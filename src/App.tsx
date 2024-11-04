import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Building2, Cpu, FolderKanban, Music2, Volume2, Settings, BarChart3, Bell, ChevronDown, LogOut, User, HelpCircle, Calendar, Menu, X } from 'lucide-react';
import StatusCard from './components/StatusCard';
import BranchStatus from './components/BranchStatus';
import ActivityLog from './components/ActivityLog';
import BranchList from './components/branches/BranchList';
import BranchGroups from './components/branches/BranchGroups';
import ViewAllBranches from './components/branches/ViewAllBranches';
import DeviceList from './components/devices/DeviceList';
import AddDevice from './components/devices/AddDevice';
import PlaylistManager from './components/content/PlaylistManager';
import AnnouncementManager from './components/content/AnnouncementManager';
import BranchSettings from './components/settings/BranchSettings';
import Reports from './components/reports/Reports';
import ViewAllActivities from './components/activities/ViewAllActivities';
import ProfileSettings from './components/profile/ProfileSettings';
import MediaLibrary from './components/media/MediaLibrary';
import PlaylistDetail from './components/media/PlaylistDetail';
import ScheduleCalendar from './components/schedule/ScheduleCalendar';
import TrialBanner from './components/TrialBanner';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'branches' | 'devices' | 'content' | 'announcements' | 'settings' | 'reports' | 'media' | 'schedule'>('dashboard');
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const stats = {
    branches: {
      total: 24,
      active: 18,
      inactive: 6
    },
    devices: {
      total: 42,
      online: 35,
      offline: 7
    },
    groups: {
      total: 8,
      withPlaylist: 6
    },
    content: {
      activePlaylists: 12,
      pendingAnnouncements: 3
    }
  };

  const handleProfileClick = (action: string) => {
    setShowProfileMenu(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'support':
        window.open('https://support.example.com', '_blank');
        break;
      case 'signout':
        // Handle sign out logic
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TrialBanner />
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6">
        {/* Header - Mobile Responsive */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Panel</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your branches, devices, and content</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 sm:w-6 h-5 sm:h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-900">Cloud Media</div>
                    <div className="text-xs text-gray-500">Administrator</div>
                  </div>
                  <ChevronDown className="hidden sm:block w-4 h-4 text-gray-500" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                    <button 
                      onClick={() => handleProfileClick('profile')}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => handleProfileClick('support')}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Support
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={() => handleProfileClick('signout')}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200 ${
          showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-200 ease-in-out ${
            showMobileMenu ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-1">
                {[
                  { label: 'Dashboard', icon: BarChart3, value: 'dashboard' },
                  { label: 'Branches', icon: Building2, value: 'branches' },
                  { label: 'Devices', icon: Cpu, value: 'devices' },
                  { label: 'Media Library', icon: Music2, value: 'media' },
                  { label: 'Content', icon: FolderKanban, value: 'content' },
                  { label: 'Announcements', icon: Volume2, value: 'announcements' },
                  { label: 'Schedule', icon: Calendar, value: 'schedule' },
                  { label: 'Settings', icon: Settings, value: 'settings' },
                  { label: 'Reports', icon: BarChart3, value: 'reports' }
                ].map(({ label, icon: Icon, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setActiveTab(value as any);
                      navigate(`/${value === 'dashboard' ? '' : value}`);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      activeTab === value
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden sm:flex overflow-x-auto hide-scrollbar gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              navigate('/');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('branches');
              navigate('/branches');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'branches'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Branches
          </button>
          <button
            onClick={() => {
              setActiveTab('devices');
              navigate('/devices');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'devices'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Devices
          </button>
          <button
            onClick={() => {
              setActiveTab('media');
              navigate('/media');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'media'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Media Library
          </button>
          <button
            onClick={() => {
              setActiveTab('content');
              navigate('/content');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'content'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => {
              setActiveTab('announcements');
              navigate('/announcements');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => {
              setActiveTab('schedule');
              navigate('/schedule');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => {
              setActiveTab('settings');
              navigate('/settings');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => {
              setActiveTab('reports');
              navigate('/reports');
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'reports'
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Reports
          </button>
        </div>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                  title="My Branches"
                  icon={<Building2 className="w-6 h-6 text-indigo-600" />}
                  total={stats.branches.total}
                  stats={[
                    { label: 'Active', value: stats.branches.active, status: 'success' },
                    { label: 'Inactive', value: stats.branches.inactive, status: 'danger' }
                  ]}
                />
                <StatusCard
                  title="My Devices"
                  icon={<Cpu className="w-6 h-6 text-indigo-600" />}
                  total={stats.devices.total}
                  stats={[
                    { label: 'Online', value: stats.devices.online, status: 'success' },
                    { label: 'Offline', value: stats.devices.offline, status: 'danger' }
                  ]}
                />
                <StatusCard
                  title="My Groups"
                  icon={<FolderKanban className="w-6 h-6 text-indigo-600" />}
                  total={stats.groups.total}
                  stats={[
                    { label: 'With Playlist', value: stats.groups.withPlaylist, status: 'success' }
                  ]}
                />
                <StatusCard
                  title="Active Content"
                  icon={<Music2 className="w-6 h-6 text-indigo-600" />}
                  total={stats.content.activePlaylists}
                  stats={[
                    { label: 'Pending Announcements', value: stats.content.pendingAnnouncements, status: 'warning' }
                  ]}
                />
              </div>

              {/* Branch Status & Activity Log */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <BranchStatus onViewAll={() => navigate('/branches')} />
                </div>
                <div className="lg:col-span-1">
                  <ActivityLog />
                </div>
              </div>
            </div>
          } />
          <Route path="/branches" element={<BranchList />} />
          <Route path="/devices" element={<DeviceList onAddDevice={() => setShowAddDevice(true)} />} />
          <Route path="/media" element={<MediaLibrary />} />
          <Route path="/media/playlist/:id" element={<PlaylistDetail />} />
          <Route path="/content" element={<PlaylistManager />} />
          <Route path="/announcements" element={<AnnouncementManager />} />
          <Route path="/schedule" element={<ScheduleCalendar />} />
          <Route path="/settings" element={<BranchSettings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/activities" element={<ViewAllActivities />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Routes>

        {/* Modals */}
        {showAddDevice && (
          <AddDevice onClose={() => setShowAddDevice(false)} />
        )}
      </div>
    </div>
  );
};

export default App;