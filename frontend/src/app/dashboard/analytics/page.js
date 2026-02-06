'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const [eventsRes, bookingsRes, usersRes, statsRes] = await Promise.all([
        api.get('/events'),
        api.get('/bookings'),
        api.get('/users'),
        api.get('/bookings/stats')
      ]);

      setEvents(eventsRes.data.data || eventsRes.data);
      setBookings(bookingsRes.data.data || bookingsRes.data);
      setUsers(usersRes.data.data || usersRes.data);
      setStats(statsRes.data.data || statsRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
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
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const eventsByStatus = events.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1;
    return acc;
  }, {});

  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const totalCapacity = events.reduce((sum, e) => sum + e.maxCapacity, 0);
  const totalBooked = events.reduce((sum, e) => sum + e.currentBookings, 0);
  const utilizationRate = totalCapacity > 0 ? ((totalBooked / totalCapacity) * 100).toFixed(1) : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights and statistics</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-200" />
            <TrendingUp className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Events</p>
          <p className="text-3xl font-bold">{events.length}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-emerald-200" />
            <TrendingUp className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-emerald-100 text-sm mb-1">Total Users</p>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-purple-200" />
            <TrendingUp className="w-5 h-5 text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mb-1">Total Bookings</p>
          <p className="text-3xl font-bold">{bookings.length}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-orange-200" />
            <TrendingUp className="w-5 h-5 text-orange-200" />
          </div>
          <p className="text-orange-100 text-sm mb-1">Utilization Rate</p>
          <p className="text-3xl font-bold">{utilizationRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Events by Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Events by Status</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(eventsByStatus).map(([status, count]) => {
              const percentage = ((count / events.length) * 100).toFixed(1);
              const colors = {
                published: 'bg-emerald-500',
                draft: 'bg-yellow-500',
                canceled: 'bg-red-500',
                completed: 'bg-blue-500',
                expired: 'bg-gray-500'
              };
              return (
                <div key={status}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${colors[status] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <PieChart className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Bookings Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-900">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{stats?.pending || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">Confirmed</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{stats?.confirmed || 0}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <div className="flex items-center mb-2">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-900">Refused</span>
              </div>
              <p className="text-2xl font-bold text-red-900">{stats?.refused || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="flex items-center mb-2">
                <XCircle className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">Canceled</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.canceled || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users & Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users by Role */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Users by Role</h2>
          <div className="space-y-4">
            {Object.entries(usersByRole).map(([role, count]) => {
              const percentage = ((count / users.length) * 100).toFixed(1);
              return (
                <div key={role}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{role}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capacity Overview */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Capacity Overview</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Capacity</span>
              <span className="text-2xl font-bold text-indigo-600">{totalCapacity}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Booked</span>
              <span className="text-2xl font-bold text-emerald-600">{totalBooked}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
              <span className="text-gray-700 font-medium">Available Spots</span>
              <span className="text-2xl font-bold text-orange-600">{totalCapacity - totalBooked}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
