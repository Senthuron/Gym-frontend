export type TrainerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
};

export type TrainerClass = {
  id: string;
  title: string;
  date: string; // ISO
  time: string;
  duration: string;
  capacity: number;
  enrolled: number;
  location: string;
  members: string[]; // member ids
};

export type TrainerMember = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  plan?: "Basic" | "Premium" | "Plus";
  activityLevel?: "Active" | "Inactive";
  lastCheckIn?: string;
  avatar?: string;
  age: number;
  classes: string[]; // class ids
  attendanceRate: number; // percent for this trainer
  startDate?: string;
  endDate?: string;
  nextBilling?: string;
};

export type AttendanceRecord = {
  classId: string;
  statuses: Record<string, "present" | "absent">; // memberId -> status
};

export const trainerProfile: TrainerProfile = {
  id: "TR-14",
  name: "Jordan Fox",
  email: "jordan.fox@gymmini.app",
  phone: "+1 (555) 123-4410",
  avatar:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80",
  bio: "Strength & conditioning coach focused on safe progressions and form.",
};

export const trainerClasses: TrainerClass[] = [
  {
    id: "TC-201",
    title: "HIIT Express",
    date: new Date().toISOString().slice(0, 10),
    time: "06:30 AM",
    duration: "45 min",
    capacity: 18,
    enrolled: 16,
    location: "Studio A",
    members: ["TM-1", "TM-2", "TM-3", "TM-4", "TM-5", "TM-6"],
  },
  {
    id: "TC-202",
    title: "Strength Foundations",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: "07:30 AM",
    duration: "60 min",
    capacity: 16,
    enrolled: 14,
    location: "Platform Room",
    members: ["TM-2", "TM-4", "TM-7", "TM-8", "TM-9"],
  },
  {
    id: "TC-203",
    title: "Mobility & Recovery",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: "05:00 PM",
    duration: "45 min",
    capacity: 20,
    enrolled: 12,
    location: "Studio B",
    members: ["TM-1", "TM-5", "TM-6", "TM-10"],
  },
  {
    id: "TC-204",
    title: "Conditioning Circuit",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    time: "06:00 PM",
    duration: "50 min",
    capacity: 18,
    enrolled: 15,
    location: "Main Floor",
    members: ["TM-3", "TM-7", "TM-8", "TM-9", "TM-10"],
  },
];

