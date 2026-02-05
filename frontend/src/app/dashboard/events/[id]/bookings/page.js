'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import api from '@/lib/api';
import { EventBookingsSkeleton } from '@/components/ui/Skeleton';
import ReasonModal from '@/components/ui/ReasonModal';
import { 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Ban,
  Calendar,
  MapPin,
  Users,
  Clock
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function EventBookingsPage() {
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'admin' && id) {
      fetchEventAndBookings();
    }
  }, [user, id]);

  const fetchEventAndBookings = async () => {
    try {
      const [eventResponse, bookingsResponse] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/bookings/event/${id}`)
      ]);
      
      setEvent(eventResponse.data.data);
      setBookings(bookingsResponse.data.data || bookingsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch event bookings');
      router.push('/dashboard/events');
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSubmit = (reason) => {
    handleStatusChange(modalConfig.bookingId, modalConfig.action, reason);
  };

  const openReasonModal = (bookingId, action) => {
    setModalConfig({
      bookingId,
      action,
      title: action === 'refuse' ? 'Refuse Booking' : 'Cancel Booking',
      placeholder: action === 'refuse' ? 'Please provide a reason for refusing this booking...' : 'Please provide a reason for canceling this booking...'
    });
    setModalOpen(true);
  };

  const handleStatusChange = async (bookingId, action, reason = '') => {
    setActionLoading(bookingId);
    try {
      let endpoint = '';
      let payload = {};

      switch (action) {
        case 'confirm':
          endpoint = `/bookings/${bookingId}/confirm`;
          break;
        case 'refuse':
          endpoint = `/bookings/${bookingId}/refuse`;
          payload = { refuseReason: reason };
          break;
        case 'cancel':
          endpoint = `/bookings/${bookingId}/admin-cancel`;
          payload = { cancelReason: reason };
          break;
      }

      await api.patch(endpoint, payload);
      toast.success(`Booking ${action}ed successfully`);
      fetchEventAndBookings();
    } catch (error) {
      toast.error(`Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: AlertCircle,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'Pending'
      },
      confirmed: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800 border-green-200',
        text: 'Confirmed'
      },
      refused: {
        icon: XCircle,
        className: 'bg-red-100 text-red-800 border-red-200',
        text: 'Refused'
      },
      canceled: {
        icon: Ban,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        text: 'Canceled'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getBookingStats = () => {
    const stats = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
    
    return {
      pending: stats.pending || 0,
      confirmed: stats.confirmed || 0,
      refused: stats.refused || 0,
      canceled: stats.canceled || 0,
      total: bookings.length
    };
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <EventBookingsSkeleton />;
  }

  const stats = getBookingStats();

  return (
    <div className="p-8">
      {/* Event Info */}
      {event && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {event.currentBookings}/{event.maxCapacity} attendees
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Refused</p>
              <p className="text-2xl font-bold text-gray-900">{stats.refused}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Ban className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Canceled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.canceled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Event Bookings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No bookings found for this event
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 relative">
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <div className="flex items-center group cursor-pointer">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-4 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {booking.user?.firstName || 'Unknown'} {booking.user?.lastName || 'Participant'}
                          </div>
                          <div className="text-sm text-gray-500 truncate">{booking.user?.email || 'No email provided'}</div>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] pointer-events-none">
                          <div className="space-y-3">
                            <div className="border-b border-gray-100 pb-2">
                              <h4 className="font-semibold text-gray-900">{booking.user?.firstName || 'Unknown'} {booking.user?.lastName || 'Participant'}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-600">Phone:</span>
                                <p className="font-medium text-gray-900">{booking.user?.phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Role:</span>
                                <p className="font-medium text-gray-900 capitalize">{booking.user?.role || 'Unknown'}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Status:</span>
                                <p className={`font-medium ${booking.user?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                  {booking.user?.isActive ? 'Active' : 'Inactive'}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600">Verified:</span>
                                <p className={`font-medium ${booking.user?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                                  {booking.user?.isEmailVerified ? 'Yes' : 'No'}
                                </p>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                              <span className="text-xs text-gray-500">Member since: {booking.user?.createdAt ? new Date(booking.user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs truncate" title={booking.notes}>
                        {booking.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {event?.createdById === user?.id ? (
                          <>
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => handleStatusChange(booking.id, 'confirm')}
                                  loading={actionLoading === booking.id}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  onClick={() => openReasonModal(booking.id, 'refuse')}
                                  loading={actionLoading === booking.id}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Refuse
                                </Button>
                              </>
                            )}
                            {(booking.status === 'confirmed' || booking.status === 'pending') && (
                              <Button
                                onClick={() => openReasonModal(booking.id, 'cancel')}
                                loading={actionLoading === booking.id}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            Only event creator can manage bookings
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ReasonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleReasonSubmit}
        title={modalConfig.title}
        placeholder={modalConfig.placeholder}
      />
    </div>
  );
}