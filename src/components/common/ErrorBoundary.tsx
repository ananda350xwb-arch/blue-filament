import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('blue_filament_orders');
    localStorage.removeItem('blue_filament_catalog');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-3xl border-2 border-red-200 shadow-xl text-slate-900 space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="font-display font-black text-xl text-red-950">
            {this.props.fallbackTitle || 'เกิดข้อผิดพลาดในการแสดงผลหน้าจอ'}
          </h3>

          <p className="text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 text-left overflow-x-auto">
            {this.state.error?.message || 'Unknown render error'}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-3d-blue px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-3d-blue cursor-pointer"
            >
              โหลดหน้านี้ใหม่ (Reload)
            </button>
            <button
              onClick={this.handleReset}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างแคชข้อมูล</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
