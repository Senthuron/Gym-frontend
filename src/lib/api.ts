// API Configuration and utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  weight?: number;
  role?: 'admin' | 'trainer' | 'member';
  membershipStartDate?: string;
  membershipEndDate?: string;
  plan?: string;
  status?: string;
  isActive?: boolean;
  nextBillingDate?: string;
  class?: string;
  classType?: string;
  difficultyLevel?: string;
  daysUntilExpiration?: number;
  gender?: string;
  workoutPlan?: {
    weeklySchedule: {
      day: string;
      exercises: {
        name: string;
        sets: string;
        reps: string;
        notes: string;
      }[];
    }[];
    trainerNotes: string;
  };
  dietPlan?: {
    dietChart: string;
    mealTiming: {
      meal: string;
      time: string;
      notes: string;
    }[];
    nutritionNotes: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DietPlan {
  _id: string;
  title: string;
  type: 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MUSCLE_BUILD' | 'MAINTENANCE';
  trainerId: string | { _id: string; name: string; email: string };
  traineeId: string | { _id: string; name: string; email: string };
  startDate: string;
  endDate: string;
  notes?: string;
  meals: {
    name: string;
    description: string;
    calories?: number;
    nutritionNotes?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutPlan {
  _id: string;
  title: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  trainerId: string | { _id: string; name: string; email: string };
  traineeId: string | { _id: string; name: string; email: string };
  startDate: string;
  endDate: string;
  workoutDays: {
    dayName: string;
    focus: string;
    exercises: {
      name: string;
      sets: string;
      reps: string;
      restTime?: string;
    }[];
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  _id: string;
  name: string;
  trainer: string | { _id: string; name: string; email: string };
  date: string;
  startTime: string;
  capacity: number;
  status: 'Scheduled' | 'Cancelled' | 'Completed';
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  role: 'Trainer' | 'Reception' | 'Manager' | 'Cleaner';
  phone: string;
  email: string;
  joiningDate: string;
  salaryType: 'Monthly' | 'Per-class' | 'Per-hour';
  baseSalary: number;
  status: 'Active' | 'On Permission' | 'Resigned';
  user?: string | { _id: string; name: string; email: string; role: string };
  specialization?: string;
  bio?: string;
  experience?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  activeMembersCount?: number;
  activeMembers?: number;
  expiringMembersCount?: number;
  expiringMembersList?: Member[];
  weeklyClassesCount?: number;
  attendancePercentage?: number;
  completedSessionsAttendancePercentage?: number;
  totalMembers?: number;
  expiringMembers?: number;
  weeklyClasses?: number;
  totalAttendance?: number;
  revenueTrend?: { label: string; value: number }[];
}

export interface Feedback {
  _id: string;
  traineeId: string | { _id: string; name: string };
  trainerId?: string | { _id: string; name: string };
  classId?: string | { _id: string; name: string; date: string };
  type: 'TRAINER' | 'CLASS';
  rating: number;
  comment?: string;
  suggestion?: string;
  status: 'ACTIVE' | 'HIDDEN';
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackAnalytics {
  trainerStats: {
    _id: string;
    name: string;
    averageRating: number;
    totalFeedback: number;
  }[];
  classStats: {
    _id: string;
    name: string;
    averageRating: number;
    totalFeedback: number;
  }[];
}

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
};

// Get user from localStorage
export const getUser = (): LoginResponse['user'] | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Set user in localStorage
export const setUser = (user: LoginResponse['user']): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    membershipStartDate?: string,
    membershipEndDate?: string,
    plan?: string,
    className?: string,
    classType?: string,
    difficultyLevel?: string,
    role?: string,
    age?: number,
    weight?: number,
    gender?: string
  ): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        confirmPassword,
        membershipStartDate,
        membershipEndDate,
        plan,
        class: className,
        classType,
        difficultyLevel,
        role,
        age,
        weight,
        gender
      }),
    });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOTP: async (email: string, otp: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });
  },

  getProfile: async (): Promise<ApiResponse<LoginResponse['user'] & { memberDetails?: Member }>> => {
    return apiRequest<LoginResponse['user'] & { memberDetails?: Member }>('/auth/me');
  },
};

