import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Calculator, Printer, Truck, MessageCircle, Check, Sparkles } from 'lucide-react';
import { Order, OrderStatus, PrinterFleetItem, StoreSettings } from '../../types';

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
  const [price, setPrice] = useState<number>(order?.quotedPrice || 0);
  const [grams, setGrams] = useState<number>(order?.estimatedGrams || 50);
  const [hours, setHours] = useState<number>(order?.estimatedPrintTimeHours || 2.5);
  const [assignedPrinter, setAssignedPrinter] = useState<string>(order?.assignedPrinterId || '');
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'PENDING_REVIEW');
  const [trackingNo, setTrackingNo] = useState<string>(order?.trackingNumber || '');
  const [internalNote, setInternalNote] = useState<string>(order?.internalNotes || '');
  const [copiedQuote, setCopiedQuote] = useState(false);

  useEffect(() => {
    if (order) {
      setPrice(order.quotedPrice || 0);
      setGrams(order.estimatedGrams || 50);
      setHours(order.estimatedPrintTimeHours || 2.5);
      setAssignedPrinter(order.assignedPrinterId || '');
      setStatus(order.status || 'PENDING_REVIEW');
      setTrackingNo(order.trackingNumber || '');
      setInternalNote(order.internalNotes || '');
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
      status: status
    });
    onShowToast('บันทึกข้อมูลใบเสนอราคาเรียบร้อย!', `Order: ${order.orderId}`, 'success');
    onClose();
  };

  const handleCopyLineQuote = () => {
    const message = `สวัสดีครับ จาก Blue Filament 3D Studio นะครับ ✨
แจ้งราคาและรายละเอียดการพิมพ์สำหรับ Order ID: ${order.orderId}

📦 โมเดล: ${order.modelName || '3D Model'}
🎨 จำนวนสี: ${order.colorCount} สี
📏 ขนาด: ${order.scale}%
🔢 จำนวน: ${order.quantity} ชิ้น
⏱️ เวลาพิมพ์โดยประมาณ: ${hours} ชั่วโมง

💰 ยอดสุทธิ (รวมส่ง): ${price > 0 ? `฿${price} บาท` : 'กำลังประเมิน'}
${trackingNo ? `🚚 เลขพัสดุ: ${trackingNo}\n` : ''}
💳 บัญชีโอนชำระ:
ธนาคารกสิกรไทย (KBANK)
123-4-56789-0 (Blue Filament Studio)

หากยืนยันการพิมพ์ สามารถโอนชำระและส่งสลิปได้เลยครับ ทางร้านจะเริ่มขึ้นงานทันที ขอบคุณครับ 🙏`;

    navigator.clipboard.writeText(message);
    setCopiedQuote(true);
    onShowToast('คัดลอกข้อความแจ้งราคา LINE สำเร็จ!', 'นำไปวางส่งให้ลูกค้าใน LINE ได้ทันที', 'success');
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900 space-y-6 relative max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
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
                ประเมินน้ำหนัก คำนวณราคา และส่งข้อความตอบกลับลูกค้าใน LINE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Order Details Quick View */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">MODEL</span>
              <h4 className="font-bold text-base text-slate-900">{order.modelName}</h4>
            </div>
            <a
              href={order.modelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-blue-600 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>เปิดดูไฟล์บน MakerWorld</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Color swatches */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">MAPPED COLORS ({order.colorCount}):</span>
            <div className="flex flex-wrap gap-1.5">
              {order.colors.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.hex }} />
                  <strong className="text-slate-800">{c.originalColor}</strong> → {c.storeColor}
                </span>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-200 text-slate-700">
            <div>จำนวน: <strong className="text-slate-900">{order.quantity} ชิ้น</strong></div>
            <div>สเกล: <strong className="text-blue-600">{order.scale}%</strong></div>
            <div>Infill: <strong className="text-emerald-700 capitalize">{order.infill || 'Standard'}</strong></div>
          </div>

          {order.note && (
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong>💬 ข้อความจากลูกค้า:</strong> {order.note}
            </div>
          )}
        </div>

        {/* Quotation & Printer Assignment Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>การประเมินราคา & ค่าใช้จ่าย</span>
            </h4>

            <button
              type="button"
              onClick={calculateSuggestedPrice}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-xl border border-blue-300 transition-colors cursor-pointer"
            >
              ⚡ คำนวณราคาแนะนำอัตโนมัติ
            </button>
          </div>

          {/* Quick Presets for weight and time */}
          <div className="space-y-1.5 bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
            <span className="text-[11px] font-bold text-blue-900 block">⚡ ค่าประมาณด่วนตามประเภทชิ้นงาน:</span>
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
                    onShowToast(`เลือกโปรไฟล์: ${preset.label}`, `น้ำหนัก ${preset.g}g • เวลา ${preset.h}ชม. • ราคาแนะนำ ฿${total}`, 'info');
                  }}
                  className="bg-white hover:bg-blue-600 hover:text-white text-slate-700 border border-blue-200 rounded-xl px-2 py-1.5 text-[11px] font-bold transition-all shadow-sm flex flex-col items-center cursor-pointer"
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
              <label className="text-xs font-bold text-slate-700">
                น้ำหนักประเมิน (กรัม):
              </label>
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
              <label className="text-xs font-bold text-slate-700">
                เวลาพิมพ์ (ชั่วโมง):
              </label>
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
              <label className="text-xs font-bold text-slate-700">
                ราคาสุทธิที่แจ้งลูกค้า (฿):
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-2 text-sm font-black text-amber-900 outline-none focus:border-amber-500 shadow-inner"
                />
                <span className="absolute right-3 top-2 text-xs text-amber-700 font-bold">THB</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Order Status */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">สถานะรายการ (Status):</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="PENDING_REVIEW">⏳ รอตรวจสอบราคา (Pending Review)</option>
                <option value="CONFIRMED">✅ ยืนยันราคาแล้ว (Confirmed)</option>
                <option value="PRINTING">🖨️ กำลังพิมพ์ 3D (Printing)</option>
                <option value="COMPLETED">📦 พิมพ์เสร็จแล้ว (Completed)</option>
                <option value="SHIPPED">🚚 จัดส่งแล้ว (Shipped)</option>
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
              placeholder="เช่น TH0123456789A (Flash/Kerry/EMS)"
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

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          {/* 1-Click Copy LINE Message */}
          <button
            type="button"
            onClick={handleCopyLineQuote}
            className="w-full sm:w-auto flex-1 btn-3d-secondary py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>{copiedQuote ? '✓ คัดลอกข้อความแล้ว!' : 'คัดลอกข้อความแจ้งราคา LINE'}</span>
          </button>

          {/* Save Quote Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto btn-3d-blue px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-3d-blue cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกการประเมินราคา</span>
          </button>
        </div>

      </div>
    </div>
  );
};
