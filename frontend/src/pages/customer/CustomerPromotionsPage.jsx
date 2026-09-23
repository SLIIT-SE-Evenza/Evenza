import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
	Tag,
	Search,
	Filter,
	Calendar,
	ArrowRight,
	ShieldCheck,
	Check,
} from "lucide-react";

export default function CustomerPromotionsPage() {
	const [promotions, setPromotions] = useState([
		{
			id: 1,
			vendorName: "Lumina Grand Ballroom",
			serviceCategory: "Venues & Banquets",
			title: "Weekend Wedding Grand Discount",
			discountType: "PERCENTAGE",
			discountValue: 20,
			endDate: "2026-10-31",
			terms: "Minimum 150 guests required. Subject to date availability.",
		},
		{
			id: 2,
			vendorName: "Aura Sound & Lighting",
			serviceCategory: "AV & Acoustics",
			title: "Complete Concert Setup Package",
			discountType: "PERCENTAGE",
			discountValue: 15,
			endDate: "2026-11-15",
			terms: "Includes free dynamic truss setup and mixer engineer.",
		},
		{
			id: 3,
			vendorName: "Crest Gourmet Catering",
			serviceCategory: "Catering Services",
			title: "Free Dessert Bar for Corporate Events",
			discountType: "COMPLIMENTARY",
			discountValue: 0,
			endDate: "2026-12-05",
			terms: "For all 3-course dinner bookings over 100 pax.",
		},
	]);

	const [categoryFilter, setCategoryFilter] = useState("All");
	const [search, setSearch] = useState("");
	const [claimedId, setClaimedId] = useState(null);

	useEffect(() => {
		fetch("/api/promotions/active")
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) setPromotions(data);
			})
			.catch((err) => console.warn("Backend not reached, using defaults", err));
	}, []);

	const handleClaimOffer = (id) => {
		// Registers engagement click/inquiry in FR6 PromotionAnalyticsService
		fetch(`/api/promotions/${id}/engage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ type: "INQUIRY_CLICK" }),
		}).catch(console.warn);

		setClaimedId(id);
		setTimeout(() => setClaimedId(null), 3500);
	};

	const filtered = promotions.filter((p) => {
		const matchesCat =
			categoryFilter === "All" || p.serviceCategory === categoryFilter;
		const matchesSearch =
			p.title.toLowerCase().includes(search.toLowerCase()) ||
			p.vendorName.toLowerCase().includes(search.toLowerCase());
		return matchesCat && matchesSearch;
	});

	return (
		<DashboardLayout activeRole="Customer">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
						Exclusive Vendor Deals & Offers (FR6)
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Browse verified partner promotions and claim special package
						discounts for your next event.
					</p>
				</div>

				{/* Filter Controls */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
					<div className="relative w-full sm:w-80">
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							size={16}
						/>
						<input
							type="text"
							placeholder="Search deals or vendors..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="relative w-full sm:w-56">
						<Filter
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							size={14}
						/>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="w-full pl-8 pr-6 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
						>
							<option value="All">All Categories</option>
							<option value="Venues & Banquets">Venues & Banquets</option>
							<option value="Catering Services">Catering Services</option>
							<option value="AV & Acoustics">AV & Acoustics</option>
						</select>
					</div>
				</div>

				{/* Promotion Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{filtered.map((item) => (
						<div
							key={item.id}
							className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
						>
							<div>
								<div className="flex items-center justify-between mb-3">
									<span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
										{item.discountType === "PERCENTAGE" &&
											`${item.discountValue}% OFF`}
										{item.discountType === "FLAT_AMOUNT" &&
											`Rs. ${item.discountValue} OFF`}
										{item.discountType === "COMPLIMENTARY" && "Perk Included"}
									</span>
									<span className="text-[11px] text-slate-400 font-medium">
										Expires {item.endDate}
									</span>
								</div>

								<h3 className="font-bold text-slate-900 text-base">
									{item.title}
								</h3>
								<p className="text-xs text-slate-500 mt-1 font-medium">
									Provided by{" "}
									<span className="text-slate-800 font-semibold">
										{item.vendorName}
									</span>
								</p>
								<p className="text-xs text-slate-400 mt-3 leading-relaxed">
									{item.terms}
								</p>
							</div>

							<div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
								<span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
									{item.serviceCategory}
								</span>

								<button
									onClick={() => handleClaimOffer(item.id)}
									className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
										claimedId === item.id
											? "bg-emerald-600 text-white"
											: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
									}`}
								>
									{claimedId === item.id ? (
										<>
											<Check size={14} /> Claimed!
										</>
									) : (
										<>
											Claim Offer <ArrowRight size={14} />
										</>
									)}
								</button>
							</div>
						</div>
					))}
				</div>
				{filtered.length === 0 && (
					<div className="p-12 text-center text-xs text-slate-400">
						No promotions matching your filter criteria.
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
