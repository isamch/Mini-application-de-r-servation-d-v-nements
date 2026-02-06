'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Extract event ID from path if present
  const eventIdMatch = pathname.match(/\/events\/([^\/]+)/);
  const eventId = eventIdMatch ? eventIdMatch[1] : null;

  useEffect(() => {
    if (eventId && eventId !== 'create' && !eventTitle) {
      setLoading(true);
      api.get(`/events/${eventId}`)
        .then(response => {
          setEventTitle(response.data.data.title);
        })
        .catch(() => {
          setEventTitle('Event');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [eventId, eventTitle]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard
    breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      const path = '/' + segments.slice(0, i + 1).join('/');

      if (segment === 'events') {
        breadcrumbs.push({ label: 'Events', path });
      } else if (segment === 'create') {
        breadcrumbs.push({ label: 'Create Event', path });
      } else if (segment === 'edit') {
        breadcrumbs.push({ label: 'Edit Event', path });
      } else if (segment === 'bookings') {
        breadcrumbs.push({ label: 'Bookings', path });
      } else if (segment === 'users') {
        breadcrumbs.push({ label: 'Users', path });
      } else if (segment === 'analytics') {
        breadcrumbs.push({ label: 'Analytics', path });
      } else if (segment === 'settings') {
        breadcrumbs.push({ label: 'Settings', path });
      } else if (eventId && segment === eventId) {
        breadcrumbs.push({ 
          label: loading ? 'Loading...' : (eventTitle || 'Event'), 
          path 
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumb on main dashboard
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              ) : (
                <button
                  onClick={() => router.push(crumb.path)}
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  {crumb.label}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={() => {
                  router.push('/dashboard/profile');
                  setShowDropdown(false);
                }}
                className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <User className="w-4 h-4 mr-3 text-gray-500" />
                View Profile
              </button>
              
              <button
                onClick={() => {
                  router.push('/dashboard/settings');
                  setShowDropdown(false);
                }}
                className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <Settings className="w-4 h-4 mr-3 text-gray-500" />
                Settings
              </button>

              <hr className="my-2" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicBreadcrumb;