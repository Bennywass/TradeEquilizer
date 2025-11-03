'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/trades/search', label: 'Search' },
  { href: '/trades/builder', label: 'Trade Builder' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/wants', label: 'Want List' },
  { href: '/pricing/market', label: 'Pricing' },
]

export function AppNav() {
  const pathname = usePathname()
  return (
    <header className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-base font-semibold">
            TradeEqualizer
          </Link>
          <nav className="hidden gap-4 sm:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default AppNav


