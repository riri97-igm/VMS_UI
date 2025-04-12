import React from 'react';
import { Link } from 'react-router-dom';
import { Users as FaUsers, Building as FaBuilding, Home } from 'lucide-react';

// SidebarProvider context
const SidebarContext = React.createContext({
  open: false,
  setOpen: () => {},
});

function SidebarProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

function Sidebar() {
  return (
    <div className="bg-sidebar text-sidebar-foreground h-full w-full flex flex-col py-4">
      <div className="px-4 py-2 font-bold text-lg mb-4">VMS System</div>
      <div className="flex flex-col space-y-1 px-3">
        <Link to="/" className="p-2 hover:bg-sidebar-accent rounded-md flex items-center">
          <Home className="mr-2" size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/department" className="p-2 hover:bg-sidebar-accent rounded-md flex items-center">
          <FaBuilding className="mr-2" size={20} />
          <span>Department</span>
        </Link>
        <Link to="/staff" className="p-2 hover:bg-sidebar-accent rounded-md flex items-center">
          <FaUsers className="mr-2" size={20} />
          <span>Staff</span>
        </Link>
      </div>
    </div>
  );
}

export { Sidebar, SidebarProvider, SidebarContext };
