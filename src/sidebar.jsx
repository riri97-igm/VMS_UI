import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Building, Shield, User2Icon, Dock, LayoutDashboard, ClipboardList, LogOut, BarChart2, UserPlus } from 'lucide-react';

const SidebarContext = React.createContext({ open: false, setOpen: () => {} });

function SidebarProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

const ROLE_BADGE = {
  admin:        'bg-red-500',
  receptionist: 'bg-blue-500',
  staff:        'bg-gray-500',
  manager:      'bg-purple-500',
};

const getRoleBadgeColor = (role = '') => {
  return ROLE_BADGE[role.toLowerCase()] || 'bg-purple-500';
};

const hasPermission = (userRole, level) => {
  if (!userRole) return false;
  const role = userRole.toLowerCase();
  switch (level) {
    case 'admin_only':   return role === 'admin';
    case 'staff_manage': return role === 'admin';
    case 'reception':
      return ['admin', 'receptionist', 'manager'].includes(role) ||
             role.includes('manager') || role.includes('reception');
    case 'report':
      return ['admin', 'manager'].includes(role) || role.includes('manager');
    case 'all_staff':    return true;
    default:             return false;
  }
};

function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('vms_user') || '{}');
  const role      = user.roleName || '';

  const allLinks = [
    { to:'/dashboard',   label:'Dashboard',        icon:LayoutDashboard, level:'all_staff'    },
    { to:'/visitor-log', label:'Visitor Log',       icon:ClipboardList,   level:'reception'    },
    { to:'/appoint',     label:'Appointments',      icon:Dock,            level:'reception'    },
    { to:'/visitor',     label:'Visitors',          icon:User2Icon,       level:'reception'    },
    { to:'/report',      label:'Reports',           icon:BarChart2,       level:'report'       },
    { to:'/staff',       label:'Staff',             icon:Users,           level:'staff_manage' },
    { to:'/department',  label:'Departments',       icon:Building,        level:'staff_manage' },
    { to:'/role',        label:'Roles',             icon:Shield,          level:'staff_manage' },
    { to:'/register',    label:'Register Account',  icon:UserPlus,        level:'staff_manage' },
  ];

  const links = allLinks.filter(l => hasPermission(role, l.level));

  const handleLogout = () => {
    localStorage.removeItem('vms_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (to) => {
    if (to === '/visitor') {
      return location.pathname === '/visitor' || location.pathname.startsWith('/visitor/');
    }
    return location.pathname === to || location.pathname.startsWith(to + '/');
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
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs text-white ${getRoleBadgeColor(role)}`}>
            {role}
          </span>
        </div>
      )}

      <div className="flex flex-col space-y-1 px-3 flex-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
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