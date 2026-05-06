import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './sheet'
import { Button } from './button'
import { MenuIcon } from 'lucide-react'
import { useIsMobile } from './hooks/use-mobile'
import { Sidebar, SidebarProvider } from './sidebar'
import './App.css'
import './api/axiosInstance'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'

import Login from './modules/Login'
import Dashboard from './modules/Dashboard/Dashboard'
import DepartmentList from './modules/Department/DepartmentList'
import DepartmentAdd from './modules/Department/DepartmentAdd'
import DepartmentEdit from './modules/Department/DepartmentEdit'
import DepartmentPage from './layouts/Department'
import StaffList from './modules/Staff/StaffList'
import StaffAdd from './modules/Staff/StaffAdd'
import StaffEdit from './modules/Staff/StaffEdit'
import StaffPage from './layouts/Staff'
import RoleList from './modules/Role/RoleList'
import RoleAdd from './modules/Role/RoleAdd'
import RoleEdit from './modules/Role/RoleEdit'
import VisitorList from './modules/Visitor/VisitorList'
import VisitorAdd from './modules/Visitor/VisitorAdd'
import VisitorEdit from './modules/Visitor/VisitorEdit'
import AppointList from './modules/Appoint/AppointList'
import AppointAdd from './modules/Appoint/AppointAdd'
import AppointEdit from './modules/Appoint/AppointEdit'
import VisitorLogList from './modules/VisitorLog/VisitorLogList'
import CheckIn from './modules/VisitorLog/CheckIn'
import Register from './modules/Auth/Register';
import ReportPage from './modules/Report/ReportPage';

// Permission levels — add new roles here to grant access
// 'admin_only'     → only Admin
// 'staff_manage'   → Admin only (staff/dept/role management)  
// 'reception'      → Admin + Receptionist + any custom receptionist-like roles
// 'all_staff'      → everyone logged in
const hasPermission = (userRole, level) => {
  if (!userRole) return false;
  const role = userRole.toLowerCase();

  switch (level) {
    case 'admin_only':
      return role === 'admin';
    case 'staff_manage':
      return role === 'admin';
    case 'reception':
      return ['admin', 'receptionist', 'manager'].includes(role) ||
             role.includes('manager') || role.includes('reception');
    case 'report':
      // Admin + Manager can see reports
      return ['admin', 'manager'].includes(role) || role.includes('manager');
    case 'all_staff':
      return true;
    default:
      return false;
  }
};

function RequireAuth({ children, level = 'all_staff' }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;

  const user = JSON.parse(localStorage.getItem('vms_user') || '{}');
  if (!hasPermission(user.roleName, level)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-5xl mb-3">🚫</div>
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-gray-500">You don't have permission to view this page.</p>
        <p className="text-gray-400 text-sm mt-1">Your role: <strong>{user.roleName}</strong></p>
      </div>
    );
  }
  return children;
}

function AppLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {!isLoginPage && !isMobile && (
          <div className="w-64 border-r"><Sidebar /></div>
        )}
        {!isLoginPage && isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-10"><MenuIcon /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0"><Sidebar /></SheetContent>
          </Sheet>
        )}
        <main className="flex-1 p-4 bg-gray-50 min-h-screen overflow-auto">
          <Routes>
            <Route path="/login"     element={<Login />} />
            <Route path="/"          element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<RequireAuth level="all_staff"><Dashboard /></RequireAuth>} />

            {/* Admin only */}
            <Route path="/department"         element={<RequireAuth level="staff_manage"><DepartmentPage /></RequireAuth>} />
            <Route path="/department/add"     element={<RequireAuth level="staff_manage"><DepartmentAdd /></RequireAuth>} />
            <Route path="/department/edit/:id" element={<RequireAuth level="staff_manage"><DepartmentEdit /></RequireAuth>} />

            <Route path="/staff"              element={<RequireAuth level="staff_manage"><StaffPage /></RequireAuth>} />
            <Route path="/staff/add"          element={<RequireAuth level="staff_manage"><StaffAdd /></RequireAuth>} />
            <Route path="/staff/edit/:id"     element={<RequireAuth level="staff_manage"><StaffEdit /></RequireAuth>} />

            <Route path="/role"               element={<RequireAuth level="staff_manage"><RoleList /></RequireAuth>} />
            <Route path="/role/add"           element={<RequireAuth level="staff_manage"><RoleAdd /></RequireAuth>} />
            <Route path="/role/edit/:id"      element={<RequireAuth level="staff_manage"><RoleEdit /></RequireAuth>} />

            {/* Admin + Receptionist + Manager */}
            <Route path="/visitor"            element={<RequireAuth level="reception"><VisitorList /></RequireAuth>} />
            <Route path="/visitor/add"        element={<RequireAuth level="reception"><VisitorAdd /></RequireAuth>} />
            <Route path="/visitor/edit/:id"   element={<RequireAuth level="reception"><VisitorEdit /></RequireAuth>} />

            <Route path="/appoint"            element={<RequireAuth level="reception"><AppointList /></RequireAuth>} />
            <Route path="/appoint/add"        element={<RequireAuth level="reception"><AppointAdd /></RequireAuth>} />
            <Route path="/appoint/edit/:id"   element={<RequireAuth level="reception"><AppointEdit /></RequireAuth>} />

            <Route path="/visitor-log"        element={<RequireAuth level="reception"><VisitorLogList /></RequireAuth>} />
            <Route path="/visitor-log/checkin" element={<RequireAuth level="reception"><CheckIn /></RequireAuth>} />

            <Route path="/register" element={<RequireAuth level="staff_manage"><Register /></RequireAuth>} />
            <Route path="/report" element={<RequireAuth level="report"><ReportPage /></RequireAuth>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppLayout />
      </Router>
    </Provider>
  )
}

export default App