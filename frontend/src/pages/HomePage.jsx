import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Search,
	Calendar,
	MapPin,
	ChevronRight,
	ArrowRight,
	Zap,
	Layers,
	Users,
	ShieldCheck,
	Menu,
	X,
} from "lucide-react";

export default function HomePage() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useState({
		category: "All",
		location: "",
		date: "",
		budget: "",
	});

	// Featured Vendor Promotions (Function 6)
	const promotions = [
		{
			id: 1,
			vendor: "Lumina Grand Ballroom",
			category: "Venue",
			discount: "20% OFF",
			title: "Weekend Wedding Special Package",
			validUntil: "Oct 31, 2026",
			badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
		},
		{
			id: 2,
			vendor: "Aura Sound & Lighting",
			category: "AV & Acoustics",
			discount: "15% OFF",
			title: "Complete Concert & Party Setup",
			validUntil: "Nov 15, 2026",
			badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
		},
		{
			id: 3,
			vendor: "Crest Gourmet Catering",
			category: "Catering",
			discount: "Free Dessert Bar",
			title: "Corporate Dinners (100+ Pax)",
			validUntil: "Dec 05, 2026",
			badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
		},
	];

	// System Value Highlights
	const features = [
		{
			icon: Zap,
			title: "Real-Time Slot Locks",
			desc: "Instantly reserve venues and vendor dates without double-booking friction or scheduling clashes.",
		},
		{
			icon: Layers,
			title: "Synchronized Inventory",
			desc: "Live warehouse tracking for AV, staging, and seating assets tied directly to event orders.",
		},
		{
			icon: Users,
			title: "Role-Based Portals",
			desc: "Dedicated workspaces designed for event managers, vendors, inventory staff, and guests.",
		},
		{
			icon: ShieldCheck,
			title: "Verified Vendors & Ratings",
			desc: "Review transparent, attendee-backed scores and authentic feedback to book with confidence.",
		},
	];

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
			{/* 1. TOP NAVIGATION BAR */}
			<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 relative flex items-center justify-between">
					{/* Brand Logo */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center gap-2">
							<span className="text-2xl font-black tracking-tight text-blue-600">
								Evenza
							</span>
							<span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
								Platform
							</span>
						</Link>
					</div>

					{/* Centered Navigation Links */}
					<nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 absolute left-1/2 -translate-x-1/2">
						<a href="#browse" className="hover:text-blue-600 transition-colors">
							Browse Venues & Vendors
						</a>
						<a
							href="#promotions"
							className="hover:text-blue-600 transition-colors"
						>
							Deals & Packages
						</a>
						<a
							href="#features"
							className="hover:text-blue-600 transition-colors"
						>
							Features
						</a>
						<a
							href="#contact"
							className="hover:text-blue-600 transition-colors"
						>
							Support
						</a>
					</nav>

					{/* Desktop Auth Buttons (Redirects) */}
					<div className="hidden md:flex items-center gap-3">
						<Link
							to="/login"
							className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
						>
							Sign In
						</Link>
						<Link
							to="/register"
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
						>
							Get Started
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="text-slate-600 p-2"
							aria-label="Toggle Menu"
						>
							{mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
						</button>
					</div>
				</div>

				{/* Mobile Dropdown (Redirects) */}
				{mobileMenuOpen && (
					<div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
						<a
							href="#browse"
							className="block py-2 text-sm font-medium text-slate-700"
						>
							Browse Venues & Vendors
						</a>
						<a
							href="#promotions"
							className="block py-2 text-sm font-medium text-slate-700"
						>
							Deals & Packages
						</a>
						<a
							href="#features"
							className="block py-2 text-sm font-medium text-slate-700"
						>
							Features
						</a>
						<div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
							<Link
								to="/login"
								onClick={() => setMobileMenuOpen(false)}
								className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg"
							>
								Sign In
							</Link>
							<Link
								to="/register"
								onClick={() => setMobileMenuOpen(false)}
								className="w-full text-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
							>
								Get Started
							</Link>
						</div>
					</div>
				)}
			</header>

			{/* 2. HERO SECTION & INTEGRATED SEARCH ENGINE */}
			<section className="relative pt-12 pb-20 bg-gradient-to-b from-blue-50/60 to-transparent">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-4 border border-blue-200">
						End-to-End Event Coordination & Resource Management
					</span>
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto">
						Design, coordinate, and execute events without the chaos.
					</h1>
					<p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
						A single workspace unifying venue bookings, vendors, live inventory,
						and activity schedules into an automated execution pipeline.
					</p>

					{/* Real-time Discovery Search Bar */}
					<div className="mt-10 max-w-4xl mx-auto bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
							<div>
								<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
									Service Category
								</label>
								<div className="relative">
									<select
										className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
										value={searchParams.category}
										onChange={(e) =>
											setSearchParams({
												...searchParams,
												category: e.target.value,
											})
										}
									>
										<option value="All">All Categories</option>
										<option value="Venues">Venues & Banquets</option>
										<option value="Catering">Catering Services</option>
										<option value="Sound">Lighting & Sound</option>
										<option value="Photography">Photography</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
									Location
								</label>
								<div className="relative flex items-center">
									<MapPin
										className="absolute left-3 text-slate-400"
										size={16}
									/>
									<input
										type="text"
										placeholder="City or Area..."
										className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
										value={searchParams.location}
										onChange={(e) =>
											setSearchParams({
												...searchParams,
												location: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
									Target Date
								</label>
								<div className="relative flex items-center">
									<Calendar
										className="absolute left-3 text-slate-400"
										size={16}
									/>
									<input
										type="date"
										className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
										value={searchParams.date}
										onChange={(e) =>
											setSearchParams({ ...searchParams, date: e.target.value })
										}
									/>
								</div>
							</div>

							<div className="flex items-end">
								<button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md">
									<Search size={16} />
									<span>Check Availability</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 3. PROMOTIONAL PACKAGES & CAMPAIGNS (FR6) */}
			<section
				id="promotions"
				className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
			>
				<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
					<div>
						<h2 className="text-2xl font-bold tracking-tight text-slate-900">
							Featured Vendor Promotions
						</h2>
						<p className="text-sm text-slate-500 mt-1">
							Direct discounts and custom event packages published by verified
							partners.
						</p>
					</div>
					<a
						href="/promotions"
						className="mt-3 sm:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
					>
						View all deals <ChevronRight size={16} />
					</a>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{promotions.map((item) => (
						<div
							key={item.id}
							className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
						>
							<div>
								<div className="flex items-center justify-between mb-3">
									<span
										className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}
									>
										{item.discount}
									</span>
									<span className="text-xs font-medium text-slate-400">
										Expires {item.validUntil}
									</span>
								</div>
								<h3 className="font-semibold text-slate-900 text-lg">
									{item.title}
								</h3>
								<p className="text-sm font-medium text-slate-500 mt-1">
									Provided by{" "}
									<span className="text-slate-700">{item.vendor}</span>
								</p>
							</div>

							<div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
								<span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
									{item.category}
								</span>
								<button className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
									Claim Deal <ArrowRight size={14} />
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* 4. VALUE PROPOSITION & SYSTEM HIGHLIGHTS */}
			<section
				id="features"
				className="py-16 bg-white border-y border-slate-200"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-2xl mx-auto mb-12">
						<h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
							Enterprise Coordination Architecture
						</h2>
						<p className="text-slate-600 mt-2 text-sm sm:text-base">
							Say goodbye to disconnected WhatsApp threads, lost Excel sheets,
							and gear shortages.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feat, idx) => (
							<div key={idx} className="flex flex-col items-start text-left">
								<div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4 border border-blue-100">
									<feat.icon size={24} />
								</div>
								<h3 className="text-base font-bold text-slate-900 mb-1">
									{feat.title}
								</h3>
								<p className="text-sm text-slate-500 leading-relaxed">
									{feat.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 5. CALL TO ACTION BANNER */}
			<section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-500/20">
					<div className="max-w-xl text-center md:text-left">
						<h2 className="text-2xl sm:text-3xl font-black tracking-tight">
							Ready to automate your next event?
						</h2>
						<p className="text-blue-100 text-sm sm:text-base mt-2">
							Sign up today as a Customer, Vendor, or Event Planner to access
							your role-specific dashboard.
						</p>
					</div>
					<div className="flex gap-3">
						<a
							href="/register"
							className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm shadow-sm"
						>
							Create Account
						</a>
						<a
							href="/login"
							className="px-5 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-sm border border-blue-500"
						>
							Sign In
						</a>
					</div>
				</div>
			</section>

			{/* 6. GLOBAL FOOTER */}
			<footer
				id="contact"
				className="bg-white border-t border-slate-200 pt-12 pb-8"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
						<div>
							<h4 className="font-bold text-slate-900 mb-3">Platform</h4>
							<ul className="space-y-2 text-slate-500">
								<li>
									<a href="#browse" className="hover:text-blue-600">
										Venues & Services
									</a>
								</li>
								<li>
									<a href="#promotions" className="hover:text-blue-600">
										Promotions & Deals
									</a>
								</li>
								<li>
									<a href="/pricing" className="hover:text-blue-600">
										Pricing Packages
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold text-slate-900 mb-3">Roles & Portals</h4>
							<ul className="space-y-2 text-slate-500">
								<li>
									<a href="/portal/customer" className="hover:text-blue-600">
										Customer Portal
									</a>
								</li>
								<li>
									<a href="/portal/manager" className="hover:text-blue-600">
										Event Manager Portal
									</a>
								</li>
								<li>
									<a href="/portal/vendor" className="hover:text-blue-600">
										Vendor Management
									</a>
								</li>
								<li>
									<a
										href="/dashboard/inventory"
										className="hover:text-blue-600"
									>
										Inventory Portal
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold text-slate-900 mb-3">Support</h4>
							<ul className="space-y-2 text-slate-500">
								<li>
									<a href="/inquiries" className="hover:text-blue-600">
										Submit Inquiry
									</a>
								</li>
								<li>
									<a href="/faq" className="hover:text-blue-600">
										Documentation & FAQ
									</a>
								</li>
								<li>
									<a href="/terms" className="hover:text-blue-600">
										Service Policy
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold text-slate-900 mb-3">Evenza System</h4>
							<p className="text-xs text-slate-500 leading-relaxed">
								Centralized Web-Based Event Planning Platform. Developed using
								modern React, Tailwind CSS, and REST API architecture.
							</p>
						</div>
					</div>

					<div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
						<p>&copy; 2026 Evenza Platform. All rights reserved.</p>
						<div className="flex gap-4">
							<a href="/privacy" className="hover:text-slate-600">
								Privacy Policy
							</a>
							<a href="/terms" className="hover:text-slate-600">
								Terms of Service
							</a>
							<a href="/security" className="hover:text-slate-600">
								Security & RBAC
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
