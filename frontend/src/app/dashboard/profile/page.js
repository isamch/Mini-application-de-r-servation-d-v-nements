'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import api from '@/lib/api';
import { User, Mail, Phone, Calendar, Edit, Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      await api.patch('/users/me', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        const fieldErrors = {};
        message.forEach(msg => {
          if (msg.includes('firstName')) fieldErrors.firstName = msg;
          else if (msg.includes('lastName')) fieldErrors.lastName = msg;
          else if (msg.includes('phone')) fieldErrors.phone = msg;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(message || 'Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setProfile({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || ''
                  });
                  setErrors({});
                }}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={saving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
          
          <div className="px-8 pb-8">
            <div className="flex items-end -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
                <span className="text-4xl font-bold text-indigo-600">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-6 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  First Name
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    error={errors.firstName}
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profile.firstName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Last Name
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    error={errors.lastName}
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profile.lastName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-500">
                  {profile.email}
                  <span className="text-xs ml-2">(Cannot be changed)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1234567890"
                    error={errors.phone}
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profile.phone || 'Not provided'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Member Since
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
