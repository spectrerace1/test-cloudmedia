import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Shield, 
  Bell, 
  Camera,
  Music2
} from 'lucide-react';
import BusinessInformation from './sections/BusinessInformation';
import PersonalInformation from './sections/PersonalInformation';
import SecuritySettings from './sections/SecuritySettings';
import NotificationSettings from './sections/NotificationSettings';

const tabs = [
  { id: 'business', label: 'Business Info', icon: Building2 },
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell }
];

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [isEditing, setIsEditing] = useState(false);

  // Mock profile data - In real app, this would come from an API
  const profile = {
    businessInfo: {
      name: 'Music For Business',
      accountType: 'Enterprise',
      registrationDate: 'January 2024',
      logo: '/path/to/logo.png',
      businessId: 'BUS123456',
      plan: 'Premium'
    },
    personalInfo: {
      name: 'John Doe',
      email: 'john@musicforbusiness.com',
      phone: '+1 234 567 8900',
      position: 'Business Owner',
      timezone: 'UTC+3',
      language: 'English'
    },
    securityInfo: {
      lastPasswordChange: '2 months ago',
      twoFactorEnabled: true,
      lastLogin: '2 hours ago',
      activeSessions: 2,
      allowedIPs: ['192.168.1.1']
    },
    notificationPreferences: {
      email: {
        deviceOffline: true,
        newPlaylist: true,
        announcements: true,
        systemUpdates: true,
        criticalAlerts: true
      },
      sms: {
        emergencyAlerts: true,
        deviceStatus: false,
        systemDowntime: true
      },
      push: {
        dailyReports: true,
        playlistChanges: true,
        branchStatus: false
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'business':
        return <BusinessInformation profile={profile} isEditing={isEditing} />;
      case 'personal':
        return <PersonalInformation profile={profile} isEditing={isEditing} />;
      case 'security':
        return <SecuritySettings profile={profile} isEditing={isEditing} />;
      case 'notifications':
        return <NotificationSettings profile={profile} isEditing={isEditing} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
              <Music2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 p-2 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-indigo-50">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{profile.businessInfo.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-md">
                {profile.businessInfo.accountType}
              </span>
              <span className="text-gray-500 hidden sm:inline">•</span>
              <span className="text-gray-500 text-sm">
                Member since {profile.businessInfo.registrationDate}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
        <div className="flex gap-4 sm:gap-6 mt-6 sm:mt-8 min-w-max border-b border-gray-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileSettings;