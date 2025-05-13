import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './sheet'
import { Button } from './button'
import { MenuIcon } from 'lucide-react'
import { useIsMobile } from './hooks/use-mobile'
import { Sidebar, SidebarProvider } from './sidebar'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DepartmentList from './modules/Department/DepartmentList'
import DepartmentAdd from './modules/Department/DepartmentAdd'
import DepartmentEdit from './modules/Department/DepartmentEdit'
import StaffList from './modules/Staff/StaffList'
import StaffAdd from './modules/Staff/StaffAdd'
import StaffEdit from './modules/Staff/StaffEdit'
import DepartmentPage from './layouts/Department'
import StaffPage from './layouts/Staff'
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {
    const isMobile = useIsMobile()
    const [count, setCount] = useState(0)

    return (
      <Provider store={store}>
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
                  <Route path='/department' element={<DepartmentPage />} />
                  <Route path='/department/add' element={<DepartmentAdd />} />
                  <Route path='/department/edit/:id' element={<DepartmentEdit />} />
                  <Route path='/staff' element={<StaffPage />} />
                  <Route path='/staff/add' element={<StaffAdd />} />
                  <Route path='/staff/edit/:id' element={<StaffEdit />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </Router>
      </Provider>
    )
}

export default App
