import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, Printer, Package, Truck, XCircle, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersManagerProps {
  orders: Order[];
  onOpenOrderQuote: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({
  orders,
  onOpenOrderQuote,
  onDeleteOrder,
  onShowToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'ALL' && order.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.orderId.toLowerCase().includes(q) ||
        (order.modelName && order.modelName.toLowerCase().includes(q)) ||
        (order.note && order.note.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> รอตรวจสอบราคา</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> ยืนยันราคาแล้ว</span>;
      case 'PRINTING':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Printer className="w-3 h-3" /> กำลังพิมพ์ 3D</span>;
      case 'COMPLETED':
        return <span className="bg-teal-100 text-teal-900 border border-teal-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Package className="w-3 h-3" /> พิมพ์เสร็จแล้ว</span>;
      case 'SHIPPED':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> จัดส่งแล้ว</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-900 border border-red-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> ยกเลิก</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            จัดการรายการสั่งพิมพ์ ({orders.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ตรวจสอบออเดอร์จากลูกค้า ประเมินราคา กำหนดเครื่องพิมพ์ และอัปเดตสถานะ
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหา Order ID หรือชื่อโมเดล..."
            className="w-full bg-white border-2 border-slate-200 focus:border-blue-600 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto">
        {[
          { id: 'ALL', label: 'ทั้งหมด', count: orders.length },
          { id: 'PENDING_REVIEW', label: 'รอตรวจสอบราคา', count: orders.filter(o => o.status === 'PENDING_REVIEW').length },
          { id: 'CONFIRMED', label: 'ยืนยันราคาแล้ว', count: orders.filter(o => o.status === 'CONFIRMED').length },
          { id: 'PRINTING', label: 'กำลังพิมพ์ 3D', count: orders.filter(o => o.status === 'PRINTING').length },
          { id: 'COMPLETED', label: 'พิมพ์เสร็จแล้ว', count: orders.filter(o => o.status === 'COMPLETED').length },
          { id: 'SHIPPED', label: 'จัดส่งแล้ว', count: orders.filter(o => o.status === 'SHIPPED').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
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
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-slate-200 space-y-3">
          <div className="text-4xl">📋</div>
          <h3 className="font-bold text-slate-700">ไม่พบรายการสั่งพิมพ์ในหมวดนี้</h3>
          <p className="text-xs text-slate-400">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
        </div>
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
                  <span className="font-mono text-sm font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                    {order.orderId}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Card Body: Model info, swatches, price */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                
                {/* Left (7 cols) */}
                <div className="lg:col-span-7 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-lg text-slate-900">
                      {order.modelName || '3D Model'}
                    </h3>
                    <a
                      href={order.modelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-bold"
                    >
                      <span>MakerWorld</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Colors */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {order.colors.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.hex }} />
                        <span>{c.storeColor}</span>
                      </span>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="text-xs text-slate-600 font-medium flex flex-wrap gap-3 pt-1">
                    <span>จำนวน: <strong className="text-slate-900">{order.quantity} ชิ้น</strong></span>
                    <span>สเกล: <strong className="text-blue-600">{order.scale}%</strong></span>
                    <span>ความหนาแน่น: <strong className="text-emerald-700 capitalize">{order.infill || 'Standard'}</strong></span>
                  </div>

                  {order.note && (
                    <p className="text-xs text-slate-600 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      💬 <strong className="text-amber-900">โน้ตลูกค้า:</strong> {order.note}
                    </p>
                  )}
                </div>

                {/* Right: Pricing & Action Controls (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase">QUOTED PRICE:</span>
                    <span className="font-display font-black text-xl text-slate-900">
                      {order.quotedPrice ? `฿${order.quotedPrice}` : <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded">รอประเมินราคา</span>}
                    </span>
                  </div>

                  {order.trackingNumber && (
                    <div className="text-xs font-mono text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 truncate">
                      🚚 Tracking: {order.trackingNumber}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                    <button
                      onClick={() => onOpenOrderQuote(order)}
                      className="flex-1 btn-3d-blue py-2 rounded-xl text-xs font-bold text-white shadow-3d-blue flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{order.quotedPrice ? 'แก้ไขราคา / สถานะ' : 'ประเมินราคา & ตอบ LINE'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`ยืนยันการลบออเดอร์ ${order.orderId}?`)) {
                          onDeleteOrder(order.orderId);
                          onShowToast('ลบรายการสั่งพิมพ์แล้ว', order.orderId, 'info');
                        }
                      }}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
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
