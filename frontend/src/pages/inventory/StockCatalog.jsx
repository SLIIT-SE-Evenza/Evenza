import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
	Search,
	Plus,
	Filter,
	MoreHorizontal,
	Edit,
	Trash,
	X,
	Package,
	AlertCircle,
} from "lucide-react";

export default function StockCatalog() {
	const [inventory, setInventory] = useState([
		{
			id: "1",
			sku: "INV-1002",
			name: "Banquet Velvet Chairs",
			category: "Seating",
			totalQuantity: 50,
			allocatedQuantity: 42,
			minSafetyLimit: 25,
			conditionStatus: "Good",
			unitCost: 1500,
		},
		{
			id: "2",
			sku: "INV-1044",
			name: "Wireless Shure Mic Kit",
			category: "AV Equipment",
			totalQuantity: 10,
			allocatedQuantity: 8,
			minSafetyLimit: 5,
			conditionStatus: "New",
			unitCost: 12000,
		},
		{
			id: "3",
			sku: "INV-1090",
			name: "LED Par Can Lights",
			category: "Lighting",
			totalQuantity: 20,
			allocatedQuantity: 16,
			minSafetyLimit: 12,
			conditionStatus: "Needs Maintenance",
			unitCost: 4500,
		},
		{
			id: "4",
			sku: "INV-1105",
			name: "Round Wooden Dining Tables",
			category: "Tables",
			totalQuantity: 30,
			allocatedQuantity: 10,
			minSafetyLimit: 10,
			conditionStatus: "Good",
			unitCost: 8000,
		},
	]);

	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("All");
	const [conditionFilter, setConditionFilter] = useState("All");

	// Modals state
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [openDropdown, setOpenDropdown] = useState(null);

	// Form states
	const [newItemName, setNewItemName] = useState("");
	const [newItemCategory, setNewItemCategory] = useState("Seating");
	const [newItemQuantity, setNewItemQuantity] = useState(1);
	const [newItemMinSafety, setNewItemMinSafety] = useState(10);
	const [newItemCondition, setNewItemCondition] = useState("New");
	const [newItemUnitCost, setNewItemUnitCost] = useState("");

	const [adjustType, setAdjustType] = useState("restock");
	const [adjustDelta, setAdjustDelta] = useState(1);
	const [adjustReason, setAdjustReason] = useState("Supplier Delivery");

	// Try fetching from backend API on mount, keeping fallback mock data if disconnected
	useEffect(() => {
		fetch("/api/inventory/items")
			.then((res) => {
				if (res.ok) return res.json();
				throw new Error("API not available");
			})
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) setInventory(data);
			})
			.catch(() => {
				// Retains mock items for local frontend evaluation
			});
	}, []);

	const handleAddItem = async (e) => {
		e.preventDefault();
		if (!newItemName.trim()) return;

		const newItem = {
			id: "inv_" + Date.now(),
			sku: "INV-" + Math.floor(1000 + Math.random() * 9000),
			name: newItemName,
			category: newItemCategory,
			totalQuantity: parseInt(newItemQuantity, 10) || 1,
			allocatedQuantity: 0,
			minSafetyLimit: parseInt(newItemMinSafety, 10) || 5,
			conditionStatus: newItemCondition,
			unitCost: parseFloat(newItemUnitCost) || 0,
		};

		try {
			const res = await fetch("/api/inventory/items", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newItem),
			});

			if (res.ok) {
				const saved = await res.json();
				setInventory((prev) => [...prev, saved]);
			} else {
				setInventory((prev) => [...prev, newItem]);
			}
		} catch {
			setInventory((prev) => [...prev, newItem]);
		}

		setIsAddModalOpen(false);
		setNewItemName("");
		setNewItemUnitCost("");
	};

	const handleAdjustQuantity = async () => {
		if (!selectedItem) return;
		const delta =
			adjustType === "reduce"
				? -Math.abs(Number(adjustDelta))
				: Math.abs(Number(adjustDelta));
		const newTotal = selectedItem.totalQuantity + delta;

		if (newTotal < selectedItem.allocatedQuantity) {
			alert(
				"Error: Total quantity cannot be reduced below the units currently allocated to events.",
			);
			return;
		}

		try {
			await fetch(
				`/api/inventory/items/${selectedItem.id || selectedItem.sku}/adjust`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ delta, reason: adjustReason }),
				},
			);
		} catch (err) {
			console.warn("Backend not reached, updating local state only:", err);
		}

		setInventory((prev) =>
			prev.map((item) =>
				(item.id || item.sku) === (selectedItem.id || selectedItem.sku)
					? { ...item, totalQuantity: newTotal }
					: item,
			),
		);
		setIsAdjustModalOpen(false);
	};

	const handleDeleteItem = async (id) => {
		const targetItem = inventory.find((item) => (item.id || item.sku) === id);
		if (targetItem && targetItem.allocatedQuantity > 0) {
			alert(
				"Cannot delete an item that is currently allocated to active events.",
			);
			return;
		}

		if (!window.confirm("Are you sure you want to delete this inventory item?"))
			return;

		try {
			await fetch(`/api/inventory/items/${id}`, { method: "DELETE" });
		} catch (err) {
			console.warn("Backend not reached, updating local state only:", err);
		}

		setInventory((prev) => prev.filter((item) => (item.id || item.sku) !== id));
	};

	const getConditionColor = (condition) => {
		switch (condition) {
			case "New":
			case "Good":
				return "bg-emerald-100 text-emerald-700 border-emerald-200";
			case "Needs Maintenance":
			case "Under Repair":
				return "bg-amber-100 text-amber-700 border-amber-200";
			case "Damaged":
				return "bg-red-100 text-red-700 border-red-200";
			default:
				return "bg-slate-100 text-slate-700 border-slate-200";
		}
	};

	const filteredInventory = inventory.filter((item) => {
		const sku = item.sku || item.id || "";
		const condition = item.conditionStatus || item.condition || "";
		const matchesSearch =
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			sku.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			categoryFilter === "All" || item.category === categoryFilter;
		const matchesCondition =
			conditionFilter === "All" || condition === conditionFilter;
		return matchesSearch && matchesCategory && matchesCondition;
	});

	return (
		<DashboardLayout activeRole="Inventory Staff">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
							Master Stock Catalog
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Maintain warehouse equipment, track safety thresholds, and monitor
							asset availability[cite: 1].
						</p>
					</div>
					<button
						onClick={() => setIsAddModalOpen(true)}
						className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
					>
						<Plus size={16} />
						<span>Add Inventory Item</span>
					</button>
				</div>

				{/* Filter Controls */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
					<div className="relative w-full sm:w-80">
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							size={16}
						/>
						<input
							type="text"
							placeholder="Search by name or SKU..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
						/>
					</div>

					<div className="flex gap-3 w-full sm:w-auto">
						<div className="relative w-full sm:w-44">
							<Filter
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								size={14}
							/>
							<select
								value={categoryFilter}
								onChange={(e) => setCategoryFilter(e.target.value)}
								className="w-full pl-8 pr-6 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
							>
								<option value="All">All Categories</option>
								<option value="Seating">Seating</option>
								<option value="Tables">Tables</option>
								<option value="Lighting">Lighting</option>
								<option value="AV Equipment">AV Equipment</option>
							</select>
						</div>

						<select
							value={conditionFilter}
							onChange={(e) => setConditionFilter(e.target.value)}
							className="w-full sm:w-40 px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
						>
							<option value="All">Condition: All</option>
							<option value="New">New</option>
							<option value="Good">Good</option>
							<option value="Needs Maintenance">Needs Maintenance</option>
							<option value="Damaged">Damaged</option>
						</select>
					</div>
				</div>

				{/* Master Catalog Data Table */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-xs text-left">
							<thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
								<tr>
									<th className="py-3 px-4">Item & SKU</th>
									<th className="py-3 px-4">Category</th>
									<th className="py-3 px-4 text-right">Total</th>
									<th className="py-3 px-4 text-right">Allocated</th>
									<th className="py-3 px-4 text-right">Available</th>
									<th className="py-3 px-4">Condition</th>
									<th className="py-3 px-4 text-center">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{filteredInventory.map((item) => {
									const id = item.id || item.sku;
									const available = item.totalQuantity - item.allocatedQuantity;
									return (
										<tr key={id} className="hover:bg-slate-50">
											<td className="py-3.5 px-4 font-bold text-slate-900">
												{item.name}
												<p className="font-mono text-[10px] text-slate-400 font-normal">
													{item.sku}
												</p>
											</td>
											<td className="py-3.5 px-4 text-slate-600 font-medium">
												{item.category}
											</td>
											<td className="py-3.5 px-4 text-right text-slate-800 font-semibold">
												{item.totalQuantity}
											</td>
											<td className="py-3.5 px-4 text-right text-blue-600 font-semibold">
												{item.allocatedQuantity}
											</td>
											<td className="py-3.5 px-4 text-right">
												<span
													className={`font-bold ${
														available <= item.minSafetyLimit
															? "text-amber-600"
															: "text-emerald-600"
													}`}
												>
													{available}
												</span>
											</td>
											<td className="py-3.5 px-4">
												<span
													className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getConditionColor(
														item.conditionStatus,
													)}`}
												>
													{item.conditionStatus}
												</span>
											</td>
											<td className="py-3.5 px-4 text-center relative">
												<button
													onClick={() =>
														setOpenDropdown(openDropdown === id ? null : id)
													}
													className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
												>
													<MoreHorizontal size={16} />
												</button>

												{/* Dropdown Menu */}
												{openDropdown === id && (
													<>
														<div
															className="fixed inset-0 z-10"
															onClick={() => setOpenDropdown(null)}
														></div>
														<div className="absolute right-6 top-8 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-20 py-1 text-left">
															<button
																onClick={() => {
																	setSelectedItem(item);
																	setIsAdjustModalOpen(true);
																	setOpenDropdown(null);
																}}
																className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
															>
																<Plus size={14} /> Adjust Quantity
															</button>
															<div className="h-px bg-slate-100 my-1"></div>
															<button
																onClick={() => {
																	handleDeleteItem(id);
																	setOpenDropdown(null);
																}}
																className="w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
															>
																<Trash size={14} /> Delete Item
															</button>
														</div>
													</>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{filteredInventory.length === 0 && (
							<div className="p-8 text-center text-xs text-slate-400">
								No matching equipment records found.
							</div>
						)}
					</div>
				</div>

				{/* Add Modal */}
				{isAddModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div
							className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
							onClick={() => setIsAddModalOpen(false)}
						></div>
						<div className="bg-white rounded-xl shadow-xl w-full max-w-md z-10 overflow-hidden">
							<div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
								<h3 className="font-bold text-slate-900 text-sm">
									Add New Inventory Item
								</h3>
								<button
									onClick={() => setIsAddModalOpen(false)}
									className="text-slate-400 hover:text-slate-600"
								>
									<X size={16} />
								</button>
							</div>
							<form onSubmit={handleAddItem} className="p-5 space-y-3">
								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1">
										Item Name
									</label>
									<input
										type="text"
										required
										value={newItemName}
										onChange={(e) => setNewItemName(e.target.value)}
										placeholder="e.g. Banquet Round Table"
										className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Category
										</label>
										<select
											value={newItemCategory}
											onChange={(e) => setNewItemCategory(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option>Seating</option>
											<option>Tables</option>
											<option>Lighting</option>
											<option>AV Equipment</option>
										</select>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Total Quantity
										</label>
										<input
											type="number"
											min="1"
											value={newItemQuantity}
											onChange={(e) => setNewItemQuantity(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Safety Limit
										</label>
										<input
											type="number"
											min="1"
											value={newItemMinSafety}
											onChange={(e) => setNewItemMinSafety(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Condition
										</label>
										<select
											value={newItemCondition}
											onChange={(e) => setNewItemCondition(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option>New</option>
											<option>Good</option>
										</select>
									</div>
								</div>
								<div className="pt-2 flex justify-end gap-2">
									<button
										type="button"
										onClick={() => setIsAddModalOpen(false)}
										className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
									>
										Save Asset
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Adjust Stock Modal */}
				{isAdjustModalOpen && selectedItem && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div
							className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
							onClick={() => setIsAdjustModalOpen(false)}
						></div>
						<div className="bg-white rounded-xl shadow-xl w-full max-w-sm z-10 p-5 space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="font-bold text-slate-900 text-sm">
									Adjust Stock Count
								</h3>
								<button
									onClick={() => setIsAdjustModalOpen(false)}
									className="text-slate-400 hover:text-slate-600"
								>
									<X size={16} />
								</button>
							</div>
							<div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
								<p className="font-bold text-slate-800 text-xs">
									{selectedItem.name}
								</p>
								<p className="text-[11px] text-slate-500">
									Total: {selectedItem.totalQuantity} | Allocated:{" "}
									{selectedItem.allocatedQuantity}
								</p>
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setAdjustType("restock")}
									className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
										adjustType === "restock"
											? "bg-blue-600 text-white border-blue-600"
											: "border-slate-200 text-slate-600"
									}`}
								>
									+ Restock
								</button>
								<button
									type="button"
									onClick={() => setAdjustType("reduce")}
									className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
										adjustType === "reduce"
											? "bg-red-600 text-white border-red-600"
											: "border-slate-200 text-slate-600"
									}`}
								>
									- Reduce
								</button>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 mb-1">
									Delta Quantity
								</label>
								<input
									type="number"
									min="1"
									value={adjustDelta}
									onChange={(e) => setAdjustDelta(e.target.value)}
									className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="flex justify-end gap-2 pt-2">
								<button
									type="button"
									onClick={() => setIsAdjustModalOpen(false)}
									className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleAdjustQuantity}
									className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
								>
									Update
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
