export const mockBranches = [
  { id: 'BR001', name: 'Downtown Branch' },
  { id: 'BR002', name: 'Mall Location' },
  { id: 'BR003', name: 'Airport Store' }
];

export const mockGroups = [
  { id: 'G001', name: 'City Center' },
  { id: 'G002', name: 'Shopping Centers' },
  { id: 'G003', name: 'Airport Locations' }
];

export const mockPlaylists = [
  {
    id: 'PL001',
    name: 'Relaxing Jazz',
    category: 'Jazz',
    createdBy: 'System Admin',
    assignedDate: '2024-03-01',
    branch: {
      branchId: 'BR002',
      name: 'Mall Location',
      groupName: 'Shopping Centers',
      deviceCount: 3
    },
    songs: [
      {
        name: 'Jazz Standard 1',
        artist: 'Artist 3',
        duration: '5:30',
        playCount: 85,
        lastPlayed: '2024-03-01 16:45'
      },
      {
        name: 'Smooth Jazz',
        artist: 'Artist 4',
        duration: '4:45',
        playCount: 73,
        lastPlayed: '2024-03-01 17:30'
      }
    ]
  },
  {
    id: 'PL002',
    name: 'Pop Hits',
    category: 'Pop',
    createdBy: 'System Admin',
    assignedDate: '2024-03-02',
    branch: {
      branchId: 'BR001',
      name: 'Downtown Branch',
      groupName: 'City Center',
      deviceCount: 2
    },
    songs: [
      {
        name: 'Popular Song 1',
        artist: 'Artist 1',
        duration: '3:45',
        playCount: 120,
        lastPlayed: '2024-03-02 14:30'
      },
      {
        name: 'Hit Song 2',
        artist: 'Artist 2',
        duration: '4:15',
        playCount: 95,
        lastPlayed: '2024-03-02 15:15'
      }
    ]
  }
];