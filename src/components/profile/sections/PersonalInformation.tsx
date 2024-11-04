import React from 'react';
import { User, Mail, Phone, Briefcase, Globe, Languages } from 'lucide-react';

interface PersonalInformationProps {
  profile: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      position: string;
      timezone: string;
      language: string;
    };
  };
  isEditing: boolean;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ profile, isEditing }) => {
  const { personalInfo } = profile;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={personalInfo.name}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg font-medium text-gray-900">{personalInfo.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  defaultValue={personalInfo.email}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg font-medium text-gray-900">{personalInfo.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Phone className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  defaultValue={personalInfo.phone}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg font-medium text-gray-900">{personalInfo.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Position */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Briefcase className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Position</label>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={personalInfo.position}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg font-medium text-gray-900">{personalInfo.position}</p>
              )}
            </div>
          </div>
        </div>

        {/* Timezone */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Time Zone</label>
              {isEditing ? (
                <select
                  defaultValue={personalInfo.timezone}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="UTC+3">UTC+3</option>
                  <option value="UTC+2">UTC+2</option>
                  <option value="UTC+1">UTC+1</option>
                </select>
              ) : (
                <p className="mt-1 text-lg font-medium text-gray-900">{personalInfo.timezone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Languages className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500">Language</label>
              {isEditing ? (
                <select
                  defaultValue={personalInfo.language}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              ) : (
                <p className="mt-1 text-lg font-medium text-gray-900">{personalInfo.language}</p>
              )}
            </div>
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

export default PersonalInformation;