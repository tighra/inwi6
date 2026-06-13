import { Link, useLocation } from 'react-router-dom'
import { Home, Film, Tv, Radio } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/shows', label: 'Shows', icon: Tv },
    { to: '/live', label: 'Live', icon: Radio },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark-900/95 backdrop-blur-md border-t border-white/5">
      <div className="flex items-center justify-around py-2">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
              isActive(to)
                ? 'text-accent'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={20} strokeWidth={isActive(to) ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
