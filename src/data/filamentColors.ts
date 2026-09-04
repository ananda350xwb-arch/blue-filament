import { FilamentColor } from '../types';

export const FILAMENT_COLORS: FilamentColor[] = [
  // Basic / Classic
  {
    id: 'blue-electric',
    name: 'Electric Blue',
    nameTh: 'น้ำเงินอิเล็คทริค (สีหลักร้าน)',
    hex: '#2563EB',
    material: 'PLA+',
    inStock: true,
    popular: true,
    category: 'basic',
    badge: 'Signature',
    descriptionTh: 'สีน้ำเงินสดใส มันเงา สวยคมชัด'
  },
  {
    id: 'cyan-vibrant',
    name: 'Vibrant Cyan',
    nameTh: 'ฟ้าสว่างไซแอน',
    hex: '#06B6D4',
    material: 'PLA+',
    inStock: true,
    popular: true,
    category: 'basic',
    descriptionTh: 'โทนฟ้าสดใส สไตล์ Sci-Fi และของเล่น'
  },
  {
    id: 'white-pure',
    name: 'Pure White',
    nameTh: 'ขาวสว่างบริสุทธิ์',
    hex: '#FFFFFF',
    material: 'PLA+',
    inStock: true,
    popular: true,
    category: 'basic',
    descriptionTh: 'สีขาวเนียน ละเอียด ไม่เหลืองง่าย'
  },
  {
    id: 'black-galaxy',
    name: 'Deep Black',
    nameTh: 'ดำสนิทมิติคม',
    hex: '#18181B',
    material: 'PLA+',
    inStock: true,
    popular: true,
    category: 'basic',
    descriptionTh: 'สีดำเข้ม ลายชั้นเลเยอร์กลืนเนียน'
  },
  {
    id: 'red-cherry',
    name: 'Cherry Red',
    nameTh: 'แดงเชอร์รี่สด',
    hex: '#DC2626',
    material: 'PLA+',
    inStock: true,
    popular: true,
    category: 'basic',
    descriptionTh: 'สีแดงสดใส มีพลัง สดเด่นชัดเจน'
  },
  {
    id: 'yellow-lemon',
    name: 'Sunshine Yellow',
    nameTh: 'เหลืองสว่างสดใส',
    hex: '#FACC15',
    material: 'PLA+',
    inStock: true,
    popular: true,
    category: 'basic',
    descriptionTh: 'สีเหลืองสว่างเหมือนของเล่นเลโก้'
  },
  {
    id: 'orange-sunset',
    name: 'Sunset Orange',
    nameTh: 'ส้มสดซันเซ็ต',
    hex: '#F97316',
    material: 'PLA+',
    inStock: true,
    popular: false,
    category: 'basic',
    descriptionTh: 'สีส้มมีชีวิตชีวา อบอุ่นและสดใส'
  },
  {
    id: 'green-emerald',
    name: 'Emerald Green',
    nameTh: 'เขียวมรกตสด',
    hex: '#10B981',
    material: 'PLA+',
    inStock: true,
    popular: false,
    category: 'basic',
    descriptionTh: 'สีเขียวธรรมชาติ สดชื่นสะดุดตา'
  },
  {
    id: 'green-lime',
    name: 'Neon Lime',
    nameTh: 'เขียวมะนาวสะท้อนแสง',
    hex: '#84CC16',
    material: 'PLA+',
    inStock: true,
    popular: true,
    category: 'neon',
    badge: 'Trending',
    descriptionTh: 'สีเขียวสะดุดตา สไตล์โมเดิร์นป๊อป'
  },

  // Pastels & Soft Tones
  {
    id: 'pink-sakura',
    name: 'Sakura Pink',
    nameTh: 'ชมพูซากุระพาสเทล',
    hex: '#F472B6',
    material: 'Matte PLA',
    inStock: true,
    popular: true,
    category: 'pastel',
    badge: 'Popular',
    descriptionTh: 'ชมพูละมุน เนื้อสัมผัสด้านพรีเมียม'
  },
  {
    id: 'purple-lavender',
    name: 'Pastel Lavender',
    nameTh: 'ม่วงพาสเทลลาเวนเดอร์',
    hex: '#C084FC',
    material: 'Matte PLA',
    inStock: true,
    popular: true,
    category: 'pastel',
    descriptionTh: 'ม่วงนุ่มนวล น่ารัก สไตล์ของสะสม'
  },
  {
    id: 'blue-baby',
    name: 'Baby Blue',
    nameTh: 'ฟ้าพาสเทลเบบี้บลู',
    hex: '#93C5FD',
    material: 'Matte PLA',
    inStock: true,
    popular: false,
    category: 'pastel',
    descriptionTh: 'ฟ้าละมุนตา เรียบหรูดูดี'
  },
  {
    id: 'gray-space',
    name: 'Space Gray',
    nameTh: 'เทาเมทัลลิกสเปซเกรย์',
    hex: '#64748B',
    material: 'PLA+',
    inStock: true,
    popular: false,
    category: 'basic',
    descriptionTh: 'สีเทากลาง เหมาะกับชิ้นส่วนเครื่องจักรและโมเดลหุ่นยนต์'
  },
  {
    id: 'brown-chocolate',
    name: 'Warm Brown',
    nameTh: 'น้ำตาลช็อกโกแลต',
    hex: '#78350F',
    material: 'PLA+',
    inStock: true,
    popular: false,
    category: 'basic',
    descriptionTh: 'โทนน้ำตาลอบอุ่น เหมาะกับฟิกเกอร์สัตว์และต้นไม้'
  },

  // Silk & Dual Colors (Special Toy Look)
  {
    id: 'silk-gold',
    name: 'Silk Royal Gold',
    nameTh: 'ทองเงาซิลค์พรีเมียม',
    hex: '#EAB308',
    material: 'Silk Glossy',
    inStock: true,
    popular: true,
    category: 'silk',
    badge: 'Shiny Silk',
    descriptionTh: 'เงาวาวประกายทองสะท้อนแสงวิบวับ'
  },
  {
    id: 'silk-silver',
    name: 'Silk Chrome Silver',
    nameTh: 'เงินโครเมียมซิลค์',
    hex: '#CBD5E1',
    material: 'Silk Glossy',
    inStock: true,
    popular: false,
    category: 'silk',
    descriptionTh: 'เงาเหมือนโลหะขัดเงา สะท้อนแสงชัดเจน'
  },
  {
    id: 'dual-silk-blue-purple',
    name: 'Dual Silk Magic (Blue/Purple)',
    nameTh: 'ดูโอซิลค์ทูโทน (น้ำเงิน/ม่วง)',
    hex: '#3B82F6',
    secondaryHex: '#A855F7',
    material: 'Dual Silk',
    inStock: true,
    popular: true,
    category: 'special',
    badge: 'Dual-Color',
    descriptionTh: 'เปลี่ยนสีตามมุมมอง หมุนแล้วสีเหลือบสวยงามมาก!'
  },
  {
    id: 'glow-cyan',
    name: 'Glow in Dark Cyan',
    nameTh: 'เรืองแสงในที่มืด (เขียวฟ้า)',
    hex: '#A7F3D0',
    material: 'Glow PLA',
    inStock: true,
    popular: true,
    category: 'special',
    badge: 'Glows in Dark',
    descriptionTh: 'ดูดซับแสงแล้วส่องสว่างในความมืด'
  }
];

export const COLOR_CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'basic', label: 'สีมาตรฐาน PLA+' },
  { id: 'pastel', label: 'พาสเทลเนื้อแมทท์' },
  { id: 'silk', label: 'ซิลค์เงาพรีเมียม' },
  { id: 'special', label: 'พิเศษ ทูโทน/เรืองแสง' },
];
