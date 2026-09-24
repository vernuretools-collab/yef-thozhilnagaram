import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun, MapPin, Mail, Phone } from 'lucide-react'
import logo from '../assets/yef.png'

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  // { to: '/chapters', label: 'Chapters' },
  { to: '/members', label: 'Members' },
  { to: '/visit-meeting', label: 'Visit Meeting' },
  // { to: '/events', label: 'Events' },
]

const LOGIN_URL = 'https://app.yef-network.com'

function isMemberProfilePath(pathname) {
  return pathname.startsWith('/members/') && pathname !== '/members/'
}

function pageTabTitle(pathname) {
  if (pathname === '/members') return 'Members - Yaam Economic Forum'
  if (pathname === '/visit-meeting') return 'Visit Meeting - Yaam Economic Forum'
  if (pathname === '/events') return 'Events - Yaam Economic Forum'
  return 'Yaam Economic Forum - Thozhilnagaram'
}

export default function Layout() {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    setMobileOpen(false)
    if (isMemberProfilePath(pathname)) return
    document.title = pageTabTitle(pathname)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-[#0C1535] text-[#111E4F] dark:text-[#DDE3F5] transition-colors">
      {/* Top bar */}
      <div className="hidden sm:block bg-[#1A2B6B] dark:bg-[#0C1535] border-b border-[#2a3460]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-4 text-[11px] text-white">
            <span className="flex items-center gap-1.5">
              <MapPin size={10} /> Thozhilnagaram Chapter
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={10} />
              <a href="mailto:info@yef-network.com" className="hover:underline">
                info@yef-network.com
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={10} /> +91 9940960100
            </span>
          </div>
          <p className="text-[11px] text-[#8899d4] font-medium tracking-wide text-white">
            Connecting Global Economy
          </p>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-[#13192e]/95 border-b border-[#C5CCE8] dark:border-[#2a3460] shadow-[0_1px_8px_rgba(26,43,107,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[64px] sm:h-[68px] gap-2 sm:gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-14 sm:w-20 md:w-24 shrink-0">
              <img
                src={logo}
                alt="Yaam Economic Forum"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="leading-tight min-w-0">
              <p
                className="font-bold text-[11px] sm:text-sm text-[#1A2B6B] dark:text-[#DDE3F5] tracking-wide truncate"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Yaam Economic Forum
              </p>
              <p className="text-[8px] sm:text-[10px] text-[#D0021B] font-semibold uppercase tracking-[0.06em] truncate">
                Connecting Global Economy
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 font-bold ${
                    isActive
                      ? 'text-[#D0021B] bg-[#FDE8EB] dark:bg-[#3d0008]/40 dark:text-[#f87171]'
                      : 'text-gray-900 dark:text-[#8899d4] hover:text-[#1A2B6B] dark:hover:text-[#DDE3F5] hover:bg-[#E8ECF8] dark:hover:bg-[#1c2340]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDark(d => !d)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#C5CCE8] dark:border-[#2a3460] grid place-items-center text-[#6B7280] hover:text-[#1A2B6B] dark:hover:text-[#DDE3F5] bg-white dark:bg-[#1c2340] transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D0021B] hover:bg-[#B00218] text-white text-sm font-bold transition-all shadow-[0_2px_8px_rgba(208,2,27,0.25)] hover:shadow-[0_4px_12px_rgba(208,2,27,0.35)] hover:-translate-y-0.5"
            >
              Login
            </a>

            <button
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center border border-[#C5CCE8] dark:border-[#2a3460] bg-white dark:bg-[#1c2340] text-[#1A2B6B] dark:text-[#8899d4]"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#C5CCE8] dark:border-[#2a3460] bg-white dark:bg-[#13192e] px-4 pb-5 pt-3 flex flex-col gap-1">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#D0021B] bg-[#FDE8EB] dark:bg-[#3d0008]/40 dark:text-[#f87171]'
                      : 'text-[#6B7280] dark:text-[#8899d4] hover:bg-[#E8ECF8] dark:hover:bg-[#1c2340]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center px-4 py-2.5 rounded-full bg-[#D0021B] hover:bg-[#B00218] text-white text-sm font-bold transition-colors"
            >
              Login
            </a>

            <Link
              to="/visit-meeting"
              className="text-center px-4 py-2.5 rounded-full border border-[#C5CCE8] dark:border-[#2a3460] text-[#1A2B6B] dark:text-[#DDE3F5] text-sm font-bold transition-colors"
            >
              Book a Visit
            </Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#C5CCE8] dark:border-[#2a3460]">
        <div className="bg-white dark:bg-[#13192e]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand col */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-20 sm:w-24 shrink-0">
                  <img
                    src={logo}
                    alt="Yaam Economic Forum"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#1A2B6B] dark:text-[#DDE3F5] truncate">
                    Yaam Economic Forum
                  </p>
                  <p className="text-[10px] text-[#D0021B] font-semibold uppercase tracking-wide truncate">
                    Connecting Global Economy
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 font-bold dark:text-[#8899d4] leading-relaxed">
                Building business through trusted referrals and meaningful economic connections across Tamil Nadu and beyond.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p
                className="font-bold text-sm text-[#1A2B6B] dark:text-[#DDE3F5] mb-4 uppercase tracking-[0.08em]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Quick Links
              </p>
              <ul className="space-y-2.5 font-bold text-gray-700 dark:text-[#8899d4]">
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm dark:text-[#8899d4] hover:text-[#D0021B] dark:hover:text-[#f87171] transition-colors font-bold"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p
                className="font-bold text-sm text-[#1A2B6B] dark:text-[#DDE3F5] mb-4 uppercase tracking-[0.08em]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Contact
              </p>
              <ul className="space-y-3">
                {[
                  { icon: MapPin, text: 'Thozhilnagaram Chapter' },
                  { icon: Mail, text: 'info@yef-network.com' },
                  { icon: Phone, text: '+91 9940960100' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-gray-700 font-bold dark:text-[#8899d4]">
                    <div className="w-7 h-7 rounded-lg bg-[#E8ECF8] dark:bg-[#1c2340] flex items-center justify-center flex-shrink-0">
                      <Icon size={12} className="text-[#1A2B6B] dark:text-[#8899d4]" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-[#1A2B6B] dark:bg-[#0C1535] py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-white">
              © {new Date().getFullYear()} Yaam Economic Forum. All rights reserved.
            </p>
            <p className="text-xs text-white font-medium tracking-wide">
              Connecting Global Economy
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}