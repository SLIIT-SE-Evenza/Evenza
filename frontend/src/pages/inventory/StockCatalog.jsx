import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
	Search,
	Plus,
	Filter,
	FolderPlus,
	Trash,
	X,
	Package,
} from "lucide-react";

export default function StockCatalog() {
	const [inventory, setInventory] = useState([]);
	const [categories, setCategories] = useState([
		"Seating",
		"Tables",
		"Lighting",
		"AV Equipment",
	]);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("All");
	const [conditionFilter, setConditionFilter] = useState("All");

	// Modals
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	// New Category State
	const [newCategoryName, setNewCategoryName] = useState("");

	// New Item Form State
	const [newItemName, setNewItemName] = useState("");
	const [newItemCategory, setNewItemCategory] = useState("Seating");
	const [customCategoryInput, setCustomCategoryInput] = useState("");
	const [isAddingInlineCategory, setIsAddingInlineCategory] = useState(false);
	const [newItemQuantity, setNewItemQuantity] = useState(1);
	const [newItemMinSafety, setNewItemMinSafety] = useState(10);
	const [newItemCondition, setNewItemCondition] = useState("New");
	const [newItemUnitCost, setNewItemUnitCost] = useState("");

	// Adjust Stock State
	const [adjustType, setAdjustType] = useState("restock");
	const [adjustDelta, setAdjustDelta] = useState(1);
	const [adjustReason, setAdjustReason] = useState("Supplier Delivery");

	// Fetch Inventory and Categories on Mount
	useEffect(() => {
		// 1. Fetch Items
		fetch("/api/inventory/items")
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) setInventory(data);
			})
			.catch((err) => console.warn("Failed to fetch inventory:", err));

		// 2. Fetch Categories
		fetch("/api/inventory/categories")
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) {
					setCategories(data.map((c) => c.name));
					if (data[0]?.name) setNewItemCategory(data[0].name);
				}
			})
			.catch((err) => console.warn("Failed to fetch categories:", err));
	}, []);

	// Handler: Create Category (Standalone Modal)
	const handleCreateCategory = async (e) => {
		e.preventDefault();
		const catName = newCategoryName.trim();
		if (!catName) return;

		if (categories.some((c) => c.toLowerCase() === catName.toLowerCase())) {
			alert("This category already exists.");
			return;
		}

		try {
			await fetch("/api/inventory/categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: catName,
					description: "Custom added category",
				}),
			});
		} catch (err) {
			console.warn("Backend not reached, saving locally:", err);
		}

		setCategories((prev) => [...prev, catName]);
		setNewCategoryName("");
		setIsCategoryModalOpen(false);
	};

	// Handler: Add Item
	const handleAddItem = async (e) => {
		e.preventDefault();
		if (!newItemName.trim()) return;

		// Use inline new category if selected
		let finalCategory = newItemCategory;
		if (isAddingInlineCategory && customCategoryInput.trim()) {
			finalCategory = customCategoryInput.trim();
			if (!categories.includes(finalCategory)) {
				setCategories((prev) => [...prev, finalCategory]);
				fetch("/api/inventory/categories", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: finalCategory }),
				}).catch(console.warn);
			}
		}

		const newItem = {
			sku: "INV-" + Math.floor(1000 + Math.random() * 9000),
			name: newItemName.trim(),
			category: finalCategory,
			totalQuantity: parseInt(newItemQuantity, 10) || 1,
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
				setInventory((prev) => [
					...prev,
					{ ...newItem, id: Date.now(), allocatedQuantity: 0 },
				]);
			}
		} catch {
			setInventory((prev) => [
				...prev,
				{ ...newItem, id: Date.now(), allocatedQuantity: 0 },
			]);
		}

		// Reset Form
		setIsAddModalOpen(false);
		setNewItemName("");
		setNewItemUnitCost("");
		setCustomCategoryInput("");
		setIsAddingInlineCategory(false);
	};

	// Handler: Delete Item
	const handleDeleteItem = async (id) => {
		if (!id) return;
		const target = inventory.find((i) => (i.id || i.sku) === id);
		if (target && target.allocatedQuantity > 0) {
			alert("Cannot delete an item currently allocated to active events.");
			return;
		}

		if (!window.confirm("Are you sure you want to delete this inventory item?"))
			return;

		try {
			await fetch(`/api/inventory/items/${id}`, { method: "DELETE" });
		} catch (err) {
			console.warn("Backend not reached, deleting locally:", err);
		}
		setInventory((prev) => prev.filter((i) => (i.id || i.sku) !== id));
	};

	// Handler: Adjust Stock
	const handleAdjustQuantity = async () => {
		if (!selectedItem) return;
		const delta =
			adjustType === "reduce"
				? -Math.abs(Number(adjustDelta))
				: Math.abs(Number(adjustDelta));
		const newTotal = selectedItem.totalQuantity + delta;

		if (newTotal < (selectedItem.allocatedQuantity || 0)) {
			alert("Error: Total quantity cannot be reduced below allocated units.");
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
			console.warn(err);
		}

		setInventory((prev) =>
			prev.map((i) =>
				(i.id || i.sku) === (selectedItem.id || selectedItem.sku)
					? { ...i, totalQuantity: newTotal }
					: i,
			),
		);
		setIsAdjustModalOpen(false);
	};

	const filteredInventory = inventory.filter((item) => {
		const sku = item.sku || item.id || "";
		const matchesSearch =
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			sku.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			categoryFilter === "All" || item.category === categoryFilter;
		const matchesCondition =
			conditionFilter === "All" || item.conditionStatus === conditionFilter;
		return matchesSearch && matchesCategory && matchesCondition;
	});

	return (
		<DashboardLayout activeRole="Inventory Staff">
			<div className="space-y-6">
				{/* Top Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
							Master Stock Catalog
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							Maintain equipment stock, create custom categories, and track
							allocations.
						</p>
					</div>

					<div className="flex items-center gap-2">
						{/* New Category Button */}
						<button
							onClick={() => setIsCategoryModalOpen(true)}
							className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
						>
							<FolderPlus size={15} className="text-blue-600" />
							<span>New Category</span>
						</button>

						{/* Add Item Button */}
						<button
							onClick={() => setIsAddModalOpen(true)}
							className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
						>
							<Plus size={15} />
							<span>Add Inventory Item</span>
						</button>
					</div>
				</div>

				{/* Filter Controls Bar */}
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
						{/* Dynamic Category Filter */}
						<div className="relative w-full sm:w-48">
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
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{cat}
									</option>
								))}
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
									const available =
										(item.totalQuantity || 0) - (item.allocatedQuantity || 0);
									return (
										<tr
											key={id}
											className="hover:bg-slate-50 transition-colors"
										>
											<td className="py-3.5 px-4 font-bold text-slate-900">
												{item.name}
												<p className="font-mono text-[10px] text-slate-400 font-normal">
													{item.sku}
												</p>
											</td>
											<td className="py-3.5 px-4">
												<span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
													{item.category}
												</span>
											</td>
											<td className="py-3.5 px-4 text-right font-semibold text-slate-800">
												{item.totalQuantity}
											</td>
											<td className="py-3.5 px-4 text-right text-blue-600 font-semibold">
												{item.allocatedQuantity || 0}
											</td>
											<td className="py-3.5 px-4 text-right">
												<span
													className={`font-bold ${
														available <= (item.minSafetyLimit || 5)
															? "text-amber-600"
															: "text-emerald-600"
													}`}
												>
													{available}
												</span>
											</td>
											<td className="py-3.5 px-4">
												<span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
													{item.conditionStatus || "Good"}
												</span>
											</td>
											<td className="py-3.5 px-4 text-center">
												<div className="flex items-center justify-center gap-1.5">
													<button
														onClick={() => {
															setSelectedItem(item);
															setIsAdjustModalOpen(true);
														}}
														className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-md text-[11px] transition-colors inline-flex items-center gap-1"
													>
														<Plus size={12} /> Adjust
													</button>
													<button
														onClick={() => handleDeleteItem(id)}
														className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
													>
														<Trash size={14} />
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>

				{/* 1. Modal: Add New Category */}
				{isCategoryModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div
							className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
							onClick={() => setIsCategoryModalOpen(false)}
						/>
						<div className="bg-white rounded-xl shadow-xl w-full max-w-sm z-10 overflow-hidden">
							<div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
								<h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
									<FolderPlus size={16} className="text-blue-600" />
									Create Equipment Category
								</h3>
								<button
									onClick={() => setIsCategoryModalOpen(false)}
									className="text-slate-400 hover:text-slate-600"
								>
									<X size={16} />
								</button>
							</div>
							<form onSubmit={handleCreateCategory} className="p-5 space-y-3">
								<div>
									<label className="block text-xs font-semibold text-slate-600 mb-1">
										Category Name
									</label>
									<input
										type="text"
										required
										placeholder="e.g. Photography Gear, Staging"
										value={newCategoryName}
										onChange={(e) => setNewCategoryName(e.target.value)}
										className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div className="flex justify-end gap-2 pt-2">
									<button
										type="button"
										onClick={() => setIsCategoryModalOpen(false)}
										className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
									>
										Save Category
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* 2. Modal: Add Inventory Item */}
				{isAddModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div
							className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
							onClick={() => setIsAddModalOpen(false)}
						/>
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
										Item Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										required
										placeholder="e.g. Round Dining Table"
										value={newItemName}
										onChange={(e) => setNewItemName(e.target.value)}
										className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								{/* Category Selection with Inline "+ Add New" Toggle */}
								<div>
									<div className="flex justify-between items-center mb-1">
										<label className="text-xs font-semibold text-slate-600">
											Category
										</label>
										<button
											type="button"
											onClick={() =>
												setIsAddingInlineCategory(!isAddingInlineCategory)
											}
											className="text-[11px] font-semibold text-blue-600 hover:underline"
										>
											{isAddingInlineCategory
												? "Select Existing"
												: "+ Add Custom Category"}
										</button>
									</div>

									{isAddingInlineCategory ? (
										<input
											type="text"
											required
											placeholder="Type new category name..."
											value={customCategoryInput}
											onChange={(e) => setCustomCategoryInput(e.target.value)}
											className="w-full px-3 py-2 border border-blue-400 bg-blue-50/20 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										/>
									) : (
										<select
											value={newItemCategory}
											onChange={(e) => setNewItemCategory(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										>
											{categories.map((c) => (
												<option key={c} value={c}>
													{c}
												</option>
											))}
										</select>
									)}
								</div>

								<div className="grid grid-cols-2 gap-3">
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
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Safety Threshold
										</label>
										<input
											type="number"
											min="1"
											value={newItemMinSafety}
											onChange={(e) => setNewItemMinSafety(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
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
											<option>Needs Maintenance</option>
										</select>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-600 mb-1">
											Unit Cost (LKR)
										</label>
										<input
											type="number"
											placeholder="e.g. 2500"
											value={newItemUnitCost}
											onChange={(e) => setNewItemUnitCost(e.target.value)}
											className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div className="pt-3 flex justify-end gap-2">
									<button
										type="button"
										onClick={() => setIsAddModalOpen(false)}
										className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
									>
										Save Asset
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* 3. Modal: Adjust Stock Quantity */}
				{isAdjustModalOpen && selectedItem && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div
							className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
							onClick={() => setIsAdjustModalOpen(false)}
						/>
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

							<div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
								<p className="font-bold text-slate-800">{selectedItem.name}</p>
								<p className="text-slate-500 font-mono text-[10px]">
									{selectedItem.sku}
								</p>
								<p className="text-slate-500 mt-1">
									Total: {selectedItem.totalQuantity} | Allocated:{" "}
									{selectedItem.allocatedQuantity || 0}
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
