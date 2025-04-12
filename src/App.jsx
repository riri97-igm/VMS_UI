import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './sheet'
import { Button } from './button'
import { MenuIcon } from 'lucide-react'
import { useIsMobile } from './hooks/use-mobile'
import { Sidebar, SidebarProvider } from './sidebar'
import './App.css'
import DepartmentList from './modules/Department/DepartmentList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DepartmentAdd from './modules/Department/DepartmentAdd'
import DepartmentPage from './layouts/Department'

function App() {
    const isMobile = useIsMobile()
    const [count, setCount] = useState(0)

    return (
      <Router>
        <SidebarProvider>
          <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            {!isMobile && (
              <div className="w-64 border-r">
                <Sidebar />
              </div>
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-10">
                    <MenuIcon />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4">
              <Routes>
                <Route path='/' element={<div>Dashboard Content</div>} />
                <Route path='/department' element={<DepartmentPage />} />
                <Route path='/department/add' element={<DepartmentAdd />} />
                <Route path='/staff' element={<div>Staff Management</div>} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </Router>
    )
}

export default App
