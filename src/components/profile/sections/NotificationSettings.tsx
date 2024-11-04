import React from 'react';
import { Mail, MessageSquare, Bell } from 'lucide-react';

interface NotificationSettingsProps {
  profile: {
    notificationPreferences: {
      email: {
        deviceOffline: boolean;
        newPlaylist: boolean;
        announcements: boolean;
        systemUpdates: boolean;
        criticalAlerts: boolean;
      };
      sms: {
        emergencyAlerts: boolean;
        deviceStatus: boolean;
        systemDowntime: boolean;
      };
      push: {
        dailyReports: boolean;
        playlistChanges: boolean;
        branchStatus: boolean;
      };
    };
  };
  isEditing: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ profile, isEditing }) => {
  const { notificationPreferences } = profile;

  const NotificationToggle = ({ checked, label }: { checked: boolean; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-900">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          disabled={!isEditing}
          className="sr-only peer"
          onChange={() => {}}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email Notifications */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
          </div>
          <div className="space-y-1 divide-y divide-gray-100">
            <NotificationToggle checked={notificationPreferences.email.deviceOffline} label="Device Offline Alerts" />
            <NotificationToggle checked={notificationPreferences.email.newPlaylist} label="New Playlist Alerts" />
            <NotificationToggle checked={notificationPreferences.email.announcements} label="Announcement Reports" />
            <NotificationToggle checked={notificationPreferences.email.systemUpdates} label="System Updates" />
            <NotificationToggle checked={notificationPreferences.email.criticalAlerts} label="Critical Alerts" />
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
          </div>
          <div className="space-y-1 divide-y divide-gray-100">
            <NotificationToggle checked={notificationPreferences.sms.emergencyAlerts} label="Emergency Alerts" />
            <NotificationToggle checked={notificationPreferences.sms.deviceStatus} label="Critical Device Status" />
            <NotificationToggle checked={notificationPreferences.sms.systemDowntime} label="System Downtime" />
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
          </div>
          <div className="space-y-1 divide-y divide-gray-100">
            <NotificationToggle checked={notificationPreferences.push.dailyReports} label="Daily Reports" />
            <NotificationToggle checked={notificationPreferences.push.playlistChanges} label="Playlist Changes" />
            <NotificationToggle checked={notificationPreferences.push.branchStatus} label="Branch Status Updates" />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;