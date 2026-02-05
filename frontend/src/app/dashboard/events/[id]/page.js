'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import api from '@/lib/api';
import { Calendar, MapPin, Users, Clock, ArrowLeft, User, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function EventDetailsPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      router.push('/dashboard/events');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
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

  return (
    <div className="p-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-colors duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium">Back to Events</span>
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Event Header Card */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-8">
          <div className="p-8">
            {/* Status Badges */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-full shadow-lg">
                Published
              </span>
              {isAlmostFull && !isFullyBooked && (
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

        {/* Organizer Card */}
        {event.createdBy && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
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
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Event Availability</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isFullyBooked ? 'bg-red-100 text-red-800' : 
              isAlmostFull ? 'bg-orange-100 text-orange-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} remaining
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

        {/* Booking Section */}
        {user && user.role === 'participant' && (
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-2">{notes.length}/500 characters</p>
            </div>

            <Button
              onClick={handleBooking}
              loading={bookingLoading}
              disabled={isFullyBooked}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                isFullyBooked 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
              }`}
            >
              {isFullyBooked ? 'Event Fully Booked' : bookingLoading ? 'Processing...' : 'Book Now'}
            </Button>
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
    </div>
  );
}