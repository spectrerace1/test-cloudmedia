import React, { useState } from 'react';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import { 
  LayoutGrid, 
  Music2, 
  Radio, 
  Calendar, 
  BarChart2,
  Settings,
  Building2,
  Laptop2,
  Bell,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import MediaLibrary from './media/MediaLibrary';
import PlaylistDetail from './media/PlaylistDetail';
import AnnouncementManager from './content/AnnouncementManager';
import ScheduleCalendar from './schedule/ScheduleCalendar';
import Reports from './reports/Reports';
import BranchSettings from './settings/BranchSettings';
import BranchList from './branches/BranchList';
import DeviceList from './devices/DeviceList';
import ViewAllActivities from './activities/ViewAllActivities';
import ProfileSettings from './profile/ProfileSettings';
import TrialBanner from './TrialBanner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications - In real app, this would come from an API
  const notifications = [
    {
      id: 1,
      title: 'Device Offline',
      message: 'Downtown Branch device went offline',
      time: '2 minutes ago',
      type: 'alert'
    },
    {
      id: 2,
      title: 'Playlist Updated',
      message: 'Summer Hits 2024 playlist has been updated',
      time: '1 hour ago',
      type: 'info'
    },
    {
      id: 3,
      title: 'New Announcement',
      message: 'Store closing announcement scheduled',
      time: '3 hours ago',
      type: 'success'
    }
  ];

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: Music2, label: 'Media Library', path: '/media' },
    { icon: Radio, label: 'Announcements', path: '/announcements' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Building2, label: 'Branches', path: '/branches' },
    { icon: Laptop2, label: 'Devices', path: '/devices' },
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: Bell, label: 'Activities', path: '/activities' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-10">
        <div className="h-full px-8 flex items-center justify-end gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button
                    onClick={() => navigate('/activities')}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile Settings
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Cloud Media</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 mt-16">
        <TrialBanner />
        <main className="p-8">
          <Routes>
            <Route path="/" element={<div>Dashboard Home</div>} />
            <Route path="/media" element={<MediaLibrary />} />
            <Route path="/media/playlist/:id" element={<PlaylistDetail />} />
            <Route path="/announcements" element={<AnnouncementManager />} />
            <Route path="/schedule" element={<ScheduleCalendar />} />
            <Route path="/branches" element={<BranchList />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/activities" element={<ViewAllActivities />} />
            <Route path="/settings" element={<BranchSettings />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;