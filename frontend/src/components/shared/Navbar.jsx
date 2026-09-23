import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
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

				{/* Centered Desktop Navigation Links */}
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
					<a href="#features" className="hover:text-blue-600 transition-colors">
						Features
					</a>
					<a href="#contact" className="hover:text-blue-600 transition-colors">
						Support
					</a>
				</nav>

				{/* Desktop Actions */}
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

			{/* Mobile Dropdown */}
			{mobileMenuOpen && (
				<div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
					<a
						href="#browse"
						onClick={() => setMobileMenuOpen(false)}
						className="block py-2 text-sm font-medium text-slate-700"
					>
						Browse Venues & Vendors
					</a>
					<a
						href="#promotions"
						onClick={() => setMobileMenuOpen(false)}
						className="block py-2 text-sm font-medium text-slate-700"
					>
						Deals & Packages
					</a>
					<a
						href="#features"
						onClick={() => setMobileMenuOpen(false)}
						className="block py-2 text-sm font-medium text-slate-700"
					>
						Features
					</a>
					<a
						href="#contact"
						onClick={() => setMobileMenuOpen(false)}
						className="block py-2 text-sm font-medium text-slate-700"
					>
						Support
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
	);
}
