import React from 'react';
import { Clock, DollarSign, Printer, ArrowUpRight, CheckCircle2, AlertCircle, Palette, Sparkles } from 'lucide-react';
import { Order, FilamentColor, PrinterFleetItem } from '../../types';

interface AdminOverviewProps {
  orders: Order[];
  filaments: FilamentColor[];
  printers: PrinterFleetItem[];
  onNavigateTab: (tab: string) => void;
  onOpenOrderQuote: (order: Order) => void;
  onOpenAddFilament: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  orders,
  filaments,
  printers,
  onNavigateTab,
  onOpenOrderQuote,
  onOpenAddFilament,
}) => {
  const pendingOrders = orders.filter(o => o.status === 'PENDING_REVIEW');

  const totalRevenue = orders.reduce((sum, o) => sum + (o.quotedPrice || 0), 0);
  const activePrintersCount = printers.filter(p => p.status === 'printing').length;
  const inStockFilamentsCount = filaments.filter(f => f.inStock).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-10 -bottom-10 text-9xl opacity-10 select-none">
          🧶
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>BLUE FILAMENT STUDIO MANAGEMENT</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-4xl">
            ยินดีต้อนรับสู่ระบบหลังบ้าน 🚀
          </h2>

          <p className="text-sm sm:text-base text-blue-100 font-medium">
            มี <strong className="text-yellow-300 underline font-bold">{pendingOrders.length} รายการ</strong> ที่รอการตรวจสอบราคาและตอบกลับลูกค้าทาง LINE
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Pending Review Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-900 uppercase">รอตรวจสอบราคา</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-amber-800">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <span>รายการจากลูกค้า</span>
            <ArrowUpRight className="w-3 h-3 text-amber-600" />
          </p>
        </div>

        {/* Active Printers */}
        <div 
          onClick={() => onNavigateTab('fleet')}
          className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-900 uppercase">เครื่องพิมพ์ที่กำลังทำงาน</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-blue-700">
            {activePrintersCount} <span className="text-lg text-slate-400 font-normal">/ {printers.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <span>Utilization {Math.round((activePrintersCount / printers.length) * 100)}%</span>
            <ArrowUpRight className="w-3 h-3 text-blue-600" />
          </p>
        </div>

        {/* In-Stock Filament Colors */}
        <div 
          onClick={() => onNavigateTab('filaments')}
          className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-sm hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-900 uppercase">สีฟิลาเมนต์พร้อมใช้</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-emerald-700">
            {inStockFilamentsCount} <span className="text-lg text-slate-400 font-normal">/ {filaments.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <span>จัดการสต็อกสี</span>
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
          </p>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-purple-900 uppercase">ยอดประเมินรวม</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-purple-700">
            ฿{totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            จากทั้งหมด {orders.length} ออเดอร์
          </p>
        </div>

      </div>

      {/* Two Column Section: Action Required Orders & Active Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Pending Review List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h3 className="font-display font-bold text-lg text-slate-900">
                รายการที่ต้องตรวจสอบราคา ({pendingOrders.length})
              </h3>
            </div>

            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              ดูทั้งหมด →
            </button>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-slate-600 text-sm font-bold">ไม่มีรายการค้างตรวจสอบ!</p>
              <p className="text-xs text-slate-400">ออเดอร์ทั้งหมดได้รับการประเมินราคาเรียบร้อยแล้ว</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.slice(0, 4).map(order => (
                <div
                  key={order.orderId}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-blue-400 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {order.orderId}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {order.modelName || '3D Model'}
                    </h4>

                    <div className="text-xs text-slate-500">
                      {order.colorCount} สี • {order.quantity} ชิ้น • สเกล {order.scale}%
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenOrderQuote(order)}
                    className="btn-3d-blue px-4 py-2 rounded-xl text-xs font-bold text-white shadow-3d-blue flex-shrink-0 cursor-pointer"
                  >
                    ประเมินราคา →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: 3D Printer Queue Snapshot (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-600" />
              <h3 className="font-display font-bold text-lg text-slate-900">
                สถานะเครื่องพิมพ์ (Fleet)
              </h3>
            </div>

            <button
              onClick={() => onNavigateTab('fleet')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              จัดการเครื่อง →
            </button>
          </div>

          <div className="space-y-3">
            {printers.map(printer => (
              <div
                key={printer.id}
                className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{printer.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    printer.status === 'printing'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {printer.status === 'printing' ? '🖨️ กำลังพิมพ์' : '🟢 เครื่องว่าง'}
                  </span>
                </div>

                {printer.status === 'printing' ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold text-slate-700 truncate">
                      งาน: {printer.currentOrderName}
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${printer.progressPercent || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{printer.progressPercent}% เสร็จแล้ว</span>
                      <span>เหลือ ~{printer.timeRemainingMinutes} นาที</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 py-1">
                    พร้อมรับคิวพิมพ์ใหม่
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={onOpenAddFilament}
              className="w-full btn-3d-secondary py-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>เพิ่มสี Filament ใหม่</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
