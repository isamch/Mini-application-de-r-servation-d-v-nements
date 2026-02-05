'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus,
  Bell,
  Search,
  Filter,
  TrendingUp,
  Clock,
  MapPin,
  Menu
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.firstName}! 👋
        </h2>
        <p className="text-gray-600">
          {isAdmin 
            ? "Manage your events and monitor platform activity" 
            : "Discover amazing events and manage your bookings"
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Events</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
          <div className="flex items-center mt-4 text-blue-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+12% from last month</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">{isAdmin ? 'Total Users' : 'My Bookings'}</p>
              <p className="text-2xl font-bold">{isAdmin ? '1,234' : '8'}</p>
            </div>
            <Users className="w-8 h-8 text-emerald-200" />
          </div>
          <div className="flex items-center mt-4 text-emerald-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+8% from last month</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Active Bookings</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
          <div className="flex items-center mt-4 text-purple-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+15% from last month</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Revenue</p>
              <p className="text-2xl font-bold">$12.4k</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
          <div className="flex items-center mt-4 text-orange-100">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+22% from last month</span>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Recent Events</Card.Title>
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  {isAdmin ? 'Create Event' : 'Browse Events'}
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer group">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">Tech Conference 2024</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Dec 25, 2024</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>Convention Center</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">150/200</p>
                      <p className="text-xs text-gray-500">Attendees</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Card.Header>
              <Card.Title>Quick Stats</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-semibold text-indigo-600">12 Events</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-emerald-600">48 Events</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold text-purple-600">$24.8k</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Card.Header>
              <Card.Title>Recent Activity</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New booking received</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}