import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Home,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Events', href: '/dashboard/events', icon: Calendar },
    { name: 'Bookings', href: '/dashboard/bookings', icon: BookOpen },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const participantNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Browse Events', href: '/dashboard/events', icon: Calendar },
    { name: 'My Bookings', href: '/dashboard/bookings', icon: BookOpen },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : participantNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-screen bg-white/90 backdrop-blur-lg border-r border-gray-200 z-50 transition-all duration-300 ease-in-out flex flex-col justify-between",
        isOpen ? "w-64" : "w-16",
        "lg:relative lg:translate-x-0",
        !isOpen && "lg:translate-x-0"
      )}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 z-10"
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Top Section */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className={cn(
            "p-4 border-b border-gray-200",
            !isOpen && "flex justify-center"
          )}>
            <div className={cn(
              "flex items-center",
              isOpen ? "space-x-3" : "justify-center"
            )}>
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              {isOpen && (
                <div>
                  <h2 className="font-bold text-gray-900">EventHub</h2>
                  <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Dashboard'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto scrollbar-hide",
            !isOpen && "items-center"
          )}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-200 group",
                    isOpen ? "px-3 py-2 space-x-3" : "w-10 h-10 justify-center",
                    isActive 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600"
                  )} />
                  {isOpen && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info */}
        <div className={cn(
          "p-4 flex-shrink-0",
          !isOpen && "flex justify-center items-center"
        )}>
          {isOpen ? (
            <div className="bg-gray-50 rounded-xl p-3 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;