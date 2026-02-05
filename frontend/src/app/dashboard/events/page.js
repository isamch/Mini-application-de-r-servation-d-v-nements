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
    startDate: '',
    endDate: '',
    status: 'published'
  });
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load filters from URL on mount
    const urlFilters = {
      search: searchParams.get('search') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      status: searchParams.get('status') || 'published'
    };
    setFilters(urlFilters);
    fetchEventsWithFilters(urlFilters);
  }, [searchParams]);

  // Apply date filter when both dates are selected
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      setEventsLoading(true);
      setTimeout(() => {
        fetchEventsWithFilters(filters);
      }, 300);
    } else if (!filters.startDate && !filters.endDate) {
      // Clear date filter when both dates are empty
      setEventsLoading(true);
      setTimeout(() => {
        fetchEventsWithFilters(filters);
      }, 300);
    }
  }, [filters.startDate, filters.endDate]);

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
      
      if (filterParams.startDate || filterParams.endDate) {
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date.split('T')[0]);
          const start = filterParams.startDate ? new Date(filterParams.startDate) : null;
          const end = filterParams.endDate ? new Date(filterParams.endDate) : null;
          
          if (start && end) {
            return eventDate >= start && eventDate <= end;
          } else if (start) {
            return eventDate >= start;
          } else if (end) {
            return eventDate <= end;
          }
          return true;
        });
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
    } else if (key === 'search') {
      // Apply search filter immediately
      setEventsLoading(true);
      setTimeout(() => {
        fetchEventsWithFilters(newFilters);
      }, 300);
    }
    // Date filters will be applied when both dates are selected
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

  const clearDateFilter = () => {
    setFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
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

        {/* Modern Search and Filter Bar */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-end">
              
              {/* Search Bar */}
              <div className="lg:col-span-4">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Search Events</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-slate-700 placeholder-slate-400 shadow-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="lg:col-span-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700">Date Range</label>
                  {(filters.startDate || filters.endDate) && (
                    <button
                      onClick={clearDateFilter}
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-slate-700 shadow-sm transition-all duration-200"
                    />
                  </div>
                  <span className="flex items-center text-slate-400 font-medium">to</span>
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-slate-700 shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Status</label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-slate-700 shadow-sm transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">All</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="canceled">Canceled</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
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

      {events.length === 0 && !eventsLoading && (
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