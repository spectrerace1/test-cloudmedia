import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
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
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import MediaLibrary from './media/MediaLibrary';
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
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      <TrialBanner />

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Cloud Media</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
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

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${
        isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
      }`}>
        <div className="p-6 max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/" element={<div>Dashboard Home</div>} />
            <Route path="/media/*" element={<MediaLibrary />} />
            <Route path="/announcements" element={<AnnouncementManager />} />
            <Route path="/schedule" element={<ScheduleCalendar />} />
            <Route path="/branches" element={<BranchList />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/activities" element={<ViewAllActivities />} />
            <Route path="/settings" element={<BranchSettings />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;