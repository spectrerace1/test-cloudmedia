import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Play, Pause, Trash2, GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  file: File;
  index: number;
  isPlaying: boolean;
  onRemove: () => void;
  onTogglePlay: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  file,
  index,
  isPlaying,
  onRemove,
  onTogglePlay
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (duration: number): string => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get the actual file name without the path
  const fileName = file.name.split('\\').pop()?.split('/').pop() || file.name;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 ${
        isDragging ? 'shadow-lg' : 'hover:border-gray-300'
      }`}
      {...attributes}
    >
      <div {...listeners} className="cursor-grab hover:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-sm font-medium text-indigo-600">
        {index + 1}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
          {(file as any).duration && (
            <>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-500">{formatDuration((file as any).duration)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SortableItem;