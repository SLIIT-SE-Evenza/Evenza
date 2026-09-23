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
		<footer
			id="contact"
			className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm">
					{/* Column 1: Platform Links */}
					<div>
						<h4 className="font-semibold text-white tracking-wide uppercase text-xs mb-4">
							Platform
						</h4>
						<ul className="space-y-2.5 text-slate-400">
							<li>
								<a
									href="#browse"
									className="hover:text-blue-400 transition-colors"
								>
									Venues & Services
								</a>
							</li>
							<li>
								<a
									href="#promotions"
									className="hover:text-blue-400 transition-colors"
								>
									Promotions & Deals
								</a>
							</li>
							<li>
								<a
									href="/pricing"
									className="hover:text-blue-400 transition-colors"
								>
									Pricing Packages
								</a>
							</li>
						</ul>
					</div>

					{/* Column 2: Portals */}
					<div>
						<h4 className="font-semibold text-white tracking-wide uppercase text-xs mb-4">
							Roles & Portals
						</h4>
						<ul className="space-y-2.5 text-slate-400">
							<li>
								<a
									href="/portal/customer"
									className="hover:text-blue-400 transition-colors"
								>
									Customer Portal
								</a>
							</li>
							<li>
								<a
									href="/portal/manager"
									className="hover:text-blue-400 transition-colors"
								>
									Event Manager Portal
								</a>
							</li>
							<li>
								<a
									href="/portal/vendor"
									className="hover:text-blue-400 transition-colors"
								>
									Vendor Management
								</a>
							</li>
							<li>
								<a
									href="/dashboard/inventory"
									className="hover:text-blue-400 transition-colors"
								>
									Inventory Portal
								</a>
							</li>
						</ul>
					</div>

					{/* Column 3: Support */}
					<div>
						<h4 className="font-semibold text-white tracking-wide uppercase text-xs mb-4">
							Support
						</h4>
						<ul className="space-y-2.5 text-slate-400">
							<li>
								<a
									href="/inquiries"
									className="hover:text-blue-400 transition-colors"
								>
									Submit Inquiry
								</a>
							</li>
							<li>
								<a
									href="/faq"
									className="hover:text-blue-400 transition-colors"
								>
									Documentation & FAQ
								</a>
							</li>
							<li>
								<a
									href="/terms"
									className="hover:text-blue-400 transition-colors"
								>
									Service Policy
								</a>
							</li>
						</ul>
					</div>

					{/* Column 4: System Info */}
					<div>
						<div className="flex items-center gap-2 mb-4">
							<span className="text-xl font-black text-blue-500 tracking-tight">
								Evenza
							</span>
							<span className="text-[10px] font-bold px-2 py-0.5 bg-blue-950 text-blue-300 rounded-full border border-blue-800">
								Platform
							</span>
						</div>
						<p className="text-xs text-slate-400 leading-relaxed mb-4">
							Centralized Web-Based Event Planning Platform. Developed using
							modern React, Tailwind CSS, and REST API architecture.
						</p>
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
							<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
							<span>All Services Operational</span>
						</div>
					</div>
				</div>

				{/* Bottom Bar: Copyright & Policies */}
				<div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
					<p>&copy; 2026 Evenza Platform. All rights reserved.</p>
					<div className="flex flex-wrap gap-6">
						<a
							href="/privacy"
							className="hover:text-slate-300 transition-colors"
						>
							Privacy Policy
						</a>
						<a href="/terms" className="hover:text-slate-300 transition-colors">
							Terms of Service
						</a>
						<a
							href="/security"
							className="hover:text-slate-300 transition-colors"
						>
							Security & RBAC
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
