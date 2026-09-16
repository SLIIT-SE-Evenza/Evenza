import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	Plus,
	ArrowRight,
} from "lucide-react";

export default function CustomerDashboard() {
	const steps = [
		{ title: "Draft", completed: true },
		{ title: "Submitted", completed: true },
		{ title: "Approved", completed: true },
		{ title: "In Progress", current: true },
		{ title: "Completed", completed: false },
	];

	const bookings = [
		{
			vendor: "Lumina Grand Ballroom",
			type: "Venue",
			date: "2026-10-12",
			cost: "250,000 LKR",
			status: "Confirmed",
			payment: "Deposit Paid",
		},
		{
			vendor: "Aura Sound Systems",
			type: "AV & Acoustics",
			date: "2026-10-12",
			cost: "85,000 LKR",
			status: "Confirmed",
			payment: "Paid",
		},
		{
			vendor: "Crest Gourmet",
			type: "Catering",
			date: "2026-10-12",
			cost: "320,000 LKR",
			status: "Pending",
			payment: "Pending",
		},
	];

	return (
		<DashboardLayout activeRole="Customer">
			<div className="space-y-6">
				{/* Banner with Action */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<span className="text-xs uppercase tracking-widest font-bold text-blue-200">
							Active Event Timeline
						</span>
						<h1 className="text-2xl font-bold mt-1">
							Wedding Reception — Colombo Grand
						</h1>
						<p className="text-xs text-blue-100 mt-0.5">
							Event Date: October 12, 2026 (26 Days Remaining)
						</p>
					</div>
					<button className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm transition-all">
						<Plus size={16} /> Plan New Event
					</button>
				</div>

				{/* Stepped Progress Tracker */}
				<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
					<p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
						Event Lifecycle Status
					</p>
					<div className="flex items-center justify-between max-w-2xl">
						{steps.map((step, idx) => (
							<div key={idx} className="flex items-center gap-2">
								<div
									className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
										step.completed
											? "bg-emerald-100 text-emerald-700"
											: step.current
												? "bg-blue-600 text-white"
												: "bg-slate-100 text-slate-400"
									}`}
								>
									{step.completed ? <CheckCircle2 size={16} /> : idx + 1}
								</div>
								<span
									className={`text-xs font-semibold ${step.current ? "text-blue-600" : "text-slate-600"}`}
								>
									{step.title}
								</span>
								{idx < steps.length - 1 && (
									<div className="w-8 sm:w-12 h-0.5 bg-slate-200 mx-1"></div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Bookings & Payments Data Table */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="p-4 border-b border-slate-200 flex justify-between items-center">
						<h3 className="font-bold text-slate-900 text-sm">
							Vendor Contracts & Payments
						</h3>
						<span className="text-xs text-slate-400">
							Currency: Sri Lankan Rupee (LKR)
						</span>
					</div>
					<table className="w-full text-xs text-left">
						<thead className="bg-slate-50 text-slate-500 font-semibold">
							<tr>
								<th className="py-3 px-4">Vendor</th>
								<th className="py-3 px-4">Service</th>
								<th className="py-3 px-4">Date</th>
								<th className="py-3 px-4 text-right">Cost</th>
								<th className="py-3 px-4">Booking Status</th>
								<th className="py-3 px-4">Payment</th>
								<th className="py-3 px-4 text-center">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{bookings.map((b, i) => (
								<tr key={i} className="hover:bg-slate-50">
									<td className="py-3.5 px-4 font-bold text-slate-800">
										{b.vendor}
									</td>
									<td className="py-3.5 px-4 text-slate-500">{b.type}</td>
									<td className="py-3.5 px-4 text-slate-600">{b.date}</td>
									<td className="py-3.5 px-4 text-right font-semibold text-slate-800">
										{b.cost}
									</td>
									<td className="py-3.5 px-4">
										<span
											className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
												b.status === "Confirmed"
													? "bg-emerald-100 text-emerald-700"
													: "bg-amber-100 text-amber-700"
											}`}
										>
											{b.status}
										</span>
									</td>
									<td className="py-3.5 px-4 text-slate-600">{b.payment}</td>
									<td className="py-3.5 px-4 text-center">
										<button className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded text-[11px] font-semibold transition-colors">
											Details
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</DashboardLayout>
	);
}
