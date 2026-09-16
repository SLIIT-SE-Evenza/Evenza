import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, Shield, Server, Activity } from "lucide-react";

export default function AdminDashboard() {
	return (
		<DashboardLayout activeRole="Admin">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
						Platform Administration
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Role assignments, account statuses, and system audit logs[cite: 1].
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs text-slate-500 uppercase font-bold">
							Total Accounts
						</p>
						<p className="text-2xl font-black text-slate-900 mt-1">1,420</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs text-slate-500 uppercase font-bold">
							Active Sessions
						</p>
						<p className="text-2xl font-black text-blue-600 mt-1">184 / 500</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs text-slate-500 uppercase font-bold">
							System Uptime
						</p>
						<p className="text-2xl font-black text-emerald-600 mt-1">99.8%</p>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200">
						<p className="text-xs text-slate-500 uppercase font-bold">
							Security Flags
						</p>
						<p className="text-2xl font-black text-amber-500 mt-1">0</p>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
