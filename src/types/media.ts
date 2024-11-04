export interface Media {
  id: string;
  name: string;
  type: string;
  path: string;
  size: number;
  metadata: {
    duration: number;
    format: string;
    bitrate: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}