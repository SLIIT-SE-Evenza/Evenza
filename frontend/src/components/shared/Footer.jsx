import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer
			id="contact"
			className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm">
					{/* Column 1: Platform Links (Synchronized with Navbar) */}
					<div>
						<h4 className="font-semibold text-white tracking-wide uppercase text-xs mb-4">
							Platform
						</h4>
						<ul className="space-y-2.5 text-slate-400">
							<li>
								<a
									href="#promotions"
									className="hover:text-blue-400 transition-colors"
								>
									Deals & Packages
								</a>
							</li>
							<li>
								<a
									href="#features"
									className="hover:text-blue-400 transition-colors"
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="#pricing"
									className="hover:text-blue-400 transition-colors"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="#faq"
									className="hover:text-blue-400 transition-colors"
								>
									FAQ
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
								<Link
									to="/portal/customer"
									className="hover:text-blue-400 transition-colors"
								>
									Customer Portal
								</Link>
							</li>
							<li>
								<Link
									to="/portal/manager"
									className="hover:text-blue-400 transition-colors"
								>
									Event Manager Portal
								</Link>
							</li>
							<li>
								<Link
									to="/portal/vendor"
									className="hover:text-blue-400 transition-colors"
								>
									Vendor Management
								</Link>
							</li>
							<li>
								<Link
									to="/dashboard/inventory"
									className="hover:text-blue-400 transition-colors"
								>
									Inventory Portal
								</Link>
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
								<Link
									to="/inquiries"
									className="hover:text-blue-400 transition-colors"
								>
									Submit Inquiry
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="hover:text-blue-400 transition-colors"
								>
									Documentation & FAQ
								</Link>
							</li>
							<li>
								<Link
									to="/terms"
									className="hover:text-blue-400 transition-colors"
								>
									Service Policy
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 4: System Info with Registered Symbol */}
					<div>
						<div className="flex items-center gap-2 mb-4">
							<span className="text-xl font-black text-white tracking-tight flex items-center">
								Evenza
								<sup className="text-[10px] font-bold text-white ml-0.5 -top-1.5 select-none">
									®
								</sup>
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
						<Link
							to="/privacy"
							className="hover:text-slate-300 transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							to="/terms"
							className="hover:text-slate-300 transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							to="/security"
							className="hover:text-slate-300 transition-colors"
						>
							Security & RBAC
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
