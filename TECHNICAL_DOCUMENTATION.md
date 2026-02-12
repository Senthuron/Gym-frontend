# Technical & Functional Documentation - Gym Mini

## 1. High-Level System Architecture

Gym Mini is a modern, lightweight Micro-SaaS application designed for gym management. It follows a client-server architecture, utilizing a robust frontend built with Next.js and interacting with a backend via RESTful APIs and real-time WebSockets.

### Architecture Diagram Overview
- **Client (Frontend):** Next.js (App Router) application hosted on Vercel or similar. Handles UI, client-side routing, and real-time state updates.
- **Server (Backend):** (External) Node.js/Express server (inferred from `http://localhost:5000/api`) that exposes REST endpoints and a Socket.IO server.
- **Database:** (External) MongoDB (implied by `_id` fields in data models).

### Key Technologies
- **Framework:** Next.js (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with `tailwindcss-animate` and `class-variance-authority`)
- **Real-time Communication:** Socket.IO Client
- **State/API Management:** Native `fetch` with React Hooks (`useState`, `useEffect`) and Context API (`SocketContext`).
- **Icons:** Lucide React

---

## 2. Folder and File Structure Explanation

 The project follows the standard Next.js App Router structure with a clear separation of concerns.

```
/src
├── app/                  # Application Routes (App Router)
│   ├── (app)/            # Protected Admin Routes (Group Route)
│   │   ├── dashboard/    # Admin Dashboard
│   │   ├── members/      # Member Management
│   │   ├── employees/    # Employee Management
│   │   └── ...           # Other Admin Features (Attendance, Classes, Settings)
│   ├── (public)/         # Public Routes
│   │   ├── login/        # Authentication Login
│   │   └── register/     # User Registration
│   ├── trainee/          # Protected Trainee/Member Routes
│   │   ├── dashboard/    # Member Dashboard
│   │   ├── workout/      # View Workout Plans
│   │   ├── diet/         # View Diet Plans
│   │   └── ...           # Profile, Attendance
│   ├── trainer/          # Protected Trainer Routes
│   │   ├── dashboard/    # Trainer Dashboard
│   │   ├── classes/      # Class Management
│   │   ├── workout-plans/# Create/Edit Workout Plans
│   │   └── ...           # Diet Plans, Attendance, Members
│   ├── layout.tsx        # Root Layout with Global Providers
│   └── page.tsx          # Root Entry (Redirects to /login)
├── components/           # Reusable UI Components
│   ├── layout/           # Sidebar, Topbar components for different roles
│   ├── ui/               # Generic UI elements (Buttons, Inputs, Cards)
│   ├── NotificationToast # Real-time notification component
│   └── trainee/          # Trainee-specific components (e.g., Onboarding)
├── lib/                  # Utilities and Services
│   ├── api.ts            # Centralized REST API Client & Type Definitions
│   ├── SocketContext.tsx # React Context for Socket.IO connection
│   └── utils.ts          # Helper functions (e.g., class name merging)
└── data/                 # Static data or mock constants
```

---

## 3. Core Logic Areas

### 3.1 Authentication & Authorization
- **Mechanism:** Token-based authentication (JWT).
- **Flow:**
  - `login` / `register` endpoints return a `token` and `user` object.
  - Token is stored in **localStorage** (`auth_token`).
  - User details are stored in **localStorage** (`user`).
- **Route Protection:**
  - Implemented in `layout.tsx` files for each route group (`(app)`, `trainee`, `trainer`).
  - Checks if `user` exists and if `user.role` matches the required role.
  - Redirects unauthorized users to `/login` or their appropriate dashboard.

### 3.2 Role-Based Dashboards
The application serves three distinct user roles, each with a dedicated sub-path:
- **Admin (`/(app)`):** Full control over gym operations. Can manage members, employees, classes, and view global analytics.
- **Trainer (`/trainer`):** Focuses on class schedules, assigning workout/diet plans to trainees, and viewing member progress.
- **Member/Trainee (`/trainee`):** Personal dashboard to view assigned plans, check attendance history, and managing profile.

### 3.3 Integrations & API Layer (`api.ts`)
- **Centralized Client:** A generic `apiRequest` function handles all HTTP requests, automatically injecting the `Authorization` header with the Bearer token.
- **Modules:** The API is structured into modules:
  - `authApi`: Login, register, password reset.
  - `membersApi`: CRUD operations for gym members.
  - `sessionsApi` / `attendanceApi`: Class scheduling and attendance tracking.
  - `dashboardApi`: Aggregated stats for dashboards.
  - `workoutPlansApi` / `dietPlansApi`: Plan management.

### 3.4 Real-Time Notifications (`SocketContext.tsx` & `NotificationToast.tsx`)
- **Connection:** Establishes a Socket.IO connection on app load, authenticated via user ID (`socket.emit('join', user.id)`).
- **Events:** Listens for backend events such as:
  - `new_feedback`, `new_class_feedback`
  - `new_diet_plan`, `update_diet_plan`
  - `new_workout_plan`, `update_workout_plan`
- **UI:** Pops up a toast notification that auto-dismisses after 5 seconds to alert the user of updates without refreshing.

---

## 4. Deployment and Rollback Procedure

### Deployment
1. **Environment Setup:**
   - Ensure `Node.js` (LTS) is installed.
   - Configure Environment Variables in `.env` or deployment platform:
     - `NEXT_PUBLIC_API_URL`: URL of the backend API (e.g., `https://api.gym-mini.com/api`).
2. **Build:**
   ```bash
   npm install
   npm run build
   ```
   This generates the optimized production build in the `.next` folder.
3. **Start:**
   ```bash
   npm start
   ```
   Runs the production server.

### Rollback
If a deployment fails or introduces critical bugs:
1. **Version Control:** Revert the main branch to the previous stable commit using Git.
   ```bash
   git revert <commit-hash>
   ```
2. **Redeploy:** Trigger a new build/deployment pipeline with the reverted code.
3. **Cache Clearing:** If using a CDN or Vercel, clear the build cache to ensure no stale assets are served.

---

## 5. Known Risks and Technical Debt

### 5.1 Security
- **Token Storage:** Authentication tokens are stored in `localStorage`. This is vulnerable to Cross-Site Scripting (XSS) attacks.
  - *Recommendation:* Move to `httpOnly` cookies for token storage.
- **Role Validation:** Role checks are performed client-side in `layout.tsx`. While the backend should handle data security, the frontend routing is easily bypassed by manipulating client-side code.
  - *Recommendation:* Implement Middleware (`middleware.ts`) for server-side route protection.

### 5.2 Performance & scalability
- **Client-Side Data Fetching:** The app uses basic `fetch` inside `useEffect`. This can lead to "waterfalls" (sequential loading) and lacks caching/deduplication provided by libraries like React Query.
- **Hardcoded Fallbacks:** Several files (`api.ts`, `SocketContext.tsx`) have hardcoded fallbacks to `http://localhost:5000`. This is risky for production if environment variables fail to load.

### 5.3 Code Quality
- **Type Safety (`any`):** There are instances of `any` type usage in API definitions (e.g., `updateWorkoutPlan` payloads), reducing the benefits of TypeScript.
- **Hydration Warnings:** The root layout suppresses hydration warnings (`suppressHydrationWarning={true}`). This masks potential mismatches between server-rendered HTML and client-side React, which can lead to layout shifts or broken interactivity.
