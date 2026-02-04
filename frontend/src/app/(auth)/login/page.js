'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { Eye, EyeOff, Calendar, Users, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    onChange: () => setLoginError(false)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(false);
    try {
      await login(data.email, data.password);
      toast.success('Login successful! Welcome back.');
      router.replace('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(Array.isArray(message) ? message[0] : message);
      setLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Header with Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">
            EventHub
          </span>
        </Link>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-20 text-indigo-300 animate-float">
        <Calendar size={24} />
      </div>
      <div className="absolute top-32 right-32 text-purple-300 animate-float animation-delay-1000">
        <Users size={28} />
      </div>
      <div className="absolute bottom-32 left-32 text-cyan-300 animate-float animation-delay-2000">
        <Sparkles size={20} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">Sign in to access your events</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    },
                    onChange: () => setLoginError(false)
                  })}
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-4 pr-4 py-3 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 group-hover:border-indigo-300 ${loginError ? 'animate-shake' : ''}`}
                  error={errors.email?.message || (loginError ? 'Invalid credentials' : null)}
                  onFocus={() => setLoginError(false)}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <div className="relative">
                  <Input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      },
                      onChange: () => setLoginError(false)
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`pl-4 pr-12 py-3 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 group-hover:border-indigo-300 ${loginError ? 'animate-shake' : ''}`}
                    error={errors.password?.message || (loginError ? 'Invalid credentials' : null)}
                    onFocus={() => setLoginError(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-600 group-hover:text-indigo-600 transition-colors duration-200">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-all duration-200">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
            <Link 
              href="/register" 
              className="mt-4 inline-flex items-center justify-center w-full py-3 px-4 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 font-medium transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600"
            >
              Create new account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 EventHub. Crafted with passion for events.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}