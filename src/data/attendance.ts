export type AttendanceDay = {
  date: string;
  checkIns: number;
  newMembers: number;
  peakHour: string;
  notes?: string;
};

export const attendanceSummary = {
  weeklyAverage: 186,
  peakUtilization: "6:00 PM",
  weekChange: "+4.2%",
};

export const attendanceDays: AttendanceDay[] = [
  {
    date: "2024-12-01",
    checkIns: 192,
    newMembers: 4,
    peakHour: "6:00 PM",
    notes: "Spin class fully booked",
  },
  {
    date: "2024-12-02",
    checkIns: 178,
    newMembers: 3,
    peakHour: "7:00 AM",
  },
  {
    date: "2024-12-03",
    checkIns: 201,
    newMembers: 5,
    peakHour: "6:30 PM",
    notes: "Evening HIIT waitlist started",
  },
  {
    date: "2024-12-04",
    checkIns: 184,
    newMembers: 2,
    peakHour: "5:00 PM",
  },
  {
    date: "2024-12-05",
    checkIns: 175,
    newMembers: 4,
    peakHour: "6:00 AM",
  },
];

