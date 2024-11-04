import React, { useState } from 'react';
import { AlertTriangle, VolumeX, Volume2 } from 'lucide-react';

interface EmergencyControlsProps {
  target: {
    type: 'all' | 'group' | 'branch';
    name: string;
  };
  onEmergencyStop: (reason: string) => void;
  onEmergencyResume: () => void;
}

const EmergencyControls: React.FC<EmergencyControlsProps> = ({
  target,
  onEmergencyStop,
  onEmergencyResume
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reason, setReason] = useState('');
  const [showControls, setShowControls] = useState(false);

  const handleEmergencyStop = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for emergency stop');
      return;
    }
    onEmergencyStop(reason);
    setShowConfirmation(false);
    setReason('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Emergency Music Controls</h3>
            <p className="text-sm text-gray-600">
              Use these controls in emergency situations to immediately stop or resume music playback
              {target.type === 'all' 
                ? ' across all branches' 
                : target.type === 'group'
                  ? ` in ${target.name} group`
                  : ` in ${target.name}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowControls(!showControls)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {showControls && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This action will immediately affect music playback. Use with caution.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowConfirmation(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <VolumeX className="w-4 h-4 mr-2" />
              Emergency Stop
            </button>
            <button
              onClick={onEmergencyResume}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Resume Playback
            </button>
          </div>
        </div>
      )}

      {/* Emergency Stop Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Confirm Emergency Stop</h3>
                <p className="text-sm text-gray-500">
                  This will immediately stop all music playback
                  {target.type === 'all' 
                    ? ' across all branches' 
                    : target.type === 'group'
                      ? ` in ${target.name} group`
                      : ` in ${target.name}`}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Emergency Stop
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
              >
                <option value="">Select a reason...</option>
                <option value="emergency">Emergency Situation</option>
                <option value="disaster">Natural Disaster</option>
                <option value="technical">Technical Issues</option>
                <option value="maintenance">Emergency Maintenance</option>
                <option value="other">Other</option>
              </select>
              {reason === 'other' && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please specify the reason..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setReason('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyStop}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyControls;