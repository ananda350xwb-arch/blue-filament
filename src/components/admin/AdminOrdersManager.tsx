import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, Printer, Package, Truck, XCircle, Trash2, Edit3, ExternalLink, MessageCircle, Play, Check, Database, ShoppingCart, RefreshCw, CreditCard, User, FileText } from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../types';

interface AdminOrdersManagerProps {
  orders: Order[];
  onOpenOrderQuote: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  onUpdatePaymentStatus?: (orderId: string, paymentStatus: PaymentStatus, paidAmount?: number, paymentNote?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onGoToStorefront?: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({
  orders,
  onOpenOrderQuote,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onDeleteOrder,
  onGoToStorefront,
  onShowToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter(order => {
    if (!order) return false;
    if (filterStatus !== 'ALL' && order.status !== filterStatus) {
      return false;
    }
    if (paymentFilter !== 'ALL' && (order.paymentStatus || 'UNPAID') !== paymentFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (order.orderId && order.orderId.toLowerCase().includes(q)) ||
        (order.modelName && order.modelName.toLowerCase().includes(q)) ||
        (order.customerName && order.customerName.toLowerCase().includes(q)) ||
        (order.customerContact && order.customerContact.toLowerCase().includes(q)) ||
        (order.note && order.note.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalQuotedRevenue = safeOrders.reduce((sum, o) => sum + (o?.quotedPrice || 0), 0);
  const totalPaidRevenue = safeOrders
    .filter(o => o?.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (o?.paidAmount || o?.quotedPrice || 0), 0);
  const pendingCount = safeOrders.filter(o => o?.status === 'PENDING_REVIEW').length;
  const printingCount = safeOrders.filter(o => o?.status === 'PRINTING').length;
  const unpaidCount = safeOrders.filter(o => (o?.paymentStatus || 'UNPAID') === 'UNPAID').length;
  const slipCount = safeOrders.filter(o => o?.paymentStatus === 'SLIP_SUBMITTED').length;
  const paidCount = safeOrders.filter(o => o?.paymentStatus === 'PAID').length;

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

  const getPaymentBadge = (status?: PaymentStatus, paidAmount?: number) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ชำระแล้ว {paidAmount ? `฿${paidAmount.toLocaleString()}` : ''}</span>
          </span>
        );
      case 'SLIP_SUBMITTED':
        return (
          <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs animate-pulse">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>ส่งสลิปแล้ว • รอตรวจ</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="bg-red-100 text-red-900 border border-red-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>คืนเงินแล้ว</span>
          </span>
        );
      case 'UNPAID':
      default:
        return (
          <span className="bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs">
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span>รอโอนเงิน</span>
          </span>
        );
    }
  };

  const formatDateTime = (dateVal?: string | number | Date) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateVal);
    }
  };

  const handleCopyLineQuote = (order: Order) => {
    const customerGreeting = order.customerName ? `คุณ ${order.customerName}` : 'คุณลูกค้า';
    const message = `สวัสดีครับ ${customerGreeting} จาก Blue Filament 3D Studio นะครับ ✨
แจ้งราคาและรายละเอียดการพิมพ์สำหรับ Order ID: ${order.orderId}

📦 โมเดล: ${order.modelName || '3D Model'}
🎨 จำนวนสี: ${order.colorCount} สี
📏 ขนาด: ${order.scale}%
🔢 จำนวน: ${order.quantity} ชิ้น
⏱️ เวลาพิมพ์โดยประมาณ: ${order.estimatedPrintTimeHours || 2.5} ชั่วโมง
🚚 กำหนดจัดส่ง: ภายใน 5 วัน (เนื่องจากต้องดำเนินการจัดทำตามคิว)

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
            รับออเดอร์ คำนวณราคา บันทึกสถานะการโอนเงิน ตรวจสอบสลิป และตอบกลับ LINE ลูกค้าทันที
          </p>
        </div>

        {/* Actions & Search */}
        <div className="flex items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา Order ID, ชื่อลูกค้า, LINE, โมเดล..."
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
          <span className="text-[10px] uppercase font-bold text-amber-800 block">WAITING PAYMENT</span>
          <span className="font-display font-black text-xl text-amber-800">{unpaidCount} รอโอน / {slipCount} สลิป</span>
        </div>
        <div className="p-2 border-r border-slate-100 last:border-0">
          <span className="text-[10px] uppercase font-bold text-purple-700 block">PRINTING QUEUE</span>
          <span className="font-display font-black text-xl text-purple-700">{printingCount} กำลังพิมพ์</span>
        </div>
        <div className="p-2">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">PAID REVENUE</span>
          <span className="font-display font-black text-xl text-emerald-700">฿{totalPaidRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block font-medium">รวม ฿{totalQuotedRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter Ribbon: Order Process & Payment Status */}
      <div className="space-y-2">
        {/* Process Status Tabs */}
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

        {/* Payment Status Sub-Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 pl-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>สถานะเงินโอน:</span>
          </span>
          {[
            { id: 'ALL', label: 'ทุกสถานะโอน', count: safeOrders.length },
            { id: 'UNPAID', label: '⏳ รอโอนเงิน', count: unpaidCount },
            { id: 'SLIP_SUBMITTED', label: '🧾 ส่งสลิปแล้ว', count: slipCount },
            { id: 'PAID', label: '✅ ชำระแล้ว', count: paidCount },
          ].map(pTab => (
            <button
              key={pTab.id}
              onClick={() => setPaymentFilter(pTab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                paymentFilter === pTab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{pTab.label}</span>
              <span className={`text-[10px] opacity-75 font-mono`}>({pTab.count})</span>
            </button>
          ))}
        </div>
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
                ระบบพร้อมรับออเดอร์งานพิมพ์ 3D จริง
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                เมื่อลูกค้ากดสั่งพิมพ์จากหน้าร้าน (บนโทรศัพท์มือถือ หรือคอมพิวเตอร์) ระบบจะส่งออเดอร์เข้ามาที่นี่อัตโนมัติแบบ Real-time พร้อมให้คุณคำนวณราคาและตอบกลับ LINE ได้ทันที
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onGoToStorefront && (
                <button
                  type="button"
                  onClick={onGoToStorefront}
                  className="btn-3d-blue w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-3d-blue flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>🛒 ไปที่หน้าร้าน (เปิดดูหน้าจอที่ลูกค้าเห็น)</span>
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
              {/* Card Top: Order ID, Date, Status Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 shadow-sm">
                    {order.orderId}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>

                {/* Badges: Process Status + Payment Status */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {getPaymentBadge(order.paymentStatus, order.paidAmount)}
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Card Body: Model info, customer info, swatches, price, pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                
                {/* Left (7 cols): Customer Contact & Model Details */}
                <div className="lg:col-span-7 space-y-3">
                  
                  {/* Customer Info Banner */}
                  <div className="bg-blue-50/70 rounded-2xl p-3 border border-blue-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>{order.customerName ? `ลูกค้า: ${order.customerName}` : 'ยังไม่ระบุชื่อลูกค้า'}</span>
                      </span>

                      {order.customerContact && (
                        <span className="text-emerald-800 font-mono font-semibold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-xs flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>{order.customerContact}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      {order.paymentSlipUrl && (
                        <a
                          href={order.paymentSlipUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-blue-600 hover:text-blue-800 bg-white px-2 py-0.5 rounded-md border border-blue-200 inline-flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>ดูรูปสลิป</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {order.paymentNote && (
                        <span className="text-slate-600 truncate max-w-[200px]" title={order.paymentNote}>
                          📝 {order.paymentNote}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Model Header */}
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
                  <div className="text-xs text-slate-600 font-medium flex flex-wrap gap-3 pt-0.5">
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

                {/* Right: Pricing, Payment 1-Click Action & Process Pipeline (5 cols) */}
                <div className="lg:col-span-5 bg-slate-50/90 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">QUOTED PRICE</span>
                      <span className="font-display font-black text-2xl text-slate-900">
                        {order.quotedPrice ? `฿${order.quotedPrice.toLocaleString()}` : <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">รอประเมินราคา</span>}
                      </span>
                    </div>

                    {/* Quick Payment Action Button */}
                    <div className="flex items-center gap-1.5">
                      {order.paymentStatus === 'UNPAID' && onUpdatePaymentStatus && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdatePaymentStatus(order.orderId, 'PAID', order.quotedPrice);
                            onShowToast('บันทึกสถานะชำระเงินแล้ว!', `Order: ${order.orderId}`, 'success');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                          title="ลูกค้ายืนยันโอนเงินแล้ว กดเพื่อบันทึกสถานะ"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                          <span>บันทึกว่าโอนแล้ว</span>
                        </button>
                      )}

                      {order.paymentStatus === 'SLIP_SUBMITTED' && onUpdatePaymentStatus && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdatePaymentStatus(order.orderId, 'PAID', order.quotedPrice);
                            onShowToast('ตรวจสอบสลิปและยืนยันยอดเรียบร้อย!', `Order: ${order.orderId}`, 'success');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-300 text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95 animate-pulse"
                          title="ตรวจสอบสลิปถูกต้องแล้ว ยืนยันยอดเงิน"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                          <span>ยืนยันสลิปถูกต้อง</span>
                        </button>
                      )}

                      {/* Copy LINE quote button */}
                      <button
                        type="button"
                        onClick={() => handleCopyLineQuote(order)}
                        className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        title="คัดลอกข้อความแจ้งราคา LINE"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span className="hidden sm:inline">LINE</span>
                      </button>
                    </div>
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
                        <span>ประเมินราคา & บันทึกโอน</span>
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
                      title="แก้ไขข้อมูลออเดอร์และการโอนเงิน"
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
