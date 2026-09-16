import { Link } from "react-router-dom";
import { CalendarDays, Mail, Globe, Users2, Heart, Code2 } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Events", to: "/events" },
    { label: "Venues & Vendors", to: "/vendors" },
    { label: "Schedule Builder", to: "/schedule" },
    { label: "Inventory", to: "/inventory" },
    { label: "Promotions", to: "/promotions" },
  ],
  Company: [
    { label: "About Evenza", to: "/#about" },
    { label: "Our Team", to: "/#team" },
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "/contact" },
  ],
  Support: [
    { label: "Documentation", to: "/docs" },
    { label: "Help Center", to: "/help" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ],
};

const socialLinks = [
  { icon: Mail, href: "mailto:hello@evenza.lk", label: "Email" },
  { icon: Code2, href: "https://github.com", label: "GitHub" },
  { icon: Globe, href: "https://twitter.com", label: "Twitter" },
  { icon: Users2, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer id="evenza-footer" className="bg-slate-900 text-slate-300">
      {/* Top CTA Band */}
      <div className="evenza-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
              Ready to plan your next event?
            </h2>
            <p className="text-white/80 mt-1 text-sm">
              Join thousands of event organizers who trust Evenza.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              id="footer-cta-register"
              className="px-6 py-2.5 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              id="footer-cta-login"
              className="px-6 py-2.5 bg-white/10 text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-all border border-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" id="footer-logo-link" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg evenza-gradient flex items-center justify-center">
                <CalendarDays className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
                evenza
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              A centralized web-based event planning platform built for modern event organizers, venues, and vendors. Streamline every step of your event lifecycle.
            </p>
            <p className="text-slate-500 text-xs mt-3">
              SLIIT — SE2030 Software Engineering Project · 2026
            </p>
            {/* Social */}
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  id={`footer-social-${label.toLowerCase()}`}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-white font-semibold text-sm mb-4">{group}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      id={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                      className="text-slate-400 text-sm hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © 2026 Evenza. All rights reserved. Built with{" "}
            <Heart className="w-3 h-3 inline text-red-400" aria-hidden="true" />{" "}
            by Group 2026-Y2-S1-MLB-B10G1-02
          </p>
          <p className="text-slate-600 text-xs">
            Faculty of Computing · SLIIT
          </p>
        </div>
      </div>
    </footer>
  );
}
