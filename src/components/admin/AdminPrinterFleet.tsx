import React from 'react';
import { Printer, Play, Pause, Square, CheckCircle2, Thermometer, Layers } from 'lucide-react';
import { PrinterFleetItem, Order } from '../../types';

interface AdminPrinterFleetProps {
  printers: PrinterFleetItem[];
  orders: Order[];
  onUpdatePrinterStatus: (id: string, status: PrinterFleetItem['status'], orderId?: string, orderName?: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminPrinterFleet: React.FC<AdminPrinterFleetProps> = ({
  printers,
  orders,
  onUpdatePrinterStatus,
  onShowToast,
}) => {
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
          สถานะเครื่องพิมพ์ 3D (Fleet Monitor)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          ตรวจสอบความพร้อม อุณหภูมิหัวฉีด (Nozzle/Bed) ความคืบหน้างานพิมพ์ และมอบหมายคิวงาน
        </p>
      </div>

      {/* Printer Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {printers.map(printer => {
          const isPrinting = printer.status === 'printing';
          const isPaused = printer.status === 'paused';

          return (
            <div
              key={printer.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm space-y-5 flex flex-col justify-between ${
                isPrinting
                  ? 'border-blue-500 ring-4 ring-blue-50'
                  : isPaused
                  ? 'border-amber-400 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Top: Name, Model, AMS Status */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isPrinting ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Printer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-base text-slate-900">{printer.name}</h3>
                      <p className="text-[11px] text-slate-500 font-semibold">{printer.model}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isPrinting
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : isPaused
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isPrinting ? '🖨️ กำลังพิมพ์' : isPaused ? '⏸️ หยุดชั่วคราว' : '🟢 เครื่องว่าง'}
                  </span>
                </div>

                {/* AMS Multi-Color Indicator */}
                {printer.hasAms && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 font-bold">
                    <Layers className="w-3.5 h-3.5" />
                    <span>ระบบเปลี่ยนสีอัตโนมัติ AMS ({printer.amsSlots} สล็อต)</span>
                  </div>
                )}

                {/* Telemetry: Temperature */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Thermometer className="w-3.5 h-3.5 text-red-500" />
                    <span>Nozzle: <strong>{isPrinting ? '220°C' : '24°C'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bed: <strong>{isPrinting ? '55°C' : '25°C'}</strong></span>
                  </div>
                </div>

                {/* Job Progress */}
                {isPrinting || isPaused ? (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs">
                      <span className="text-slate-500 block font-bold text-[10px] uppercase">CURRENT JOB</span>
                      <span className="font-bold text-slate-900 truncate block">
                        {printer.currentOrderName || '3D Print Job'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${printer.progressPercent || 0}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs font-mono text-slate-600">
                      <span>{printer.progressPercent || 0}% เสร็จสิ้น</span>
                      <span>เหลือ ~{printer.timeRemainingMinutes || 30} นาที</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center space-y-1">
                    <p className="text-xs text-slate-500 font-bold">ไม่มีคิวงานที่กำลังพิมพ์</p>
                    <p className="text-[11px] text-slate-400">เลือกออเดอร์ด้านล่างเพื่อเริ่มพิมพ์</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {isPrinting ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdatePrinterStatus(printer.id, 'paused');
                        onShowToast('หยุดงานพิมพ์ชั่วคราว', printer.name, 'info');
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>หยุดชั่วคราว</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onUpdatePrinterStatus(printer.id, 'idle');
                        onShowToast('เสร็จสิ้นงานพิมพ์แล้ว', printer.name, 'success');
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>เสร็จสิ้นงาน</span>
                    </button>
                  </div>
                ) : isPaused ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdatePrinterStatus(printer.id, 'printing');
                        onShowToast('พิมพ์ต่อ', printer.name, 'info');
                      }}
                      className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>พิมพ์ต่อ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onUpdatePrinterStatus(printer.id, 'idle');
                        onShowToast('ยกเลิกงานพิมพ์', printer.name, 'info');
                      }}
                      className="p-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-200 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  /* Idle: Assign new job selector */
                  <div className="space-y-1.5">
                    <select
                      onChange={(e) => {
                        const selectedOrd = orders.find(o => o.orderId === e.target.value);
                        if (selectedOrd) {
                          onUpdatePrinterStatus(printer.id, 'printing', selectedOrd.orderId, selectedOrd.modelName);
                          onShowToast(`เริ่มสั่งพิมพ์ออเดอร์ ${selectedOrd.orderId} บน ${printer.name}`, undefined, 'success');
                        }
                      }}
                      defaultValue=""
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="" disabled>-- เลือกออเดอร์เพื่อเริ่มพิมพ์ --</option>
                      {confirmedOrders.map(o => (
                        <option key={o.orderId} value={o.orderId}>
                          {o.orderId}: {o.modelName} ({o.quantity}ชิ้น)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
