import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Calculator, Printer, Truck, MessageCircle, Check, Sparkles, CreditCard, User, FileText, Send } from 'lucide-react';
import { Order, OrderStatus, PaymentStatus, PrinterFleetItem, StoreSettings } from '../../types';

interface OrderQuoteModalProps {
  isOpen: boolean;
  order: Order | null;
  printers: PrinterFleetItem[];
  settings: StoreSettings;
  onClose: () => void;
  onSaveQuote: (
    orderId: string,
    quoteData: {
      quotedPrice: number;
      estimatedGrams?: number;
      estimatedPrintTimeHours?: number;
      assignedPrinterId?: string;
      internalNotes?: string;
      trackingNumber?: string;
      status?: OrderStatus;
      customerName?: string;
      customerContact?: string;
      paymentStatus?: PaymentStatus;
      paidAmount?: number;
      paymentDate?: string;
      paymentSlipUrl?: string;
      paymentNote?: string;
    }
  ) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const OrderQuoteModal: React.FC<OrderQuoteModalProps> = ({
  isOpen,
  order,
  printers,
  settings,
  onClose,
  onSaveQuote,
  onShowToast,
}) => {
  // Specs & Quotation
  const [price, setPrice] = useState<number>(order?.quotedPrice || 0);
  const [grams, setGrams] = useState<number>(order?.estimatedGrams || 50);
  const [hours, setHours] = useState<number>(order?.estimatedPrintTimeHours || 2.5);
  const [assignedPrinter, setAssignedPrinter] = useState<string>(order?.assignedPrinterId || '');
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'PENDING_REVIEW');
  const [trackingNo, setTrackingNo] = useState<string>(order?.trackingNumber || '');
  const [internalNote, setInternalNote] = useState<string>(order?.internalNotes || '');