// Members API
export const membersApi = {
  getAll: async (search?: string, status?: string, role?: string): Promise<ApiResponse<Member[]>> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (role) params.append('role', role);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Member[]>(`/members${query}`);
  },

  getById: async (id: string): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>(`/members/${id}`);
  },

  getProfile: async (): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>('/members/profile');
  },

  updateProfile: async (memberData: {
    name?: string;
    email?: string;
    phone?: string;
    age?: number;
    weight?: number;
    gender?: string;
  }): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>('/members/profile', {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  create: async (memberData: {
    name: string;
    email: string;
    phone: string;
    role?: 'admin' | 'trainer' | 'member';
    membershipStartDate?: string;
    membershipEndDate?: string;
    plan?: string;
    status?: string;
    nextBillingDate?: string;
    class?: string;
    classType?: string;
    difficultyLevel?: string;
    age?: number;
    weight?: number;
    gender?: string;
  }): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  update: async (id: string, memberData: Partial<Member>): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/members/${id}`, {
      method: 'DELETE',
    });
  },

  updateWorkoutPlan: async (id: string, workoutPlan: any): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ workoutPlan }),
    });
  },

  updateDietPlan: async (id: string, dietPlan: any): Promise<ApiResponse<Member>> => {
    return apiRequest<Member>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ dietPlan }),
    });
  },
};

// Sessions API
export const sessionsApi = {
  getAll: async (startDate?: string, endDate?: string, status?: string, trainerId?: string): Promise<ApiResponse<Session[]>> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (status) params.append('status', status);
    if (trainerId) params.append('trainer', trainerId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Session[]>(`/sessions${query}`);
  },

  getById: async (id: string): Promise<ApiResponse<Session>> => {
    return apiRequest<Session>(`/sessions/${id}`);
  },

  create: async (sessionData: {
    name: string;
    trainer: string;
    date: string;
    startTime: string;
    capacity: number;
    location?: string;
  }): Promise<ApiResponse<Session>> => {
    return apiRequest<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  update: async (id: string, sessionData: Partial<Session>): Promise<ApiResponse<Session>> => {
    return apiRequest<Session>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  },

  cancel: async (id: string): Promise<ApiResponse<Session>> => {
    return apiRequest<Session>(`/sessions/${id}/cancel`, {
      method: 'PUT',
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/sessions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardApi = {
  getAdminStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiRequest<DashboardStats>('/dashboard/admin');
  },

  getTrainerStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiRequest<DashboardStats>('/dashboard/trainer');
  },

  getMemberStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiRequest<DashboardStats>('/dashboard/member');
  },
};

// Attendance API
export const attendanceApi = {
  mark: async (sessionId: string, memberId: string, isPresent: boolean): Promise<ApiResponse<{ marked: number; errors: any[] }>> => {
    return apiRequest<{ marked: number; errors: any[] }>('/attendance', {
      method: 'POST',
      body: JSON.stringify({ sessionId, memberId, isPresent }),
    });
  },

  getBySession: async (sessionId: string): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>(`/attendance/session/${sessionId}`);
  },

  getMemberHistory: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/attendance/member');
  },
};

// Trainers API
export const trainersApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/trainers');
  },
};

// Employees API
export const employeesApi = {
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    return apiRequest<Employee[]>('/employees');
  },

  getById: async (id: string): Promise<ApiResponse<Employee>> => {
    return apiRequest<Employee>(`/employees/${id}`);
  },

  create: async (employeeData: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    return apiRequest<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  },

  update: async (id: string, employeeData: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    return apiRequest<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  },
};

export interface EmployeeAttendance {
  _id: string;
  employee: string | { _id: string; name: string; employeeId: string; role: string };
  date: string;
  status: 'Present' | 'On Permission' | 'Absent';
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}


// Employee Attendance API
export const employeeAttendanceApi = {
  mark: async (date: string, attendanceData: { employeeId: string; status: string; note?: string }[]): Promise<ApiResponse<EmployeeAttendance[]>> => {
    return apiRequest<EmployeeAttendance[]>('/employee-attendance', {
      method: 'POST',
      body: JSON.stringify({ date, attendanceData }),
    });
  },

  getByDate: async (date: string): Promise<ApiResponse<EmployeeAttendance[]>> => {
    return apiRequest<EmployeeAttendance[]>(`/employee-attendance/date/${date}`);
  },

  getEmployeeHistory: async (employeeId: string): Promise<ApiResponse<EmployeeAttendance[]>> => {
    return apiRequest<EmployeeAttendance[]>(`/employee-attendance/employee/${employeeId}`);
  },
};

// Diet Plans API
export const dietPlansApi = {
  getAll: async (): Promise<ApiResponse<DietPlan[]>> => {
    return apiRequest<DietPlan[]>('/diet-plans');
  },
  getById: async (id: string): Promise<ApiResponse<DietPlan>> => {
    return apiRequest<DietPlan>(`/diet-plans/${id}`);
  },
  create: async (data: Partial<DietPlan>): Promise<ApiResponse<DietPlan>> => {
    return apiRequest<DietPlan>('/diet-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: Partial<DietPlan>): Promise<ApiResponse<DietPlan>> => {
    return apiRequest<DietPlan>(`/diet-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/diet-plans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Workout Plans API
export const workoutPlansApi = {
  getAll: async (): Promise<ApiResponse<WorkoutPlan[]>> => {
    return apiRequest<WorkoutPlan[]>('/workout-plans');
  },
  getById: async (id: string): Promise<ApiResponse<WorkoutPlan>> => {
    return apiRequest<WorkoutPlan>(`/workout-plans/${id}`);
  },
  create: async (data: Partial<WorkoutPlan>): Promise<ApiResponse<WorkoutPlan>> => {
    return apiRequest<WorkoutPlan>('/workout-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: Partial<WorkoutPlan>): Promise<ApiResponse<WorkoutPlan>> => {
    return apiRequest<WorkoutPlan>(`/workout-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/workout-plans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Feedback API
export const feedbackApi = {
  create: async (data: {
    trainerId?: string;
    classId?: string;
    type: 'TRAINER' | 'CLASS';
    rating: number;
    comment?: string;
    suggestion?: string;
  }): Promise<ApiResponse<Feedback>> => {
    return apiRequest<Feedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async (params?: {
    type?: 'TRAINER' | 'CLASS';
    trainerId?: string;
    traineeId?: string;
    classId?: string;
    status?: 'ACTIVE' | 'HIDDEN';
  }): Promise<ApiResponse<Feedback[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.trainerId) searchParams.append('trainerId', params.trainerId);
    if (params?.traineeId) searchParams.append('traineeId', params.traineeId);
    if (params?.classId) searchParams.append('classId', params.classId);
    if (params?.status) searchParams.append('status', params.status);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiRequest<Feedback[]>(`/feedback${query}`);
  },

  getAnalytics: async (): Promise<ApiResponse<FeedbackAnalytics>> => {
    return apiRequest<FeedbackAnalytics>('/feedback/analytics');
  },

  updateStatus: async (id: string, status: 'ACTIVE' | 'HIDDEN'): Promise<ApiResponse<Feedback>> => {
    return apiRequest<Feedback>(`/feedback/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
