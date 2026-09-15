import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Star,
  Bell,
  Package,
  Megaphone,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  Shield,
  ChevronRight,
  Play,
  TrendingUp,
  BarChart3,
  Award,
  Globe,
  Sparkles,
  Calendar,
  MessageSquare,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ─── STATS DATA ───────────────────────────────────────────────────────────────
const stats = [
  { value: "2,400+", label: "Events Managed", icon: CalendarDays },
  { value: "340+", label: "Venues Listed", icon: MapPin },
  { value: "98%", label: "Satisfaction Rate", icon: Star },
  { value: "60+", label: "Active Vendors", icon: Users },
];

// ─── MODULES DATA ─────────────────────────────────────────────────────────────
const modules = [
  {
    id: "fr1",
    icon: MessageSquare,
    title: "Inquiry & Feedback",
    subtitle: "FR1",
    description:
      "Submit pre-event inquiries with threaded replies, and collect verified post-event ratings with 1–5 star reviews and sentiment analytics.",
    color: "from-blue-500 to-blue-600",
    accentColor: "bg-blue-50 text-blue-600",
    features: ["Threaded inquiry inbox", "Star rating system", "Review verification", "Feedback analytics"],
  },
  {
    id: "fr2",
    icon: CalendarDays,
    title: "Event Lifecycle",
    subtitle: "FR2",
    description:
      "Multi-step event creation wizard with lifecycle tracking from Draft to Completion, with manager approval workflows and budget tracking.",
    color: "from-violet-500 to-violet-600",
    accentColor: "bg-violet-50 text-violet-600",
    features: ["Multi-step wizard", "Lifecycle status tracking", "Manager approvals", "Budget management"],
  },
  {
    id: "fr3",
    icon: MapPin,
    title: "Venue & Vendor Booking",
    subtitle: "FR3",
    description:
      "Real-time availability checking with calendar slot locking to prevent double bookings. Full payment audit log and receipt management.",
    color: "from-emerald-500 to-emerald-600",
    accentColor: "bg-emerald-50 text-emerald-600",
    features: ["Real-time availability", "Calendar slot locking", "Payment tracking", "Booking inbox"],
  },
  {
    id: "fr4",
    icon: Clock,
    title: "Schedule & Activities",
    subtitle: "FR4",
    description:
      "Build interactive event timelines and itineraries. Delegate tasks to staff with deadlines and track execution with kanban-style boards.",
    color: "from-amber-500 to-orange-500",
    accentColor: "bg-amber-50 text-amber-600",
    features: ["Timeline builder", "Kanban task board", "Staff task delegation", "Calendar views"],
  },
  {
    id: "fr5",
    icon: Package,
    title: "Inventory Management",
    subtitle: "FR5",
    description:
      "Track all event equipment and assets with real-time stock levels, automated low-stock alerts, and detailed check-in/check-out logs.",
    color: "from-rose-500 to-rose-600",
    accentColor: "bg-rose-50 text-rose-600",
    features: ["Asset catalog", "Stock allocation", "Return & audit console", "Low-stock alerts"],
  },
  {
    id: "fr6",
    icon: Megaphone,
    title: "Promotions & Ads",
    subtitle: "FR6",
    description:
      "Vendors can launch promotional campaigns with banner ads, discount codes, and track performance with impressions and click-through analytics.",
    color: "from-pink-500 to-fuchsia-600",
    accentColor: "bg-pink-50 text-pink-600",
    features: ["Campaign wizard", "Banner carousel", "Promo code badges", "Click analytics"],
  },
];

// ─── FEATURES DATA ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "WebSocket-powered live notifications, calendar locks, and stock alerts keep your team perfectly synchronized.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "6 distinct stakeholder roles — Admin, Customer, Manager, Vendor, Inventory Staff, and Guest — each with tailored dashboards.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Export PDF/CSV reports for bookings, inventory, and feedback. Track event performance with visual data charts.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Globe,
    title: "Centralized Platform",
    description: "One platform for all stakeholders — no more WhatsApp chains or spreadsheets. Everything is connected and synchronized.",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
];

// ─── ROLES DATA ───────────────────────────────────────────────────────────────
const roles = [
  { role: "Customer", icon: Users, desc: "Create events, book venues & vendors, track timelines and payments.", color: "bg-blue-600" },
  { role: "Event Manager", icon: CheckCircle2, desc: "Approve event plans, build schedules, assign tasks to operational staff.", color: "bg-violet-600" },
  { role: "Vendor", icon: Star, desc: "List services, manage bookings, run promotional ad campaigns.", color: "bg-emerald-600" },
  { role: "Inventory Staff", icon: Package, desc: "Catalog assets, allocate stock to events, and process returns.", color: "bg-amber-600" },
  { role: "Guest", icon: Calendar, desc: "View event agendas, RSVP, submit post-event feedback and ratings.", color: "bg-rose-600" },
  { role: "Administrator", icon: Shield, desc: "Full platform governance, user management, audit logs, and analytics.", color: "bg-slate-700" },
];

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Amal Perera",
    role: "Corporate Event Manager",
    avatar: "AP",
    rating: 5,
    quote: "Evenza transformed how we coordinate large-scale corporate conferences. The real-time booking lock alone saved us from three double-booking disasters.",
    color: "bg-blue-600",
  },
  {
    name: "Renu Fernando",
    role: "Wedding Planner",
    avatar: "RF",
    rating: 5,
    quote: "The vendor directory and timeline builder make planning a 300-guest wedding feel effortless. My clients love the transparency of the booking status tracker.",
    color: "bg-violet-600",
  },
  {
    name: "Kavinda Mendis",
    role: "Catering Vendor",
    avatar: "KM",
    rating: 5,
    quote: "As a vendor, the promotional campaign tool has increased my bookings by 40%. The promo code integration during checkout is brilliant.",
    color: "bg-emerald-600",
  },
];

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", isVisible }) {
  const [count, setCount] = useState(0);
  const numTarget = parseInt(target.replace(/\D/g, ""), 10);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(numTarget / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= numTarget) {
        setCount(numTarget);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, numTarget]);

  return (
    <span>
      {count.toLocaleString()}
      {target.replace(/[\d,]/g, "")}
    </span>
  );
}

