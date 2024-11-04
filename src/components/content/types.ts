export interface AudioFile {
  id: string;
  file: File;
  name: string;
  size: number;
  order: number;
  preview?: {
    audio: HTMLAudioElement;
    isPlaying: boolean;
    duration: string;
  };
}