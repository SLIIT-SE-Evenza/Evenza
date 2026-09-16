import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { QrCode, MapPin, Calendar } from "lucide-react";

export default function GuestDashboard() {
	return (
		<DashboardLayout activeRole="Guest">
			<div className="space-y-6 max-w-4xl mx-auto">
				<div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6">
					<div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
						<QrCode size={120} className="text-slate-800" />
						<p className="text-[10px] text-center text-slate-400 mt-1 font-mono">
							TICKET: #EV-9821
						</p>
					</div>
					<div>
						<span className="text-xs font-bold text-blue-600 uppercase">
							Confirmed Attendee Pass
						</span>
						<h2 className="text-2xl font-bold text-slate-900 mt-1">
							Tech Pulse Colombo 2026
						</h2>
						<p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
							<Calendar size={14} /> November 04, 2026 â€¢ 09:00 AM - 05:00 PM
						</p>
						<p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
							<MapPin size={14} /> Main Auditorium, BMICH, Colombo
						</p>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