// ─── USE INTERSECTION OBSERVER ────────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── HOMEPAGE COMPONENT ───────────────────────────────────────────────────────
export default function HomePage() {
  const [statsRef, statsInView] = useInView(0.2);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <main id="evenza-homepage" className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        aria-label="Hero section"
        className="hero-bg relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden"
      >
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left — Text Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-5 animate-fade-in-up">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Centralized Event Planning Platform
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-5"
                style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
              >
                Plan Events{" "}
                <span className="evenza-text-gradient">Smarter,</span>
                <br />
                Deliver Them{" "}
                <span className="evenza-text-gradient">Flawlessly.</span>
              </h1>

              <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Evenza is the all-in-one web platform that unifies event creation, venue bookings, vendor coordination, schedule management, inventory tracking, and promotions — in one seamless workflow.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link
                  to="/register"
                  id="hero-primary-cta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold evenza-gradient hover:opacity-90 shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Start Planning Free
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/#features"
                  id="hero-secondary-cta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-slate-700 font-semibold bg-white border border-slate-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all text-sm"
                >
                  <Play className="w-4 h-4" aria-hidden="true" />
                  See How It Works
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start flex-wrap">
                {["No credit card required", "RBAC secured", "Real-time sync"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero Card Dashboard Preview */}
            <div className="flex-1 w-full max-w-md lg:max-w-none lg:w-auto animate-float">
              <div className="relative">
                {/* Main Card */}
                <div className="glass-card rounded-2xl p-5 shadow-2xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500">{today}</p>
                      <h3 className="text-sm font-bold text-slate-800">Event Dashboard</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-emerald-600 font-medium">Live</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Events", value: "12", delta: "+2", color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Bookings", value: "34", delta: "+7", color: "text-violet-600", bg: "bg-violet-50" },
                      { label: "Tasks", value: "8", delta: "-3", color: "text-amber-600", bg: "bg-amber-50" },
                    ].map((s) => (
                      <div key={s.label} className={cn("rounded-xl p-3", s.bg)}>
                        <p className="text-[10px] text-slate-500 mb-0.5">{s.label}</p>
                        <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">{s.delta} today</p>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming Events List */}
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Upcoming Events</p>
                    {[
                      { name: "Annual Tech Conference", date: "Sep 20", status: "Approved", statusColor: "text-emerald-600 bg-emerald-50" },
                      { name: "Charity Gala Night", date: "Oct 2", status: "Pending", statusColor: "text-amber-600 bg-amber-50" },
                      { name: "Product Launch Party", date: "Oct 15", status: "Draft", statusColor: "text-slate-500 bg-slate-100" },
                    ].map((event) => (
                      <div
                        key={event.name}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-100 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg evenza-gradient flex items-center justify-center">
                            <CalendarDays className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700 leading-tight">{event.name}</p>
                            <p className="text-[10px] text-slate-400">{event.date}</p>
                          </div>
                        </div>
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", event.statusColor)}>
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Notification Card */}
                <div className="absolute -top-4 -right-4 glass-card rounded-xl px-3.5 py-3 shadow-lg animate-float-delay max-w-[180px]">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center mt-0.5 shrink-0">
                      <Bell className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-800">Booking Confirmed</p>
                      <p className="text-[9px] text-slate-500">Grand Ballroom · Sep 20</p>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Card */}
                <div className="absolute -bottom-4 -left-4 glass-card rounded-xl px-3.5 py-3 shadow-lg max-w-[170px]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" aria-hidden="true" />
                    <div>
                      <p className="text-[10px] text-slate-500">Satisfaction</p>
                      <p className="text-sm font-bold text-slate-800">98.4%</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[98%] evenza-gradient rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section id="stats" aria-label="Platform statistics" ref={statsRef} className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-2xl evenza-gradient-subtle flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                </div>
                <p className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
                  <AnimatedCounter target={value} isVisible={statsInView} />
                </p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section id="features" aria-label="Platform features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-4">
              Why Evenza
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
            >
              Everything You Need,{" "}
              <span className="evenza-text-gradient">Nothing You Don't</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base">
              Evenza replaces fragmented communication channels with a powerful, integrated system designed for modern event professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const FeatIcon = feat.icon;
              return (
              <div
                key={feat.title}
                id={`feature-card-${idx}`}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", feat.bg)}>
                  <FeatIcon className={cn("w-6 h-6", feat.color)} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1.5">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MODULES SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section id="modules" aria-label="Core modules" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-semibold border border-violet-100 mb-4">
              6 Integrated Modules
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
            >
              One Platform,{" "}
              <span className="evenza-text-gradient">Six Superpowers</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base">
              Each module is purpose-built for a specific phase of event planning, all woven together into a unified system.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Module Tabs */}
            <div className="lg:w-72 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 shrink-0">
              {modules.map((mod, idx) => {
                const ModIcon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    id={`module-tab-${mod.id}`}
                    onClick={() => setActiveModuleIdx(idx)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all shrink-0 lg:shrink border",
                      activeModuleIdx === idx
                        ? "bg-white border-blue-200 shadow-md text-slate-900"
                        : "bg-slate-50 border-transparent hover:border-slate-200 text-slate-600 hover:text-slate-800"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      activeModuleIdx === idx ? `bg-gradient-to-br ${mod.color}` : "bg-slate-200"
                    )}>
                      <ModIcon className={cn("w-4 h-4", activeModuleIdx === idx ? "text-white" : "text-slate-500")} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 font-medium">{mod.subtitle}</p>
                      <p className="text-sm font-semibold truncate">{mod.title}</p>
                    </div>
                    {activeModuleIdx === idx && (
                      <ChevronRight className="w-4 h-4 text-blue-500 ml-auto shrink-0 hidden lg:block" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Module Detail Card */}
            {modules[activeModuleIdx] && (() => {
              const ActiveModIcon = modules[activeModuleIdx].icon;
              return (
              <div
                key={modules[activeModuleIdx].id}
                className="flex-1 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-8 shadow-sm animate-fade-in-up"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br", modules[activeModuleIdx].color)}>
                    <ActiveModIcon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <span className={cn("inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1", modules[activeModuleIdx].accentColor)}>
                      {modules[activeModuleIdx].subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
                      {modules[activeModuleIdx].title}
                    </h3>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {modules[activeModuleIdx].description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {modules[activeModuleIdx].features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                      {feat}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3">
                  <Link
                    to="/register"
                    id={`module-cta-${modules[activeModuleIdx].id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
                  >
                    Get Access <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <span className="text-xs text-slate-400">Free to start • No card required</span>
                </div>
              </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ROLES SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section id="roles" aria-label="Stakeholder roles" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-100 mb-4">
              Role-Based Access
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
            >
              Built for{" "}
              <span className="evenza-text-gradient">Every Stakeholder</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base">
              Six tailored dashboards ensure every participant — from event creator to guest — has exactly the tools they need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.map((r, idx) => {
              const RoleIcon = r.icon;
              return (
              <div
                key={r.role}
                id={`role-card-${r.role.toLowerCase().replace(/\s/g, "-")}`}
                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", r.color)}>
                    <RoleIcon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-slate-800">{r.role}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section id="testimonials" aria-label="Testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100 mb-4">
              Trusted by Professionals
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
            >
              What Our Users{" "}
              <span className="evenza-text-gradient">Are Saying</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                id={`testimonial-card-${idx}`}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold", t.color)}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT / TECH STACK SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section id="about" aria-label="About Evenza" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left — text */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 mb-4">
                About the Project
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-slate-900 mb-5"
                style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
              >
                Built on a{" "}
                <span className="evenza-text-gradient">Modern Stack</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Evenza is an academic software engineering project developed by a team of 6 Full-Stack Developers at SLIIT as part of the SE2030 module. The platform leverages cutting-edge technologies to deliver a production-quality event management system.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "React 19 + Vite", desc: "SPA frontend" },
                  { label: "Spring Boot 3", desc: "Java backend" },
                  { label: "Tailwind CSS v4", desc: "Utility-first styling" },
                  { label: "shadcn/ui + Radix", desc: "Accessible UI primitives" },
                  { label: "PostgreSQL 15+", desc: "Relational database" },
                  { label: "JWT + Spring Security", desc: "Stateless auth" },
                  { label: "WebSocket + STOMP", desc: "Real-time updates" },
                  { label: "React Hook Form + Zod", desc: "Form validation" },
                ].map((tech) => (
                  <div key={tech.label} className="flex items-start gap-2 bg-white rounded-xl p-3 border border-slate-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{tech.label}</p>
                      <p className="text-[11px] text-slate-500">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Team Card */}
            <div className="flex-1 w-full max-w-sm mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl evenza-gradient flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">SLIIT SE2030 · 2026</p>
                    <p className="text-sm font-bold text-slate-800">Group B10G1-02</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Chathuranga B.G.", id: "IT25101514", module: "Inquiry & Feedback" },
                    { name: "Suriyage O.W.", id: "IT25100916", module: "Event Management" },
                    { name: "Gunasekara N.B.", id: "IT25102923", module: "Venue & Bookings" },
                    { name: "Wickramarathna W.L.S.", id: "IT25102322", module: "Schedule & Activities" },
                    { name: "Keshavan M.", id: "IT25103301", module: "Inventory" },
                    { name: "Wickramasinghage C.P.W.", id: "IT25100220", module: "Promotions & Ads" },
                  ].map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full evenza-gradient-subtle border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                        {member.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-400">{member.module} · {member.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section id="cta" aria-label="Call to action" className="py-20 relative overflow-hidden">
        <div className="evenza-gradient absolute inset-0" aria-hidden="true" />
        {/* Decorative grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-5"
            style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
          >
            Ready to Elevate Your Events?
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
            Join Evenza and experience the future of centralized event planning. No spreadsheets. No silos. Just seamless coordination.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              id="cta-final-register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Start Planning for Free
            </Link>
            <Link
              to="/login"
              id="cta-final-login"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 border border-white/20 transition-all"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              Sign In
            </Link>
          </div>
          <p className="text-white/50 text-xs mt-6">
            SLIIT Faculty of Computing · SE2030 Software Engineering · 2026
          </p>
        </div>
      </section>

    </main>
  );
}
