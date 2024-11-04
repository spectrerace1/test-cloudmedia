import React from 'react';
import { Building2, Calendar, CreditCard, FileText } from 'lucide-react';

interface BusinessInformationProps {
  profile: {
    businessInfo: {
      name: string;
      accountType: string;
      registrationDate: string;
      logo: string;
      businessId: string;
      plan: string;
    };
  };
  isEditing: boolean;
}

const BusinessInformation: React.FC<BusinessInformationProps> = ({ profile, isEditing }) => {
  const { businessInfo } = profile;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Business Name</label>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={businessInfo.name}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-lg font-medium text-gray-900">{businessInfo.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business ID */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Business ID</label>
              <p className="mt-1 text-lg font-medium text-gray-900">{businessInfo.businessId}</p>
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Registration Date</label>
              <p className="mt-1 text-lg font-medium text-gray-900">{businessInfo.registrationDate}</p>
            </div>
          </div>
        </div>

        {/* Account Plan */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <CreditCard className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Account Plan</label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-medium text-gray-900">{businessInfo.plan}</span>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-md">Active</span>
              </div>
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

export default BusinessInformation;