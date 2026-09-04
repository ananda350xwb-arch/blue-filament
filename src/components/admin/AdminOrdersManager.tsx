import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, Printer, Package, Truck, XCircle, Trash2, Edit3, ExternalLink, MessageCircle, Play, Check, Sparkles, Database, ShoppingCart, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersManagerProps {
  orders: Order[];
  onOpenOrderQuote: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onSeedDemoOrders?: () => Promise<void> | void;
  onGoToStorefront?: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({
  orders,
  onOpenOrderQuote,
  onUpdateStatus,
  onDeleteOrder,
  onSeedDemoOrders,
  onGoToStorefront,
  onShowToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter(order => {
    if (!order) return false;
    if (filterStatus !== 'ALL' && order.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (order.orderId && order.orderId.toLowerCase().includes(q)) ||
        (order.modelName && order.modelName.toLowerCase().includes(q)) ||
        (order.note && order.note.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalQuotedRevenue = safeOrders.reduce((sum, o) => sum + (o?.quotedPrice || 0), 0);
  const pendingCount = safeOrders.filter(o => o?.status === 'PENDING_REVIEW').length;
  const printingCount = safeOrders.filter(o => o?.status === 'PRINTING').length;

  const handleSeedOrders = async () => {
    if (!onSeedDemoOrders) return;
    setIsSeeding(true);
    try {
      await onSeedDemoOrders();
      onShowToast('โหลดออเดอร์ตัวอย่าง 3 รายการสำเร็จ!', 'ข้อมูลซิงค์ขึ้น Supabase Cloud เรียบร้อยแล้ว', 'success');
    } catch {
      onShowToast('เกิดข้อผิดพลาดในการโหลดข้อมูลตัวอย่าง', undefined, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"><Clock className="w-3.5 h-3.5" /> รอตรวจสอบราคา</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> ยืนยันราคาแล้ว</span>;
      case 'PRINTING':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm animate-pulse"><Printer className="w-3.5 h-3.5 text-purple-600" /> กำลังพิมพ์ 3D</span>;
      case 'COMPLETED':
        return <span className="bg-teal-100 text-teal-900 border border-teal-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"><Package className="w-3.5 h-3.5 text-teal-600" /> พิมพ์เสร็จแล้ว</span>;
      case 'SHIPPED':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"><Truck className="w-3.5 h-3.5 text-emerald-600" /> จัดส่งแล้ว</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-900 border border-red-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"><XCircle className="w-3.5 h-3.5 text-red-600" /> ยกเลิก</span>;
      default:
        return null;
    }
  };

  const handleCopyLineQuote = (order: Order) => {
    const message = `สวัสดีครับ จาก Blue Filament 3D Studio นะครับ ✨
แจ้งราคาและรายละเอียดการพิมพ์สำหรับ Order ID: ${order.orderId}

📦 โมเดล: ${order.modelName || '3D Model'}
🎨 จำนวนสี: ${order.colorCount} สี
📏 ขนาด: ${order.scale}%
🔢 จำนวน: ${order.quantity} ชิ้น
⏱️ เวลาพิมพ์โดยประมาณ: ${order.estimatedPrintTimeHours || 2.5} ชั่วโมง

💰 ยอดสุทธิ (รวมส่ง): ${order.quotedPrice ? `฿${order.quotedPrice} บาท` : 'รอตรวจสอบราคา'}
${order.trackingNumber ? `🚚 เลขพัสดุ: ${order.trackingNumber}\n` : ''}
💳 บัญชีโอนชำระ:
ธนาคารกสิกรไทย (KBANK)
123-4-56789-0 (Blue Filament Studio)

หากยืนยันการพิมพ์ สามารถโอนชำระและส่งสลิปได้เลยครับ ขอบคุณครับ 🙏`;

    navigator.clipboard.writeText(message);
    onShowToast('คัดลอกข้อความแจ้งราคาสำเร็จ!', `Order: ${order.orderId}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Quick Summary Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              จัดการรายการสั่งพิมพ์ ({safeOrders.length})
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Supabase Realtime
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ระบบประสานงานรับออเดอร์ คำนวณราคา ตัดสต็อกอัตโนมัติ และติดตามสถานะแบบสดข้ามอุปกรณ์
          </p>
        </div>

        {/* Actions & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {onSeedDemoOrders && (
            <button
              type="button"
              onClick={handleSeedOrders}
              disabled={isSeeding}
              className="btn-3d-secondary px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-800 hover:text-blue-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95 disabled:opacity-50"
              title="โหลดออเดอร์ตัวอย่าง 3 รายการเพื่อทดสอบระบบ"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isSeeding ? 'กำลังซิงค์...' : 'โหลดออเดอร์ตัวอย่าง'}</span>
            </button>
          )}

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา Order ID หรือชื่อโมเดล..."
              className="w-full bg-white border-2 border-slate-200 focus:border-blue-600 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 outline-none shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-sm">
        <div className="p-2 border-r border-slate-100 last:border-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">TOTAL ORDERS</span>
          <span className="font-display font-black text-xl text-slate-900">{safeOrders.length} ออเดอร์</span>
        </div>
        <div className="p-2 border-r border-slate-100 last:border-0">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">PENDING REVIEW</span>
          <span className="font-display font-black text-xl text-amber-800">{pendingCount} รายการ</span>
        </div>
        <div className="p-2 border-r border-slate-100 last:border-0">
          <span className="text-[10px] uppercase font-bold text-purple-700 block">PRINTING QUEUE</span>
          <span className="font-display font-black text-xl text-purple-700">{printingCount} กำลังพิมพ์</span>
        </div>
        <div className="p-2">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">TOTAL REVENUE</span>
          <span className="font-display font-black text-xl text-emerald-700">฿{totalQuotedRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-1 overflow-x-auto">
        {[
          { id: 'ALL', label: 'ทั้งหมด', count: safeOrders.length },
          { id: 'PENDING_REVIEW', label: 'รอตรวจสอบราคา', count: pendingCount },
          { id: 'CONFIRMED', label: 'ยืนยันราคาแล้ว', count: safeOrders.filter(o => o.status === 'CONFIRMED').length },
          { id: 'PRINTING', label: 'กำลังพิมพ์ 3D', count: printingCount },
          { id: 'COMPLETED', label: 'พิมพ์เสร็จแล้ว', count: safeOrders.filter(o => o.status === 'COMPLETED').length },
          { id: 'SHIPPED', label: 'จัดส่งแล้ว', count: safeOrders.filter(o => o.status === 'SHIPPED').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              filterStatus === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        safeOrders.length === 0 ? (
          /* Empty Database State */
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border-2 border-blue-100 text-blue-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <Database className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-display font-black text-xl text-slate-900">
                ยังไม่มีรายการสั่งพิมพ์ในระบบ
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                เมื่อลูกค้ากดสั่งพิมพ์จากหน้าร้าน (บนโทรศัพท์มือถือ หรือคอมพิวเตอร์) ระบบจะส่งออเดอร์เข้ามาที่นี่อัตโนมัติแบบ Real-time ผ่าน Supabase Cloud
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onSeedDemoOrders && (
                <button
                  type="button"
                  onClick={handleSeedOrders}
                  disabled={isSeeding}
                  className="btn-3d-blue w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-3d-blue flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>{isSeeding ? 'กำลังบันทึกข้อมูล...' : '⚡ โหลดออเดอร์ตัวอย่าง 3 รายการ'}</span>
                </button>
              )}

              {onGoToStorefront && (
                <button
                  type="button"
                  onClick={onGoToStorefront}
                  className="btn-3d-secondary w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span>🛒 ไปที่หน้าร้านเพื่อทดลองสั่งพิมพ์</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Filter / Search Match Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-slate-200 space-y-4 shadow-sm">
            <div className="text-4xl">🔍</div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">ไม่พบรายการสั่งพิมพ์ในหมวดที่เลือก</h3>
              <p className="text-xs text-slate-400">
                {searchQuery ? `ไม่พบข้อมูลที่ตรงกับ "${searchQuery}"` : 'ไม่มีออเดอร์ในสถานะนี้'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilterStatus('ALL');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรองและดูทั้งหมด ({safeOrders.length})</span>
            </button>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.orderId}
              className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-blue-300 transition-all shadow-sm space-y-4"
            >
              {/* Card Top: Order ID, Date, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 shadow-sm">
                    {order.orderId}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Card Body: Model info, swatches, price, pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                
                {/* Left (7 cols) */}
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-lg text-slate-900">
                      {order.modelName || '3D Model'}
                    </h3>
                    <a
                      href={order.modelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-flex items-center gap-1 font-bold"
                    >
                      <span>เปิด MakerWorld</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Colors List */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {(order.colors || []).map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-[11px] bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full border border-white shadow-xs" style={{ background: c?.hex || '#2563EB' }} />
                        <span className="font-bold">{c?.storeColor || 'Color'}</span>
                      </span>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="text-xs text-slate-600 font-medium flex flex-wrap gap-3 pt-1">
                    <span>จำนวน: <strong className="text-slate-900">{order.quantity} ชิ้น</strong></span>
                    <span>สเกล: <strong className="text-blue-600">{order.scale}%</strong></span>
                    <span>Infill: <strong className="text-emerald-700 capitalize">{order.infill || 'Standard'}</strong></span>
                    {order.estimatedPrintTimeHours && (
                      <span>เวลาพิมพ์: <strong className="text-purple-700">~{order.estimatedPrintTimeHours} ชม.</strong></span>
                    )}
                  </div>

                  {order.note && (
                    <p className="text-xs text-slate-700 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80">
                      💬 <strong className="text-amber-950">โน้ตลูกค้า:</strong> {order.note}
                    </p>
                  )}
                </div>

                {/* Right: Pricing, Quick Pipeline & Action Controls (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50/90 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">QUOTED PRICE</span>
                      <span className="font-display font-black text-2xl text-slate-900">
                        {order.quotedPrice ? `฿${order.quotedPrice.toLocaleString()}` : <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">รอประเมินราคา</span>}
                      </span>
                    </div>

                    {/* Copy LINE quote button */}
                    <button
                      type="button"
                      onClick={() => handleCopyLineQuote(order)}
                      className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      title="คัดลอกข้อความแจ้งราคา LINE"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">คัดลอก LINE</span>
                    </button>
                  </div>

                  {order.trackingNumber && (
                    <div className="text-xs font-mono text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 truncate">
                      🚚 <strong>Tracking:</strong> {order.trackingNumber}
                    </div>
                  )}

                  {/* 1-Click Status Pipeline Fast-Forward */}
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                    {order.status === 'PENDING_REVIEW' && (
                      <button
                        onClick={() => onOpenOrderQuote(order)}
                        className="flex-1 btn-3d-blue py-2.5 rounded-xl text-xs font-bold text-white shadow-3d-blue flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ประเมินราคา & ตอบแชท</span>
                      </button>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => {
                          if (onUpdateStatus) {
                            onUpdateStatus(order.orderId, 'PRINTING');
                            onShowToast('เริ่มพิมพ์ออเดอร์แล้ว!', order.orderId, 'success');
                          }
                        }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>เริ่มพิมพ์ 3D (Start Print)</span>
                      </button>
                    )}

                    {order.status === 'PRINTING' && (
                      <button
                        onClick={() => {
                          if (onUpdateStatus) {
                            onUpdateStatus(order.orderId, 'COMPLETED');
                            onShowToast('พิมพ์เสร็จสมบูรณ์!', 'ระบบตัดสต็อกฟิลาเมนต์อัตโนมัติแล้ว', 'success');
                          }
                        }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>พิมพ์เสร็จแล้ว (Mark Complete)</span>
                      </button>
                    )}

                    {order.status === 'COMPLETED' && (
                      <button
                        onClick={() => {
                          const tracking = window.prompt('กรุณาระบุเลขพัสดุ (Tracking Number) หรือเว้นว่าง:', order.trackingNumber || '');
                          if (tracking !== null && onUpdateStatus) {
                            onUpdateStatus(order.orderId, 'SHIPPED', tracking || undefined);
                            onShowToast('บันทึกการจัดส่งแล้ว!', order.orderId, 'success');
                          }
                        }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Truck className="w-4 h-4" />
                        <span>บันทึกจัดส่ง (Ship Order)</span>
                      </button>
                    )}

                    {/* Edit Details */}
                    <button
                      onClick={() => onOpenOrderQuote(order)}
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer shadow-sm"
                      title="แก้ไขข้อมูลออเดอร์"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`ยืนยันการลบออเดอร์ ${order.orderId}?`)) {
                          onDeleteOrder(order.orderId);
                          onShowToast('ลบรายการสั่งพิมพ์แล้ว', order.orderId, 'info');
                        }
                      }}
                      className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                      title="ลบรายการ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
