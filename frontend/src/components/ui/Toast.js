import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils';

const Toast = ({ type = 'success', message, onClose, visible }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-200',
    error: 'bg-gradient-to-r from-red-500 to-rose-600 border-red-200',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-200',
    info: 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-200',
  };

  const Icon = icons[type];

  if (!visible) return null;

  return (
    <div className={cn(
      'flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border text-white transform transition-all duration-500 ease-out max-w-sm',
      styles[type],
      visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
    )}>
      <div className="flex-shrink-0">
        <Icon size={20} className="drop-shadow-sm" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">
          {message}
        </p>
      </div>
      
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110"
      >
        <X size={14} />
      </button>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl animate-shrink"></div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink {
          animation: shrink 4s linear;
        }
      `}</style>
    </div>
  );
};

export default Toast;