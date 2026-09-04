import React from 'react';
import { X, History, Trash2, Copy, Camera } from 'lucide-react';
import { Order } from '../../types';

interface OrderHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onClearHistory: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const OrderHistoryDrawer: React.FC<OrderHistoryDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onClearHistory,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const handleCopyOrderText = (order: Order) => {
    const text = `สวัสดีครับ ต้องการสั่งพิมพ์โมเดล 3D
Order ID: ${order.orderId}
Model: ${order.modelName || '3D Model'}
MakerWorld: ${order.modelUrl}
จำนวนสี: ${order.colorCount} สี
จำนวน: ${order.quantity} ชิ้น
ขนาด: ${order.scale}%
รบกวนตรวจสอบราคาให้ด้วยครับ`;

    navigator.clipboard.writeText(text);
    onShowToast('คัดลอกสำเร็จ!', 'นำข้อความไปส่งใน LINE ได้เลย', 'success');
  };

  const formatDate = (dateVal?: string | number | Date) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString('th-TH');
    } catch {
      return '-';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display font-black text-xl">ประวัติการสั่งทำ</h2>
                <p className="text-xs text-slate-400">รายการที่คุณเคยบันทึกไว้บนอุปกรณ์นี้</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <History className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
                <p className="text-slate-500 font-medium">ยังไม่มีประวัติการสั่งทำ</p>
                <p className="text-xs text-slate-400">เมื่อคุณสั่งพิมพ์ โมเดลจะถูกบันทึกไว้ที่นี่</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div
                    key={order.orderId}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-blue-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {order.orderId}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {order.paymentStatus === 'PAID' ? (
                          <span className="font-bold text-emerald-950 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                            ✅ ชำระแล้ว
                          </span>
                        ) : order.quotedPrice ? (
                          <span className="font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-300">
                            ฿{order.quotedPrice.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            {formatDate(order.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {order.modelName || '3D Model'}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <span>{order.quantity} ชิ้น • {order.scale}%</span>
                      <span className="text-blue-600 font-bold">{order.colorCount} สี</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          onSelectOrder(order);
                          onClose();
                        }}
                        className="flex-1 btn-3d-blue py-1.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 shadow-3d-blue cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>เปิดดู / แคปรูป</span>
                      </button>

                      <button
                        onClick={() => handleCopyOrderText(order)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer"
                        title="คัดลอกข้อความ"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Bottom Clear History Button */}
        {orders.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={onClearHistory}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างประวัติทั้งหมด</span>
            </button>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};
