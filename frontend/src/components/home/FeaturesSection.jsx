import React from "react";
import { Zap, Layers, Users, ShieldCheck } from "lucide-react";

const featuresData = [
	{
		icon: Zap,
		title: "Real-Time Slot Locks",
		desc: "Instantly reserve venues and vendor dates without double-booking friction or scheduling clashes.",
	},
	{
		icon: Layers,
		title: "Synchronized Inventory",
		desc: "Live warehouse tracking for AV, staging, and seating assets tied directly to event orders.",
	},
	{
		icon: Users,
		title: "Role-Based Portals",
		desc: "Dedicated workspaces designed for event managers, vendors, inventory staff, and guests.",
	},
	{
		icon: ShieldCheck,
		title: "Verified Vendors & Ratings",
		desc: "Review transparent, attendee-backed scores and authentic feedback to book with confidence.",
	},
];

export default function FeaturesSection({ features = featuresData }) {
	return (
		<section id="features" className="py-16 bg-white border-y border-slate-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-12">
					<h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
						Enterprise Coordination Architecture
					</h2>
					<p className="text-slate-600 mt-2 text-sm sm:text-base">
						Say goodbye to disconnected WhatsApp threads, lost Excel sheets, and
						gear shortages.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feat, idx) => (
						<div key={idx} className="flex flex-col items-start text-left">
							<div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4 border border-blue-100">
								<feat.icon size={24} />
							</div>
							<h3 className="text-base font-bold text-slate-900 mb-1">
								{feat.title}
							</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								{feat.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