export const trainerMembers: TrainerMember[] = [
  {
    id: "TM-1",
    name: "Sofia Park",
    phone: "+1 555-310-8899",
    email: "sofia.park@example.com",
    plan: "Premium",
    activityLevel: "Active",
    lastCheckIn: "2025-01-08",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
    age: 29,
    classes: ["TC-201", "TC-203"],
    attendanceRate: 92,
    startDate: "2024-04-21",
    endDate: "2025-04-21",
    nextBilling: "2025-02-10",
  },
  {
    id: "TM-2",
    name: "Alex Carter",
    phone: "+1 555-410-1122",
    email: "alex.carter@example.com",
    plan: "Basic",
    activityLevel: "Active",
    lastCheckIn: "2025-01-06",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    age: 32,
    classes: ["TC-201", "TC-202"],
    attendanceRate: 88,
    startDate: "2024-06-10",
    endDate: "2025-06-10",
    nextBilling: "2025-02-12",
  },
  {
    id: "TM-3",
    name: "Diego Alvarez",
    phone: "+1 555-215-7741",
    email: "diego@alvarez.studio",
    plan: "Premium",
    activityLevel: "Active",
    lastCheckIn: "2025-01-05",
    age: 27,
    classes: ["TC-201", "TC-204"],
    attendanceRate: 81,
    startDate: "2024-08-01",
    endDate: "2025-08-01",
    nextBilling: "2025-02-15",
  },
  {
    id: "TM-4",
    name: "Priya Desai",
    phone: "+1 555-009-3321",
    email: "priya.desai@example.com",
    plan: "Premium",
    activityLevel: "Active",
    lastCheckIn: "2025-01-08",
    avatar:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
    age: 31,
    classes: ["TC-201", "TC-202"],
    attendanceRate: 95,
    startDate: "2024-09-15",
    endDate: "2025-09-15",
    nextBilling: "2025-02-11",
  },
  {
    id: "TM-5",
    name: "Marcus Lee",
    phone: "+1 555-104-2231",
    email: "marcus.lee@example.com",
    plan: "Basic",
    activityLevel: "Active",
    lastCheckIn: "2025-01-07",
    age: 34,
    classes: ["TC-201", "TC-203"],
    attendanceRate: 76,
    startDate: "2024-10-20",
    endDate: "2025-10-20",
    nextBilling: "2025-02-18",
  },
  {
    id: "TM-6",
    name: "Brooklyn James",
    phone: "+1 555-211-7344",
    email: "brooklyn.james@example.com",
    plan: "Premium",
    activityLevel: "Inactive",
    lastCheckIn: "2024-12-28",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    age: 25,
    classes: ["TC-201", "TC-203"],
    attendanceRate: 85,
    startDate: "2024-12-01",
    endDate: "2025-12-01",
    nextBilling: "2025-02-22",
  },
  {
    id: "TM-7",
    name: "Lena Kim",
    phone: "+1 555-908-1221",
    email: "lena.kim@example.com",
    plan: "Premium",
    activityLevel: "Active",
    lastCheckIn: "2025-01-06",
    age: 30,
    classes: ["TC-202", "TC-204"],
    attendanceRate: 89,
    startDate: "2024-05-10",
    endDate: "2025-05-10",
    nextBilling: "2025-02-09",
  },
  {
    id: "TM-8",
    name: "Chris Yu",
    phone: "+1 555-778-9981",
    email: "chris.yu@example.com",
    plan: "Premium",
    activityLevel: "Active",
    lastCheckIn: "2025-01-05",
    age: 33,
    classes: ["TC-202", "TC-204"],
    attendanceRate: 84,
    startDate: "2024-07-05",
    endDate: "2025-07-05",
    nextBilling: "2025-02-14",
  },
  {
    id: "TM-9",
    name: "Jamie Chen",
    phone: "+1 555-211-6644",
    email: "jamie.chen@example.com",
    plan: "Premium",
    activityLevel: "Active",
    lastCheckIn: "2025-01-04",
    age: 28,
    classes: ["TC-202", "TC-204"],
    attendanceRate: 91,
    startDate: "2024-03-18",
    endDate: "2025-03-18",
    nextBilling: "2025-02-08",
  },
  {
    id: "TM-10",
    name: "Ava Morgan",
    phone: "+1 555-712-2210",
    email: "ava.morgan@example.com",
    plan: "Basic",
    activityLevel: "Inactive",
    lastCheckIn: "2025-01-02",
    age: 26,
    classes: ["TC-203", "TC-204"],
    attendanceRate: 78,
    startDate: "2024-11-01",
    endDate: "2025-11-01",
    nextBilling: "2025-02-20",
  },
];

export const trainerAttendance: AttendanceRecord[] = [
  {
    classId: "TC-201",
    statuses: {
      "TM-1": "present",
      "TM-2": "present",
      "TM-3": "absent",
      "TM-4": "present",
      "TM-5": "present",
      "TM-6": "present",
    },
  },
  {
    classId: "TC-202",
    statuses: {
      "TM-2": "present",
      "TM-4": "present",
      "TM-7": "absent",
      "TM-8": "present",
      "TM-9": "present",
    },
  },
  {
    classId: "TC-203",
    statuses: {
      "TM-1": "present",
      "TM-5": "present",
      "TM-6": "absent",
      "TM-10": "present",
    },
  },
  {
    classId: "TC-204",
    statuses: {
      "TM-3": "present",
      "TM-7": "present",
      "TM-8": "present",
      "TM-9": "absent",
      "TM-10": "present",
    },
  },
];

