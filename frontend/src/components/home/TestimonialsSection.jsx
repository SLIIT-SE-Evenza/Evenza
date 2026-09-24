import React from "react";
import { Star, Quote, ShieldCheck } from "lucide-react";

const userTestimonials = [
	{
		id: 1,
		name: "Ms. Dilani Fernando",
		role: "Senior Event Coordinator",
		organization: "Lumina Weddings & Galas",
		avatar: "DF",
		rating: 5,
		highlight: "Zero double-bookings across concurrent timelines.",
		story:
			"Before Evenza, our coordination was scattered across WhatsApp and spreadsheets. Linked vendor schedules and activity slots now populate automatically once an event is approved, cutting our timeline review overhead in half.",
	},
	{
		id: 2,
		name: "Mr. Sahan Jayasinghe",
		role: "Vendor Relations Officer",
		organization: "Aura Sound & Stage Lighting",
		avatar: "SJ",
		rating: 5,
		highlight: "Direct online booking approvals without phone tag.",
		story:
			"We receive customer requests directly through the portal, verify live availability, and lock dates instantly. It keeps every booking record in one unified location and completely eliminates scheduling conflicts.",
	},
	{
		id: 3,
		name: "Ms. Tharushi Ekanayake",
		role: "Customer Experience Executive",
		organization: "Global Fintech Summit",
		avatar: "TE",
		rating: 5,
		highlight: "Transparent budgeting, schedule tracking, and vendor details.",
		story:
			"Having venue bookings, catering milestones, and payment schedules visible in one place gives clients complete peace of mind. The automated milestone reminders keep everyone perfectly on track.",
	},
];

export default function TestimonialsSection() {
	return (
		<section className="py-20 bg-slate-50 border-y border-slate-200/80">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Minimalist Section Header */}
				<div className="text-center max-w-2xl mx-auto mb-14">
					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3 border border-blue-200">
						<ShieldCheck size={14} className="text-blue-600" />
						Verified Feedback & Experiences
					</div>
					<h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
						Trusted by the people who run live events.
					</h2>
					<p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
						Real feedback from event planners, vendor partners, and coordinators
						managing real-world events on Evenza.
					</p>
				</div>

				{/* Minimal 3-Card Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{userTestimonials.map((item) => (
						<div
							key={item.id}
							className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
						>
							<div>
								{/* 5-Star Rating */}
								<div className="flex items-center gap-1 text-amber-400 mb-4">
									{[...Array(item.rating)].map((_, i) => (
										<Star key={i} size={14} className="fill-amber-400" />
									))}
								</div>

								{/* Key Highlight */}
								<h3 className="font-bold text-slate-900 text-base leading-snug mb-3">
									"{item.highlight}"
								</h3>

								{/* Testimonial Quote */}
								<p className="text-xs sm:text-sm text-slate-600 leading-relaxed relative">
									<span className="relative z-10 pl-2">{item.story}</span>
								</p>
							</div>

							{/* Author Info */}
							<div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
									{item.avatar}
								</div>
								<div className="min-w-0">
									<p className="text-xs font-bold text-slate-900 truncate">
										{item.name}
									</p>
									<p className="text-[11px] text-slate-500 truncate">
										{item.role} • {item.organization}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
