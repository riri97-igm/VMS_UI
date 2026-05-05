# VMS UI — Visitor Management System (Frontend)

A React-based frontend for the Visitor Management System, providing role-based dashboards, visitor check-in/check-out, appointment management, and staff administration.

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

## Project Structure

```
vms-ui/
├── public/
└── src/
    ├── api/                    # API call functions
    │   ├── axiosInstance.jsx   # JWT interceptor
    │   ├── loginApi.jsx
    │   ├── departmentApi.jsx
    │   ├── staffApi.jsx
    │   ├── roleApi.jsx
    │   ├── visitorApi.jsx
    │   ├── appointApi.jsx
    │   └── visitorLogApi.jsx
    ├── config/
    │   └── config.jsx          # API base URL config
    ├── modules/
    │   ├── Login.jsx
    │   ├── Dashboard/
    │   ├── Department/
    │   ├── Staff/
    │   ├── Role/
    │   ├── Visitor/
    │   ├── Appoint/
    │   └── VisitorLog/
    ├── redux/
    │   ├── store.jsx
    │   └── slices/
    ├── layouts/
    ├── App.jsx
    ├── sidebar.jsx
    └── main.jsx
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher
- VMS API running (backend)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/riri97-igm/VMS_UI.git
cd VMS_UI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

Open `src/config/config.jsx` and set the URL to match where your API is running:

```jsx
const config = {
    API_Base_URL: 'http://localhost:5235/api/',
};

export default config;
```

> Make sure the VMS API is running before starting the frontend.

### 4. Start the development server

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Login

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@vms.com` | `Admin@123` |
| Receptionist | `sarah@vms.com` | `Reception@123` |
| Staff | `alice@vms.com` | `Staff@123` |

---

## Features by Role

### Admin
Full access to all modules:

| Module | Actions |
|--------|---------|
| Dashboard | View stats, today's visitors, recent appointments |
| Visitor Log | Check in/out visitors, view history |
| Appointments | Create, edit, change status, delete |
| Visitors | Add, edit, delete, search |
| Staff | Add, edit, delete staff accounts |
| Departments | Add, edit, delete departments |
| Roles | Add, edit, delete roles |

### Receptionist
| Module | Actions |
|--------|---------|
| Dashboard | View stats only |
| Visitor Log | Check in/out visitors |
| Appointments | Create, edit, change status |
| Visitors | Add, edit, delete |

### Staff
| Module | Actions |
|--------|---------|
| Dashboard | View stats only |

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/dashboard` | Dashboard | All roles |
| `/visitor-log` | Visitor Log | Admin, Receptionist |
| `/visitor-log/checkin` | Check In Form | Admin, Receptionist |
| `/appoint` | Appointment List | Admin, Receptionist |
| `/appoint/add` | Add Appointment | Admin, Receptionist |
| `/appoint/edit/:id` | Edit Appointment | Admin, Receptionist |
| `/visitor` | Visitor List | Admin, Receptionist |
| `/visitor/add` | Add Visitor | Admin, Receptionist |
| `/visitor/edit/:id` | Edit Visitor | Admin, Receptionist |
| `/staff` | Staff List | Admin only |
| `/staff/add` | Add Staff | Admin only |
| `/staff/edit/:id` | Edit Staff | Admin only |
| `/department` | Department List | Admin only |
| `/department/add` | Add Department | Admin only |
| `/department/edit/:id` | Edit Department | Admin only |
| `/role` | Role List | Admin only |
| `/role/add` | Add Role | Admin only |
| `/role/edit/:id` | Edit Role | Admin only |

---

## Authentication Flow

1. User enters email and password on the Login page
2. Frontend calls `POST /api/Auth/login`
3. On success, the JWT token and user info are saved to `localStorage`
4. `axiosInstance.jsx` automatically attaches `Authorization: Bearer <token>` to every API request
5. On `401 Unauthorized`, the user is automatically redirected to `/login`
6. On logout, localStorage is cleared and user is redirected to `/login`

---

## Email Notifications (handled by API)

The following actions trigger automatic emails:

- **Check In** — host staff receives an email when their visitor arrives
- **Appointment Approved** — visitor receives a confirmation email
- **Appointment Rejected** — visitor receives a rejection email

---

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder. Deploy to any static hosting (Vercel, Netlify, etc.).

For Vercel deployment, set the environment variable:

```
VITE_API_BASE_URL=https://your-api-domain.com/api/
```

Then update `config.jsx` to use it:

```jsx
const config = {
    API_Base_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5235/api/',
};
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `ERR_CONNECTION_REFUSED` | API is not running — start it with `dotnet run --project VMS.API` |
| `ERR_SSL_PROTOCOL_ERROR` | Change `https` to `http` in `config.jsx` |
| `401 Unauthorized` | Token expired — log out and log in again |
| `400 Bad Request` on update | Check that all required fields are filled |
| Blank sidebar / no nav links | `vms_user` not saved in localStorage — check `Login.jsx` saves the full user object |
