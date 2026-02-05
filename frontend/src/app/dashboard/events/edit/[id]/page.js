'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import api from '@/lib/api';
import { ArrowLeft, Calendar, Clock, MapPin, Users, FileText, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function EditEventPage() {
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxCapacity: '',
    status: '',
    isExpired: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard/events');
      return;
    }
    if (id) {
      fetchEvent();
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const eventData = response.data.data;
      setEvent({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date.split('T')[0],
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        maxCapacity: eventData.maxCapacity.toString(),
        status: eventData.status,
        isExpired: eventData.isExpired
      });
    } catch (error) {
      toast.error('Event not found');
      router.push('/dashboard/events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    try {
      await api.patch(`/events/${id}`, {
        title: event.title,
        description: event.description,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        maxCapacity: parseInt(event.maxCapacity),
        status: event.status
      });
      toast.success('Event updated successfully');
      router.push(`/dashboard/events/${id}`);
    } catch (error) {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        const fieldErrors = {};
        message.forEach(msg => {
          if (msg.includes('title')) fieldErrors.title = msg;
          else if (msg.includes('description')) fieldErrors.description = msg;
          else if (msg.includes('date')) fieldErrors.date = msg;
          else if (msg.includes('startTime')) fieldErrors.startTime = msg;
          else if (msg.includes('endTime')) fieldErrors.endTime = msg;
          else if (msg.includes('location')) fieldErrors.location = msg;
          else if (msg.includes('maxCapacity')) fieldErrors.maxCapacity = msg;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(message || 'Failed to update event');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setEvent(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-all duration-300 group bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 hover:bg-white/80 transform hover:-translate-y-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back</span>
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Edit Event
              </span>
            </h1>
            <p className="text-xl text-gray-700">Update your event details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Event Title
                </label>
                <Input
                  type="text"
                  value={event.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter event title"
                  error={errors.title}
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Description
                </label>
                <textarea
                  value={event.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your event"
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur-sm transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    errors.description ? 'border-red-500 shake' : 'border-gray-200'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Event Date
                </label>
                <Input
                  type="date"
                  value={event.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  error={errors.date}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <Input
                  type="text"
                  value={event.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Event location"
                  error={errors.location}
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Start Time
                </label>
                <Input
                  type="time"
                  value={event.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  error={errors.startTime}
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  End Time
                </label>
                <Input
                  type="time"
                  value={event.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  error={errors.endTime}
                />
              </div>

              {/* Max Capacity */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  <Users className="w-4 h-4 inline mr-2" />
                  Maximum Capacity
                </label>
                <Input
                  type="number"
                  value={event.maxCapacity}
                  onChange={(e) => handleChange('maxCapacity', e.target.value)}
                  placeholder="Maximum number of attendees"
                  min="1"
                  error={errors.maxCapacity}
                />
              </div>

              {/* Status (Editable for non-expired events) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Status
                </label>
                {event.status === 'expired' || event.isExpired ? (
                  <div className="px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600">
                    {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Loading...'}
                    <p className="text-xs text-gray-500 mt-1">Expired events cannot be modified</p>
                  </div>
                ) : (
                  <select
                    value={event.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur-sm transition-all duration-200 text-gray-900 border-gray-200"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="canceled">Canceled</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-12 text-center">
              <Button
                type="submit"
                loading={saving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Updating...' : 'Update Event'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}