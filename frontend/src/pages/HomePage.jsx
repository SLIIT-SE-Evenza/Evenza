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
    solidBg: "bg-brand-teal",
    accentColor: "bg-brand-cream/20 text-brand-teal",
    features: ["Threaded inquiry inbox", "Star rating system", "Review verification", "Feedback analytics"],
  },
  {
    id: "fr2",
    icon: CalendarDays,
    title: "Event Lifecycle",
    subtitle: "FR2",
    description:
      "Multi-step event creation wizard with lifecycle tracking from Draft to Completion, with manager approval workflows and budget tracking.",
    solidBg: "bg-brand-dark",
    accentColor: "bg-brand-cream/30 text-brand-dark",
    features: ["Multi-step wizard", "Lifecycle status tracking", "Manager approvals", "Budget management"],
  },
  {
    id: "fr3",
    icon: MapPin,
    title: "Venue & Vendor Booking",
    subtitle: "FR3",
    description:
      "Real-time availability checking with calendar slot locking to prevent double bookings. Full payment audit log and receipt management.",
    solidBg: "bg-brand-orange",
    accentColor: "bg-brand-cream/30 text-brand-orange",
    features: ["Real-time availability", "Calendar slot locking", "Payment tracking", "Booking inbox"],
  },
  {
    id: "fr4",
    icon: Clock,
    title: "Schedule & Activities",
    subtitle: "FR4",
    description:
      "Build interactive event timelines and itineraries. Delegate tasks to staff with deadlines and track execution with kanban-style boards.",
    solidBg: "bg-brand-teal/90",
    accentColor: "bg-brand-cream/30 text-brand-teal",
    features: ["Timeline builder", "Kanban task board", "Staff task delegation", "Calendar views"],
  },
  {
    id: "fr5",
    icon: Package,
    title: "Inventory Management",
    subtitle: "FR5",
    href: "http://localhost:8080/inventory/index.html",
    description:
      "Track all event equipment and assets with real-time stock levels, automated low-stock alerts, and detailed check-in/check-out logs.",
    solidBg: "bg-brand-dark/90",
    accentColor: "bg-brand-cream/30 text-brand-dark/90",
    features: ["Asset catalog", "Stock allocation", "Return & audit console", "Low-stock alerts"],
  },
  {
    id: "fr6",
    icon: Megaphone,
    title: "Promotions & Ads",
    subtitle: "FR6",
    description:
      "Vendors can launch promotional campaigns with banner ads, discount codes, and track performance with impressions and click-through analytics.",
    solidBg: "bg-brand-teal",
    accentColor: "bg-brand-cream/20 text-brand-teal",
    features: ["Campaign wizard", "Banner carousel", "Promo code badges", "Click analytics"],
  },
];

// ─── FEATURES DATA ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "WebSocket-powered live notifications, calendar locks, and stock alerts keep your team perfectly synchronized.",
    color: "text-brand-teal/90",
    bg: "bg-brand-cream/30",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "6 distinct stakeholder roles — Admin, Customer, Manager, Vendor, Inventory Staff, and Guest — each with tailored dashboards.",
    color: "text-brand-teal/80",
    bg: "bg-brand-cream/20",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Export PDF/CSV reports for bookings, inventory, and feedback. Track event performance with visual data charts.",
    color: "text-brand-cream/300",
    bg: "bg-brand-cream/30",
  },
  {
    icon: Globe,
    title: "Centralized Platform",
    description: "One platform for all stakeholders — no more WhatsApp chains or spreadsheets. Everything is connected and synchronized.",
    color: "text-brand-cream/300",
    bg: "bg-brand-cream/30",
  },
];

