import {
  Briefcase,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const quickLinks = ["Home", "About Us", "Events", "Contact Us"];

  const socials = [
    { name: "Facebook", active: false },
    { name: "LinkedIn", active: false },
    { name: "Twitter", active: true },
    { name: "Instagram", active: false },
  ];

  return (
    <footer className="bg-[#111827] text-white py-20 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        
        {/* Top Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* Brand */}
          <div className="max-w-[384px]">
            <div className="flex items-center gap-2 mb-6">
              
              {/* Logo */}
              <div className="w-8 h-8 rounded-md border-2 border-[#6366F1] flex items-center justify-center">
                <Briefcase
                  size={18}
                  className="text-[#6366F1]"
                />
              </div>

              <h2 className="text-3xl font-bold tracking-[-0.6px]">
                EventHub
              </h2>
            </div>

            <p className="text-[#9CA3AF] text-sm leading-[23px]">
              EventHub is your ultimate platform to discover, create,
              and manage unforgettable experiences. From local meetups
              to global festivals, we bring people together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[18px] leading-7 font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#9CA3AF] hover:text-white transition text-[16px]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-[18px] leading-7 font-semibold mb-6">
              Follow Us
            </h3>

            <ul className="flex flex-col">
              {socials.map((social) => (
                <li
                  key={social.name}
                  className="border-b border-[#1F2937] pb-2 mb-4"
                >
                  <a
                    href="#"
                    className={`text-[16px] transition ${
                      social.active
                        ? "text-[#6366F1]"
                        : "text-[#9CA3AF] hover:text-white"
                    }`}
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#1F2937] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <p className="text-sm text-[#6B7280]">
            © 2026 EventHub. All Rights Reserved.
          </p>

          <button className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center hover:bg-indigo-500 transition">
            <ArrowUp
              size={16}
              className="text-white"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}