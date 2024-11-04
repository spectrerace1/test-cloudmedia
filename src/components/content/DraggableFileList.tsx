import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableItem from './SortableItem';
import { Music2 } from 'lucide-react';

interface DraggableFileListProps {
  files: File[];
  currentlyPlaying: number | null;
  onFilesReorder: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onTogglePlay: (index: number) => void;
}

const DraggableFileList: React.FC<DraggableFileListProps> = ({
  files,
  currentlyPlaying,
  onFilesReorder,
  onRemoveFile,
  onTogglePlay
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = files.findIndex((_, i) => `file-${i}` === active.id);
      const newIndex = files.findIndex((_, i) => `file-${i}` === over.id);
      
      const newFiles = [...files];
      const [movedItem] = newFiles.splice(oldIndex, 1);
      newFiles.splice(newIndex, 0, movedItem);
      
      onFilesReorder(newFiles);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-gray-400" />
          <h3 className="font-medium text-gray-900">Uploaded Files</h3>
        </div>
        <span className="text-sm text-gray-500">{files.length} files</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="max-h-[320px] overflow-y-auto p-4">
          <SortableContext
            items={files.map((_, i) => `file-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {files.map((file, index) => (
                <SortableItem
                  key={`file-${index}`}
                  id={`file-${index}`}
                  file={file}
                  index={index}
                  isPlaying={currentlyPlaying === index}
                  onRemove={() => onRemoveFile(index)}
                  onTogglePlay={() => onTogglePlay(index)}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default DraggableFileList;