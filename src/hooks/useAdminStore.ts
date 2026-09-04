import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Order, FilamentColor, ModelPreset, PrinterFleetItem, StoreSettings, OrderStatus } from '../types';
import { FILAMENT_COLORS } from '../data/filamentColors';
import { MODEL_PRESETS } from '../data/modelPresets';
import { INITIAL_PRINTERS, INITIAL_STORE_SETTINGS, INITIAL_DEMO_ORDERS } from '../data/initialAdminData';

export function useAdminStore() {
  const [orders, setOrders] = useLocalStorage<Order[]>('blue_filament_orders', INITIAL_DEMO_ORDERS);
  const [filaments, setFilaments] = useLocalStorage<FilamentColor[]>('blue_filament_catalog', FILAMENT_COLORS);
  const [modelPresets, setModelPresets] = useLocalStorage<ModelPreset[]>('blue_filament_presets', MODEL_PRESETS);
  const [printers, setPrinters] = useLocalStorage<PrinterFleetItem[]>('blue_filament_printers', INITIAL_PRINTERS);
  const [settings, setSettings] = useLocalStorage<StoreSettings>('blue_filament_settings', INITIAL_STORE_SETTINGS);

  // --- ORDER ACTIONS ---
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));
  }, [setOrders]);

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
    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          quotedPrice: quoteData.quotedPrice,
          estimatedGrams: quoteData.estimatedGrams,
          estimatedPrintTimeHours: quoteData.estimatedPrintTimeHours,
          assignedPrinterId: quoteData.assignedPrinterId,
          internalNotes: quoteData.internalNotes,
          trackingNumber: quoteData.trackingNumber,
          priceStatus: 'QUOTED',
          status: quoteData.status || (order.status === 'PENDING_REVIEW' ? 'CONFIRMED' : order.status),
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));

    // If assigned to a printer, update printer job
    if (quoteData.assignedPrinterId) {
      setPrinters(prev => prev.map(printer => {
        if (printer.id === quoteData.assignedPrinterId) {
          return {
            ...printer,
            status: 'printing',
            currentOrderId: orderId,
            progressPercent: 10,
            timeRemainingMinutes: Math.round((quoteData.estimatedPrintTimeHours || 2) * 60)
          };
        }
        return printer;
      }));
    }
  }, [setOrders, setPrinters]);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
  }, [setOrders]);

  const addCustomerOrder = useCallback((newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev.filter(o => o.orderId !== newOrder.orderId)]);
  }, [setOrders]);

  // --- FILAMENT ACTIONS ---
  const addFilament = useCallback((newFilament: FilamentColor) => {
    setFilaments(prev => [newFilament, ...prev]);
  }, [setFilaments]);

  const updateFilament = useCallback((id: string, updatedFields: Partial<FilamentColor>) => {
    setFilaments(prev => prev.map(f => (f.id === id ? { ...f, ...updatedFields } : f)));
  }, [setFilaments]);

  const deleteFilament = useCallback((id: string) => {
    setFilaments(prev => prev.filter(f => f.id !== id));
  }, [setFilaments]);

  const toggleFilamentStock = useCallback((id: string) => {
    setFilaments(prev => prev.map(f => (f.id === id ? { ...f, inStock: !f.inStock } : f)));
  }, [setFilaments]);

  const updateFilamentGrams = useCallback((id: string, grams: number) => {
    setFilaments(prev => prev.map(f => (f.id === id ? { ...f, remainingGrams: grams } : f)));
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
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSettings]);

  // --- BACKUP & RESET ---
  const resetToDefaults = useCallback(() => {
    setOrders(INITIAL_DEMO_ORDERS);
    setFilaments(FILAMENT_COLORS);
    setModelPresets(MODEL_PRESETS);
    setPrinters(INITIAL_PRINTERS);
    setSettings(INITIAL_STORE_SETTINGS);
  }, [setOrders, setFilaments, setModelPresets, setPrinters, setSettings]);

  const exportDataJson = useCallback(() => {
    return JSON.stringify({
      version: '1.0.0',
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
      if (data.orders) setOrders(data.orders);
      if (data.filaments) setFilaments(data.filaments);
      if (data.modelPresets) setModelPresets(data.modelPresets);
      if (data.printers) setPrinters(data.printers);
      if (data.settings) setSettings(data.settings);
      return { success: true, message: 'นำเข้าข้อมูลระบบสำเร็จ!' };
    } catch (e: any) {
      return { success: false, message: `ไฟล์ JSON ไม่ถูกต้อง: ${e.message}` };
    }
  }, [setOrders, setFilaments, setModelPresets, setPrinters, setSettings]);

  return {
    orders,
    filaments,
    modelPresets,
    printers,
    settings,
    updateOrderStatus,
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
    resetToDefaults,
    exportDataJson,
    importDataJson,
  };
}
