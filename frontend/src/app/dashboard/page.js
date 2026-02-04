'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                  <Bell className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
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
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
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

            <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
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

            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
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

            <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
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
              <Card>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <Card.Title>Recent Events</Card.Title>
                    <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      <Plus className="w-4 h-4 mr-2" />
                      {isAdmin ? 'Create Event' : 'Browse Events'}
                    </Button>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">Tech Conference 2024</h4>
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
              <Card>
                <Card.Header>
                  <Card.Title>Quick Stats</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">This Week</span>
                      <span className="font-semibold">12 Events</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-semibold">48 Events</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold">$24.8k</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Recent Activity */}
              <Card>
                <Card.Header>
                  <Card.Title>Recent Activity</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
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
        </main>
      </div>
    </div>
  );
}