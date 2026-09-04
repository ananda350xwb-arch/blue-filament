export type MaterialType = 
  | 'PLA+' 
  | 'Matte PLA' 
  | 'Silk Glossy' 
  | 'Dual Silk' 
  | 'PETG' 
  | 'Glow PLA'
  | 'TPU Flex'
  | 'Wood PLA'
  | 'Carbon Fiber';

export interface FilamentColor {
  id: string;
  name: string;
  nameTh: string;
  hex: string;
  secondaryHex?: string; // For dual-color silk
  material: MaterialType;
  inStock: boolean;
  popular?: boolean;
  category: 'basic' | 'pastel' | 'neon' | 'silk' | 'special';
  badge?: string;
  descriptionTh?: string;
  remainingGrams?: number; // e.g. 750 (out of 1000g)
  pricePerGram?: number;   // e.g. 1.2 THB/g
}

export interface ColorMapping {
  slotIndex: number;
  originalColor: string;
  storeColorId: string;
  storeColorNameTh: string;
  hex: string;
  material: MaterialType;
}

export interface ModelPreset {
  id: string;
  name: string;
  nameTh: string;
  category: string;
  url: string;
  colorCount: number;
  defaultColors: Array<{
    originalColor: string;
    storeColorId: string;
  }>;
  imageUrl: string;
  author: string;
  tags: string[];
  descriptionTh: string;
  recommendedSize?: string;
}

export type OrderStatus = 
  | 'PENDING_REVIEW'   // รอตรวจสอบราคา
  | 'CONFIRMED'        // ยืนยันราคาแล้ว
  | 'PRINTING'         // กำลังพิมพ์ 3D
  | 'COMPLETED'        // พิมพ์เสร็จแล้ว
  | 'SHIPPED'          // จัดส่งแล้ว
  | 'CANCELLED';       // ยกเลิก

export interface Order {
  orderId: string;
  modelUrl: string;
  modelName: string;
  colorCount: number;
  colors: Array<{
    slot: number;
    originalColor: string;
    storeColor: string;
    hex: string;
    material?: string;
  }>;
  quantity: number;
  scale: number; // e.g. 100
  infill?: 'standard' | 'strong' | 'solid';
  note: string;
  priceStatus: 'TO BE CONFIRMED' | 'QUOTED';
  status: OrderStatus;
  quotedPrice?: number;         // in THB, e.g. 250
  estimatedGrams?: number;      // in grams, e.g. 85
  estimatedPrintTimeHours?: number; // in hours, e.g. 4.5
  assignedPrinterId?: string;
  trackingNumber?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PrinterFleetItem {
  id: string;
  name: string;
  model: string;
  hasAms: boolean;
  amsSlots: number;
  status: 'idle' | 'printing' | 'maintenance' | 'paused';
  currentOrderId?: string;
  currentOrderName?: string;
  progressPercent?: number; // 0 - 100
  timeRemainingMinutes?: number;
  temperatureNozzle?: number;
  temperatureBed?: number;
}

export interface StoreSettings {
  storeName: string;
  lineId: string;
  phone: string;
  announcementText: string;
  announcementActive: boolean;
  basePricePerGram: number; // e.g. 1.2 Baht/g
  amsColorChangeFee: number; // e.g. 30 Baht per additional color
  shippingFlatRate: number;  // e.g. 45 Baht
  licenseNotice: string;
}

export type OrderStep = 1 | 2 | 3 | 4;
