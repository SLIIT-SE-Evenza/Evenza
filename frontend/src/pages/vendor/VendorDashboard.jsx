import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Calendar, Tag, Star, ArrowRight, Check, X } from "lucide-react";

export default function VendorDashboard() {
	const [requests, setRequests] = useState([
		{
			id: 1,
			customer: "Suren Fernando",
			event: "Corporate Annual Gala",
			date: "2026-11-14",
			pax: 200,
		},
	]);

	return (
		<DashboardLayout activeRole="Vendor">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
						Vendor Gig Management
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Accept booking requests and publish promotional packages.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs font-semibold text-slate-500 uppercase">
							Incoming Bookings
						</p>
						<p className="text-2xl font-black text-blue-600 mt-1">3</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs font-semibold text-slate-500 uppercase">
							Confirmed Gigs
						</p>
						<p className="text-2xl font-black text-slate-800 mt-1">8</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs font-semibold text-slate-500 uppercase">
							Average Rating
						</p>
						<p className="text-2xl font-black text-amber-500 mt-1">4.9 / 5.0</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs font-semibold text-slate-500 uppercase">
							Ad Impressions
						</p>
						<p className="text-2xl font-black text-indigo-600 mt-1">1,240</p>
					</div>
				</div>

				{/* Requests Feed */}
				<div className="bg-white rounded-xl border border-slate-200 p-5">
					<h3 className="font-bold text-sm text-slate-900 mb-3">
						Incoming Booking Requests
					</h3>
					<div className="space-y-3">
						{requests.map((r) => (
							<div
								key={r.id}
								className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
							>
								<div>
									<h4 className="font-bold text-sm text-slate-900">
										{r.event}
									</h4>
									<p className="text-xs text-slate-500">
										Requested by {r.customer} â€¢ Target Date: {r.date} ({r.pax}{" "}
										Guests)
									</p>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => setRequests([])}
										className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700"
									>
										Accept Gig
									</button>
									<button
										onClick={() => setRequests([])}
										className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded text-xs font-medium hover:bg-slate-100"
									>
										Decline
									</button>
								</div>
							</div>
						))}
						{requests.length === 0 && (
							<p className="text-xs text-slate-400">
								No pending booking requests.
							</p>
						)}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
