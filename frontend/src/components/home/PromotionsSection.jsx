import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";

const promotionsData = [
	{
		id: 1,
		vendor: "Lumina Grand Ballroom",
		category: "Venue",
		discount: "20% OFF",
		title: "Weekend Wedding Special Package",
		validUntil: "Oct 31, 2026",
		badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
	},
	{
		id: 2,
		vendor: "Aura Sound & Lighting",
		category: "AV & Acoustics",
		discount: "15% OFF",
		title: "Complete Concert & Party Setup",
		validUntil: "Nov 15, 2026",
		badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
	},
	{
		id: 3,
		vendor: "Crest Gourmet Catering",
		category: "Catering",
		discount: "Free Dessert Bar",
		title: "Corporate Dinners (100+ Pax)",
		validUntil: "Dec 05, 2026",
		badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
	},
];

export default function PromotionsSection({ promotions = promotionsData }) {
	return (
		<section
			id="promotions"
			className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
		>
			<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-slate-900">
						Featured Vendor Promotions
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						Direct discounts and custom event packages published by verified
						partners.
					</p>
				</div>
				<Link
					to="/promotions"
					className="mt-3 sm:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
				>
					View all deals{" "}
					<ChevronRight
						size={16}
						className="transition-transform group-hover:translate-x-1"
					/>
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{promotions.map((item) => (
					<div
						key={item.id}
						className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
					>
						<div>
							<div className="flex items-center justify-between mb-3">
								<span
									className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}
								>
									{item.discount}
								</span>
								<span className="text-xs font-medium text-slate-400">
									Expires {item.validUntil}
								</span>
							</div>
							<h3 className="font-semibold text-slate-900 text-lg">
								{item.title}
							</h3>
							<p className="text-sm font-medium text-slate-500 mt-1">
								Provided by{" "}
								<span className="text-slate-700">{item.vendor}</span>
							</p>
						</div>

						<div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
							<span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
								{item.category}
							</span>
							<Link
								to="/promotions"
								className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
							>
								Claim Deal <ArrowRight size={14} />
							</Link>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
