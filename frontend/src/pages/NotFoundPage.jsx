import React from "react";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFoundPage() {
	return (
		<main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
			<div className="max-w-md w-full text-center">
				{/* Visual Badge & Code */}
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-6 shadow-sm">
					<Search size={32} />
				</div>

				<p className="text-sm font-bold uppercase tracking-widest text-blue-600">
					404 Error
				</p>

				<h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
					Page not found
				</h1>

				<p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">
					The page or event resource you are looking for does not exist, has
					been removed, or is temporarily unavailable.
				</p>

				{/* Action Buttons */}
				<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
					<button
						onClick={() => window.history.back()}
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
					>
						<ArrowLeft size={16} />
						Go Back
					</button>

					<a
						href="/"
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
					>
						<Home size={16} />
						Back to Home
					</a>
				</div>
			</div>
		</main>
	);
}
