import React from "react";
import { Sparkles, CalendarDays, Globe2, Users } from "lucide-react";

const stats = [
	{
		icon: Sparkles,
		value: "100,000+",
		label: "events coordinated",
		description: "Flawlessly managed through automated pipelines",
	},
	{
		icon: CalendarDays,
		value: "50,000+",
		label: "event planners",
		description: "Active organizers, coordinators & managers",
	},
	{
		icon: Globe2,
		value: "165+",
		label: "regions & cities",
		description: "Cross-regional venue & partner network",
	},
	{
		icon: Users,
		value: "1.6M+",
		label: "registered attendees",
		description: "Seamless guest experiences & live check-ins",
	},
];

export default function MetricsStatsSection() {
	return (
		<section className="relative py-16 bg-white border-y border-slate-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Metric Cards Grid with Vertical Dividers */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-slate-200">
					{stats.map((stat, idx) => {
						const Icon = stat.icon;
						return (
							<div
								key={idx}
								className="flex flex-col items-center text-center px-4 sm:px-6"
							>
								{/* Circular Badge matching Evenza palette */}
								<div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shadow-sm mb-6 transition-transform duration-300 hover:scale-105">
									<Icon size={24} className="stroke-[2.2]" />
								</div>

								{/* Main Stat Metric */}
								<h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
									{stat.value}
								</h3>

								{/* Primary Category Label */}
								<p className="mt-2 text-base font-bold text-slate-700 uppercase tracking-wider text-xs sm:text-sm">
									{stat.label}
								</p>

								{/* Subtitle / Context */}
								<p className="mt-1 text-xs text-slate-400 max-w-[200px]">
									{stat.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
