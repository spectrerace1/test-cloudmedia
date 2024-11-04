import React from 'react';

interface Stat {
  label: string;
  value: number;
  status: 'success' | 'warning' | 'danger';
}

interface StatusCardProps {
  title: string;
  icon: React.ReactNode;
  total: number;
  stats: Stat[];
}

const StatusCard: React.FC<StatusCardProps> = ({ title, icon, total, stats }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div className="p-2 sm:p-3 bg-indigo-50 rounded-lg">
          {icon}
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="mb-4">
        <span className="text-xl sm:text-2xl font-bold text-gray-900">{total}</span>
        <span className="text-sm text-gray-600 ml-2">total</span>
      </div>

      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className={`${getStatusColor(stat.status)} text-sm sm:text-base font-medium`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusCard;