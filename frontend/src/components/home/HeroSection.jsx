import React, { useState } from "react";
import { Search, Calendar, MapPin } from "lucide-react";

export default function HeroSection() {
	const [searchParams, setSearchParams] = useState({
		category: "All",
		location: "",
		date: "",
		budget: "",
	});

	const handleSearch = (e) => {
		e.preventDefault();
		console.log("Search parameters:", searchParams);
	};

	return (
		<section
			id="browse"
			className="relative min-h-[calc(100vh-7rem)] flex flex-col justify-center items-center py-6 bg-linear-to-b from-blue-50/60 to-transparent"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full flex flex-col items-center">
				{/* Category Pill */}
				<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-4 border border-blue-200">
					End-to-End Event Coordination & Resource Management
				</span>

				{/* Hero Title */}
				<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto">
					Design, coordinate, and execute events without the chaos.
				</h1>

				{/* Subtitle */}
				<p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
					A single workspace unifying venue bookings, vendors, live inventory,
					and activity schedules into an automated execution pipeline.
				</p>

				{/* Discovery Search Bar */}
				<div className="mt-8 max-w-4xl w-full mx-auto bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
					<form
						onSubmit={handleSearch}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left"
					>
						<div>
							<label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
								Service Category
							</label>
							<div className="relative">
								<select
									className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
								<MapPin className="absolute left-3 text-slate-400" size={16} />
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
							<button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
							>
								<Search size={16} />
								<span>Check Availability</span>
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
