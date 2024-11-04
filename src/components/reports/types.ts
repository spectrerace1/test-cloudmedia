export interface Song {
  name: string;
  artist: string;
  duration: string;
  playCount: number;
  lastPlayed: string;
}

export interface Branch {
  id: number;
  name: string;
  branchId: string;
  groupName?: string;
  deviceCount: number;
}

export interface Playlist {
  id: number;
  name: string;
  branch: Branch;
  duration: string;
  category: string;
  createdBy: string;
  assignedDate: string;
  songs: Song[];
}

export interface FilterOptions {
  startDate: string;
  endDate: string;
  selectedBranches: number[];
  selectedGroups: number[];
  selectedPlaylists: number[];
}