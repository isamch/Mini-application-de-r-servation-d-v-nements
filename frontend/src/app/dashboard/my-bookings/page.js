'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import api from '@/lib/api';
import { Calendar, MapPin, Clock, Download, X, Eye, Ticket, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });
  const [cancelReason, setCancelReason] = useState('');
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await api.patch(`/bookings/${cancelModal.bookingId}/cancel`, {
        cancelReason: cancelReason || 'Canceled by user'
      });
      toast.success('Booking canceled successfully');
      setCancelModal({ open: false, bookingId: null });
      setCancelReason('');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleDownload = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/ticket`);
      const { data, filename } = response.data.data;
      
      const byteCharacters = atob(data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Ticket downloaded successfully');
      setOpenMenuId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download ticket');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'from-emerald-500 to-teal-600';
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'refused': return 'from-red-500 to-pink-600';
      case 'canceled': return 'from-gray-500 to-slate-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600">View and manage your event bookings</p>
      </div>

      <div className="mb-6 flex gap-3">
        {['all', 'pending', 'confirmed', 'refused', 'canceled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === status
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{booking.event.title}</h3>
                    <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(booking.status)} text-white text-xs font-medium rounded-full`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-1">{booking.event.description}</p>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  {openMenuId === booking.id && (
                    <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-10">
                      <Link href={`/dashboard/events/${booking.event.id}`}>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Event
                        </button>
                      </Link>
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            handleDownload(booking.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Ticket
                        </button>
                      )}
                      
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => {
                            setCancelModal({ open: true, bookingId: booking.id });
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-xs">{formatDate(booking.event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-xs">{formatTime(booking.event.startTime)} - {formatTime(booking.event.endTime)}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium text-xs truncate">{booking.event.location}</p>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-xs text-gray-700">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-12 h-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' ? "You haven't booked any events yet" : `No ${filter} bookings`}
          </p>
          <Link href="/dashboard/events">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Browse Events
            </Button>
          </Link>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Cancel Booking</h3>
                <p className="text-sm text-gray-600">Are you sure you want to cancel this booking?</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Why are you canceling?"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-gray-900 font-medium placeholder-gray-400"
                rows="3"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCancelModal({ open: false, bookingId: null });
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
