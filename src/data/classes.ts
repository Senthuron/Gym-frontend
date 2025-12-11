export type ClassItem = {
  id: string;
  title: string;
  coach: string;
  time: string;
  capacity: number;
  booked: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  location: string;
};

export const classes: ClassItem[] = [
  {
    id: "C-401",
    title: "Strength Foundations",
    coach: "Lena Kim",
    time: "Mon · 7:00 AM",
    capacity: 16,
    booked: 14,
    level: "Beginner",
    location: "Studio A",
  },
  {
    id: "C-418",
    title: "HIIT Express",
    coach: "Jordan Fox",
    time: "Tue · 6:30 PM",
    capacity: 18,
    booked: 17,
    level: "Advanced",
    location: "Main Floor",
  },
  {
    id: "C-409",
    title: "Mobility & Recovery",
    coach: "Samira Patel",
    time: "Wed · 12:00 PM",
    capacity: 20,
    booked: 12,
    level: "Beginner",
    location: "Studio B",
  },
  {
    id: "C-425",
    title: "Powerlifting Club",
    coach: "Chris Yu",
    time: "Thu · 5:30 PM",
    capacity: 12,
    booked: 9,
    level: "Intermediate",
    location: "Platform Room",
  },
  {
    id: "C-432",
    title: "Cycling Burn",
    coach: "Jamie Chen",
    time: "Sat · 9:00 AM",
    capacity: 22,
    booked: 21,
    level: "Intermediate",
    location: "Cycle Studio",
  },
];

