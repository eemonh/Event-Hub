import { useState, useEffect } from "react"
import { NavLink, Link } from "react-router-dom"
import { ArrowRight, BriefcaseBusiness, Menu, X } from "lucide-react"
import { navLinks } from "../data/navigation"

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { 
    if (!isMobileOpen) return
    const onKey = (e) => {
      if (e.key === "Escape") setIsMobileOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isMobileOpen])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMobileOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-[81px] border-b border-border-light backdrop-blur-[6px] transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 shadow-sm"
            : "bg-white/80"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <BriefcaseBusiness size={32} strokeWidth={2.66667} className="text-primary" />
            </div>
            <span className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-text-primary">
              EventHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-[16px] leading-6 transition-colors ${
                    isActive
                      ? "font-medium text-text-primary"
                      : "font-normal text-text-muted hover:text-text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            to="/register"
            className="hidden md:flex h-[44px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-[10px] text-white shadow-sm transition-all hover:bg-primary-hover text-[16px] font-medium leading-6"
          >
            <span>Register</span>
            <ArrowRight size={16} strokeWidth={1.33333} />
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:opacity-0 md:pointer-events-none ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 md:translate-x-full ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex justify-end">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:text-text-primary transition-colors"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex h-12 items-center rounded-lg px-4 text-[16px] leading-6 transition-colors ${
                    isActive
                      ? "font-medium text-text-primary bg-gray-100"
                      : "font-normal text-text-muted hover:text-text-primary hover:bg-gray-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto">
            <Link
              to="/register"
              onClick={() => setIsMobileOpen(false)}
              className="flex h-[44px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-[10px] text-white shadow-sm transition-all hover:bg-primary-hover text-[16px] font-medium leading-6"
            >
              <span>Register</span>
              <ArrowRight size={16} strokeWidth={1.33333} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
