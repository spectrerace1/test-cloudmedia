export interface Device {
  id: string;
  name: string;
  token: string;
  status: {
    online: boolean;
    lastSeen: Date;
    ip: string;
    version: string;
    systemInfo: {
      os: string;
      memory: number;
      storage: number;
    };
  };
  branch: Branch;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}