import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, X } from 'lucide-react';

const TrialBanner: React.FC = () => {
  const [daysLeft, setDaysLeft] = useState(14);
  const [showBanner, setShowBanner] = useState(true);
  const [trialEnded, setTrialEnded] = useState(false);

  useEffect(() => {
    // In a real app, you'd get the trial start date from your backend
    const trialStartDate = localStorage.getItem('trialStartDate');
    
    if (!trialStartDate) {
      localStorage.setItem('trialStartDate', new Date().toISOString());
    } else {
      const startDate = new Date(trialStartDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const remaining = Math.max(14 - diffDays, 0);
      
      setDaysLeft(remaining);
      setTrialEnded(remaining === 0);
    }
  }, []);

  if (!showBanner) return null;

  if (trialEnded) {
    return (
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">
                  Your trial period has ended
                </p>
                <p className="text-sm text-red-700">
                  Please upgrade to continue using all features
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {/* Handle upgrade */}}
                className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-indigo-50 border-b border-indigo-100 ${daysLeft <= 3 ? 'animate-pulse' : ''}`}>
      <div className="max-w-[1600px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-900">
                {daysLeft === 1 ? '1 day' : `${daysLeft} days`} left in your trial
              </p>
              <p className="text-sm text-indigo-700">
                {daysLeft <= 3 
                  ? 'Your trial is ending soon. Upgrade now to keep access to all features.'
                  : 'Explore all our premium features during your trial period.'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {/* Handle upgrade */}}
              className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
            >
              Upgrade Now
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 text-indigo-600 hover:bg-indigo-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;