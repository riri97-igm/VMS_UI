import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './sheet'
import { Button } from './button'
import { MenuIcon } from 'lucide-react'
import { useIsMobile } from './hooks/use-mobile'  // Updated import path
import { Sidebar, SidebarProvider } from './sidebar'  // Import SidebarProvider
import './App.css'

function App() {
  const isMobile = useIsMobile()
  const [count, setCount] = useState(0)

  return (
    <SidebarProvider>  {/* Wrap everything in SidebarProvider */}
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
              <Button variant="ghost" size="icon" className="fixed left-4 top-4">
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
          <div>
            <h1>Vite + React</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App
