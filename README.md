
# VMS UI — Visitor Management System Frontend

React + Vite frontend for the Visitor Management System.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| State Management | Redux Toolkit |
| HTTP Client | Axios |
| Icons | Lucide React |
| UI Components | Radix UI |

---
## Features

- 🔐 JWT login with role-based access control
- 📊 Dashboard with live stats, recent appointments and walk-ins
- 📋 Visitor Log with check-in / check-out and walk-in vs appointment badge
- 📅 Appointments with department filter and staff department display
- 👤 Visitor management
- 👥 Staff management with role assignment
- 🏢 Department management
- 🛡️ Role management
- 📈 Reports with charts (Admin and Manager only)
- 🔑 Register new staff accounts (Admin only)
- 🌏 Singapore timezone (SGT) display

## Project Structure

```
src/
├── api/                  # Axios API calls
│   ├── appointApi.jsx
│   ├── departmentApi.jsx
│   ├── loginApi.jsx
│   ├── reportApi.jsx
│   ├── roleApi.jsx
│   ├── staffApi.jsx
│   ├── visitorApi.jsx
│   └── visitorLogApi.jsx
├── modules/              # Page components
│   ├── Appoint/          # Appointment list, add, edit
│   ├── Auth/             # Register page
│   ├── Dashboard/        # Dashboard
│   ├── Department/       # Department list, add, edit
│   ├── Report/           # Reports with charts
│   ├── Role/             # Role list, add, edit
│   ├── Staff/            # Staff list, add, edit
│   ├── Visitor/          # Visitor list, add, edit
│   ├── VisitorLog/       # Visitor log, check-in
│   └── Login.jsx
├── redux/                # State management
├── layouts/              # Layout wrappers
├── config/               # API base URL config
├── App.jsx               # Routes and auth guards
└── sidebar.jsx           # Navigation sidebar
```

## Getting Started

### Prerequisites
- Node.js 18+
- VMS API running on `http://localhost:5235`

### Setup

```bash
# Clone the repo
git clone https://github.com/riri97-igm/VMS_UI.git
cd vms-ui

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

App runs on: `http://localhost:5173`

> Note: Use `--legacy-peer-deps` because recharts has a peer dependency
> conflict with React 19

## Configuration

Update `src/config/config.js`:

```js
const config = {
  API_Base_URL: 'http://localhost:5235/api/'
};

export default config;
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vms.com | Admin@123 |
| Receptionist | sarah@vms.com | Reception@123 |
| Staff | alice@vms.com | Staff@123 |

## Role Access

| Page | Admin | Manager | Receptionist | Staff |
|------|-------|---------|--------------|-------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Visitor Log | ✅ | ✅ | ✅ | ❌ |
| Appointments | ✅ | ✅ | ✅ | ❌ |
| Visitors | ✅ | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ❌ | ❌ |
| Staff | ✅ | ❌ | ❌ | ❌ |
| Departments | ✅ | ❌ | ❌ | ❌ |
| Roles | ✅ | ❌ | ❌ | ❌ |
| Register Account | ✅ | ❌ | ❌ | ❌ |

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Known Issues / Notes

- `npm install` requires `--legacy-peer-deps` flag due to React 19 peer dependency conflicts
- All times displayed in SGT (UTC+8)
- Sidebar hides completely on login page
- `/visitor-log` and `/visitor` use exact route matching to avoid sidebar highlight conflicts
