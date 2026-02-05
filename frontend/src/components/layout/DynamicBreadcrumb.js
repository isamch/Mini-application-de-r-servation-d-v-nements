'use client';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(false);

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
    </div>
  );
};

export default DynamicBreadcrumb;