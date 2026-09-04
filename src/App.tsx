import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/home/HeroSection';
import { BrandTrustBar } from './components/home/BrandTrustBar';
import { HowItWorks } from './components/home/HowItWorks';
import { FilamentMaterialLab } from './components/home/FilamentMaterialLab';
import { ModelInspirationGallery } from './components/home/ModelInspirationGallery';
import { MainCTA } from './components/home/MainCTA';
import { FAQSection } from './components/home/FAQSection';
import { Footer } from './components/layout/Footer';
import { PrintFlowModal } from './components/order-flow/PrintFlowModal';
import { ConfirmationModal } from './components/confirmation/ConfirmationModal';
import { ScreenshotModeView } from './components/confirmation/ScreenshotModeView';
import { OrderHistoryDrawer } from './components/history/OrderHistoryDrawer';
import { Toast, ToastMessage } from './components/common/Toast';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useOrderState } from './hooks/useOrderState';
import { useAdminStore } from './hooks/useAdminStore';
import { ModelPreset, Order } from './types';
import { Sparkles } from 'lucide-react';

export function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.toLowerCase().startsWith('/admin') ||
      window.location.hash.toLowerCase() === '#admin' ||
      window.location.search.includes('admin=true')
    );
  });

  // Listen to URL route changes (e.g. /admin, #admin) & Keyboard shortcut Cmd+Shift+A
  useEffect(() => {
    const checkAdminRoute = () => {
      const isAdm =
        window.location.pathname.toLowerCase().startsWith('/admin') ||
        window.location.hash.toLowerCase() === '#admin' ||
        window.location.search.includes('admin=true');
      setIsAdminMode(isAdm);
    };

    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Cmd+Shift+A or Ctrl+Shift+A for direct Admin access
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminMode(prev => {
          const next = !prev;
          if (next) {
            window.history.pushState({}, '', '/admin');
          } else {
            window.history.pushState({}, '', '/');
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Admin store for live synchronized data
  const {
    filaments,
    modelPresets,
  } = useAdminStore();

  const {
    step,
    setStep,
    isOpen,
    setIsOpen,
    modelUrl,
    setModelUrl,
    modelName,
    setModelName,
    colorCount,
    handleColorCountChange,
    colorMappings,
    updateColorMapping,
    updateOriginalColorName,
    quantity,
    setQuantity,
    scaleMode,
    setScaleMode,
    scale,
    setScale,
    infill,
    setInfill,
    note,
    setNote,
    currentOrderId,
    recentOrders,
    lastCompletedOrder,
    isConfirmationOpen,
    setIsConfirmationOpen,
    isScreenshotMode,
    setIsScreenshotMode,
    loadPreset,
    startNewOrder,
    completeOrder,
  } = useOrderState();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedHistoryOrder, setSelectedHistoryOrder] = useState<Order | null>(null);

  const addToast = useCallback((title: string, description?: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSelectPreset = (preset: ModelPreset) => {
    loadPreset(preset);
    addToast('โหลดโมเดลสำเร็จ!', `เลือกโมเดล: ${preset.nameTh}`, 'success');
  };

  const handleCompleteOrder = () => {
    completeOrder();
    addToast('สร้างรายการสั่งพิมพ์สำเร็จ!', 'บันทึกรายการเข้าสู่ระบบหลังบ้านเรียบร้อยแล้ว', 'success');
  };

  const handleExitAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdminMode(false);
  };

  // If visiting /admin or #admin, show the dedicated Admin Dashboard
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Toast toasts={toasts} onDismiss={dismissToast} />
        <AdminDashboard
          onExitAdmin={handleExitAdmin}
          onShowToast={addToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 relative">
      
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Clean Customer Header (No Admin Button) */}
      <Header
        onOpenOrderFlow={startNewOrder}
        onOpenHistory={() => setIsHistoryOpen(true)}
        orderCount={recentOrders.length}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero */}
        <HeroSection onOpenOrderFlow={startNewOrder} />

        {/* Brand Quality Trust Showcase */}
        <BrandTrustBar />

        {/* How It Works */}
        <HowItWorks onOpenOrderFlow={startNewOrder} />

        {/* Filament Material Lab */}
        <FilamentMaterialLab
          filaments={filaments}
          onOpenOrderFlow={startNewOrder}
        />

        {/* Model Inspiration Gallery */}
        <ModelInspirationGallery
          modelPresets={modelPresets}
          onSelectPreset={handleSelectPreset}
        />

        {/* Main CTA Poster */}
        <MainCTA onOpenOrderFlow={startNewOrder} />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer onOpenOrderFlow={startNewOrder} />

      {/* Floating Quick Action Button on Mobile */}
      <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-30 sm:hidden">
        <button
          onClick={startNewOrder}
          className="btn-3d-blue w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer active:scale-95 transition-transform"
          aria-label="สั่งพิมพ์"
        >
          <Sparkles className="w-6 h-6 text-yellow-300 animate-spin-slow" />
        </button>
      </div>

      {/* Full-Screen Print Customizer Flow */}
      <PrintFlowModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        step={step}
        setStep={setStep}
        modelUrl={modelUrl}
        setModelUrl={setModelUrl}
        modelName={modelName}
        setModelName={setModelName}
        colorCount={colorCount}
        onColorCountChange={handleColorCountChange}
        colorMappings={colorMappings}
        availableFilaments={filaments}
        updateColorMapping={updateColorMapping}
        updateOriginalColorName={updateOriginalColorName}
        quantity={quantity}
        setQuantity={setQuantity}
        scaleMode={scaleMode}
        setScaleMode={setScaleMode}
        scale={scale}
        setScale={setScale}
        infill={infill}
        setInfill={setInfill}
        note={note}
        setNote={setNote}
        orderId={currentOrderId}
        onSelectPreset={handleSelectPreset}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        order={lastCompletedOrder || selectedHistoryOrder}
        onClose={() => setIsConfirmationOpen(false)}
        onEnterScreenshotMode={() => {
          setIsConfirmationOpen(false);
          setIsScreenshotMode(true);
        }}
        onShowToast={addToast}
      />

      {/* Dedicated Screenshot Mode View */}
      {isScreenshotMode && (lastCompletedOrder || selectedHistoryOrder) && (
        <ScreenshotModeView
          order={(lastCompletedOrder || selectedHistoryOrder)!}
          onExit={() => {
            setIsScreenshotMode(false);
            setIsConfirmationOpen(true);
          }}
        />
      )}

      {/* Order History Drawer */}
      <OrderHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={recentOrders}
        onSelectOrder={(order) => {
          setSelectedHistoryOrder(order);
          setIsConfirmationOpen(true);
        }}
        onClearHistory={() => {
          localStorage.removeItem('blue_filament_orders');
          window.location.reload();
        }}
        onShowToast={addToast}
      />

    </div>
  );
}

export default App;
