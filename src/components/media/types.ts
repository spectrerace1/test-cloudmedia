export interface Playlist {
  id: number;
  name: string;
  artwork: string;
  songCount: number;
  duration: string;
  category: string;
  mood: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}