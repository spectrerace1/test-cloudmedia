import React from 'react';
import { Music2, Play, Pause, Trash2 } from 'lucide-react';

interface FileListProps {
  files: File[];
  currentlyPlaying: number | null;
  onRemove: (index: number) => void;
  onTogglePlay: (index: number) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  currentlyPlaying,
  onRemove,
  onTogglePlay
}) => {
  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="max-h-64 overflow-y-auto space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Music2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay(index);
              }}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              {currentlyPlaying === index ? (
                <Pause className="w-4 h-4 text-gray-600" />
              ) : (
                <Play className="w-4 h-4 text-gray-600" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="p-2 hover:bg-red-100 rounded-full text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};