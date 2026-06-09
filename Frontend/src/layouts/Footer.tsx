import { Briefcase, ArrowUp } from "lucide-react"
import { Link } from "react-router-dom"
import Button from "../components/ui/Button"

export default function Footer() {
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Venues", path: "/venues" },
    { label: "Contact Us", path: "/contact" },
  ]

  const socials = [
    { name: "Facebook", active: false },
    { name: "LinkedIn", active: false },
    { name: "Twitter", active: false },
    { name: "Instagram", active: false },
  ]

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
          <div className="col-span-2 md:col-span-1 max-w-[384px]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-md border-2 border-primary flex items-center justify-center">
                <Briefcase size={18} className="text-primary" />
              </div>

              <h2 className="text-3xl font-bold tracking-[-0.6px]">
                EventHub
              </h2>
            </div>

            <p className="text-gray-400 text-sm leading-[23px]">
              EventHub is your ultimate platform to discover, create,
              and manage unforgettable experiences. From local meetups
              to global festivals, we bring people together.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg leading-7 font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(29,161,242,0.8)] transition-all duration-300 text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg leading-7 font-semibold mb-6">
              Follow Us
            </h3>

            <ul className="flex flex-col">
              {socials.map((social) => (
                <li
                  key={social.name}
                  className="border-b border-gray-800 pb-2 mb-4"
                >
                  <a
                    href="#"
                    className={`text-base transition-all duration-300 ${
                      social.active
                        ? "text-primary drop-shadow-[0_0_8px_rgba(29,161,242,0.5)] hover:drop-shadow-[0_0_12px_rgba(29,161,242,0.8)]"
                        : "text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(29,161,242,0.8)]"
                    }`}
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-sm text-text-muted">
            &copy; 2026 EventHub. All Rights Reserved.
          </p>

          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            variant="primary"
            size="sm"
            icon={ArrowUp}
            className="w-8 h-8 !rounded-lg"
            aria-label="Scroll to top"
          />
        </div>
      </div>
    </footer>
  )
}
