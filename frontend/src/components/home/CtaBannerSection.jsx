import React from "react";
import { Link } from "react-router-dom";

export default function CtaBannerSection() {
	return (
		<section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
			<div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-500/20">
				<div className="max-w-xl text-center md:text-left">
					<h2 className="text-2xl sm:text-3xl font-black tracking-tight">
						Ready to automate your next event?
					</h2>
					<p className="text-blue-100 text-sm sm:text-base mt-2">
						Sign up today as a Customer, Vendor, or Event Planner to access your
						role-specific dashboard.
					</p>
				</div>
				<div className="flex gap-3">
					<Link
						to="/register"
						className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm shadow-sm"
					>
						Create Account
					</Link>
					<Link
						to="/login"
						className="px-5 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-sm border border-blue-500"
					>
						Sign In
					</Link>
				</div>
			</div>
		</section>
	);
}
