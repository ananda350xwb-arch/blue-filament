import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Camera, MessageCircle, X } from 'lucide-react';
import { Order } from '../../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onEnterScreenshotMode: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  order,
  onClose,
  onEnterScreenshotMode,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      // Trigger joyful colorful confetti
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#2563EB', '#EC4899', '#FFD600', '#10B981']
      });
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  // Build structured Thai LINE message
  const colorListText = order.colors
    .map(c => `• ${c.originalColor} → ${c.storeColor}`)
    .join('\n');

  const lineMessageText = `สวัสดีครับ ต้องการสั่งพิมพ์โมเดล 3D
Order ID: ${order.orderId}
Model: ${order.modelName || '3D Model'}
MakerWorld: ${order.modelUrl}
จำนวนสี: ${order.colorCount} สี
สีที่เลือก:
${colorListText}
จำนวน: ${order.quantity} ชิ้น
ขนาด: ${order.scale}%
ความหนาแน่น: ${order.infill || 'Standard'}
${order.note ? `หมายเหตุ: ${order.note}\n` : ''}
รบกวนตรวจสอบราคาและรายละเอียดการพิมพ์ให้ด้วยครับ`;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(lineMessageText);
      setCopied(true);
      onShowToast('คัดลอกข้อความสำเร็จ!', 'นำข้อความไปวางส่งใน LINE ได้ทันที', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      onShowToast('คัดลอกไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง', 'info');
    }
  };

  const handleOpenLine = () => {
    const lineUrl = 'https://line.me/R/ti/p/@bluefilament';
    window.open(lineUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] border-2 border-blue-200 shadow-2xl p-6 sm:p-8 text-slate-900 space-y-6 relative overflow-hidden my-auto max-h-[95vh] flex flex-col justify-between">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Celebration */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.3)] border-4 border-white animate-bounce">
            <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-white stroke-[2.5]" />
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight pt-1">
            บันทึกรายการสั่งพิมพ์สำเร็จ
          </h2>

          <p className="text-sm sm:text-base text-blue-700 font-bold">
            แคปหน้าจอนี้ หรือคัดลอกข้อความ แล้วส่งให้เราทาง LINE
          </p>
        </div>

        {/* Order Ticket Card Preview */}
        <div className="bg-slate-50 rounded-3xl p-4 sm:p-5 border-2 border-slate-200 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-2.5">
            <div>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">ORDER ID</span>
              <span className="font-mono font-black text-base text-amber-900">
                {order.orderId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">PRICE</span>
              {order.paymentStatus === 'PAID' ? (
                <span className="text-xs font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                  ✅ ชำระแล้ว {order.paidAmount || order.quotedPrice ? `฿${(order.paidAmount || order.quotedPrice || 0).toLocaleString()}` : ''}
                </span>
              ) : order.quotedPrice ? (
                <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-300">
                  ฿{order.quotedPrice.toLocaleString()} บาท
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                  รอตรวจสอบราคา
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-base text-slate-900 truncate">
              {order.modelName || 'MakerWorld 3D Model'}
            </h4>
            <p className="text-xs font-mono text-blue-600 font-semibold truncate">
              {order.modelUrl}
            </p>
          </div>

          {/* Color Pills Preview */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {order.colors.map((c, i) => (
              <div
                key={i}
                className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 text-[11px]"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.hex }} />
                <span className="text-slate-800 font-medium">{c.storeColor}</span>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 border-t border-slate-200">
            <span>จำนวน: <strong className="text-slate-900">{order.quantity} ชิ้น</strong></span>
            <span>ขนาด: <strong className="text-blue-600">{order.scale}%</strong></span>
            {order.note && <span className="truncate">โน้ต: {order.note}</span>}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Copy Text Button */}
            <button
              type="button"
              onClick={handleCopyMessage}
              className="btn-3d-blue h-13 sm:h-14 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-3d-blue"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? '✓ คัดลอกแล้ว!' : 'คัดลอกข้อความ'}</span>
            </button>

            {/* Open LINE Button */}
            <button
              type="button"
              onClick={handleOpenLine}
              className="bg-[#06C755] hover:bg-[#05b34c] text-white font-bold h-13 sm:h-14 rounded-2xl shadow-[0_6px_0_#038b3b,0_10px_20px_rgba(6,199,85,0.3)] flex items-center justify-center gap-2 transition-all active:translate-y-1 active:shadow-[0_2px_0_#038b3b] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>เปิด LINE (@bluefilament)</span>
            </button>
          </div>

          {/* Screenshot Mode Button */}
          <button
            type="button"
            onClick={onEnterScreenshotMode}
            className="w-full btn-3d-secondary py-3.5 rounded-2xl text-slate-800 hover:text-blue-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer border-2 border-slate-200"
          >
            <Camera className="w-4 h-4 text-amber-600" />
            <span>แสดงรายการสำหรับแคปหน้าจอ (Screenshot Mode)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
