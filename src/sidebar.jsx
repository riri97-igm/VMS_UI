import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Building, Shield, User2Icon, Dock, LayoutDashboard, ClipboardList, LogOut } from 'lucide-react';

const SidebarContext = React.createContext({ open: false, setOpen: () => {} });

function SidebarProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

const ROLE_BADGE = { Admin:'bg-red-500', Receptionist:'bg-blue-500', Staff:'bg-gray-500' };

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('vms_user') || '{}');
  const role = user.roleName || '';

  const allLinks = [
    { to:'/dashboard',   label:'Dashboard',    icon:LayoutDashboard, roles:['Admin','Receptionist','Staff'] },
    { to:'/visitor-log', label:'Visitor Log',  icon:ClipboardList,   roles:['Admin','Receptionist'] },
    { to:'/appoint',     label:'Appointments', icon:Dock,            roles:['Admin','Receptionist'] },
    { to:'/visitor',     label:'Visitors',     icon:User2Icon,       roles:['Admin','Receptionist'] },
    { to:'/staff',       label:'Staff',        icon:Users,           roles:['Admin'] },
    { to:'/department',  label:'Departments',  icon:Building,        roles:['Admin'] },
    { to:'/role',        label:'Roles',        icon:Shield,          roles:['Admin'] },
  ];

  const links = allLinks.filter(l => !role || l.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('vms_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-sidebar text-sidebar-foreground h-full w-full flex flex-col py-4">
      <div className="px-4 py-2 font-bold text-lg mb-2 border-b border-gray-700 pb-3">
        <span className="text-blue-400">VMS</span> System
      </div>

      {user.name && (
        <div className="px-4 py-2 border-b border-gray-700 mb-2">
          <p className="text-sm font-semibold truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs text-white ${ROLE_BADGE[role] || 'bg-gray-500'}`}>
            {role}
          </span>
        </div>
      )}

      <div className="flex flex-col space-y-1 px-3 flex-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link key={to} to={to}
              className={`p-2 rounded-md flex items-center transition-colors ${active ? 'bg-blue-600 text-white' : 'hover:bg-sidebar-accent'}`}>
              <Icon className="mr-2" size={18} />
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-3 pt-2 border-t border-gray-700 mt-2">
        <button onClick={handleLogout}
          className="w-full p-2 rounded-md flex items-center text-sm hover:bg-red-600 hover:text-white transition-colors">
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export { Sidebar, SidebarProvider, SidebarContext };