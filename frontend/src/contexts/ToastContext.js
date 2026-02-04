'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    const toast = { id, message, type, visible: true };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
        {toasts.map((toastItem, index) => (
          <div 
            key={toastItem.id}
            className="pointer-events-auto transform transition-all duration-300 ease-out"
            style={{
              transform: `translateY(${index * 4}px) scale(${1 - index * 0.02})`,
              opacity: 1 - index * 0.1,
              zIndex: 50 - index
            }}
          >
            <Toast
              type={toastItem.type}
              message={toastItem.message}
              visible={toastItem.visible}
              onClose={() => removeToast(toastItem.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};