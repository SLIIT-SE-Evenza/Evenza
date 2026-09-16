import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
	Package,
	Boxes,
	CalendarCheck,
	AlertTriangle,
	ArrowRight,
	ShieldAlert,
	Check,
} from "lucide-react";

export default function InventoryDashboard() {
	const [allocatedQty, setAllocatedQty] = useState(25);
	const [allocationSuccess, setAllocationSuccess] = useState(false);

	const kpiStats = [
		{
			title: "Total Asset Types",
			value: "142",
			sub: "+6 categories active",
			icon: Package,
			color: "text-blue-600 bg-blue-50 border-blue-100",
		},
		{
			title: "Units in Warehouse",
			value: "4,850",
			sub: "Chairs, Tables, AV, Staging",
			icon: Boxes,
			color: "text-indigo-600 bg-indigo-50 border-indigo-100",
		},
		{
			title: "Active Allocations",
			value: "1,280",
			sub: "Circulating in 8 events",
			icon: CalendarCheck,
			color: "text-emerald-600 bg-emerald-50 border-emerald-100",
		},
		{
			title: "Low Stock Warnings",
			value: "3 Items",
			sub: "Below safety threshold",
			icon: AlertTriangle,
			color: "text-amber-600 bg-amber-50 border-amber-100",
		},
	];

	const lowStockItems = [
		{
			name: "Banquet Velvet Chairs",
			sku: "INV-1002",
			available: 8,
			threshold: 25,
			category: "Seating",
		},
		{
			name: "Wireless Shure Mic Kit",
			sku: "INV-1044",
			available: 2,
			threshold: 5,
			category: "AV Equipment",
		},
		{
			name: "LED Par Can Lights",
			sku: "INV-1090",
			available: 4,
			threshold: 12,
			category: "Lighting",
		},
	];

	const handleAllocate = (e) => {
		e.preventDefault();
		if (allocatedQty > 45) {
			alert("Error: Cannot exceed available stock limit (45 units remaining).");
			return;
		}
		setAllocationSuccess(true);
		setTimeout(() => setAllocationSuccess(false), 3000);
	};

	return (
		<DashboardLayout activeRole="Inventory Staff">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
						Inventory Overview & Metrics
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Real-time warehouse tracking, safe stock thresholds, and live event
						equipment dispatch.
					</p>
				</div>

				{/* KPI Cards Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{kpiStats.map((kpi, idx) => {
						const Icon = kpi.icon;
						return (
							<div
								key={idx}
								className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
							>
								<div>
									<p className="text-xs font-semibold text-slate-500 uppercase">
										{kpi.title}
									</p>
									<p className="text-2xl font-black text-slate-900 mt-1">
										{kpi.value}
									</p>
									<p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
								</div>
								<div className={`p-3 rounded-xl border ${kpi.color}`}>
									<Icon size={22} />
								</div>
							</div>
						);
					})}
				</div>

				{/* Split Section: Critical Low Stock & Equipment Allocator */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Critical Low Stock Table (60%) */}
					<div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="font-bold text-slate-900 flex items-center gap-2">
									<ShieldAlert size={18} className="text-amber-500" />
									Critical Low-Stock Watchlist
								</h3>
								<p className="text-xs text-slate-400">
									Items below configured minimum reserve limit.
								</p>
							</div>
							<a
								href="/dashboard/inventory/catalog"
								className="text-xs font-semibold text-blue-600 hover:underline"
							>
								View Catalog
							</a>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-xs text-left">
								<thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
									<tr>
										<th className="py-2.5 px-3">Item & SKU</th>
										<th className="py-2.5 px-3">Category</th>
										<th className="py-2.5 px-3 text-right">Available</th>
										<th className="py-2.5 px-3 text-right">Threshold</th>
										<th className="py-2.5 px-3 text-center">Action</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{lowStockItems.map((item) => (
										<tr key={item.sku} className="hover:bg-slate-50">
											<td className="py-3 px-3 font-semibold text-slate-800">
												{item.name}
												<p className="font-mono text-[10px] text-slate-400">
													{item.sku}
												</p>
											</td>
											<td className="py-3 px-3 text-slate-500">
												{item.category}
											</td>
											<td className="py-3 px-3 text-right font-bold text-amber-600">
												{item.available}
											</td>
											<td className="py-3 px-3 text-right text-slate-400">
												{item.threshold}
											</td>
											<td className="py-3 px-3 text-center">
												<button className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-md text-[11px] transition-colors">
													+ Restock
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Quick Equipment Allocator Drawer (40%) */}
					<div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
						<div>
							<h3 className="font-bold text-slate-900 mb-1">
								Allocate Gear to Event
							</h3>
							<p className="text-xs text-slate-400 mb-4">
								Assign warehouse units directly to approved event reservations.
							</p>

							{allocationSuccess && (
								<div className="p-3 mb-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
									<Check size={16} /> Gear successfully reserved and allocated!
								</div>
							)}

							<form onSubmit={handleAllocate} className="space-y-3">
								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1">
										Target Approved Event
									</label>
									<select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500">
										<option>Perera Wedding Reception (2026-10-12)</option>
										<option>Tech Pulse Colombo Conference (2026-11-04)</option>
									</select>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1">
										Select Equipment
									</label>
									<select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500">
										<option>Ergonomic Banquet Chairs (45 in stock)</option>
										<option>Heavy-Duty Truss Stage (4 in stock)</option>
									</select>
								</div>

								<div>
									<div className="flex justify-between text-xs font-semibold mb-1">
										<span className="text-slate-600">Quantity Needed</span>
										<span className="text-slate-400">Max limit: 45</span>
									</div>
									<input
										type="number"
										min="1"
										max="45"
										value={allocatedQty}
										onChange={(e) => setAllocatedQty(Number(e.target.value))}
										className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<button
									type="submit"
									className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-2"
								>
									<span>Confirm Allocation</span>
									<ArrowRight size={14} />
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
