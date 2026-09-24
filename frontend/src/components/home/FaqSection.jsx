import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqData = [
	{
		id: 1,
		question: "What is event management software?",
		answer:
			"Event management software is an end-to-end digital solution designed to plan, coordinate, and execute events. It automates workflows such as venue bookings, vendor scheduling, attendee registration, budgeting, and physical asset allocation within a unified platform.",
	},
	{
		id: 2,
		question:
			"How does event management software help organize successful events?",
		answer:
			"It eliminates manual overhead and communication silos across phone calls and spreadsheets. By maintaining centralized timelines, synchronizing real-time vendor availability, and automating notifications, coordinators can prevent double-bookings and ensure milestones are delivered on time.",
	},
	{
		id: 3,
		question: "What are the key features of event management software?",
		answer:
			"Core features include real-time calendar and slot locking, vendor inquiry and rating systems, physical inventory tracking with safe operational thresholds, role-based dashboards (for clients, managers, and vendors), and promotional offer management.",
	},
	{
		id: 4,
		question: "How is Evenza different from other event management platforms?",
		answer:
			"Evenza bridges the gap between client discovery, event planning, and back-of-house logistics. Unlike isolated ticketing tools, Evenza ties client requests directly to live vendor schedules and warehouse asset availability in one synchronized coordination pipeline.",
	},
	{
		id: 5,
		question:
			"What is the difference between virtual event management software and webinar software?",
		answer:
			"Webinar software focuses purely on real-time video broadcasting and audience presentation tools. In contrast, comprehensive event management software orchestrates the entire operational lifecycle—including vendor contracts, equipment logistics, multi-track agendas, payment records, and post-event analytics.",
	},
];

export default function FaqSection() {
	const [openId, setOpenId] = useState(null);

	const toggleFaq = (id) => {
		setOpenId((prevId) => (prevId === id ? null : id));
	};

	return (
		<section id="faq" className="py-20 bg-white border-b border-slate-200">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="mb-12">
					<h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
						Frequently Asked Questions
					</h2>
					<p className="mt-2 text-sm sm:text-base text-slate-500">
						Find answers to common questions about managing events and vendors
						on Evenza.
					</p>
				</div>

				{/* Minimalist Border-Divided Accordion List */}
				<div className="border-t border-slate-200">
					{faqData.map((item) => {
						const isOpen = openId === item.id;

						return (
							<div
								key={item.id}
								className="border-b border-slate-200 transition-colors"
							>
								<button
									type="button"
									onClick={() => toggleFaq(item.id)}
									aria-expanded={isOpen}
									className="w-full py-6 flex items-center justify-between text-left group focus:outline-hidden"
								>
									<span className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors pr-6">
										{item.question}
									</span>
									<motion.div
										animate={{ rotate: isOpen ? 180 : 0 }}
										transition={{ duration: 0.25, ease: "easeInOut" }}
										className="shrink-0 text-slate-500 group-hover:text-slate-900 transition-colors"
									>
										<ChevronDown size={22} strokeWidth={2} />
									</motion.div>
								</button>

								{/* Smooth Expansion Animation */}
								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											key="content"
											initial={{ height: 0, opacity: 0 }}
											animate={{
												height: "auto",
												opacity: 1,
												transition: {
													height: {
														duration: 0.3,
														ease: [0.04, 0.62, 0.23, 0.98],
													},
													opacity: { duration: 0.2, delay: 0.05 },
												},
											}}
											exit={{
												height: 0,
												opacity: 0,
												transition: {
													height: { duration: 0.25, ease: "easeInOut" },
													opacity: { duration: 0.15 },
												},
											}}
											className="overflow-hidden"
										>
											<div className="pb-6 pr-8 text-sm sm:text-base text-slate-600 leading-relaxed">
												{item.answer}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
