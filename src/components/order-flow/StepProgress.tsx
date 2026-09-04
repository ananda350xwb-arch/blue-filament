import React from 'react';
import { Check } from 'lucide-react';
import { OrderStep } from '../../types';

interface StepProgressProps {
  currentStep: OrderStep;
  onStepClick?: (step: OrderStep) => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { num: 1, label: 'เลือกลิงก์โมเดล' },
    { num: 2, label: 'เลือกสีวัสดุ' },
    { num: 3, label: 'รายละเอียดการพิมพ์' },
    { num: 4, label: 'สรุปรายการ' },
  ];

  return (
    <div className="w-full py-1">
      {/* Progress Track */}
      <div className="flex items-center justify-between relative max-w-md mx-auto px-4">
        {/* Background connector line */}
        <div className="absolute left-8 right-8 top-4 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-0" />
        
        {/* Active connector line */}
        <div 
          className="absolute left-8 top-4 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full z-0 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 82}%`
          }}
        />

        {steps.map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;

          return (
            <div
              key={s.num}
              onClick={() => {
                if (isDone && onStepClick) {
                  onStepClick(s.num as OrderStep);
                }
              }}
              className={`relative z-10 flex flex-col items-center gap-1.5 transition-all ${
                isDone ? 'cursor-pointer hover:scale-105' : ''
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isDone
                    ? 'bg-blue-600 text-white shadow-md'
                    : isCurrent
                    ? 'bg-blue-600 text-white shadow-3d-blue scale-110 ring-4 ring-blue-100'
                    : 'bg-white text-slate-400 border-2 border-slate-200 shadow-sm'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] sm:text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'text-blue-700'
                    : isDone
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
