import { PrinterFleetItem, StoreSettings, Order } from '../types';

export const INITIAL_PRINTERS: PrinterFleetItem[] = [
  {
    id: 'printer-1',
    name: 'Bambu X1-Carbon #1',
    model: 'Bambu Lab X1-Carbon + AMS',
    hasAms: true,
    amsSlots: 4,
    status: 'printing',
    currentOrderId: 'BF-20260904-839',
    currentOrderName: 'Articulated Baby Dragon (4 สี)',
    progressPercent: 68,
    timeRemainingMinutes: 42,
    temperatureNozzle: 220,
    temperatureBed: 55,
  },
  {
    id: 'printer-2',
    name: 'Bambu P1S AMS #2',
    model: 'Bambu Lab P1S + AMS',
    hasAms: true,
    amsSlots: 4,
    status: 'idle',
    temperatureNozzle: 24,
    temperatureBed: 25,
  },
  {
    id: 'printer-3',
    name: 'Bambu A1 Mini #3',
    model: 'Bambu Lab A1 Mini + AMS Lite',
    hasAms: true,
    amsSlots: 4,
    status: 'printing',
    currentOrderId: 'BF-20260904-112',
    currentOrderName: 'Maneki Neko 3D Keychain',
    progressPercent: 35,
    timeRemainingMinutes: 28,
    temperatureNozzle: 215,
    temperatureBed: 60,
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'Blue Filament 3D Studio',
  lineId: '@bluefilament',
  phone: '081-234-5678',
  announcementText: '🚀 โปรโมชั่นเปิดร้านใหม่! สั่งพิมพ์ 3 ชิ้นขึ้นไป ส่งฟรีทั่วประเทศ',
  announcementActive: true,
  basePricePerGram: 1.2, // 1.2 THB per gram
  amsColorChangeFee: 25,  // 25 THB per extra color
  shippingFlatRate: 45,   // 45 THB
  licenseNotice: 'รับผลิตเฉพาะโมเดลที่อนุญาตให้ผลิตตามเงื่อนไขของเจ้าของผลงานและ License ที่เกี่ยวข้อง (เช่น Non-Commercial, CC-BY, หรือ Commercial Authorized)',
};

export const INITIAL_DEMO_ORDERS: Order[] = [
  {
    orderId: 'BF-20260904-839',
    modelUrl: 'https://makerworld.com/en/models/48123-articulated-cute-dragon',
    modelName: 'Articulated Baby Dragon',
    colorCount: 4,
    colors: [
      { slot: 1, originalColor: 'Primary Blue', storeColor: 'น้ำเงินอิเล็คทริค (สีหลักร้าน)', hex: '#2563EB', material: 'PLA+' },
      { slot: 2, originalColor: 'Belly Yellow', storeColor: 'เหลืองสว่างสดใส', hex: '#FACC15', material: 'PLA+' },
      { slot: 3, originalColor: 'Spikes White', storeColor: 'ขาวสว่างบริสุทธิ์', hex: '#FFFFFF', material: 'PLA+' },
      { slot: 4, originalColor: 'Eyes Black', storeColor: 'ดำสนิทมิติคม', hex: '#18181B', material: 'PLA+' }
    ],
    quantity: 1,
    scale: 100,
    infill: 'standard',
    note: 'ขอให้ขยับข้อต่อลื่นๆ นะครับ จะให้เป็นของขวัญวันเกิดน้อง',
    priceStatus: 'QUOTED',
    status: 'PRINTING',
    quotedPrice: 280,
    estimatedGrams: 85,
    estimatedPrintTimeHours: 3.5,
    assignedPrinterId: 'printer-1',
    customerName: 'คุณภานุวัฒน์ (นนท์)',
    customerContact: 'LINE: non_panuwat',
    paymentStatus: 'PAID',
    paidAmount: 280,
    paymentDate: new Date(Date.now() - 3600000 * 3.8).toISOString(),
    paymentNote: 'โอนผ่าน KBank เรียบร้อย สลิปตรงยอด',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    orderId: 'BF-20260904-112',
    modelUrl: 'https://makerworld.com/en/models/112450-lucky-cat-keychain',
    modelName: 'Maneki Neko 3D Keychain',
    colorCount: 3,
    colors: [
      { slot: 1, originalColor: 'Body Pure White', storeColor: 'ขาวสว่างบริสุทธิ์', hex: '#FFFFFF', material: 'PLA+' },
      { slot: 2, originalColor: 'Ears Sakura Pink', storeColor: 'ชมพูซากุระพาสเทล', hex: '#F472B6', material: 'Matte PLA' },
      { slot: 3, originalColor: 'Collar Cherry Red', storeColor: 'แดงเชอร์รี่สด', hex: '#DC2626', material: 'PLA+' }
    ],
    quantity: 2,
    scale: 100,
    infill: 'strong',
    note: 'เจาะรูร้อยห่วงพวงกุญแจให้ด้วยครับ',
    priceStatus: 'QUOTED',
    status: 'CONFIRMED',
    quotedPrice: 160,
    estimatedGrams: 35,
    estimatedPrintTimeHours: 1.2,
    customerName: 'คุณธิดารัตน์',
    customerContact: 'LINE: may_thida (089-123-4567)',
    paymentStatus: 'SLIP_SUBMITTED',
    paidAmount: 160,
    paymentDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    paymentNote: 'ส่งสลิป PromptPay ใน LINE แล้ว รอแอดมินเริ่มพิมพ์',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    orderId: 'BF-20260904-450',
    modelUrl: 'https://makerworld.com/en/models/62910-retro-bot-plant-pot',
    modelName: 'Cute Retro Bot Planter',
    colorCount: 3,
    colors: [
      { slot: 1, originalColor: 'Body Cyan', storeColor: 'ฟ้าสว่างไซแอน', hex: '#06B6D4', material: 'PLA+' },
      { slot: 2, originalColor: 'Joints Space Gray', storeColor: 'เทาเมทัลลิกสเปซเกรย์', hex: '#64748B', material: 'PLA+' },
      { slot: 3, originalColor: 'Eyes Lemon Yellow', storeColor: 'เหลืองสว่างสดใส', hex: '#FACC15', material: 'PLA+' }
    ],
    quantity: 1,
    scale: 120,
    infill: 'solid',
    note: 'ตั้งใจเอาไว้ใส่แคคตัสต้นจริง ขอแบบกันน้ำซึมหน่อยครับ',
    priceStatus: 'TO BE CONFIRMED',
    status: 'PENDING_REVIEW',
    customerName: 'คุณกิตติศักดิ์',
    customerContact: 'LINE: kittisak_3d',
    paymentStatus: 'UNPAID',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];
