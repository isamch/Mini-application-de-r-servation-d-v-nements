'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { Eye, EyeOff, User, Mail, Phone, ArrowRight, ArrowLeft, CheckCircle, Calendar } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { register: registerUser } = useAuth();
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchedFields = watch();

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Account Setup', icon: Mail },
    { id: 3, title: 'Complete', icon: CheckCircle }
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Send fields accepted by RegisterDto including optional phone
      const registrationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        ...(data.phone && { phone: data.phone }) // Include phone if provided
      };
      await registerUser(registrationData);
      setCurrentStep(3);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid = watchedFields.firstName && watchedFields.lastName && watchedFields.phone;
  const isStep2Valid = watchedFields.email && watchedFields.password;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Header with Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-teal-700 transition-all duration-300">
            EventHub
          </span>
        </Link>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Geometric Shapes */}
      <div className="absolute top-20 right-20 w-20 h-20 border-2 border-emerald-200 rounded-lg rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-br from-teal-300 to-cyan-300 rounded-full animate-bounce"></div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Join EventHub
          </h1>
          <p className="text-gray-600 mt-2">Create your account and start exploring amazing events</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-lg' 
                      : 'border-gray-300 text-gray-400 bg-white'
                    }
                    ${isCurrent ? 'scale-110 shadow-xl' : ''}
                  `}>
                    <Icon size={20} />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-1 mx-2 rounded-full transition-all duration-300
                      ${currentStep > step.id ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 transform hover:scale-[1.01] transition-all duration-300">
          {currentStep < 3 ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Tell us about yourself</h3>
                    <p className="text-gray-600 text-sm mt-1">We'd love to know who you are</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      {...register('firstName', { required: 'First name is required' })}
                      placeholder="First Name"
                      className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      error={errors.firstName?.message}
                    />
                    <Input
                      {...register('lastName', { required: 'Last name is required' })}
                      placeholder="Last Name"
                      className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      error={errors.lastName?.message}
                    />
                  </div>
                  
                  <Input
                    {...register('phone')}
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />

                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight className="ml-2" size={20} />
                  </Button>
                </div>
              )}

              {/* Step 2: Account Setup */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Setup your account</h3>
                    <p className="text-gray-600 text-sm mt-1">Choose your login credentials</p>
                  </div>

                  <Input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    placeholder="Email Address"
                    className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    error={errors.email?.message}
                  />

                  <div className="relative">
                    <Input
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                          message: 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 pr-12"
                      error={errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 py-3 rounded-xl border-gray-200 hover:border-emerald-500 hover:text-emerald-600"
                    >
                      <ArrowLeft className="mr-2" size={20} /> Back
                    </Button>
                    <Button
                      type="submit"
                      loading={isLoading}
                      disabled={!isStep2Valid}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? 'Creating...' : 'Create Account'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Step 3: Success */
            <div className="text-center py-8 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to EventHub!</h3>
              <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </div>
          )}

          {currentStep < 3 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition-all duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}