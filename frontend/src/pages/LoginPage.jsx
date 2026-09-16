import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	ArrowRight,
	AlertCircle,
	Loader2,
} from "lucide-react";

export default function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const getRoleDashboardRoute = (role) => {
		switch (role) {
			case "Inventory Staff":
				return "/dashboard/inventory";
			case "Customer":
				return "/portal/customer";
			case "Event Manager":
				return "/portal/manager";
			case "Vendor":
				return "/portal/vendor";
			case "Admin":
				return "/portal/admin";
			case "Guest":
			default:
				return "/portal/guest";
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Input Validation
		if (!formData.email.trim() || !formData.password.trim()) {
			setError("Please provide both email and password.");
			return;
		}

		setLoading(true);

		try {
			// Simulate API verification call
			await new Promise((resolve) => setTimeout(resolve, 800));

			// Mock user object (replace with backend API response)
			const mockUserData = {
				id: "usr_1029",
				name: formData.email.split("@")[0],
				email: formData.email,
				role: formData.email.includes("inventory")
					? "Inventory Staff"
					: formData.email.includes("manager")
						? "Event Manager"
						: "Customer",
			};

			const mockToken = "jwt_token_sample_" + Date.now();

			// Update Auth Context & Local Storage
			login(mockUserData, mockToken);

			// Route to role-specific portal
			navigate(getRoleDashboardRoute(mockUserData.role));
		} catch (err) {
			setError("Invalid email or password. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
				{/* Brand Header */}
				<div className="text-center mb-6">
					<Link to="/" className="inline-flex items-center gap-2 mb-3">
						<span className="text-2xl font-black tracking-tight text-blue-600">
							Evenza
						</span>
						<span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
							Platform
						</span>
					</Link>
					<h2 className="text-2xl font-bold text-slate-900 tracking-tight">
						Sign In to Your Account
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						Access your event workspace, bookings, and dashboard.
					</p>
				</div>

				{/* Error Alert */}
				{error && (
					<div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2.5">
						<AlertCircle size={18} className="mt-0.5 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
							Email Address
						</label>
						<div className="relative">
							<Mail
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>
							<input
								type="email"
								required
								placeholder="name@example.com"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
							/>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1.5">
							<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
								Password
							</label>
							<Link
								to="/forgot-password"
								className="text-xs font-medium text-blue-600 hover:text-blue-700"
							>
								Forgot Password?
							</Link>
						</div>
						<div className="relative">
							<Lock
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>
							<input
								type={showPassword ? "text" : "password"}
								required
								placeholder="••••••••"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					<div className="flex items-center">
						<input
							id="remember-me"
							type="checkbox"
							checked={formData.rememberMe}
							onChange={(e) =>
								setFormData({ ...formData, rememberMe: e.target.checked })
							}
							className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
						/>
						<label
							htmlFor="remember-me"
							className="ml-2 block text-xs text-slate-600 cursor-pointer"
						>
							Remember me on this browser
						</label>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<Loader2 size={16} className="animate-spin" />
								<span>Signing in...</span>
							</>
						) : (
							<>
								<span>Sign In</span>
								<ArrowRight size={16} />
							</>
						)}
					</button>
				</form>

				<div className="mt-6 pt-5 border-t border-slate-100 text-center">
					<p className="text-sm text-slate-500">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="font-semibold text-blue-600 hover:text-blue-700"
						>
							Create an account
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
