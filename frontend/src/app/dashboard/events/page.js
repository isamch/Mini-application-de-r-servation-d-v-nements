'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, Search, Filter, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    status: 'published'
  });
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load filters from URL on mount
    const urlFilters = {
      search: searchParams.get('search') || '',
      date: searchParams.get('date') || '',
      status: searchParams.get('status') || 'published'
    };
    setFilters(urlFilters);
    fetchEventsWithFilters(urlFilters);
  }, [searchParams]);

  const fetchEventsWithFilters = async (filterParams) => {
    setEventsLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Only send status to backend
      if (filterParams.status && filterParams.status !== '') {
        params.append('status', filterParams.status);
      }
      
      const response = await api.get(`/events?${params.toString()}`);
      let filteredEvents = response.data.data;
      
      // Apply frontend filters
      if (filterParams.search) {
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(filterParams.search.toLowerCase()) ||
          event.description.toLowerCase().includes(filterParams.search.toLowerCase())
        );
      }
      
      if (filterParams.date) {
        filteredEvents = filteredEvents.filter(event => 
          event.date.split('T')[0] === filterParams.date
        );
      }
      
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (key === 'status') {
      // Update URL and fetch from backend
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v && v !== '') params.set(k, v.toString());
      });
      router.push(`/dashboard/events?${params.toString()}`);
    } else {
      // Apply frontend filter immediately
      setEventsLoading(true);
      setTimeout(() => {
        fetchEventsWithFilters(newFilters);
      }, 300);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Discover Events
            </h1>
            <p className="text-gray-600 mt-2">Find and book amazing events happening around you</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm appearance-none pr-10"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="canceled">Canceled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Apply Filter Button */}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsLoading ? (
          // Skeleton Loading
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-white/20 animate-pulse">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="space-y-3 mb-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  ))}
                </div>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))
        ) : (
          events.map((event) => {
            const availableSpots = event.maxCapacity - event.currentBookings;
            const isAlmostFull = availableSpots <= event.maxCapacity * 0.2;
            
            return (
              <div key={event.id} className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20 hover:scale-[1.02]">
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-white text-xs font-medium rounded-full ${
                      event.status === 'published' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                      event.status === 'draft' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-red-500 to-pink-600'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    {isAlmostFull && event.status === 'published' && (
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded-full">
                        Almost Full
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-orange-600" />
                      </div>
                      <span>{event.currentBookings}/{event.maxCapacity} attendees</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Availability</span>
                      <span className="font-medium">{availableSpots} spots left</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isAlmostFull ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                        }`}
                        style={{ width: `${(event.currentBookings / event.maxCapacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/dashboard/events/${event.id}`}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-center block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {events.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
}