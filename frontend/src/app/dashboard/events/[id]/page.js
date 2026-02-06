'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import api from '@/lib/api';
import { Calendar, MapPin, Users, Clock, ArrowLeft, User, Star, Edit, Trash2, Settings, CheckCircle, MoreVertical } from 'lucide-react';
import { EventDetailsSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function EventDetailsPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notes, setNotes] = useState('');
  const [userBooking, setUserBooking] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data);
      
      // Check if user has existing booking for this event
      if (user && user.role === 'participant') {
        try {
          const bookingsResponse = await api.get('/bookings/my');
          const bookings = bookingsResponse.data.data || bookingsResponse.data;
          const existingBooking = bookings.find(b => b.eventId === id);
          setUserBooking(existingBooking || null);
        } catch (error) {
          console.error('Error fetching user bookings:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      router.push('/dashboard/events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      router.push('/dashboard/events');
    } catch (error) {
      toast.error('Failed to delete event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/events/${id}`, { status: newStatus });
      toast.success(`Event ${newStatus} successfully`);
      fetchEvent();
    } catch (error) {
      toast.error('Failed to update event status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book this event');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        eventId: id,
        notes: notes.trim() || undefined
      });
      
      toast.success('Booking request submitted successfully!');
      setNotes('');
      fetchEvent();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book event';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status, isExpired) => {
    if (isExpired && status === 'published') {
      return {
        text: 'Expired',
        className: 'bg-gradient-to-r from-red-500 to-pink-600'
      };
    }
    
    switch (status) {
      case 'published':
        return {
          text: 'Published',
          className: 'bg-gradient-to-r from-emerald-500 to-teal-600'
        };
      case 'draft':
        return {
          text: 'Draft',
          className: 'bg-gradient-to-r from-yellow-500 to-orange-500'
        };
      case 'canceled':
        return {
          text: 'Canceled',
          className: 'bg-gradient-to-r from-red-500 to-pink-600'
        };
      case 'completed':
        return {
          text: 'Completed',
          className: 'bg-gradient-to-r from-blue-500 to-indigo-600'
        };
      case 'expired':
        return {
          text: 'Expired',
          className: 'bg-gradient-to-r from-red-500 to-pink-600'
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gradient-to-r from-gray-400 to-gray-500'
        };
    }
  };

  if (loading) {
    return <EventDetailsSkeleton />;
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const availableSpots = event.maxCapacity - event.currentBookings;
  const isFullyBooked = availableSpots <= 0;
  const isAlmostFull = availableSpots <= event.maxCapacity * 0.2;
  const statusBadge = getStatusBadge(event.status, event.isExpired);
  const canBook = event.status === 'published' && !event.isExpired && !isFullyBooked;

  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Event Card */}
          <div className="lg:col-span-2">
            {/* Event Header Card */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-8">
              <div className="p-8">
                {/* Status Badges */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 text-white text-sm font-semibold rounded-full shadow-lg ${statusBadge.className}`}>
                      {statusBadge.text}
                    </span>
                    {isAlmostFull && !isFullyBooked && canBook && (
                      <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full shadow-lg">
                        Almost Full
                      </span>
                    )}
                    {isFullyBooked && (
                      <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg">
                        Fully Booked
                      </span>
                    )}
                  </div>
                  
                  {/* Admin Dropdown - Only for event creator */}
                  {user?.role === 'admin' && event.createdById === user.id && (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="p-2 rounded-full hover:bg-white/50 transition-colors duration-200 backdrop-blur-sm"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                          <Link 
                            href={`/dashboard/events/edit/${event.id}`}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setShowDropdown(false)}
                          >
                            <Edit className="w-4 h-4 mr-3 text-indigo-600" />
                            Edit Event
                          </Link>
                          
                          <hr className="my-2" />
                          
                          <button
                            onClick={() => {
                              handleDeleteEvent();
                              setShowDropdown(false);
                            }}
                            disabled={actionLoading}
                            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete Event
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {event.title}
                </h1>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">{event.description}</p>

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Date</p>
                        <p className="text-gray-600">{formatDate(event.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Time</p>
                        <p className="text-gray-600">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Location</p>
                        <p className="text-gray-600">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Capacity</p>
                        <p className="text-gray-600">{event.currentBookings}/{event.maxCapacity} attendees</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form for Participants */}
            {user && user.role === 'participant' && canBook && !userBooking && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Book This Event</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements, dietary restrictions, or questions..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-2">{notes.length}/500 characters</p>
                </div>

                <Button
                  onClick={handleBooking}
                  loading={bookingLoading}
                  className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {bookingLoading ? 'Processing...' : 'Book Now'}
                </Button>
              </div>
            )}

            {/* User Already Booked */}
            {user && user.role === 'participant' && userBooking && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Booking Status</h3>
                <div className="flex items-center space-x-3 mb-4">
                  {userBooking.status === 'pending' && (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      ⏳ Pending Approval
                    </span>
                  )}
                  {userBooking.status === 'confirmed' && (
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✓ Confirmed
                    </span>
                  )}
                  {userBooking.status === 'refused' && (
                    <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      ✗ Refused
                    </span>
                  )}
                  {userBooking.status === 'canceled' && (
                    <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      ✗ Canceled
                    </span>
                  )}
                </div>
                <p className="text-gray-600">
                  {userBooking.status === 'pending' && 'Your booking is awaiting admin approval.'}
                  {userBooking.status === 'confirmed' && 'Your booking has been confirmed! Check your email for the ticket.'}
                  {userBooking.status === 'refused' && 'Your booking was refused. You can book again if needed.'}
                  {userBooking.status === 'canceled' && 'Your booking was canceled.'}
                </p>
              </div>
            )}

            {/* Event Not Available Message */}
            {user && user.role === 'participant' && !canBook && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Not Available</h3>
                <p className="text-gray-600">
                  {event.isExpired || event.status === 'expired' ? 'This event has expired and is no longer available for booking.' :
                   event.status === 'canceled' ? 'This event has been canceled.' :
                   event.status === 'completed' ? 'This event has been completed.' :
                   isFullyBooked ? 'This event is fully booked.' :
                   'This event is not available for booking.'}
                </p>
              </div>
            )}

            {!user && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to join this event?</h3>
                <p className="text-gray-600 mb-6">Please login to book this amazing event</p>
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Login to Book
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Organizer Card */}
            {event.createdBy && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Organized by</p>
                    <p className="text-indigo-600 font-medium">{event.createdBy.firstName} {event.createdBy.lastName}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Availability Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isFullyBooked ? 'bg-red-100 text-red-800' : 
                  isAlmostFull ? 'bg-orange-100 text-orange-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {availableSpots} spots left
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${
                    isFullyBooked ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                    isAlmostFull ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                    'bg-gradient-to-r from-indigo-500 to-purple-600'
                  }`}
                  style={{ width: `${(event.currentBookings / event.maxCapacity) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Bookings Card - Only for event creator */}
            {user?.role === 'admin' && event.createdById === user.id && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Bookings</span>
                    <span className="font-semibold text-gray-900">{event.currentBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Available Spots</span>
                    <span className="font-semibold text-gray-900">{availableSpots}</span>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/events/${event.id}/bookings`}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View All Bookings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}