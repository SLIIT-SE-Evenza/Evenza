import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Check, X, AlertOctagon, Users, Calendar, Clock } from "lucide-react";

export default function ManagerDashboard() {
	const [approvals, setApprovals] = useState([
		{
			id: 1,
			title: "FinTech Awards Night",
			customer: "Amara Silva",
			date: "2026-10-18",
			venue: "Lotus Ballroom",
			pax: 150,
		},
		{
			id: 2,
			title: "Perera Silver Jubilee",
			customer: "Devinda Perera",
			date: "2026-10-22",
			venue: "Grand Pavilion",
			pax: 80,
		},
	]);

	const handleAction = (id) => {
		setApprovals(approvals.filter((item) => item.id !== id));
	};

	return (
		<DashboardLayout activeRole="Event Manager">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
						Manager Oversight & Approvals
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Resolve booking bottlenecks, verify logistics feasibility, and
						eliminate schedule conflicts.
					</p>
				</div>

				{/* 4-Column Operational KPIs */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs font-semibold text-slate-500 uppercase">
							Pending Approvals
						</p>
						<p className="text-2xl font-black text-amber-600 mt-1">
							{approvals.length}
						</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs font-semibold text-slate-500 uppercase">
							Events This Week
						</p>
						<p className="text-2xl font-black text-blue-600 mt-1">4</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs font-semibold text-slate-500 uppercase">
							Unassigned Tasks
						</p>
						<p className="text-2xl font-black text-slate-800 mt-1">9</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs font-semibold text-slate-500 uppercase">
							Schedule Conflicts
						</p>
						<p className="text-2xl font-black text-emerald-600 mt-1">0</p>
					</div>
				</div>

				{/* Event Approval Queue */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="p-4 border-b border-slate-200">
						<h3 className="font-bold text-slate-900 text-sm">
							Awaiting Manager Verification
						</h3>
					</div>
					<table className="w-full text-xs text-left">
						<thead className="bg-slate-50 text-slate-500 font-semibold">
							<tr>
								<th className="py-3 px-4">Event Title</th>
								<th className="py-3 px-4">Organizer</th>
								<th className="py-3 px-4">Date</th>
								<th className="py-3 px-4">Venue</th>
								<th className="py-3 px-4 text-right">Attendees</th>
								<th className="py-3 px-4 text-center">Decision</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{approvals.map((row) => (
								<tr key={row.id} className="hover:bg-slate-50">
									<td className="py-3.5 px-4 font-bold text-slate-900">
										{row.title}
									</td>
									<td className="py-3.5 px-4 text-slate-600">{row.customer}</td>
									<td className="py-3.5 px-4 text-slate-600">{row.date}</td>
									<td className="py-3.5 px-4 text-slate-600">{row.venue}</td>
									<td className="py-3.5 px-4 text-right font-semibold">
										{row.pax} Pax
									</td>
									<td className="py-3.5 px-4 text-center space-x-2">
										<button
											onClick={() => handleAction(row.id)}
											className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-bold inline-flex items-center gap-1"
										>
											<Check size={14} /> Approve
										</button>
										<button
											onClick={() => handleAction(row.id)}
											className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold inline-flex items-center gap-1"
										>
											<X size={14} /> Reject
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{approvals.length === 0 && (
						<div className="p-8 text-center text-slate-400 text-xs">
							All event approvals cleared.
						</div>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
}
