export interface Playlist {
  id: string;
  name: string;
  settings: {
    shuffle: boolean;
    repeat: boolean;
    volume: number;
    schedule: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      days: string[];
    };
  };
  media: Media[];
  branches: Branch[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}