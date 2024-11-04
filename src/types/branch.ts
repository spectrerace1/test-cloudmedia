export interface Branch {
  id: string;
  name: string;
  location: string;
  settings: {
    volume: number;
    operatingHours: {
      start: string;
      end: string;
    };
    timezone: string;
  };
  isActive: boolean;
  devices: Device[];
  createdAt: string;
  updatedAt: string;
}