export interface BusinessInfo {
  name: string;
  logo: string;
  businessId: string;
  registrationDate: string;
  accountType: string;
  address: string;
  phone: string;
  website: string;
  description: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  position: string;
  timeZone: string;
  language: string;
}

export interface SecurityInfo {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
  loginHistory: Array<{
    date: string;
    location: string;
    device: string;
  }>;
}

export interface NotificationPreferences {
  email: {
    deviceOffline: boolean;
    newPlaylist: boolean;
    announcementReports: boolean;
    systemUpdates: boolean;
    criticalAlerts: boolean;
  };
  sms: {
    emergencyAlerts: boolean;
    criticalDeviceStatus: boolean;
    systemDowntime: boolean;
  };
  push: {
    dailyReports: boolean;
    playlistChanges: boolean;
    branchStatus: boolean;
  };
}

export interface Profile {
  businessInfo: BusinessInfo;
  personalInfo: PersonalInfo;
  securityInfo: SecurityInfo;
  notificationPreferences: NotificationPreferences;
}