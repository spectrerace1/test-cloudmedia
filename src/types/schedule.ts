export interface Schedule {
  id: string;
  playlist: Playlist;
  branch: Branch;
  schedule: {
    startDate: Date;
    endDate?: Date;
    startTime: string;
    endTime: string;
    days: string[];
    repeat: boolean;
    interval: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}