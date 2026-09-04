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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl text-slate-900">
        
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-900">
              <History className="w-5 h-5 text-blue-600" />
              <h3 className="font-display font-black text-lg">ประวัติรายการที่บันทึกไว้</h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <History className="w-6 h-6" />
              </div>
              <p className="text-slate-500 text-sm font-medium">ยังไม่มีประวัติรายการสั่งพิมพ์</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl p-4 border-2 border-slate-200 space-y-2.5 hover:border-blue-400 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
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
                          {new Date(order.createdAt).toLocaleDateString('th-TH')}
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
  );
};
