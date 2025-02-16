'use client'
import { useState } from "react"
import { useAuth } from "@/lib/authContext"
import { useRouter, usePathname } from "next/navigation"
import { Home, LogOut, ClipboardList, UserPlus, Menu, X, PlusCircle, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  icon: LucideIcon;
  text: string;
  onClick: () => void;
  className?: string;
  path?: string;
}

const Sidebar = () => {
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const toggleSidebar = () => setIsOpen(!isOpen)
  const toggleAddVisit = () => setIsAddVisitOpen(!isAddVisitOpen)

  const NavItem = ({ icon: Icon, text, onClick, className = "", path }: NavItemProps) => {
    const isSelected = path ? pathname === path : false;
    
    return (
      <li>
        <button
          onClick={onClick}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg text-gray-700",
            isSelected ? "bg-black text-white" : "hover:bg-gray-100",
            className
          )}
        >
          <Icon className="h-5 w-5 ml-2" />
          <span>{text}</span>
        </button>
      </li>
    )
  }

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen bg-white shadow-lg fixed top-0 right-0 z-50 transition-all duration-300 ease-in-out",
          "w-64 md:w-64",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-center text-primary">أداء</h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              <NavItem 
                icon={PlusCircle} 
                text="تقييم معلم" 
                onClick={() => router.push("/add-eval")}
                path="/add-eval"
              />
              <NavItem
                icon={PlusCircle}
                text="إضافة زيارة"
                onClick={toggleAddVisit}
                className=" hover:bg-primary-dark"
              />
              {isAddVisitOpen && (
                <ul className="mr-6 mt-2 space-y-2 border-r-2 border-gray-200 pr-2">
                  <NavItem 
                    icon={Home} 
                    text="زيارة صفية" 
                    onClick={() => router.push("/add-class-visit")}
                    path="/add-class-visit"
                  />
                  <NavItem 
                    icon={Home} 
                    text="زيارة لا صفية" 
                    onClick={() => router.push("/add-non-class-visit")}
                    path="/add-non-class-visit"
                  />
                </ul>
              )}
              <NavItem 
                icon={ClipboardList} 
                text="سجل التقييمات" 
                onClick={() => router.push("/evaluations")}
                path="/evaluations"
              />
              <NavItem 
                icon={ClipboardList} 
                text="سجل الزيارات" 
                onClick={() => router.push("/visits")}
                path="/visits"
              />
              <NavItem 
                icon={UserPlus} 
                text="إضافة إداري" 
                onClick={() => router.push("/add-admin")}
                path="/add-admin"
              />
              <NavItem 
                icon={UserPlus} 
                text="إضافة معلم" 
                onClick={() => router.push("/add-teacher")}
                path="/add-teacher"
              />
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-red-600"
            >
              <LogOut className="h-5 w-5 ml-2" />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar