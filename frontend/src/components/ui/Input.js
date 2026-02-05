import { cn } from '@/utils';

const Input = ({ 
  label, 
  error, 
  className,
  type = 'text',
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-500 text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500 shake',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;