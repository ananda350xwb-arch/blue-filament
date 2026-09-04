import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onDismiss(toast.id)}
            className="pointer-events-auto cursor-pointer p-4 rounded-2xl border flex items-center gap-3 backdrop-blur-xl shadow-2xl text-white plastic-card"
            style={{
              background: toast.type === 'success' 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.95) 100%)'
                : toast.type === 'error'
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(29, 78, 216, 0.95) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35), inset 0 2px 3px rgba(255, 255, 255, 0.4)'
            }}
          >
            <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-white" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm tracking-wide">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-white/90 mt-0.5 truncate">{toast.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
