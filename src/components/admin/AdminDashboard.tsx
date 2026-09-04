import React, { useState } from 'react';
import { LayoutDashboard, Package, Palette, Lightbulb, Printer, Settings, ArrowLeft } from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminOrdersManager } from './AdminOrdersManager';
import { AdminFilamentManager } from './AdminFilamentManager';
import { AdminModelsManager } from './AdminModelsManager';
import { AdminPrinterFleet } from './AdminPrinterFleet';
import { AdminSettings } from './AdminSettings';
import { OrderQuoteModal } from './OrderQuoteModal';
import { FilamentEditModal } from './FilamentEditModal';
import { Order, FilamentColor } from '../../types';
import { useAdminStore } from '../../hooks/useAdminStore';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Modals state
  const [selectedQuoteOrder, setSelectedQuoteOrder] = useState<Order | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  const [selectedFilamentForEdit, setSelectedFilamentForEdit] = useState<FilamentColor | null>(null);
  const [isFilamentModalOpen, setIsFilamentModalOpen] = useState(false);

  const {
    orders,
    filaments,
    modelPresets,
    printers,
    settings,
    updateOrderStatus,
    saveOrderQuote,
    deleteOrder,
    addFilament,
    updateFilament,
    deleteFilament,
    toggleFilamentStock,
    addModelPreset,
    updateModelPreset,
    deleteModelPreset,
    updatePrinterStatus,
    updateSettings,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  } = useAdminStore();

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING_REVIEW').length;
  const inStockFilamentCount = filaments.filter(f => f.inStock).length;
  const activePrintersCount = printers.filter(p => p.status === 'printing').length;

  const handleOpenQuote = (order: Order) => {
    setSelectedQuoteOrder(order);
    setIsQuoteModalOpen(true);
  };

  const handleOpenFilamentEdit = (filament: FilamentColor | null) => {
    setSelectedFilamentForEdit(filament);
    setIsFilamentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand + Admin Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-pink p-[2px] shadow-3d-blue">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-sm">
                🧶
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-slate-900">
                  Blue Filament
                </span>
                <span className="bg-blue-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shadow-sm">
                  ADMIN BACKOFFICE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                ระบบจัดการร้านพิมพ์ 3D & คลังวัสดุ
              </p>
            </div>
          </div>

          {/* Exit to Storefront Button */}
          <button
            type="button"
            onClick={onExitAdmin}
            className="btn-3d-secondary px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>กลับสู่หน้าร้าน (Storefront)</span>
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100">
          {[
            { id: 'overview', label: 'ภาพรวม', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'orders', label: 'รายการสั่งพิมพ์', icon: <Package className="w-4 h-4" />, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-amber-500 text-white' },
            { id: 'filaments', label: 'คลังสี & วัสดุ Filament', icon: <Palette className="w-4 h-4" />, badge: inStockFilamentCount, badgeColor: 'bg-blue-100 text-blue-800' },
            { id: 'presets', label: 'โมเดลแนะนำ MakerWorld', icon: <Lightbulb className="w-4 h-4" />, badge: modelPresets.length },
            { id: 'fleet', label: 'เครื่องพิมพ์ 3D (Fleet)', icon: <Printer className="w-4 h-4" />, badge: activePrintersCount > 0 ? `${activePrintersCount} เครื่อง` : undefined, badgeColor: 'bg-emerald-500 text-white' },
            { id: 'settings', label: 'ตั้งค่าร้าน & สำรองข้อมูล', icon: <Settings className="w-4 h-4" /> },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'overview' && (
          <AdminOverview
            orders={orders}
            filaments={filaments}
            printers={printers}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenOrderQuote={handleOpenQuote}
            onOpenAddFilament={() => handleOpenFilamentEdit(null)}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersManager
            orders={orders}
            onOpenOrderQuote={handleOpenQuote}
            onUpdateStatus={updateOrderStatus}
            onDeleteOrder={deleteOrder}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'filaments' && (
          <AdminFilamentManager
            filaments={filaments}
            onOpenEditFilament={handleOpenFilamentEdit}
            onToggleStock={toggleFilamentStock}
            onDeleteFilament={deleteFilament}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'presets' && (
          <AdminModelsManager
            modelPresets={modelPresets}
            onAddModel={addModelPreset}
            onUpdateModel={updateModelPreset}
            onDeleteModel={deleteModelPreset}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'fleet' && (
          <AdminPrinterFleet
            printers={printers}
            orders={orders}
            onUpdatePrinterStatus={updatePrinterStatus}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onUpdateSettings={updateSettings}
            onExportData={exportDataJson}
            onImportData={importDataJson}
            onResetDefaults={resetToDefaults}
            onShowToast={onShowToast}
          />
        )}

      </main>

      {/* Order Quote & Review Modal */}
      <OrderQuoteModal
        isOpen={isQuoteModalOpen}
        order={selectedQuoteOrder}
        printers={printers}
        settings={settings}
        onClose={() => setIsQuoteModalOpen(false)}
        onSaveQuote={saveOrderQuote}
        onShowToast={onShowToast}
      />

      {/* Filament Add/Edit Modal */}
      <FilamentEditModal
        isOpen={isFilamentModalOpen}
        filament={selectedFilamentForEdit}
        onClose={() => setIsFilamentModalOpen(false)}
        onSave={(fil) => {
          if (selectedFilamentForEdit) {
            updateFilament(selectedFilamentForEdit.id, fil);
          } else {
            addFilament(fil);
          }
        }}
        onShowToast={onShowToast}
      />

    </div>
  );
};
