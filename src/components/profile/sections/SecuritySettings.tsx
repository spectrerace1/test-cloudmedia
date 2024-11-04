import React from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  Globe 
} from 'lucide-react';

interface SecuritySettingsProps {
  profile: {
    securityInfo: {
      lastPasswordChange: string;
      twoFactorEnabled: boolean;
      lastLogin: string;
      activeSessions: number;
      allowedIPs: string[];
    };
  };
  isEditing: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ profile, isEditing }) => {
  const { securityInfo } = profile;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <KeyRound className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Password</label>
              <p className="mt-1 text-gray-900">Last changed {securityInfo.lastPasswordChange}</p>
              {isEditing && (
                <button className="mt-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100">
                  Change Password
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Two-Factor Authentication</label>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-gray-900">
                  {securityInfo.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
                {isEditing && (
                  <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100">
                    {securityInfo.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Last Login */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Last Login</label>
              <p className="mt-1 text-gray-900">{securityInfo.lastLogin}</p>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Smartphone className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Active Sessions</label>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-gray-900">{securityInfo.activeSessions} devices</p>
                {isEditing && (
                  <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
                    End All Sessions
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* IP Access List */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">IP Access List</label>
              <div className="mt-2 space-y-2">
                {securityInfo.allowedIPs.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-900">{ip}</span>
                    {isEditing && (
                      <button className="text-red-600 hover:text-red-700">Remove</button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button className="mt-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100">
                    Add IP Address
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;