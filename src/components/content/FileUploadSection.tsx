import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { AudioFile } from './types';
import DraggableFileList from './DraggableFileList';

interface FileUploadSectionProps {
  files: AudioFile[];
  dragActive: boolean;
  currentlyPlaying: number | null;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilesReorder: (files: AudioFile[]) => void;
  onRemoveFile: (index: number) => void;
  onTogglePlay: (index: number) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  dragActive,
  currentlyPlaying,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFileInput,
  onFilesReorder,
  onRemoveFile,
  onTogglePlay,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          onChange={onFileInput}
          className="hidden"
        />
        <div className="mx-auto w-12 h-12 mb-4 bg-indigo-50 rounded-full flex items-center justify-center">
          <Upload className="w-6 h-6 text-indigo-600" />
        </div>
        <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">MP3, WAV up to 10MB</p>
      </div>

      {files.length > 0 && (
        <DraggableFileList
          files={files}
          onFilesReorder={onFilesReorder}
          onRemoveFile={onRemoveFile}
          onTogglePlay={onTogglePlay}
          currentlyPlaying={currentlyPlaying}
        />
      )}
    </div>
  );
};

export default FileUploadSection;