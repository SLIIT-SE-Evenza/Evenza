import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
	User,
	Mail,
	Lock,
	Eye,
	EyeOff,
	ArrowRight,
	AlertCircle,
	Loader2,
	Shield,
} from "lucide-react";

export default function RegisterPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		role: "Customer",
		password: "",
		confirmPassword: "",
		agreeTerms: false,
	});

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const roles = [
		{ value: "Customer", label: "Customer (Event Host)" },
		{ value: "Vendor", label: "Vendor / Service Provider" },
		{ value: "Event Manager", label: "Event Coordinator / Manager" },
		{ value: "Inventory Staff", label: "Inventory Staff" },
		{ value: "Guest", label: "Guest / Attendee" },
	];

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
			case "Guest":
			default:
				return "/portal/guest";
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validations
		if (!formData.fullName.trim() || !formData.email.trim()) {
			setError("Please fill in all required fields.");
			return;
		}
		if (formData.password.length < 8) {
			setError("Password must be at least 8 characters long.");
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		if (!formData.agreeTerms) {
			setError("Please accept the terms and privacy policy to continue.");
			return;
		}

		setLoading(true);

		try {
			// Simulate API registration call
			await new Promise((resolve) => setTimeout(resolve, 900));

			const registeredUser = {
				id: "usr_" + Math.floor(Math.random() * 9000 + 1000),
				name: formData.fullName,
				email: formData.email,
				role: formData.role,
			};

			const generatedToken = "jwt_reg_token_" + Date.now();

			// Log in immediately through context
			login(registeredUser, generatedToken);

			// Route straight to the user's role workspace
			navigate(getRoleDashboardRoute(registeredUser.role));
		} catch (err) {
			setError("Registration failed. Please verify your details.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:px-6 lg:px-8 py-10">
			<div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
				{/* Header */}
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
						Create an Account
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						Choose your account role to set up your customized workspace.
					</p>
				</div>

				{/* Error Notification */}
				{error && (
					<div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2.5">
						<AlertCircle size={18} className="mt-0.5 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
							Full Name
						</label>
						<div className="relative">
							<User
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>
							<input
								type="text"
								required
								placeholder="John Doe"
								value={formData.fullName}
								onChange={(e) =>
									setFormData({ ...formData, fullName: e.target.value })
								}
								className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
							/>
						</div>
					</div>

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

					{/* Role Selection Dropdown (Evenza RBAC) */}
					<div>
						<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
							Select Role
						</label>
						<div className="relative">
							<Shield
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							/>
							<select
								value={formData.role}
								onChange={(e) =>
									setFormData({ ...formData, role: e.target.value })
								}
								className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
							>
								{roles.map((r) => (
									<option key={r.value} value={r.value}>
										{r.label}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
								Password
							</label>
							<div className="relative">
								<Lock
									size={18}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type={showPassword ? "text" : "password"}
									required
									placeholder="Min. 8 chars"
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
									{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
								Confirm Password
							</label>
							<div className="relative">
								<Lock
									size={18}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type={showPassword ? "text" : "password"}
									required
									placeholder="Repeat password"
									value={formData.confirmPassword}
									onChange={(e) =>
										setFormData({
											...formData,
											confirmPassword: e.target.value,
										})
									}
									className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
								/>
							</div>
						</div>
					</div>

					<div className="flex items-start pt-1">
						<input
							id="terms"
							type="checkbox"
							checked={formData.agreeTerms}
							onChange={(e) =>
								setFormData({ ...formData, agreeTerms: e.target.checked })
							}
							className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
						/>
						<label
							htmlFor="terms"
							className="ml-2 block text-xs text-slate-600 cursor-pointer leading-relaxed"
						>
							I agree to the{" "}
							<Link to="/terms" className="text-blue-600 underline">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link to="/privacy" className="text-blue-600 underline">
								Privacy Policy
							</Link>
							.
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
								<span>Creating Account...</span>
							</>
						) : (
							<>
								<span>Create Account</span>
								<ArrowRight size={16} />
							</>
						)}
					</button>
				</form>

				<div className="mt-6 pt-5 border-t border-slate-100 text-center">
					<p className="text-sm text-slate-500">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-semibold text-blue-600 hover:text-blue-700"
						>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
