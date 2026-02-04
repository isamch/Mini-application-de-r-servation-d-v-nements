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
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
    error: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
  };

  const Icon = icons[type];

  if (!visible) return null;

  return (
    <div className={cn(
      'fixed top-6 right-6 z-50 flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 transform transition-all duration-300 ease-out',
      styles[type],
      visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
    )}>
      <div className="flex-shrink-0">
        <Icon size={24} className="drop-shadow-sm" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium drop-shadow-sm">
          {message}
        </p>
      </div>
      
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
      >
        <X size={16} />
      </button>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Toast;