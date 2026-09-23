import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
	Tag,
	Plus,
	Calendar,
	Eye,
	MousePointerClick,
	TrendingUp,
	Percent,
	DollarSign,
	AlertCircle,
	Clock,
	Trash,
	CheckCircle2,
	X,
	Sparkles,
} from "lucide-react";

export default function VendorPromotionsPage() {
	const [promotions, setPromotions] = useState([
		{
			id: 1,
			title: "Early Bird Wedding Package",
			serviceCategory: "Venues & Banquets",
			discountType: "PERCENTAGE", // PERCENTAGE, FLAT_AMOUNT, COMPLIMENTARY
			discountValue: 20,
			bannerUrl: "",
			startDate: "2026-10-01",
			endDate: "2026-11-30",
			terms: "Valid on bookings with at least 150 guests.",
			status: "ACTIVE", // ACTIVE, DRAFT, EXPIRED, PAUSED
			impressions: 1420,
			clicks: 348,
			conversions: 18,
		},
		{
			id: 2,
			title: "Free Acoustic Soundboard Upgrade",
			serviceCategory: "AV & Acoustics",
			discountType: "COMPLIMENTARY",
			discountValue: 0,
			bannerUrl: "",
			startDate: "2026-09-01",
			endDate: "2026-09-30",
			terms: "Applied automatically on all concert setups.",
			status: "ACTIVE",
			impressions: 890,
			clicks: 172,
			conversions: 9,
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formError, setFormError] = useState("");
	const [form, setForm] = useState({
		title: "",
		serviceCategory: "Venues & Banquets",
		discountType: "PERCENTAGE",
		discountValue: "",
		startDate: "",
		endDate: "",
		terms: "",
	});

	// Fetch promotions from FR6 backend controller on mount
	useEffect(() => {
		fetch("/api/promotions/vendor")
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) setPromotions(data);
			})
			.catch((err) =>
				console.warn("Backend not reached, using local state", err),
			);
	}, []);

	const handleCreatePromotion = async (e) => {
		e.preventDefault();
		setFormError("");

		if (!form.title.trim() || !form.startDate || !form.endDate) {
			setFormError("Please fill out all required fields.");
			return;
		}

		if (new Date(form.startDate) >= new Date(form.endDate)) {
			setFormError("End date must be later than the start date.");
			return;
		}

		const newPromo = {
			id: "promo_" + Date.now(),
			title: form.title.trim(),
			serviceCategory: form.serviceCategory,
			discountType: form.discountType,
			discountValue: parseFloat(form.discountValue) || 0,
			startDate: form.startDate,
			endDate: form.endDate,
			terms:
				form.terms.trim() || "Standard vendor service contract rules apply.",
			status: "ACTIVE",
			impressions: 0,
			clicks: 0,
			conversions: 0,
		};

		try {
			const res = await fetch("/api/promotions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newPromo),
			});

			if (res.ok) {
				const saved = await res.json();
				setPromotions((prev) => [saved, ...prev]);
			} else {
				setPromotions((prev) => [newPromo, ...prev]);
			}
		} catch {
			setPromotions((prev) => [newPromo, ...prev]);
		}

		setIsModalOpen(false);
		setForm({
			title: "",
			serviceCategory: "Venues & Banquets",
			discountType: "PERCENTAGE",
			discountValue: "",
			startDate: "",
			endDate: "",
			terms: "",
		});
	};

	const handleToggleStatus = async (id, currentStatus) => {
		const nextStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
		try {
			await fetch(`/api/promotions/${id}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: nextStatus }),
			});
		} catch (err) {
			console.warn("Backend update failed, updating local state", err);
		}

		setPromotions((prev) =>
			prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)),
		);
	};

	const handleDelete = async (id) => {
		if (
			!window.confirm(
				"Are you sure you want to deactivate and remove this offer?",
			)
		)
			return;
		try {
			await fetch(`/api/promotions/${id}`, { method: "DELETE" });
		} catch (err) {
			console.warn("Backend update failed, removing locally", err);
		}
		setPromotions((prev) => prev.filter((p) => p.id !== id));
	};

	const totalImpressions = promotions.reduce(
		(acc, p) => acc + (p.impressions || 0),
		0,
	);
	const totalClicks = promotions.reduce((acc, p) => acc + (p.clicks || 0), 0);
	const totalConversions = promotions.reduce(
		(acc, p) => acc + (p.conversions || 0),
		0,
	);

	return (
		<DashboardLayout activeRole="Vendor">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
							Promotions & Advertisement Manager
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Publish service packages, manage discount parameters, and track
							marketing analytics[cite: 3, 4].
						</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
					>
						<Plus size={16} />
						<span>Create New Promotion</span>
					</button>
				</div>

				{/* Campaign Metrics Overview (Sub-function 4) */}
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-500 uppercase">
								Live Campaigns
							</p>
							<p className="text-2xl font-black text-slate-900 mt-1">
								{promotions.filter((p) => p.status === "ACTIVE").length}
							</p>
						</div>
						<div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
							<Tag size={20} />
						</div>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-500 uppercase">
								Total Impressions
							</p>
							<p className="text-2xl font-black text-indigo-600 mt-1">
								{totalImpressions.toLocaleString()}
							</p>
						</div>
						<div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
							<Eye size={20} />
						</div>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-500 uppercase">
								Clicks
							</p>
							<p className="text-2xl font-black text-emerald-600 mt-1">
								{totalClicks.toLocaleString()}
							</p>
						</div>
						<div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
							<MousePointerClick size={20} />
						</div>
					</div>
					<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-500 uppercase">
								Inquiry Conversions
							</p>
							<p className="text-2xl font-black text-amber-600 mt-1">
								{totalConversions.toLocaleString()}
							</p>
						</div>
						<div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
							<TrendingUp size={20} />
						</div>
					</div>
				</div>

				{/* Promotions List Table */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="p-4 border-b border-slate-200 flex justify-between items-center">
						<h3 className="font-bold text-slate-900 text-sm">
							Campaigns & Offers (FR6)
						</h3>
						<span className="text-xs text-slate-400">
							Manage campaign statuses & validities[cite: 3, 4]
						</span>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-xs text-left">
							<thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
								<tr>
									<th className="py-3 px-4">Offer Title</th>
									<th className="py-3 px-4">Category</th>
									<th className="py-3 px-4">Benefit</th>
									<th className="py-3 px-4">Validity Range</th>
									<th className="py-3 px-4 text-center">Status</th>
									<th className="py-3 px-4 text-right">
										Analytics (Imp / Clicks / Conv)
									</th>
									<th className="py-3 px-4 text-center">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{promotions.map((p) => (
									<tr
										key={p.id}
										className="hover:bg-slate-50 transition-colors"
									>
										<td className="py-3.5 px-4 font-bold text-slate-900">
											{p.title}
											<p className="text-[11px] text-slate-400 font-normal truncate max-w-xs">
												{p.terms}
											</p>
										</td>
										<td className="py-3.5 px-4 text-slate-600">
											{p.serviceCategory}
										</td>
										<td className="py-3.5 px-4">
											<span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full text-[11px]">
												{p.discountType === "PERCENTAGE" &&
													`${p.discountValue}% OFF`}
												{p.discountType === "FLAT_AMOUNT" &&
													`Rs. ${p.discountValue} OFF`}
												{p.discountType === "COMPLIMENTARY" &&
													"Complimentary Perk"}
											</span>
										</td>
										<td className="py-3.5 px-4 text-slate-500">
											{p.startDate} → {p.endDate}
										</td>
										<td className="py-3.5 px-4 text-center">
											<span
												className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
													p.status === "ACTIVE"
														? "bg-emerald-50 text-emerald-700 border-emerald-200"
														: "bg-slate-100 text-slate-500 border-slate-200"
												}`}
											>
												{p.status}
											</span>
										</td>
										<td className="py-3.5 px-4 text-right font-mono text-slate-700">
											{p.impressions} / {p.clicks} / {p.conversions}
										</td>
										<td className="py-3.5 px-4 text-center">
											<div className="flex items-center justify-center gap-2">
												<button
													onClick={() => handleToggleStatus(p.id, p.status)}
													className="px-2.5 py-1 text-[11px] font-semibold rounded border border-slate-300 hover:bg-slate-50 text-slate-700"
												>
													{p.status === "ACTIVE" ? "Pause" : "Resume"}
												</button>
												<button
													onClick={() => handleDelete(p.id)}
													className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
												>
													<Trash size={14} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{promotions.length === 0 && (
							<div className="p-8 text-center text-xs text-slate-400">
								No campaigns created yet.
							</div>
						)}
					</div>
				</div>

				{/* Modal: Create Promotion (T-23.1 to T-23.5) */}
				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div
							className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
							onClick={() => setIsModalOpen(false)}
						/>
						<div className="bg-white rounded-xl shadow-xl w-full max-w-lg z-10 overflow-hidden">
							<div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
								<h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
									<Sparkles size={16} className="text-blue-600" />
									Create Promotional Offer
								</h3>
								<button
									onClick={() => setIsModalOpen(false)}
									className="text-slate-400 hover:text-slate-600"
								>
									<X size={16} />
								</button>
							</div>

							{formError && (
								<div className="m-4 mb-0 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
									<AlertCircle size={15} />
									<span>{formError}</span>
								</div>
							)}

							<form
								onSubmit={handleCreatePromotion}
								className="p-5 space-y-3.5"
							>
								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1">
										Campaign Title <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										required
										placeholder="e.g. 15% Off Corporate Weekend Catering"
										value={form.title}
										onChange={(e) =>
											setForm({ ...form, title: e.target.value })
										}
										className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Service Category
										</label>
										<select
											value={form.serviceCategory}
											onChange={(e) =>
												setForm({ ...form, serviceCategory: e.target.value })
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option>Venues & Banquets</option>
											<option>Catering Services</option>
											<option>AV & Acoustics</option>
											<option>Photography & Video</option>
											<option>Stage & Decor</option>
										</select>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Discount Model
										</label>
										<select
											value={form.discountType}
											onChange={(e) =>
												setForm({ ...form, discountType: e.target.value })
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="PERCENTAGE">Percentage (%) Off</option>
											<option value="FLAT_AMOUNT">Flat Amount (LKR) Off</option>
											<option value="COMPLIMENTARY">Free Add-on / Perk</option>
										</select>
									</div>
								</div>

								{form.discountType !== "COMPLIMENTARY" && (
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Discount Value (
											{form.discountType === "PERCENTAGE" ? "%" : "LKR"})
										</label>
										<input
											type="number"
											required
											min="1"
											placeholder={
												form.discountType === "PERCENTAGE" ? "20" : "15000"
											}
											value={form.discountValue}
											onChange={(e) =>
												setForm({ ...form, discountValue: e.target.value })
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								)}

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Start Date
										</label>
										<input
											type="date"
											required
											value={form.startDate}
											onChange={(e) =>
												setForm({ ...form, startDate: e.target.value })
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											End Date
										</label>
										<input
											type="date"
											required
											value={form.endDate}
											onChange={(e) =>
												setForm({ ...form, endDate: e.target.value })
											}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1">
										Offer Terms & Eligibility
									</label>
									<textarea
										rows={2}
										placeholder="e.g. Applicable only for bookings confirmed 30 days in advance."
										value={form.terms}
										onChange={(e) =>
											setForm({ ...form, terms: e.target.value })
										}
										className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
									<button
										type="button"
										onClick={() => setIsModalOpen(false)}
										className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
									>
										Publish Campaign
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
