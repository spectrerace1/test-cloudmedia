import React from 'react';

interface PlayTypeCardProps {
  selected: boolean;
  title: string;
  onClick: () => void;
  value?: number;
  onChange?: (value: number) => void;
}

export const PlayTypeCard: React.FC<PlayTypeCardProps> = ({
  selected,
  title,
  onClick,
  value,
  onChange
}) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-lg border cursor-pointer transition-all ${
      selected 
        ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
        selected ? 'border-indigo-600' : 'border-gray-300'
      }`}>
        {selected && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
      </div>
      <span className={`font-medium ${selected ? 'text-indigo-900' : 'text-gray-700'}`}>
        {title}
      </span>
    </div>
    {selected && onChange && (
      <div className="mt-3 pl-7">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            placeholder="0"
          />
          <span className="text-sm text-gray-600">
            {title.includes('song') ? 'songs' : 'minutes'}
          </span>
        </div>
      </div>
    )}
  </div>
);