  // Customer & Payment Info
  const [customerName, setCustomerName] = useState<string>(order?.customerName || '');
  const [customerContact, setCustomerContact] = useState<string>(order?.customerContact || '');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order?.paymentStatus || 'UNPAID');
  const [paidAmount, setPaidAmount] = useState<number>(order?.paidAmount || 0);
  const [paymentDate, setPaymentDate] = useState<string>(order?.paymentDate || '');
  const [paymentSlipUrl, setPaymentSlipUrl] = useState<string>(order?.paymentSlipUrl || '');
  const [paymentNote, setPaymentNote] = useState<string>(order?.paymentNote || '');

  // LINE Template Switcher
  const [lineTemplateType, setLineTemplateType] = useState<'quote' | 'payment_confirmed' | 'printing' | 'shipped'>('quote');
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    if (order) {
      setPrice(order.quotedPrice || 0);
      setGrams(order.estimatedGrams || 50);
      setHours(order.estimatedPrintTimeHours || 2.5);
      setAssignedPrinter(order.assignedPrinterId || '');
      setStatus(order.status || 'PENDING_REVIEW');
      setTrackingNo(order.trackingNumber || '');
      setInternalNote(order.internalNotes || '');

      setCustomerName(order.customerName || '');
      setCustomerContact(order.customerContact || '');
      setPaymentStatus(order.paymentStatus || 'UNPAID');
      setPaidAmount(order.paidAmount || (order.paymentStatus === 'PAID' ? (order.quotedPrice || 0) : 0));
      setPaymentDate(order.paymentDate || '');
      setPaymentSlipUrl(order.paymentSlipUrl || '');
      setPaymentNote(order.paymentNote || '');

      // Auto-select relevant LINE template based on current state
      if (order.status === 'SHIPPED') {
        setLineTemplateType('shipped');
      } else if (order.status === 'PRINTING') {
        setLineTemplateType('printing');
      } else if (order.paymentStatus === 'PAID') {
        setLineTemplateType('payment_confirmed');
      } else {
        setLineTemplateType('quote');
      }
    }
  }, [order]);

  if (!isOpen || !order) return null;

  // Auto calculate recommended price
  const calculateSuggestedPrice = () => {
    const materialCost = grams * settings.basePricePerGram;
    const timeCost = hours * 25; // 25 THB per print hour
    const multiColorCost = Math.max(0, order.colorCount - 1) * settings.amsColorChangeFee;
    const subtotal = (materialCost + timeCost + multiColorCost) * order.quantity;
    const total = Math.round(subtotal + settings.shippingFlatRate);
    setPrice(total);
    if (paymentStatus === 'PAID' && paidAmount === 0) {
      setPaidAmount(total);
    }
    onShowToast('คำนวณราคาแนะนำสำเร็จ', `฿${total} (รวมค่าวัสดุ + เวลาพิมพ์ + AMS + จัดส่ง)`, 'info');
  };

  const handleSave = () => {
    onSaveQuote(order.orderId, {
      quotedPrice: price,
      estimatedGrams: grams,
      estimatedPrintTimeHours: hours,
      assignedPrinterId: assignedPrinter || undefined,
      internalNotes: internalNote,
      trackingNumber: trackingNo,
      status: status,
      customerName: customerName.trim() || undefined,
      customerContact: customerContact.trim() || undefined,
      paymentStatus: paymentStatus,
      paidAmount: paidAmount > 0 ? paidAmount : undefined,
      paymentDate: paymentDate || undefined,
      paymentSlipUrl: paymentSlipUrl.trim() || undefined,
      paymentNote: paymentNote.trim() || undefined,
    });
    onShowToast('บันทึกข้อมูลและสถานะออเดอร์เรียบร้อย!', `Order: ${order.orderId}`, 'success');
    onClose();
  };

  // Generate LINE messages dynamically
  const getLineMessage = () => {
    const customerGreeting = customerName ? `คุณ ${customerName}` : 'คุณลูกค้า';

    switch (lineTemplateType) {
      case 'quote':
        return `สวัสดีครับ ${customerGreeting} จาก Blue Filament 3D Studio นะครับ ✨
แจ้งราคาและรายละเอียดการพิมพ์สำหรับ Order ID: ${order.orderId}

📦 โมเดล: ${order.modelName || '3D Model'}
🎨 จำนวนสี: ${order.colorCount} สี (${order.colors.map(c => c.storeColor).join(', ')})
📏 ขนาด: ${order.scale}% | จำนวน: ${order.quantity} ชิ้น
⏱️ เวลาพิมพ์โดยประมาณ: ${hours} ชั่วโมง

💰 ยอดสุทธิ (รวมจัดส่ง): ${price > 0 ? `฿${price.toLocaleString()} บาท` : 'รอประเมิน'}
💳 บัญชีโอนชำระเงิน:
ธนาคารกสิกรไทย (KBANK)
เลขบัญชี: 123-4-56789-0
ชื่อบัญชี: Blue Filament 3D Studio
(หรือ PromptPay: ${settings.phone || '081-234-5678'})

หากยืนยันการพิมพ์ สามารถโอนชำระและส่งสลิปได้เลยครับ ทางร้านจะเริ่มขึ้นงานทันที ขอบคุณครับ 🙏`;

      case 'payment_confirmed':
        return `สวัสดีครับ ${customerGreeting} 🙏
ทาง Blue Filament 3D Studio ได้รับยอดชำระ ฿${(paidAmount || price).toLocaleString()} บาท สำหรับ Order ID: ${order.orderId} เรียบร้อยแล้วครับ ✨

🛠️ รายการโมเดล: ${order.modelName} (${order.colorCount} สี)
⏱️ คิวพิมพ์: จัดคิวขึ้นแท่นพิมพ์ 3D เรียบร้อย
เมื่อพิมพ์เสร็จและจัดส่งแล้ว ทางร้านจะอัปเดตเลขพัสดุให้ทราบอีกครั้งครับ ขอบคุณมากครับ 🚀`;

      case 'printing':
        return `อัปเดตสถานะการพิมพ์ 3D ครับ ${customerGreeting} 🖨️✨
สำหรับ Order ID: ${order.orderId} (${order.modelName})

🚀 ขณะนี้ชิ้นงานกำลังขึ้นรูปบนเครื่องพิมพ์ 3D ความละเอียดสูง
⏱️ ใช้เวลาพิมพ์ประมาณ ${hours} ชั่วโมง
เมื่อพิมพ์เสร็จและทำความสะอาดชิ้นงานเรียบร้อย ทางร้านจะรีบจัดส่งให้ทันทีครับ 🙏`;

      case 'shipped':
        return `แจ้งจัดส่งสินค้าเรียบร้อยครับ ${customerGreeting} 🚚✨
Order ID: ${order.orderId} (${order.modelName})

📦 เลขพัสดุสำหรับติดตาม (Tracking No.):
👉 ${trackingNo || 'กำลังอัปเดตเข้าระบบขนส่ง'}

สามารถนำเลขพัสดุไปเช็คสถานะการจัดส่งได้เลยครับ ขอบคุณที่ไว้วางใจใช้บริการ Blue Filament 3D Studio ครับ 🙏💙`;

      default:
        return '';
    }
  };

  const handleCopyMessage = () => {
    const msg = getLineMessage();
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    onShowToast('คัดลอกข้อความ LINE สำเร็จ!', 'นำไปวางส่งให้ลูกค้าในแชท LINE ได้ทันที', 'success');
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-2xl p-5 sm:p-7 text-slate-900 space-y-6 relative max-h-[94vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-slate-900">
                  จัดการออเดอร์ & ประเมินราคา
                </span>
                <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                  {order.orderId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                จัดการราคา สเปกการพิมพ์ บันทึกสถานะการโอนเงิน และคัดลอกข้อความส่ง LINE ลูกค้า
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-6 pr-1">

          {/* Section 1: Customer Order Specs Overview */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">MODEL DETAILS</span>
                <h4 className="font-bold text-base text-slate-900">{order.modelName}</h4>
              </div>
              <a
                href={order.modelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-blue-600 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
              >
                <span>เปิดไฟล์ MakerWorld</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Color swatches */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">MAPPED COLORS ({order.colorCount}):</span>
              <div className="flex flex-wrap gap-1.5">
                {order.colors.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full border border-white shadow-xs" style={{ background: c.hex }} />
                    <strong className="text-slate-800">{c.originalColor}</strong> → {c.storeColor}
                  </span>
                ))}
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-200 text-slate-700">
              <div>จำนวน: <strong className="text-slate-900">{order.quantity} ชิ้น</strong></div>
              <div>สเกล: <strong className="text-blue-600">{order.scale}%</strong></div>
              <div>Infill: <strong className="text-emerald-700 capitalize">{order.infill || 'Standard'}</strong></div>
            </div>

            {order.note && (
              <div className="bg-amber-50/90 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>💬 ข้อความจากลูกค้า:</strong> {order.note}
              </div>
            )}
          </div>

          {/* Section 2: Customer Contact & Payment Management */}
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/40 rounded-3xl p-4 sm:p-5 border-2 border-blue-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/70">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-700" />
                <h4 className="font-bold text-sm text-blue-950">ข้อมูลลูกค้า & สถานะการโอนเงิน (Payment & Transfer)</h4>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200 shadow-xs">
                อัปเดตสถานะโอนเงิน
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>ชื่อลูกค้า:</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="เช่น คุณนนท์ / คุณสมชาย"
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 shadow-sm font-medium"
                />
              </div>

              {/* Customer Contact / LINE ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>LINE ID หรือเบอร์ติดต่อ:</span>
                </label>
                <input
                  type="text"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="เช่น LINE: non_3d หรือ 081-xxx-xxxx"
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 shadow-sm font-medium"
                />
              </div>
            </div>

            {/* Payment Status Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">สถานะการโอนเงิน / ชำระเงิน:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UNPAID', label: '⏳ รอโอนเงิน', color: 'border-amber-300 bg-amber-50 text-amber-900' },
                  { id: 'SLIP_SUBMITTED', label: '🧾 ส่งสลิปแล้ว', color: 'border-blue-300 bg-blue-50 text-blue-900' },
                  { id: 'PAID', label: '✅ ชำระเงินแล้ว', color: 'border-emerald-400 bg-emerald-50 text-emerald-950 font-black' },
                  { id: 'REFUNDED', label: '↩️ คืนเงิน', color: 'border-red-300 bg-red-50 text-red-900' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPaymentStatus(item.id as PaymentStatus);
                      if (item.id === 'PAID') {
                        if (paidAmount === 0 && price > 0) setPaidAmount(price);
                        if (!paymentDate) setPaymentDate(new Date().toISOString().slice(0, 16));
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm ${
                      paymentStatus === item.id
                        ? `${item.color} ring-2 ring-blue-500 shadow-md scale-[1.02]`
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paid Amount & Transfer Time & Note */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Paid Amount */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">ยอดเงินที่โอน (฿):</label>
                  {price > 0 && (
                    <button
                      type="button"
                      onClick={() => setPaidAmount(price)}
                      className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      ใส่ ฿{price}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 shadow-sm"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">THB</span>
                </div>
              </div>

              {/* Payment Date & Time */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">วัน/เวลาโอน:</label>
                  <button
                    type="button"
                    onClick={() => setPaymentDate(new Date().toISOString().slice(0, 16))}
                    className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    ตอนนี้ (Now)
                  </button>
                </div>
                <input
                  type="datetime-local"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Payment Note / Method */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">หมายเหตุการโอน/ธนาคาร:</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="เช่น KBank / PromptPay / มัดจำ"
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 shadow-sm"
                />
              </div>
            </div>

            {/* Slip Link URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>ลิงก์รูปสลิปโอนเงิน (URL รูปสลิป):</span>
              </label>
              <input
                type="text"
                value={paymentSlipUrl}
                onChange={(e) => setPaymentSlipUrl(e.target.value)}
                placeholder="เช่น https://... (แนบลิงก์รูปภาพสลิปที่ลูกค้าส่งใน LINE หรือ Google Drive)"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 font-mono shadow-sm"
              />
            </div>
          </div>

          {/* Section 3: Quotation & Printing Specs */}
          <div className="space-y-4 bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>การประเมินราคา & มอบหมายเครื่องพิมพ์</span>
              </h4>

              <button
                type="button"
                onClick={calculateSuggestedPrice}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-xl border border-blue-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>⚡ คำนวณราคาแนะนำอัตโนมัติ</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block">⚡ ค่าประมาณด่วนตามประเภทชิ้นงาน:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { label: 'พวงกุญแจ/ชิ้นเล็ก', g: 25, h: 1.5 },
                  { label: 'ฟิกเกอร์/ของเล่น', g: 60, h: 3.5 },
                  { label: 'ที่วาง/กล่องขนาดกลาง', g: 150, h: 6.5 },
                  { label: 'แจกัน/ชิ้นงานใหญ่', g: 300, h: 12.0 },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setGrams(preset.g);
                      setHours(preset.h);
                      const materialCost = preset.g * settings.basePricePerGram;
                      const timeCost = preset.h * 25;
                      const multiColorCost = Math.max(0, order.colorCount - 1) * settings.amsColorChangeFee;
                      const subtotal = (materialCost + timeCost + multiColorCost) * order.quantity;
                      const total = Math.round(subtotal + settings.shippingFlatRate);
                      setPrice(total);
                      if (paymentStatus === 'PAID') setPaidAmount(total);
                      onShowToast(`เลือกโปรไฟล์: ${preset.label}`, `น้ำหนัก ${preset.g}g • เวลา ${preset.h}ชม. • ราคาแนะนำ ฿${total}`, 'info');
                    }}
                    className="bg-white hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200 rounded-xl px-2 py-1.5 text-[11px] font-bold transition-all shadow-sm flex flex-col items-center cursor-pointer"
                  >
                    <span>{preset.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{preset.g}g • {preset.h}h</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Weight Grams */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">น้ำหนักประเมิน (กรัม):</label>
                <div className="relative">
                  <input
                    type="number"
                    value={grams}
                    onChange={(e) => setGrams(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">g</span>
                </div>
              </div>

              {/* Print Time Hours */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">เวลาพิมพ์ (ชั่วโมง):</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">hrs</span>
                </div>
              </div>

              {/* Quoted Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">ราคาสุทธิที่แจ้งลูกค้า (฿):</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPrice(val);
                      if (paymentStatus === 'PAID' && paidAmount === 0) setPaidAmount(val);
                    }}
                    className="w-full bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-2 text-sm font-black text-amber-900 outline-none focus:border-amber-500 shadow-inner"
                  />
                  <span className="absolute right-3 top-2 text-xs text-amber-700 font-bold">THB</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Order Status */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">สถานะขั้นตอนงาน (Order Status):</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="PENDING_REVIEW">⏳ 1. รอตรวจสอบราคา (Pending Review)</option>
                  <option value="CONFIRMED">✅ 2. ยืนยันราคาแล้ว (Confirmed)</option>
                  <option value="PRINTING">🖨️ 3. กำลังพิมพ์ 3D (Printing)</option>
                  <option value="COMPLETED">📦 4. พิมพ์เสร็จแล้ว (Completed)</option>
                  <option value="SHIPPED">🚚 5. จัดส่งแล้ว (Shipped)</option>
                  <option value="CANCELLED">❌ ยกเลิก (Cancelled)</option>
                </select>
              </div>

              {/* Assign Printer */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>มอบหมายเครื่องพิมพ์ (Printer):</span>
                </label>
                <select
                  value={assignedPrinter}
                  onChange={(e) => setAssignedPrinter(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="">-- ยังไม่ระบุเครื่องพิมพ์ --</option>
                  {printers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status === 'idle' ? 'ว่าง' : 'กำลังพิมพ์'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tracking Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>เลขติดตามพัสดุ (Tracking Number):</span>
              </label>
              <input
                type="text"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                placeholder="เช่น TH0123456789A (Flash/Kerry/EMS/J&T)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 font-mono"
              />
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">โน้ตภายในทีมงาน (Internal Note):</label>
              <input
                type="text"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="เช่น ลูกค้าขอส่งวันศุกร์ / สลิปโอนเช็คแล้ว"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Section 4: Smart LINE Message Generator */}
          <div className="bg-emerald-50/70 rounded-3xl p-4 sm:p-5 border-2 border-emerald-300 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-sm text-emerald-950">
                  เครื่องมือตอบแชท LINE อัจฉริยะ (LINE Quick Reply Templates)
                </h4>
              </div>
              <span className="text-[11px] text-emerald-800 font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                1-Click Copy
              </span>
            </div>

            {/* Template Type Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'quote', label: '1. แจ้งราคา & บัญชีโอน' },
                { id: 'payment_confirmed', label: '2. ยืนยันยอดโอนสำเร็จ' },
                { id: 'printing', label: '3. แจ้งกำลังพิมพ์ 3D' },
                { id: 'shipped', label: '4. แจ้งส่งของ & Tracking' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLineTemplateType(tab.id as any)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    lineTemplateType === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Preview Box */}
            <div className="relative">
              <textarea
                readOnly
                rows={6}
                value={getLineMessage()}
                className="w-full bg-white border border-emerald-200 rounded-2xl p-3 text-xs text-slate-800 font-mono leading-relaxed outline-none shadow-inner"
              />
              <button
                type="button"
                onClick={handleCopyMessage}
                className="absolute top-2.5 right-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>คัดลอกแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>คัดลอกข้อความ</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          {/* Copy LINE Message Button */}
          <button
            type="button"
            onClick={handleCopyMessage}
            className="w-full sm:w-auto flex-1 btn-3d-secondary py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>{copiedMessage ? '✓ คัดลอกข้อความแล้ว!' : 'คัดลอกข้อความ LINE ตามสถานะ'}</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto btn-3d-blue px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-3d-blue cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกข้อมูลออเดอร์ & การโอน</span>
          </button>
        </div>

      </div>
    </div>
  );
};
