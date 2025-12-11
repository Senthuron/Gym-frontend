export type TraineeProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  avatar: string;
  trainer: string;
  trainerContact?: string;
  membershipPlan: string;
  membershipExpiry: string;
  membershipDaysLeft: number;
  attendancePercent: number;
};

export type TraineeClass = {
  id: string;
  title: string;
  trainer: string;
  date: string; // ISO
  time: string;
  duration: string;
  status: "Upcoming" | "Completed";
  description: string;
  location: string;
};

export type AttendanceHistory = {
  classId: string;
  className: string;
  date: string; // ISO
  status: "Present" | "Absent";
};

export const traineeProfile: TraineeProfile = {
  id: "TM-220",
  name: "Nora Mills",
  email: "nora.mills@example.com",
  phone: "+1 (555) 214-8899",
  age: 29,
  avatar:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
  trainer: "Jordan Fox",
  trainerContact: "jordan.fox@gymmini.app",
  membershipPlan: "Premium",
  membershipExpiry: "2025-02-18",
  membershipDaysLeft: 42,
  attendancePercent: 88,
};

export const traineeClasses: TraineeClass[] = [
  {
    id: "CL-301",
    title: "Strength Foundations",
    trainer: "Jordan Fox",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: "07:00 AM",
    duration: "60 min",
    status: "Upcoming",
    description: "Full-body strength circuit focusing on core stability.",
    location: "Studio A",
  },
  {
    id: "CL-302",
    title: "Mobility & Recovery",
    trainer: "Jordan Fox",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    time: "06:00 PM",
    duration: "45 min",
    status: "Upcoming",
    description: "Stretch, foam roll, and activate key muscle groups.",
    location: "Studio B",
  },
  {
    id: "CL-303",
    title: "HIIT Express",
    trainer: "Jordan Fox",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    time: "06:30 PM",
    duration: "40 min",
    status: "Completed",
    description: "High intensity interval training; bring water and towel.",
    location: "Main Floor",
  },
  {
    id: "CL-304",
    title: "Conditioning Circuit",
    trainer: "Jordan Fox",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    time: "05:30 PM",
    duration: "50 min",
    status: "Upcoming",
    description: "Rotating stations targeting cardio and muscular endurance.",
    location: "Main Floor",
  },
];

export const attendanceHistory: AttendanceHistory[] = [
  {
    classId: "CL-298",
    className: "HIIT Express",
    date: "2025-01-08",
    status: "Present",
  },
  {
    classId: "CL-297",
    className: "Strength Foundations",
    date: "2025-01-06",
    status: "Present",
  },
  {
    classId: "CL-296",
    className: "Mobility & Recovery",
    date: "2025-01-03",
    status: "Absent",
  },
  {
    classId: "CL-295",
    className: "Conditioning Circuit",
    date: "2025-01-01",
    status: "Present",
  },
];

