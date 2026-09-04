import { useState, useCallback } from 'react';
import { ColorMapping, Order, OrderStep, ModelPreset } from '../types';
import { FILAMENT_COLORS } from '../data/filamentColors';
import { INITIAL_DEMO_ORDERS } from '../data/initialAdminData';
import { useLocalStorage } from './useLocalStorage';

export function generateOrderId(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(100 + Math.random() * 900); // 3-digit random
  return `BF-${yyyy}${mm}${dd}-${random}`;
}

const DEFAULT_ORIGINAL_COLORS = ['Blue', 'White', 'Black', 'Yellow', 'Red', 'Green', 'Purple', 'Orange'];
const DEFAULT_STORE_COLOR_IDS = ['blue-electric', 'white-pure', 'black-galaxy', 'yellow-lemon', 'red-cherry', 'green-emerald', 'purple-lavender', 'orange-sunset'];

export function useOrderState() {
  const [step, setStep] = useState<OrderStep>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [modelUrl, setModelUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [colorCount, setColorCount] = useState<number>(4);
  const [colorMappings, setColorMappings] = useState<ColorMapping[]>(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const storeCol = FILAMENT_COLORS.find(c => c.id === DEFAULT_STORE_COLOR_IDS[i]) || FILAMENT_COLORS[0];
      return {
        slotIndex: i + 1,
        originalColor: DEFAULT_ORIGINAL_COLORS[i] || `Color ${i + 1}`,
        storeColorId: storeCol.id,
        storeColorNameTh: storeCol.nameTh,
        hex: storeCol.hex,
        material: storeCol.material
      };
    });
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [scaleMode, setScaleMode] = useState<'original' | 'custom'>('original');
  const [scale, setScale] = useState<number>(100);
  const [infill, setInfill] = useState<'standard' | 'strong' | 'solid'>('standard');
  const [note, setNote] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<string>(generateOrderId());
  const [recentOrders, setRecentOrders] = useLocalStorage<Order[]>('blue_filament_orders', INITIAL_DEMO_ORDERS);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  // Update color mappings when color count changes
  const handleColorCountChange = useCallback((newCount: number) => {
    const clamped = Math.max(1, Math.min(8, newCount));
    setColorCount(clamped);
    setColorMappings(prev => {
      const next: ColorMapping[] = [];
      for (let i = 0; i < clamped; i++) {
        if (prev[i]) {
          next.push(prev[i]);
        } else {
          const storeCol = FILAMENT_COLORS.find(c => c.id === DEFAULT_STORE_COLOR_IDS[i % DEFAULT_STORE_COLOR_IDS.length]) || FILAMENT_COLORS[0];
          next.push({
            slotIndex: i + 1,
            originalColor: DEFAULT_ORIGINAL_COLORS[i % DEFAULT_ORIGINAL_COLORS.length] || `Color ${i + 1}`,
            storeColorId: storeCol.id,
            storeColorNameTh: storeCol.nameTh,
            hex: storeCol.hex,
            material: storeCol.material
          });
        }
      }
      return next;
    });
  }, []);

  const updateColorMapping = useCallback((index: number, storeColorId: string, customOriginalName?: string) => {
    const found = FILAMENT_COLORS.find(c => c.id === storeColorId);
    if (!found) return;

    setColorMappings(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          storeColorId: found.id,
          storeColorNameTh: found.nameTh,
          hex: found.hex,
          material: found.material,
          ...(customOriginalName !== undefined ? { originalColor: customOriginalName } : {})
        };
      }
      return updated;
    });
  }, []);

  const updateOriginalColorName = useCallback((index: number, name: string) => {
    setColorMappings(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          originalColor: name
        };
      }
      return updated;
    });
  }, []);

  // Preload from preset
  const loadPreset = useCallback((preset: ModelPreset) => {
    setModelUrl(preset.url);
    setModelName(preset.nameTh || preset.name);
    setColorCount(preset.colorCount);
    
    const newMappings: ColorMapping[] = preset.defaultColors.map((dc, i) => {
      const found = FILAMENT_COLORS.find(c => c.id === dc.storeColorId) || FILAMENT_COLORS[0];
      return {
        slotIndex: i + 1,
        originalColor: dc.originalColor,
        storeColorId: found.id,
        storeColorNameTh: found.nameTh,
        hex: found.hex,
        material: found.material
      };
    });
    setColorMappings(newMappings);
    setStep(1);
    setIsOpen(true);
  }, []);

  // Reset / Start New
  const startNewOrder = useCallback(() => {
    setCurrentOrderId(generateOrderId());
    setModelUrl('');
    setModelName('');
    setColorCount(4);
    handleColorCountChange(4);
    setQuantity(1);
    setScaleMode('original');
    setScale(100);
    setInfill('standard');
    setNote('');
    setStep(1);
    setIsOpen(true);
    setIsConfirmationOpen(false);
    setIsScreenshotMode(false);
  }, [handleColorCountChange]);

  // Finalize order
  const completeOrder = useCallback((): Order => {
    const finalOrder: Order = {
      orderId: currentOrderId,
      modelUrl: modelUrl.trim() || 'https://makerworld.com/',
      modelName: modelName.trim() || 'Custom 3D Model',
      colorCount,
      colors: colorMappings.slice(0, colorCount).map((m, i) => ({
        slot: i + 1,
        originalColor: m.originalColor,
        storeColor: m.storeColorNameTh,
        hex: m.hex,
        material: m.material
      })),
      quantity,
      scale: scaleMode === 'original' ? 100 : scale,
      infill,
      note: note.trim(),
      status: 'PENDING_REVIEW',
      priceStatus: 'TO BE CONFIRMED',
      createdAt: new Date().toISOString()
    };

    setRecentOrders(prev => [finalOrder, ...prev.filter(o => o.orderId !== finalOrder.orderId)]);
    setLastCompletedOrder(finalOrder);
    setIsOpen(false);
    setIsConfirmationOpen(true);

    return finalOrder;
  }, [currentOrderId, modelUrl, modelName, colorCount, colorMappings, quantity, scaleMode, scale, infill, note, setRecentOrders]);

  return {
    step,
    setStep,
    isOpen,
    setIsOpen,
    modelUrl,
    setModelUrl,
    modelName,
    setModelName,
    colorCount,
    handleColorCountChange,
    colorMappings,
    updateColorMapping,
    updateOriginalColorName,
    quantity,
    setQuantity,
    scaleMode,
    setScaleMode,
    scale,
    setScale,
    infill,
    setInfill,
    note,
    setNote,
    currentOrderId,
    recentOrders,
    lastCompletedOrder,
    isConfirmationOpen,
    setIsConfirmationOpen,
    isScreenshotMode,
    setIsScreenshotMode,
    loadPreset,
    startNewOrder,
    completeOrder
  };
}
