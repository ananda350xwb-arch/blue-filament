import React, { useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Printer } from 'lucide-react';
import { StepProgress } from './StepProgress';
import { Step1Model } from './Step1Model';
import { Step2Colors } from './Step2Colors';
import { Step3Details } from './Step3Details';
import { Step4Summary } from './Step4Summary';
import { OrderStep, ColorMapping, ModelPreset, FilamentColor } from '../../types';

interface PrintFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: OrderStep;
  setStep: (step: OrderStep) => void;
  modelUrl: string;
  setModelUrl: (url: string) => void;
  modelName: string;
  setModelName: (name: string) => void;
  colorCount: number;
  onColorCountChange: (count: number) => void;
  colorMappings: ColorMapping[];
  availableFilaments?: FilamentColor[];
  updateColorMapping: (index: number, storeColorId: string, customOriginalName?: string) => void;
  updateOriginalColorName: (index: number, name: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  scaleMode: 'original' | 'custom';
  setScaleMode: (m: 'original' | 'custom') => void;
  scale: number;
  setScale: (s: number) => void;
  infill: 'standard' | 'strong' | 'solid';
  setInfill: (inf: 'standard' | 'strong' | 'solid') => void;
  note: string;
  setNote: (note: string) => void;
  orderId: string;
  onSelectPreset: (preset: ModelPreset) => void;
  onCompleteOrder: () => void;
}

export const PrintFlowModal: React.FC<PrintFlowModalProps> = ({
  isOpen,
  onClose,
  step,
  setStep,
  modelUrl,
  setModelUrl,
  modelName,
  setModelName,
  colorCount,
  onColorCountChange,
  colorMappings,
  availableFilaments,
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
  orderId,
  onSelectPreset,
  onCompleteOrder,
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as OrderStep);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as OrderStep);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Container - Mobile Full Screen (100dvh), Desktop Centered Card */}
      <div className="w-full h-[100dvh] sm:h-[90vh] sm:max-h-[850px] sm:max-w-2xl bg-white sm:rounded-[2rem] border-0 sm:border-2 sm:border-slate-200 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur-md flex-shrink-0 z-20">
          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-black text-slate-900 text-base block leading-tight">
                    สั่งพิมพ์ 3D
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Blue Filament Customizer
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 py-3 px-4 flex-shrink-0">
          <StepProgress currentStep={step} onStepClick={(s) => setStep(s)} />
        </div>

        {/* Scrollable Step Content (Guaranteed 100% scroll to bottom) */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 pb-8 bg-[#F8FAFC]">
          {step === 1 && (
            <Step1Model
              modelUrl={modelUrl}
              setModelUrl={setModelUrl}
              modelName={modelName}
              setModelName={setModelName}
              onSelectPreset={onSelectPreset}
            />
          )}

          {step === 2 && (
            <Step2Colors
              colorCount={colorCount}
              onColorCountChange={onColorCountChange}
              colorMappings={colorMappings}
              availableFilaments={availableFilaments}
              onUpdateMapping={updateColorMapping}
              onUpdateOriginalName={updateOriginalColorName}
            />
          )}

          {step === 3 && (
            <Step3Details
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
            />
          )}

          {step === 4 && (
            <Step4Summary
              orderId={orderId}
              modelUrl={modelUrl}
              modelName={modelName}
              colorCount={colorCount}
              colorMappings={colorMappings}
              quantity={quantity}
              scale={scaleMode === 'original' ? 100 : scale}
              infill={infill}
              note={note}
              onConfirmOrder={onCompleteOrder}
            />
          )}
        </div>

        {/* Bottom Action Bar for Steps 1, 2, 3 (Inside flex flow with safe-area padding) */}
        {step < 4 && (
          <div className="flex-shrink-0 p-3.5 sm:p-4 sm:px-8 pb-[max(0.875rem,env(safe-area-inset-bottom))] bg-white border-t border-slate-200 z-20 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="w-1/3 btn-3d-secondary h-12 sm:h-13 rounded-2xl text-slate-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 btn-3d-blue h-12 sm:h-13 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-3d-blue cursor-pointer"
            >
              <span>{step === 3 ? 'ดูสรุปรายการสั่งพิมพ์' : 'ขั้นตอนถัดไป'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
