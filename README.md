# Credio – Frontend

Credio is a frontend MVP for a credit and loan management platform.  
This repository contains the web client built with modern React tooling and a scalable architecture designed for team collaboration.

---

## 🧩 Tech Stack

- **React** (Functional Components)
- **TypeScript**
- **Vite**
- **React Router**
- **Tailwind CSS**
- **ESLint**
- **Lucide Icons**

---

## 📁 Project Structure

The project follows a **feature-based architecture** with a clear separation between
application-level configuration, shared resources, and domain features.

```text
src/
├── app/                # Application shell (router, providers, global styles)
│   ├── providers/
│   ├── router/
│   └── styles/
│
├── features/           # Domain features
│   ├── auth/
│   ├── customers/
│   ├── loans/
│   ├── payments/
│   └── notifications/
│
├── shared/             # Reusable resources
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── assets/
├── config/
└── main.tsx

---

## 🔐 Authentication & Authorization

- Authentication state is handled via **AuthProvider**
- Access control is implemented using:
  - `ProtectedRoute` (authentication)
  - `RoleGuard` (role-based authorization)
- Roles supported:
  - `ADMIN`
  - `OFFICER`
  - `COLLECTOR`
  - `CLIENT`

---

## 🌿 Git Workflow

This project uses a **Git Flow–inspired workflow**.

### Main branches
- `main` → Production-ready code
- `develop` → Integration branch

### Supporting branches
- `feature/*` → New features
- `fix/*` → Bug fixes
- `chore/*` → Configuration / setup changes
- `refactor/*` → Code refactors
- `release/*` → Release preparation

> ❌ No direct commits to `main` or `develop`

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone <repository-url>
cd credio-frontend


npm install
npm run dev
http://localhost:5173
