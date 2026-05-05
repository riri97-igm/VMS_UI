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

function RequireAuth({ children, roles }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles) {
    const user = JSON.parse(localStorage.getItem('vms_user') || '{}');
    if (!roles.includes(user.roleName)) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-5xl mb-3">🚫</div>
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to view this page.</p>
        </div>
      );
    }
  }
  return children;
}

function App() {
  const isMobile = useIsMobile()

  return (
    <Provider store={store}>
      <Router>
        <SidebarProvider>
          <div className="flex min-h-screen">
            {!isMobile && <div className="w-64 border-r"><Sidebar /></div>}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-10"><MenuIcon /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0"><Sidebar /></SheetContent>
              </Sheet>
            )}
            <main className="flex-1 p-4 bg-gray-50 min-h-screen overflow-auto">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

                <Route path="/department" element={<RequireAuth roles={['Admin']}><DepartmentPage /></RequireAuth>} />
                <Route path="/department/add" element={<RequireAuth roles={['Admin']}><DepartmentAdd /></RequireAuth>} />
                <Route path="/department/edit/:id" element={<RequireAuth roles={['Admin']}><DepartmentEdit /></RequireAuth>} />

                <Route path="/staff" element={<RequireAuth roles={['Admin']}><StaffPage /></RequireAuth>} />
                <Route path="/staff/add" element={<RequireAuth roles={['Admin']}><StaffAdd /></RequireAuth>} />
                <Route path="/staff/edit/:id" element={<RequireAuth roles={['Admin']}><StaffEdit /></RequireAuth>} />

                <Route path="/role" element={<RequireAuth roles={['Admin']}><RoleList /></RequireAuth>} />
                <Route path="/role/add" element={<RequireAuth roles={['Admin']}><RoleAdd /></RequireAuth>} />
                <Route path="/role/edit/:id" element={<RequireAuth roles={['Admin']}><RoleEdit /></RequireAuth>} />

                <Route path="/visitor" element={<RequireAuth roles={['Admin','Receptionist']}><VisitorList /></RequireAuth>} />
                <Route path="/visitor/add" element={<RequireAuth roles={['Admin','Receptionist']}><VisitorAdd /></RequireAuth>} />
                <Route path="/visitor/edit/:id" element={<RequireAuth roles={['Admin','Receptionist']}><VisitorEdit /></RequireAuth>} />

                <Route path="/appoint" element={<RequireAuth roles={['Admin','Receptionist']}><AppointList /></RequireAuth>} />
                <Route path="/appoint/add" element={<RequireAuth roles={['Admin','Receptionist']}><AppointAdd /></RequireAuth>} />
                <Route path="/appoint/edit/:id" element={<RequireAuth roles={['Admin','Receptionist']}><AppointEdit /></RequireAuth>} />

                <Route path="/visitor-log" element={<RequireAuth roles={['Admin','Receptionist']}><VisitorLogList /></RequireAuth>} />
                <Route path="/visitor-log/checkin" element={<RequireAuth roles={['Admin','Receptionist']}><CheckIn /></RequireAuth>} />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </Router>
    </Provider>
  )
}

export default App