// ─── ROLES DATA ───────────────────────────────────────────────────────────────
const roles = [
  { role: "Customer", icon: Users, desc: "Create events, book venues & vendors, track timelines and payments.", color: "bg-brand-teal" },
  { role: "Event Manager", icon: CheckCircle2, desc: "Approve event plans, build schedules, assign tasks to operational staff.", color: "bg-brand-dark" },
  { role: "Vendor", icon: Star, desc: "List services, manage bookings, run promotional ad campaigns.", color: "bg-brand-orange" },
  { role: "Inventory Staff", icon: Package, desc: "Catalog assets, allocate stock to events, and process returns.", color: "bg-brand-teal" },
  { role: "Guest", icon: Calendar, desc: "View event agendas, RSVP, submit post-event feedback and ratings.", color: "bg-brand-dark/90" },
  { role: "Administrator", icon: Shield, desc: "Full platform governance, user management, audit logs, and analytics.", color: "bg-brand-teal" },
];

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Amal Perera",
    role: "Corporate Event Manager",
    avatar: "AP",
    rating: 5,
    quote: "Evenza transformed how we coordinate large-scale corporate conferences. The real-time booking lock alone saved us from three double-booking disasters.",
    color: "bg-brand-teal",
  },
  {
    name: "Renu Fernando",
    role: "Wedding Planner",
    avatar: "RF",
    rating: 5,
    quote: "The vendor directory and timeline builder make planning a 300-guest wedding feel effortless. My clients love the transparency of the booking status tracker.",
    color: "bg-brand-dark",
  },
  {
    name: "Kavinda Mendis",
    role: "Catering Vendor",
    avatar: "KM",
    rating: 5,
    quote: "As a vendor, the promotional campaign tool has increased my bookings by 40%. The promo code integration during checkout is brilliant.",
    color: "bg-brand-orange",
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
        {/* Subtle dot pattern accent (no gradient) */}
        <div
          aria-hidden="true"
          className="absolute top-10 right-0 w-64 h-64 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #1e293b 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left — Text Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cream/20 border border-brand-cream/60 text-brand-teal text-xs font-semibold mb-5 animate-fade-in-up">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Centralized Event Planning Platform
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-5"
                style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
              >
                Plan Events{" "}
                <span className="evenza-text-gradient">Smarter,</span>
                <br />
                Deliver Them{" "}
                <span className="evenza-text-gradient">Flawlessly.</span>
              </h1>

              <p className="text-brand-teal/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Evenza is the all-in-one web platform that unifies event creation, venue bookings, vendor coordination, schedule management, inventory tracking, and promotions — in one seamless workflow.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link
                  to="/register"
                  id="hero-primary-cta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold bg-brand-teal hover:bg-brand-dark shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Start Planning Free
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/#features"
                  id="hero-secondary-cta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-brand-teal font-semibold bg-white border border-brand-cream/60 hover:border-brand-cream/80 hover:text-brand-teal hover:bg-brand-cream/20 shadow-sm hover:shadow-md transition-all text-sm"
                >
                  <Play className="w-4 h-4" aria-hidden="true" />
                  See How It Works
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start flex-wrap">
                {["No credit card required", "RBAC secured", "Real-time sync"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-brand-cream/200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-cream/300" aria-hidden="true" />
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
                      <p className="text-xs text-brand-cream/200">{today}</p>
                      <h3 className="text-sm font-bold text-brand-teal">Event Dashboard</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-brand-orange font-medium">Live</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Events", value: "12", delta: "+2", color: "text-brand-teal", bg: "bg-brand-cream/20" },
                      { label: "Bookings", value: "34", delta: "+7", color: "text-brand-dark", bg: "bg-brand-cream/30" },
                      { label: "Tasks", value: "8", delta: "-3", color: "text-brand-teal", bg: "bg-brand-cream/30" },
                    ].map((s) => (
                      <div key={s.label} className={cn("rounded-xl p-3", s.bg)}>
                        <p className="text-[10px] text-brand-cream/200 mb-0.5">{s.label}</p>
                        <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                        <p className="text-[10px] text-brand-orange font-medium">{s.delta} today</p>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming Events List */}
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Upcoming Events</p>
                    {[
                      { name: "Annual Tech Conference", date: "Sep 20", status: "Approved", statusColor: "text-brand-orange bg-brand-cream/30" },
                      { name: "Charity Gala Night", date: "Oct 2", status: "Pending", statusColor: "text-brand-teal bg-brand-cream/30" },
                      { name: "Product Launch Party", date: "Oct 15", status: "Draft", statusColor: "text-brand-cream/200 bg-brand-cream/40" },
                    ].map((event) => (
                      <div
                        key={event.name}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-brand-cream/20 border border-brand-cream/40 hover:border-brand-cream/60 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-brand-teal flex items-center justify-center">
                            <CalendarDays className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-brand-teal leading-tight">{event.name}</p>
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
                      <Bell className="w-3 h-3 text-brand-orange" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-brand-teal">Booking Confirmed</p>
                      <p className="text-[9px] text-brand-cream/200">Grand Ballroom · Sep 20</p>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Card */}
                <div className="absolute -bottom-4 -left-4 glass-card rounded-xl px-3.5 py-3 shadow-lg max-w-[170px]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-teal" aria-hidden="true" />
                    <div>
                      <p className="text-[10px] text-brand-cream/200">Satisfaction</p>
                      <p className="text-sm font-bold text-brand-teal">98.4%</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-brand-cream/40 overflow-hidden">
                    <div className="h-full w-[98%] bg-brand-teal rounded-full" />
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
      <section id="stats" aria-label="Platform statistics" ref={statsRef} className="py-16 bg-white border-y border-brand-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-2xl bg-brand-cream/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-brand-teal" aria-hidden="true" />
                </div>
                <p className="text-3xl font-bold text-brand-dark" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
                  <AnimatedCounter target={value} isVisible={statsInView} />
                </p>
                <p className="text-sm text-brand-cream/200 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section id="features" aria-label="Platform features" className="py-20 bg-brand-cream/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-cream/20 text-brand-teal text-xs font-semibold border border-brand-cream/60 mb-4">
              Why Evenza
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-brand-dark mb-4"
              style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
            >
              Everything You Need,{" "}
              <span className="evenza-text-gradient">Nothing You Don't</span>
            </h2>
            <p className="text-brand-teal/80 max-w-xl mx-auto text-base">
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
                className="group bg-white rounded-2xl p-6 border border-brand-cream/60 hover:border-brand-cream/80 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", feat.bg)}>
                  <FeatIcon className={cn("w-6 h-6", feat.color)} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-teal mb-1.5">{feat.title}</h3>
                  <p className="text-sm text-brand-teal/80 leading-relaxed">{feat.description}</p>
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
            <span className="inline-block px-3 py-1 rounded-full bg-brand-cream/30 text-brand-dark text-xs font-semibold border border-violet-100 mb-4">
              6 Integrated Modules
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-brand-dark mb-4"
              style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
            >
              One Platform,{" "}
              <span className="evenza-text-gradient">Six Superpowers</span>
            </h2>
            <p className="text-brand-teal/80 max-w-xl mx-auto text-base">
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
                        ? "bg-white border-brand-cream/80 shadow-md text-brand-dark"
                        : "bg-brand-cream/20 border-transparent hover:border-brand-cream/60 text-brand-teal/80 hover:text-brand-teal"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      activeModuleIdx === idx ? mod.solidBg : "bg-brand-cream/60"
                    )}>
                      <ModIcon className={cn("w-4 h-4", activeModuleIdx === idx ? "text-white" : "text-brand-cream/200")} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 font-medium">{mod.subtitle}</p>
                      <p className="text-sm font-semibold truncate">{mod.title}</p>
                    </div>
                    {activeModuleIdx === idx && (
                      <ChevronRight className="w-4 h-4 text-brand-teal/80 ml-auto shrink-0 hidden lg:block" aria-hidden="true" />
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
                className="flex-1 bg-brand-cream/20 rounded-2xl border border-brand-cream/60 p-8 shadow-sm animate-fade-in-up"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", modules[activeModuleIdx].solidBg)}>
                    <ActiveModIcon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <span className={cn("inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1", modules[activeModuleIdx].accentColor)}>
                      {modules[activeModuleIdx].subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-brand-dark" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
                      {modules[activeModuleIdx].title}
                    </h3>
                  </div>
                </div>
                <p className="text-brand-teal/80 leading-relaxed mb-6">
                  {modules[activeModuleIdx].description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {modules[activeModuleIdx].features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-sm text-brand-teal">
                      <CheckCircle2 className="w-4 h-4 text-brand-cream/300 shrink-0" aria-hidden="true" />
                      {feat}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-brand-cream/40 flex items-center gap-3">
                  {modules[activeModuleIdx].href ? (
                    <a
                      href={modules[activeModuleIdx].href}
                      id={`module-cta-${modules[activeModuleIdx].id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-teal hover:bg-brand-dark transition-all shadow-sm hover:shadow-md"
                    >
                      Open Inventory <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      to="/register"
                      id={`module-cta-${modules[activeModuleIdx].id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-teal hover:bg-brand-dark transition-all shadow-sm hover:shadow-md"
                    >
                      Get Access <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  )}
                  <span className="text-xs text-slate-400">
                    {modules[activeModuleIdx].href
                      ? "Available to authorized inventory users"
                      : "Free to start • No card required"}
                  </span>
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
      <section id="roles" aria-label="Stakeholder roles" className="py-20 bg-brand-cream/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-cream/30 text-brand-orange text-xs font-semibold border border-emerald-100 mb-4">
              Role-Based Access
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-brand-dark mb-4"
              style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
            >
              Built for{" "}
              <span className="evenza-text-gradient">Every Stakeholder</span>
            </h2>
            <p className="text-brand-teal/80 max-w-xl mx-auto text-base">
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
                className="group bg-white rounded-2xl border border-brand-cream/60 p-5 hover:border-brand-cream/80 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", r.color)}>
                    <RoleIcon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-brand-teal">{r.role}</h3>
                </div>
                <p className="text-sm text-brand-teal/80 leading-relaxed">{r.desc}</p>
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
            <span className="inline-block px-3 py-1 rounded-full bg-brand-cream/30 text-brand-teal text-xs font-semibold border border-amber-100 mb-4">
              Trusted by Professionals
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-brand-dark mb-4"
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
                className="bg-brand-cream/20 rounded-2xl border border-brand-cream/60 p-6 hover:shadow-md transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-brand-teal text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold", t.color)}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-teal">{t.name}</p>
                    <p className="text-xs text-brand-cream/200">{t.role}</p>
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
      <section id="about" aria-label="About Evenza" className="py-20 bg-brand-cream/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left — text */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-brand-cream/20 text-brand-teal text-xs font-semibold border border-brand-cream/60 mb-4">
                About the Project
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-brand-dark mb-5"
                style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
              >
                Built on a{" "}
                <span className="evenza-text-gradient">Modern Stack</span>
              </h2>
              <p className="text-brand-teal/80 leading-relaxed mb-6">
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
                  <div key={tech.label} className="flex items-start gap-2 bg-white rounded-xl p-3 border border-brand-cream/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-teal/80 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-brand-teal">{tech.label}</p>
                      <p className="text-[11px] text-brand-cream/200">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Team Card */}
            <div className="flex-1 w-full max-w-sm mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl border border-brand-cream/60 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-brand-cream/40">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-cream/200">SLIIT SE2030 · 2026</p>
                    <p className="text-sm font-bold text-brand-teal">Group B10G1-02</p>
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
                      <div className="w-8 h-8 rounded-full bg-brand-cream/20 border border-brand-cream/60 flex items-center justify-center text-xs font-bold text-brand-teal shrink-0">
                        {member.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-brand-teal truncate">{member.name}</p>
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
        <div className="bg-brand-teal absolute inset-0" aria-hidden="true" />
        {/* Decorative dot grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
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
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-teal rounded-xl font-bold text-sm hover:bg-brand-cream/20 shadow-lg hover:shadow-xl transition-all"
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
