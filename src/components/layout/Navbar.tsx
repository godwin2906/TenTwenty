import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function Navbar() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-gray-900 tracking-tight">ticktock</span>
        <nav>
          <span className="text-sm font-medium text-gray-500">Timesheets</span>
        </nav>
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
            {session?.user.avatar || session?.user.name.slice(0, 2).toUpperCase()}
          </div>
          <span>{session?.user.name}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="truncate text-sm font-medium text-gray-800">{session?.user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
