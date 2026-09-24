import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
	Bell,
	Search,
	LogOut,
	ChevronLeft,
	ChevronRight,
	Package,
	Calendar,
	Layers,
	Users,
	Tag,
	MessageSquare,
	ShieldCheck,
	CheckSquare,
	Clock,
	Menu,
	X,
} from "lucide-react";

export default function DashboardLayout({
	children,
	activeRole = "Inventory Staff",
}) {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	// Scoped navigation links per role specification
	const roleNavItems = {
		"Inventory Staff": [
			{
				label: "Overview & Metrics",
				path: "/dashboard/inventory",
				icon: Layers,
			},
			{
				label: "Stock Catalog",
				path: "/dashboard/inventory/catalog",
				icon: Package,
			},
			{
				label: "Allocate to Events",
				path: "/dashboard/inventory/allocate",
				icon: Calendar,
			},
			{
				label: "Returns & Damage Log",
				path: "/dashboard/inventory/returns",
				icon: CheckSquare,
			},
		],
		Customer: [
			{ label: "Dashboard Overview", path: "/portal/customer", icon: Layers },
			{ label: "My Events", path: "/portal/customer/events", icon: Calendar },
			{
				label: "Browse Venues/Vendors",
				path: "/portal/customer/browse",
				icon: Search,
			},
			{
				label: "Bookings & Payments",
				path: "/portal/customer/bookings",
				icon: CheckSquare,
			},
			{
				label: "Promotions & Offers",
				path: "/portal/customer/promotions",
				icon: Tag,
			},
		],
		"Event Manager": [
			{ label: "Manager Overview", path: "/portal/manager", icon: Layers },
			{
				label: "Event Approvals",
				path: "/portal/manager/approvals",
				icon: CheckSquare,
			},
			{
				label: "Master Schedules",
				path: "/portal/manager/schedules",
				icon: Clock,
			},
			{
				label: "Staff Task Delegation",
				path: "/portal/manager/tasks",
				icon: Users,
			},
		],
		Vendor: [
			{ label: "Vendor Dashboard", path: "/portal/vendor", icon: Layers },
			{
				label: "Booking Requests",
				path: "/portal/vendor/bookings",
				icon: CheckSquare,
			},
			{
				label: "Availability Calendar",
				path: "/portal/vendor/calendar",
				icon: Calendar,
			},
			{
				label: "Promotions & Ads",
				path: "/portal/vendor/promotions",
				icon: Tag,
			},
		],
		Admin: [
			{ label: "Admin Overview", path: "/portal/admin", icon: Layers },
			{ label: "User & Role RBAC", path: "/portal/admin/users", icon: Users },
			{ label: "Audit Logs", path: "/portal/admin/logs", icon: ShieldCheck },
		],
		Guest: [
			{ label: "My Itineraries", path: "/portal/guest", icon: Calendar },
			{
				label: "Ask a Question",
				path: "/portal/guest/inquiries",
				icon: MessageSquare,
			},
		],
	};

	const navLinks = roleNavItems[activeRole] || roleNavItems["Inventory Staff"];

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 flex">
			{/* SIDEBAR (Desktop) */}
			<aside
				className={`hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 shrink-0 sticky top-0 h-screen z-30 ${
					collapsed ? "w-20" : "w-64"
				}`}
			>
				{/* Brand Header */}
				<div
					className={`h-16 px-4 border-b border-slate-200 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
				>
					<Link to="/" className="flex items-center gap-2 overflow-hidden">
						<span className="text-xl font-black text-blue-600 tracking-tight">
							{collapsed ? "E" : "Evenza"}
						</span>
						{!collapsed && (
							<span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 truncate max-w-[100px]">
								{activeRole}
							</span>
						)}
					</Link>
					<button
						onClick={() => setCollapsed(!collapsed)}
						className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
						title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
					</button>
				</div>

				{/* Sidebar Navigation */}
				<nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
					{navLinks.map((item) => {
						const Icon = item.icon;
						const active = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								title={collapsed ? item.label : undefined}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
									collapsed ? "justify-center px-2" : ""
								} ${
									active
										? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
										: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
								}`}
							>
								<Icon size={19} className="shrink-0" />
								{!collapsed && <span className="truncate">{item.label}</span>}
							</Link>
						);
					})}
				</nav>

				{/* Bottom User / Logout */}
				<div className="p-3 border-t border-slate-200">
					<button
						onClick={handleLogout}
						title={collapsed ? "Sign Out" : undefined}
						className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors ${
							collapsed ? "justify-center px-2" : ""
						}`}
					>
						<LogOut size={18} className="shrink-0" />
						{!collapsed && <span>Sign Out</span>}
					</button>
				</div>
			</aside>

			{/* MAIN VIEW AREA */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Navigation Bar (64px) */}
				<header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
						>
							<Menu size={20} />
						</button>
						<div className="hidden sm:flex items-center text-xs text-slate-400 gap-1.5">
							<span>Portals</span>
							<span>/</span>
							<span className="font-semibold text-slate-700">{activeRole}</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						{/* Scoped Quick Search */}
						<div className="hidden sm:flex items-center relative">
							<Search size={16} className="absolute left-3 text-slate-400" />
							<input
								type="text"
								placeholder="Ctrl + K to search..."
								className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-48 lg:w-64 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
							/>
						</div>

						{/* Notification Bell */}
						<button className="relative p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
							<Bell size={18} />
							<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
						</button>

						{/* User Profile Pill */}
						<div className="flex items-center gap-2 pl-2 border-l border-slate-200">
							<div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
								{user?.name?.[0]?.toUpperCase() || "U"}
							</div>
							<div className="hidden lg:block text-left">
								<p className="text-xs font-bold text-slate-800 leading-none">
									{user?.name || "Keshavan M."}
								</p>
								<p className="text-[11px] text-slate-400 mt-0.5">
									{activeRole}
								</p>
							</div>
						</div>
					</div>
				</header>

				{/* Page Content Body */}
				<main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
					{children}
				</main>
			</div>

			{/* Mobile Drawer (When screen < md) */}
			{mobileOpen && (
				<div className="fixed inset-0 z-50 md:hidden flex">
					<div
						className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
						onClick={() => setMobileOpen(false)}
					/>
					<div className="relative w-64 bg-white h-full flex flex-col z-10 shadow-xl">
						<div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
							<span className="text-xl font-black text-blue-600">Evenza</span>
							<button
								onClick={() => setMobileOpen(false)}
								className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
							>
								<X size={18} />
							</button>
						</div>
						<nav className="flex-1 p-3 space-y-1">
							{navLinks.map((item) => {
								const Icon = item.icon;
								const active = location.pathname === item.path;
								return (
									<Link
										key={item.path}
										to={item.path}
										onClick={() => setMobileOpen(false)}
										className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
											active
												? "bg-blue-50 text-blue-600 font-semibold"
												: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
										}`}
									>
										<Icon size={18} />
										<span>{item.label}</span>
									</Link>
								);
							})}
						</nav>
						<div className="p-3 border-t border-slate-200">
							<button
								onClick={handleLogout}
								className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
							>
								<LogOut size={18} />
								<span>Sign Out</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
