import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "Modules", to: "/#modules" },
  { label: "About", to: "/#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header
      id="evenza-navbar"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-brand-cream/60/80"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            id="evenza-logo-link"
            className="flex items-center gap-2.5 group"
            aria-label="Evenza Home"
          >
            <div className="w-8 h-8 rounded-lg evenza-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <CalendarDays className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span
              className={cn(
                "text-xl font-bold tracking-tight transition-colors",
                scrolled ? "text-brand-dark" : "text-brand-dark"
              )}
              style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
            >
              ev
              <span className="evenza-text-gradient">enza</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                id={`nav-link-${link.label.toLowerCase()}`}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  scrolled
                    ? "text-brand-teal/80 hover:text-brand-teal hover:bg-brand-cream/20"
                    : "text-brand-teal hover:text-brand-teal hover:bg-white/60"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <button
                  id="notification-bell-btn"
                  aria-label="Notifications"
                  className="relative p-2 rounded-lg text-brand-teal/80 hover:text-brand-teal hover:bg-brand-cream/20 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    id="profile-dropdown-btn"
                    onClick={() => setProfileOpen((p) => !p)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-brand-cream/40 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full evenza-gradient flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="text-sm font-medium text-brand-teal">{user?.name ?? "User"}</span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", profileOpen && "rotate-180")} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-brand-cream/60 py-1.5 z-50">
                      <Link
                        to="/dashboard"
                        id="profile-dashboard-link"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-teal hover:bg-brand-cream/20 hover:text-brand-teal transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        id="profile-settings-link"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-teal hover:bg-brand-cream/20 hover:text-brand-teal transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile Settings
                      </Link>
                      <div className="my-1 border-t border-brand-cream/40" />
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  id="navbar-login-btn"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-brand-teal hover:text-brand-teal hover:bg-brand-cream/20 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  id="navbar-register-btn"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white evenza-gradient hover:opacity-90 shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            className="md:hidden p-2 rounded-lg text-brand-teal/80 hover:bg-brand-cream/40 transition-all"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white/95 backdrop-blur-md border-t border-brand-cream/60 px-4 pb-4"
        >
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                id={`mobile-nav-${link.label.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-brand-teal hover:text-brand-teal hover:bg-brand-cream/20 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-brand-cream/40">
            {isAuthenticated ? (
              <button
                id="mobile-logout-btn"
                onClick={handleLogout}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 text-left"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  id="mobile-login-btn"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-brand-teal bg-brand-cream/40 text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  id="mobile-register-btn"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white evenza-gradient text-center"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
