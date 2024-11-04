export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  type: 'playlist' | 'announcement';
  branch: string;
  playlist: string;
  description: string;
}

export interface EventFormData {
  title: string;
  type: 'playlist' | 'announcement';
  playlist: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  branches: string[];
  groups: string[];
  description: string;
  recurrence: {
    enabled: boolean;
    type: 'weekly' | 'monthly';
    interval: number;
    endAfter: number;
    monthlyType: 'dayOfMonth' | 'dayOfWeek';
    selectedDates: number[];
    repeatDays: string[];
  };
}

export interface ValidationError {
  field: string;
  message: string;
}