import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const pricingTiers = [
	{
		name: "Starter / Customer",
		tagline: "For individual planners and private celebration hosts.",
		monthlyPrice: 0,
		annualPrice: 0,
		badge: null,
		highlight: false,
		ctaText: "Get Started Free",
		ctaLink: "/register",
		features: [
			"Access to public venue & vendor directory",
			"Real-time availability slot checks",
			"Customer booking portal & status tracking",
			"Claim vendor promotional discount packages",
			"Standard email booking notifications",
		],
	},
	{
		name: "Vendor Pro",
		tagline: "For independent vendors, decorators, and AV technicians.",
		monthlyPrice: 29,
		annualPrice: 24, // 20% savings
		badge: "Most Popular",
		highlight: true,
		ctaText: "Start 14-Day Pro Trial",
		ctaLink: "/register",
		features: [
			"Dedicated Vendor Portal & calendar locks",
			"Publish custom promotions & package discounts",
			"Ad performance analytics (impressions, clicks)",
			"Direct gig request approvals & declines",
			"Verified vendor badge & client review showcase",
			"Direct client messaging & inquiry conversion",
		],
	},
	{
		name: "Event Agency & Fleet",
		tagline: "For full-scale event companies and inventory depots.",
		monthlyPrice: 89,
		annualPrice: 72, // 20% savings
		badge: "Enterprise",
		highlight: false,
		ctaText: "Contact Platform Sales",
		ctaLink: "/inquiries",
		features: [
			"Everything in Vendor Pro plan",
			"Multi-track event schedule & timeline coordinator",
			"Live warehouse inventory & asset allocation",
			"Stock threshold alerts & maintenance audit logs",
			"Multi-role team workspaces (Manager, Staff, Client)",
			"Dedicated account manager & priority SLA",
		],
	},
];

export default function PricingSection() {
	const [annualBilling, setAnnualBilling] = useState(false);

	return (
		<section
			id="pricing"
			className="py-20 bg-slate-50 border-y border-slate-200/80"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-12">
					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3 border border-blue-200">
						<Sparkles size={14} className="text-blue-600" />
						Transparent Platform Plans
					</div>
					<h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
						Predictable plans for every stage of event coordination.
					</h2>
					<p className="mt-3 text-sm sm:text-base text-slate-600">
						Whether you are booking your first venue or synchronizing hundreds
						of vendor timelines and inventory assets.
					</p>

					{/* Billing Interval Toggle */}
					<div className="mt-8 inline-flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
						<button
							type="button"
							onClick={() => setAnnualBilling(false)}
							className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
								!annualBilling
									? "bg-blue-600 text-white shadow-xs"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							Monthly Billing
						</button>
						<button
							type="button"
							onClick={() => setAnnualBilling(true)}
							className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
								annualBilling
									? "bg-blue-600 text-white shadow-xs"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<span>Annual Billing</span>
							<span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
								Save 20%
							</span>
						</button>
					</div>
				</div>

				{/* Pricing Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
					{pricingTiers.map((tier) => {
						const price = annualBilling ? tier.annualPrice : tier.monthlyPrice;

						return (
							<div
								key={tier.name}
								className={`relative rounded-2xl flex flex-col justify-between p-8 transition-all duration-200 ${
									tier.highlight
										? "bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 scale-100 md:-translate-y-2"
										: "bg-white border border-slate-200/90 shadow-xs hover:shadow-md"
								}`}
							>
								{/* Popular Badge */}
								{tier.badge && (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2">
										<span
											className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs ${
												tier.highlight
													? "bg-blue-600 text-white"
													: "bg-slate-900 text-slate-200"
											}`}
										>
											{tier.badge}
										</span>
									</div>
								)}

								<div>
									<h3 className="text-xl font-bold text-slate-900 tracking-tight">
										{tier.name}
									</h3>
									<p className="text-xs text-slate-500 mt-1 min-h-[32px]">
										{tier.tagline}
									</p>

									{/* Price Block */}
									<div className="mt-6 mb-6 pb-6 border-b border-slate-100 flex items-baseline gap-1">
										<span className="text-4xl sm:text-5xl font-black text-slate-900">
											${price}
										</span>
										<span className="text-xs font-semibold text-slate-400">
											{price === 0 ? "forever" : "/ month"}
										</span>
									</div>

									{/* Features List */}
									<div className="space-y-3 mb-8">
										<p className="text-xs font-bold uppercase tracking-wider text-slate-400">
											Included Capabilities:
										</p>
										<ul className="space-y-2.5">
											{tier.features.map((feature, idx) => (
												<li
													key={idx}
													className="flex items-start gap-2.5 text-xs text-slate-600"
												>
													<Check
														size={16}
														className={`shrink-0 mt-0.5 ${
															tier.highlight
																? "text-blue-600"
																: "text-emerald-500"
														}`}
													/>
													<span>{feature}</span>
												</li>
											))}
										</ul>
									</div>
								</div>

								{/* CTA Action */}
								<Link
									to={tier.ctaLink}
									className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
										tier.highlight
											? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 shadow-md active:scale-[0.98]"
											: "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 active:scale-[0.98]"
									}`}
								>
									<span>{tier.ctaText}</span>
									<ArrowRight size={14} />
								</Link>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
