import { PrinterFleetItem, StoreSettings, Order } from '../types';

export const INITIAL_PRINTERS: PrinterFleetItem[] = [
  {
    id: 'printer-1',
    name: 'Bambu X1-Carbon #1',
    model: 'Bambu Lab X1-Carbon + AMS',
    hasAms: true,
    amsSlots: 4,
    status: 'idle',
    temperatureNozzle: 25,
    temperatureBed: 25,
  },
  {
    id: 'printer-2',
    name: 'Bambu P1S AMS #2',
    model: 'Bambu Lab P1S + AMS',
    hasAms: true,
    amsSlots: 4,
    status: 'idle',
    temperatureNozzle: 25,
    temperatureBed: 25,
  },
  {
    id: 'printer-3',
    name: 'Bambu A1 Mini #3',
    model: 'Bambu Lab A1 Mini + AMS Lite',
    hasAms: true,
    amsSlots: 4,
    status: 'idle',
    temperatureNozzle: 25,
    temperatureBed: 25,
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'Blue Filament 3D Studio',
  lineId: '@bluefilament',
  phone: '081-234-5678',
  announcementText: '🚀 ยินดีต้อนรับสู่ Blue Filament 3D Studio - รับพิมพ์งาน 3D สั่งพิมพ์หลากสี AMS จัดส่งทั่วประเทศ',
  announcementActive: true,
  basePricePerGram: 1.2, // 1.2 THB per gram
  amsColorChangeFee: 25,  // 25 THB per extra color
  shippingFlatRate: 45,   // 45 THB
  licenseNotice: 'รับผลิตเฉพาะโมเดลที่อนุญาตให้ผลิตตามเงื่อนไขของเจ้าของผลงานและ License ที่เกี่ยวข้อง (เช่น Non-Commercial, CC-BY, หรือ Commercial Authorized)',
};

export const INITIAL_DEMO_ORDERS: Order[] = [];
