import { ModelPreset } from '../types';

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'cute-dragon',
    name: 'Articulated Baby Dragon',
    nameTh: 'มังกรดุ๊กดิ๊ก ดัดขยับได้',
    category: 'Toys & Flexi',
    url: 'https://makerworld.com/en/models/48123-articulated-cute-dragon',
    colorCount: 4,
    defaultColors: [
      { originalColor: 'Primary Blue', storeColorId: 'blue-electric' },
      { originalColor: 'Belly Yellow', storeColorId: 'yellow-lemon' },
      { originalColor: 'Spikes White', storeColorId: 'white-pure' },
      { originalColor: 'Eyes Black', storeColorId: 'black-galaxy' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    author: 'Cinderwing3D',
    tags: ['Articulated', 'Toy', 'Multi-Color', 'Bestseller'],
    descriptionTh: 'โมเดลยอดฮิตตลอดกาล ข้อต่อขยับได้ทุกข้อ ลื่นไหลไม่ต้องประกอบ',
    recommendedSize: '100% (ความยาวประมาณ 18 cm)'
  },
  {
    id: 'retro-robot',
    name: 'Cute Retro Bot Planter',
    nameTh: 'กระถางต้นไม้หุ่นยนต์เรโทร',
    category: 'Desk & Home',
    url: 'https://makerworld.com/en/models/62910-retro-bot-plant-pot',
    colorCount: 3,
    defaultColors: [
      { originalColor: 'Body Cyan', storeColorId: 'cyan-vibrant' },
      { originalColor: 'Joints Space Gray', storeColorId: 'gray-space' },
      { originalColor: 'Eyes Lemon Yellow', storeColorId: 'yellow-lemon' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    author: 'ToyBotLab',
    tags: ['Home Decor', 'Desk Toy', 'Multi-Color'],
    descriptionTh: 'หุ่นยนต์หน้าตากวนๆ สำหรับวางต้นไม้แคคตัสหรือเสียบปากกาบนโต๊ะทำงาน',
    recommendedSize: '100% (กว้าง 10cm สูง 12cm)'
  },
  {
    id: 'fidget-gear-cube',
    name: 'Infinity Gyro Gear Cube',
    nameTh: 'ลูกบาศก์เฟืองของเล่นคลายเครียด',
    category: 'Fidget & Gadgets',
    url: 'https://makerworld.com/en/models/89201-infinity-gear-cube',
    colorCount: 2,
    defaultColors: [
      { originalColor: 'Gears Blue', storeColorId: 'blue-electric' },
      { originalColor: 'Frame Sakura Pink', storeColorId: 'pink-sakura' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
    author: 'GearMaster',
    tags: ['Fidget', 'Mechanical', 'Dual-Color'],
    descriptionTh: 'หมุนเพลินไม่มีสะดุด ช่วยผ่อนคลายความเครียดเวลาทำงานหรือเรียน',
    recommendedSize: '100% (ขนาดจับถนัดมือ 6x6 cm)'
  },
  {
    id: 'lucky-cat-keychain',
    name: 'Maneki Neko 3D Keychain',
    nameTh: 'พวงกุญแจแมวกวักนำโชค 3 มิติ',
    category: 'Accessories',
    url: 'https://makerworld.com/en/models/112450-lucky-cat-keychain',
    colorCount: 4,
    defaultColors: [
      { originalColor: 'Body Pure White', storeColorId: 'white-pure' },
      { originalColor: 'Ears Sakura Pink', storeColorId: 'pink-sakura' },
      { originalColor: 'Collar Cherry Red', storeColorId: 'red-cherry' },
      { originalColor: 'Coin Silk Gold', storeColorId: 'silk-gold' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    author: 'NekoArtisan',
    tags: ['Keychain', 'Cute', 'Lucky Charm'],
    descriptionTh: 'พวงกุญแจน้องแมวสีสันน่ารัก พกพาไปได้ทุกที่ ของขวัญยอดนิยม',
    recommendedSize: '100% (สูง 5 cm)'
  },
  {
    id: 'mini-spool-lamp',
    name: 'Filament Spool Ambient Night Lamp',
    nameTh: 'โคมไฟม้วนฟิลาเมนต์ตั้งโต๊ะ',
    category: 'Desk & Home',
    url: 'https://makerworld.com/en/models/145890-mini-filament-spool-lamp',
    colorCount: 2,
    defaultColors: [
      { originalColor: 'Spool Deep Black', storeColorId: 'black-galaxy' },
      { originalColor: 'Filament Glow Cyan', storeColorId: 'glow-cyan' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    author: 'MakerLight',
    tags: ['Lighting', 'Maker Spirit', 'Glow'],
    descriptionTh: 'โคมไฟสไตล์ Maker จำลองม้วนฟิลาเมนต์ สว่างนวลตาในตอนกลางคืน',
    recommendedSize: '100% (กว้าง 12 cm)'
  }
];
