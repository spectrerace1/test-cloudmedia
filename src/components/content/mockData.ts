// Mock data for branches and groups
export const mockBranches = Array.from({ length: 200 }, (_, i) => ({
  id: `br${i + 1}`,
  name: `Branch ${i + 1}`,
  location: `Location ${Math.floor(i / 20) + 1}`,
  status: Math.random() > 0.2 ? 'online' : 'offline'
})) as const;

export const mockGroups = [
  { id: 'g1', name: 'City Center Branches', branchCount: 45 },
  { id: 'g2', name: 'Shopping Centers', branchCount: 38 },
  { id: 'g3', name: 'Transportation Hubs', branchCount: 22 },
  { id: 'g4', name: 'Business District', branchCount: 35 },
  { id: 'g5', name: 'Plaza Network', branchCount: 28 },
  { id: 'g6', name: 'Mall Locations', branchCount: 32 },
] as const;