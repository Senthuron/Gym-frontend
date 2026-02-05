# Gym Management System (Frontend)

A modern, responsive, and feature-rich Gym Management System frontend built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**. This application serves as the client-side interface for managing gym operations, including member management, staff administration, scheduling, workout/diet planning, and real-time notifications.

## 🚀 Technologies Used

-   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Real-time Communication:** [Socket.io Client](https://socket.io/)
-   **State Management:** React Context (SocketContext) & Hooks
-   **Linting:** ESLint

## ✨ Features

### 🔐 Authentication & Security
-   **User Roles:** Support for Admin, Trainer, Member (Trainee), and Staff (Reception, Manager, Cleaner).
-   **Secure Login/Register:** JWT-based authentication.
-   **Password Recovery:** Email-based OTP verification for password resets.

### 👥 Member Management
-   **Profile Management:** View and edit personal details, membership status, and physical metrics (age, weight, etc.).
-   **Plans:** Customized Workout and Diet plans assigned by trainers.
-   **Progress Tracking:** Track attendance and goals.

### 🏋️ Trainer & Staff Management
-   **Employee Directory:** Manage staff details, roles, and specializations.
-   **Attendance Tracking:** Mark and view staff attendance (Present, Absent, On Permission).
-   **Dashboard:** specialized dashboard for trainers to view their sessions and assigned members.

### 📅 Scheduling & Classes
-   **Session Management:** Create, update, and cancel training sessions.
-   **Class Booking:** View available classes and capacity.
-   **Attendance:** Mark member attendance for specific sessions.

### 🥗 Diet & Workout Planning
-   **Custom Plans:** Trainers can create detailed workout routines (sets, reps, exercises) and diet charts (meals, calories, macros).
-   **Assignment:** Assign plans to specific members.

### 💬 Feedback & Notifications
-   **Feedback System:** Members can rate and review trainers and classes.
-   **Real-time Alerts:** Socket.io integration for instant notifications (e.g., plan updates, session changes).

### 📊 Dashboards
-   **Admin Dashboard:** Overview of active members, revenue trends, attendance stats, and expiring memberships.
-   **Trainer Dashboard:** Upcoming sessions, trainee feedback, and schedule.
-   **Member Dashboard:** Personal plans, today's schedule, and announcements.

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (app)/            # Protected routes (Dashboard, Settings, etc.)
│   ├── (public)/         # Public routes (Login, Register)
│   ├── trainee/          # Trainee-specific views
│   └── trainer/          # Trainer-specific views
├── components/           # Reusable UI components
│   ├── dashboard/        # Dashboard widgets
│   ├── ui/               # Generic UI elements (Buttons, Inputs, etc.)
│   └── ...
├── data/                 # Static data and type definitions
├── lib/                  # Utilities and Configuration
│   ├── api.ts            # API client and type definitions
│   ├── SocketContext.tsx # WebSocket context provider
│   └── utils.ts          # Helper functions
```

## 🛠️ Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gym-frontend.git
    cd gym-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and configure your backend URL:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔌 API Integration

The application communicates with a backend server via RESTful endpoints defined in `src/lib/api.ts`. Key API groups include:

-   `authApi`: Authentication and profile management.
-   `membersApi`: Member CRUD and plan management.
-   `sessionsApi`: Class scheduling and management.
-   `attendanceApi`: Member and employee attendance.
-   `employeesApi`: Staff management.
-   `dashboardApi`: Aggregated statistics for dashboards.
-   `feedbackApi`: Feedback submission and analytics.

Ensure your backend server is running and accessible at the `NEXT_PUBLIC_API_URL`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
