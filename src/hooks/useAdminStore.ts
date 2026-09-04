import { useCallback, useMemo, useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Order, FilamentColor, ModelPreset, PrinterFleetItem, StoreSettings, OrderStatus } from '../types';
import { FILAMENT_COLORS } from '../data/filamentColors';
import { MODEL_PRESETS } from '../data/modelPresets';
import { INITIAL_PRINTERS, INITIAL_STORE_SETTINGS, INITIAL_DEMO_ORDERS } from '../data/initialAdminData';
import { CloudDB, dbRowToOrder, dbRowToFilament } from '../lib/supabaseSync';
import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';

export function useAdminStore() {
  const [orders, setOrders] = useLocalStorage<Order[]>('blue_filament_orders', INITIAL_DEMO_ORDERS);
  const [filaments, setFilaments] = useLocalStorage<FilamentColor[]>('blue_filament_catalog', FILAMENT_COLORS);
  const [modelPresets, setModelPresets] = useLocalStorage<ModelPreset[]>('blue_filament_presets', MODEL_PRESETS);
  const [printers, setPrinters] = useLocalStorage<PrinterFleetItem[]>('blue_filament_printers', INITIAL_PRINTERS);
  const [settings, setSettings] = useLocalStorage<StoreSettings>('blue_filament_settings', INITIAL_STORE_SETTINGS);

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(() => getSupabaseConfig().connected);

  // --- INITIAL CLOUD DATA FETCH & REALTIME SUBSCRIPTION ---
  useEffect(() => {
    let activeChannel: any = null;

    const initCloud = async () => {
      const client = getSupabaseClient();
      if (!client) {
        setIsCloudConnected(false);
        return;
      }

      setIsCloudConnected(true);

      // 1. Initial Cloud Sync
      try {
        const cloudOrders = await CloudDB.fetchOrders();
        if (cloudOrders && cloudOrders.length > 0) {
          setOrders(cloudOrders);
        }

        const cloudFilaments = await CloudDB.fetchFilaments();
        if (cloudFilaments && cloudFilaments.length > 0) {
          setFilaments(cloudFilaments);
        }

        const cloudSettings = await CloudDB.fetchSettings();
        if (cloudSettings) {
          setSettings(cloudSettings);
        }
      } catch (err) {
        console.warn('Initial Supabase sync notice:', err);
      }

      // 2. Realtime Listener for instant cross-device live updates
      try {
        activeChannel = client
          .channel('blue-filament-realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'bf_orders' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                const newOrd = dbRowToOrder(payload.new);
                setOrders(prev => [newOrd, ...prev.filter(o => o.orderId !== newOrd.orderId)]);
              } else if (payload.eventType === 'UPDATE') {
                const updatedOrd = dbRowToOrder(payload.new);
                setOrders(prev => prev.map(o => o.orderId === updatedOrd.orderId ? updatedOrd : o));
              } else if (payload.eventType === 'DELETE') {
                const deletedId = (payload.old as any).order_id;
                if (deletedId) {
                  setOrders(prev => prev.filter(o => o.orderId !== deletedId));
                }
              }
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'bf_filaments' },
            (payload) => {
              if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const updatedFil = dbRowToFilament(payload.new);
                setFilaments(prev => {
                  const exists = prev.some(f => f.id === updatedFil.id);
                  if (exists) {
                    return prev.map(f => f.id === updatedFil.id ? updatedFil : f);
                  }
                  return [updatedFil, ...prev];
                });
              } else if (payload.eventType === 'DELETE') {
                const deletedId = (payload.old as any).id;
                if (deletedId) {
                  setFilaments(prev => prev.filter(f => f.id !== deletedId));
                }
              }
            }
          )
          .subscribe();
      } catch (subErr) {
        console.warn('Supabase realtime subscribe warning:', subErr);
      }
    };

    initCloud();

    const handleConfigChange = () => {
      initCloud();
    };
    window.addEventListener('blue_filament_supabase_config_updated', handleConfigChange);

    return () => {
      window.removeEventListener('blue_filament_supabase_config_updated', handleConfigChange);
      if (activeChannel && getSupabaseClient()) {
        getSupabaseClient()?.removeChannel(activeChannel);
      }
    };
  }, [setOrders, setFilaments, setSettings]);

  // --- FILAMENT DEDUCTION HELPER ---
  const deductOrderFilament = useCallback((order: Order) => {
    const totalGrams = (order.estimatedGrams || 50) * order.quantity;
    const colorsCount = Math.max(1, order.colors.length);
    const gramsPerColor = Math.round(totalGrams / colorsCount);

    setFilaments(prevFilaments => {
      const updatedList = prevFilaments.map(fil => {
        const wasUsed = order.colors.some(c => 
          c.storeColor.toLowerCase().includes(fil.nameTh.toLowerCase()) || 
          c.storeColor.toLowerCase().includes(fil.name.toLowerCase()) ||
          c.hex.toLowerCase() === fil.hex.toLowerCase()
        );

        if (wasUsed) {
          const currentRemaining = fil.remainingGrams ?? 1000;
          const newRemaining = Math.max(0, currentRemaining - gramsPerColor);
          const updated = {
            ...fil,
            remainingGrams: newRemaining,
            inStock: newRemaining > 20
          };
          CloudDB.upsertFilament(updated);
          return updated;
        }
        return fil;
      });
      return updatedList;
    });
  }, [setFilaments]);

  // --- ORDER ACTIONS ---
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, trackingNumber?: string) => {
    let targetOrder: Order | undefined;

    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        targetOrder = {
          ...order,
          status,
          trackingNumber: trackingNumber || order.trackingNumber,
          updatedAt: new Date().toISOString()
        };
        CloudDB.upsertOrder(targetOrder);
        return targetOrder;
      }
      return order;
    }));

    if (targetOrder) {
      if (status === 'PRINTING' && targetOrder.assignedPrinterId) {
        setPrinters(prev => prev.map(p => {
          if (p.id === targetOrder?.assignedPrinterId) {
            return {
              ...p,
              status: 'printing',
              currentOrderId: orderId,
              currentOrderName: targetOrder?.modelName || '3D Model',
              progressPercent: 15,
              timeRemainingMinutes: Math.round((targetOrder?.estimatedPrintTimeHours || 2) * 60)
            };
          }
          return p;
        }));
      } else if (status === 'COMPLETED' || status === 'SHIPPED' || status === 'CANCELLED') {
        setPrinters(prev => prev.map(p => {
          if (p.currentOrderId === orderId) {
            return {
              ...p,
              status: 'idle',
              currentOrderId: undefined,
              currentOrderName: undefined,
              progressPercent: 0,
              timeRemainingMinutes: undefined
            };
          }
          return p;
        }));

        if (status === 'COMPLETED') {
          deductOrderFilament(targetOrder);
        }
      }
    }
  }, [setOrders, setPrinters, deductOrderFilament]);

  const advanceOrderStatus = useCallback((orderId: string) => {
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;

    switch (order.status) {
      case 'PENDING_REVIEW':
        updateOrderStatus(orderId, 'CONFIRMED');
        break;
      case 'CONFIRMED':
        updateOrderStatus(orderId, 'PRINTING');
        break;
      case 'PRINTING':
        updateOrderStatus(orderId, 'COMPLETED');
        break;
      case 'COMPLETED':
        updateOrderStatus(orderId, 'SHIPPED');
        break;
    }
  }, [orders, updateOrderStatus]);

  const saveOrderQuote = useCallback((
    orderId: string,
    quoteData: {
      quotedPrice: number;
      estimatedGrams?: number;
      estimatedPrintTimeHours?: number;
      assignedPrinterId?: string;
      internalNotes?: string;
      trackingNumber?: string;
      status?: OrderStatus;
    }
  ) => {
    const nextStatus = quoteData.status || 'CONFIRMED';

    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        const updated: Order = {
          ...order,
          quotedPrice: quoteData.quotedPrice,
          estimatedGrams: quoteData.estimatedGrams,
          estimatedPrintTimeHours: quoteData.estimatedPrintTimeHours,
          assignedPrinterId: quoteData.assignedPrinterId,
          internalNotes: quoteData.internalNotes,
          trackingNumber: quoteData.trackingNumber,
          priceStatus: 'QUOTED',
          status: nextStatus,
          updatedAt: new Date().toISOString()
        };
        CloudDB.upsertOrder(updated);
        return updated;
      }
      return order;
    }));

    if (quoteData.assignedPrinterId) {
      setPrinters(prev => prev.map(printer => {
        if (printer.id === quoteData.assignedPrinterId) {
          return {
            ...printer,
            status: nextStatus === 'PRINTING' ? 'printing' : printer.status,
            currentOrderId: orderId,
            progressPercent: nextStatus === 'PRINTING' ? 10 : printer.progressPercent,
            timeRemainingMinutes: Math.round((quoteData.estimatedPrintTimeHours || 2) * 60)
          };
        }
        return printer;
      }));
    }
  }, [setOrders, setPrinters]);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
    CloudDB.deleteOrder(orderId);

    setPrinters(prev => prev.map(p => {
      if (p.currentOrderId === orderId) {
        return {
          ...p,
          status: 'idle',
          currentOrderId: undefined,
          currentOrderName: undefined,
          progressPercent: 0
        };
      }
      return p;
    }));
  }, [setOrders, setPrinters]);

  const addCustomerOrder = useCallback((newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev.filter(o => o.orderId !== newOrder.orderId)]);
    CloudDB.upsertOrder(newOrder);
  }, [setOrders]);

  // --- FILAMENT ACTIONS ---
  const addFilament = useCallback((newFilament: FilamentColor) => {
    setFilaments(prev => [newFilament, ...prev]);
    CloudDB.upsertFilament(newFilament);
  }, [setFilaments]);

  const updateFilament = useCallback((id: string, updatedFields: Partial<FilamentColor>) => {
    setFilaments(prev => prev.map(f => {
      if (f.id === id) {
        const updated = { ...f, ...updatedFields };
        CloudDB.upsertFilament(updated);
        return updated;
      }
      return f;
    }));
  }, [setFilaments]);

  const deleteFilament = useCallback((id: string) => {
    setFilaments(prev => prev.filter(f => f.id !== id));
    CloudDB.deleteFilament(id);
  }, [setFilaments]);

  const toggleFilamentStock = useCallback((id: string) => {
    setFilaments(prev => prev.map(f => {
      if (f.id === id) {
        const updated = { ...f, inStock: !f.inStock };
        CloudDB.upsertFilament(updated);
        return updated;
      }
      return f;
    }));
  }, [setFilaments]);

  const updateFilamentGrams = useCallback((id: string, grams: number) => {
    setFilaments(prev => prev.map(f => {
      if (f.id === id) {
        const updated = { ...f, remainingGrams: grams, inStock: grams > 20 };
        CloudDB.upsertFilament(updated);
        return updated;
      }
      return f;
    }));
  }, [setFilaments]);

  // --- MODEL PRESET ACTIONS ---
  const addModelPreset = useCallback((newPreset: ModelPreset) => {
    setModelPresets(prev => [newPreset, ...prev]);
  }, [setModelPresets]);

  const updateModelPreset = useCallback((id: string, updatedFields: Partial<ModelPreset>) => {
    setModelPresets(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
  }, [setModelPresets]);

  const deleteModelPreset = useCallback((id: string) => {
    setModelPresets(prev => prev.filter(p => p.id !== id));
  }, [setModelPresets]);

  // --- PRINTER ACTIONS ---
  const updatePrinterStatus = useCallback((
    id: string,
    status: PrinterFleetItem['status'],
    orderId?: string,
    orderName?: string
  ) => {
    setPrinters(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          currentOrderId: status === 'idle' ? undefined : (orderId || p.currentOrderId),
          currentOrderName: status === 'idle' ? undefined : (orderName || p.currentOrderName),
          progressPercent: status === 'idle' ? 0 : p.progressPercent
        };
      }
      return p;
    }));
  }, [setPrinters]);

  // --- SETTINGS ACTIONS ---
  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      CloudDB.updateSettings(updated);
      return updated;
    });
  }, [setSettings]);

  // --- BACKUP & RESET ---
  const seedDemoOrders = useCallback(async () => {
    setOrders(INITIAL_DEMO_ORDERS);
    for (const ord of INITIAL_DEMO_ORDERS) {
      await CloudDB.upsertOrder(ord);
    }
  }, [setOrders]);

  const resetToDefaults = useCallback(() => {
    setOrders(INITIAL_DEMO_ORDERS);
    setFilaments(FILAMENT_COLORS);
    setModelPresets(MODEL_PRESETS);
    setPrinters(INITIAL_PRINTERS);
    setSettings(INITIAL_STORE_SETTINGS);
  }, [setOrders, setFilaments, setModelPresets, setPrinters, setSettings]);

  const exportDataJson = useCallback(() => {
    return JSON.stringify({
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      orders,
      filaments,
      modelPresets,
      printers,
      settings
    }, null, 2);
  }, [orders, filaments, modelPresets, printers, settings]);

  const importDataJson = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      if (data.filaments && Array.isArray(data.filaments)) setFilaments(data.filaments);
      if (data.modelPresets && Array.isArray(data.modelPresets)) setModelPresets(data.modelPresets);
      if (data.printers && Array.isArray(data.printers)) setPrinters(data.printers);
      if (data.settings && typeof data.settings === 'object') setSettings(data.settings);
      return { success: true, message: 'นำเข้าข้อมูลระบบและอัปเดตสถานะสำเร็จ 100%!' };
    } catch (e: any) {
      return { success: false, message: `ไฟล์ JSON ไม่ถูกต้อง: ${e.message}` };
    }
  }, [setOrders, setFilaments, setModelPresets, setPrinters, setSettings]);

  // --- COMPUTED ANALYTICS ---
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.quotedPrice || 0), 0);
    const pendingReviewCount = orders.filter(o => o.status === 'PENDING_REVIEW').length;
    const printingCount = orders.filter(o => o.status === 'PRINTING').length;
    const completedCount = orders.filter(o => o.status === 'COMPLETED' || o.status === 'SHIPPED').length;
    const lowStockFilaments = filaments.filter(f => (f.remainingGrams !== undefined && f.remainingGrams < 100) || !f.inStock);

    return {
      totalRevenue,
      pendingReviewCount,
      printingCount,
      completedCount,
      lowStockFilaments,
      isCloudConnected
    };
  }, [orders, filaments, isCloudConnected]);

  return {
    orders,
    filaments,
    modelPresets,
    printers,
    settings,
    analytics,
    isCloudConnected,
    updateOrderStatus,
    advanceOrderStatus,
    saveOrderQuote,
    deleteOrder,
    addCustomerOrder,
    addFilament,
    updateFilament,
    deleteFilament,
    toggleFilamentStock,
    updateFilamentGrams,
    addModelPreset,
    updateModelPreset,
    deleteModelPreset,
    updatePrinterStatus,
    updateSettings,
    seedDemoOrders,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  };
}
