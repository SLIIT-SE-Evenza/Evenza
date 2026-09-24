import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
	{ label: "Deals & Packages", href: "#promotions" },
	{ label: "Features", href: "#features" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
];

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [hoveredNav, setHoveredNav] = useState(null);
	const [isSignInHovered, setIsSignInHovered] = useState(false);

	return (
		<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 relative flex items-center justify-between">
				{/* Brand Logo with Registered Symbol */}
				<div className="flex items-center">
					<Link to="/" className="flex items-center group">
						<span className="text-2xl font-black tracking-tight text-blue-600 flex items-center">
							Evenza
							<sup className="text-[10px] font-bold text-blue-600 ml-0.5 -top-2 select-none">
								®
							</sup>
						</span>
					</Link>
				</div>

				{/* Centered Desktop Navigation with Shared Floating Background Pill */}
				<nav
					className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-700 absolute left-1/2 -translate-x-1/2 p-1"
					onMouseLeave={() => setHoveredNav(null)}
				>
					{navItems.map((item) => {
						const isHovered = hoveredNav === item.href;

						return (
							<a
								key={item.href}
								href={item.href}
								onMouseEnter={() => setHoveredNav(item.href)}
								className="relative px-3.5 py-1.5 rounded-lg text-slate-700 transition-colors duration-200 select-none"
							>
								{/* Smooth Animated Gliding Pill */}
								{isHovered && (
									<motion.span
										layoutId="navbar-hover-pill"
										className="absolute inset-0 bg-slate-100 rounded-lg -z-10"
										transition={{
											type: "spring",
											stiffness: 380,
											damping: 30,
										}}
									/>
								)}
								<span className="relative z-10">{item.label}</span>
							</a>
						);
					})}
				</nav>

				{/* Desktop Actions */}
				<div className="hidden md:flex items-center gap-2">
					{/* Sign In with Smooth Floating Pill */}
					<Link
						to="/login"
						onMouseEnter={() => setIsSignInHovered(true)}
						onMouseLeave={() => setIsSignInHovered(false)}
						className="relative px-3.5 py-1.5 text-sm font-medium text-slate-700 rounded-lg select-none"
					>
						{isSignInHovered && (
							<motion.span
								layoutId="signin-hover-pill"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="absolute inset-0 bg-slate-100 rounded-lg -z-10"
								transition={{
									type: "spring",
									stiffness: 350,
									damping: 25,
								}}
							/>
						)}
						<span className="relative z-10">Sign In</span>
					</Link>

					<Link
						to="/register"
						className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors duration-200"
					>
						Get Started
					</Link>
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden flex items-center">
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
						aria-label="Toggle Menu"
					>
						{mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>
			</div>

			{/* Smooth Expanding Mobile Dropdown */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 overflow-hidden"
					>
						{navItems.map((item) => (
							<a
								key={item.href}
								href={item.href}
								onClick={() => setMobileMenuOpen(false)}
								className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
							>
								{item.label}
							</a>
						))}
						<div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
							<Link
								to="/login"
								onClick={() => setMobileMenuOpen(false)}
								className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
							>
								Sign In
							</Link>
							<Link
								to="/register"
								onClick={() => setMobileMenuOpen(false)}
								className="w-full text-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Get Started
							</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
