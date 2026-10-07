/*
 * Evenza Inventory UI
 * -------------------
 * Connects the static Inventory dashboard to the Spring Boot REST APIs.
 */

let currentUser = null;
let items = [];
let categories = [];
let events = [];

const $ = id => document.getElementById(id);

/** Loads the authenticated user and all data required by the dashboard. */
async function load() {
    try {
        currentUser = await api("/api/auth/me");

        const allowedRoles = ["ADMIN", "EVENT_MANAGER", "INVENTORY_STAFF"];
        if (!allowedRoles.includes(currentUser.role)) {
            window.location.href = "/";
            return;
        }

        [items, categories, events] = await Promise.all([
            api("/api/inventory/items"),
            api("/api/inventory/categories"),
            api("/api/schedule/events")
        ]);

        configureRoleInterface();
        fillSelectors();
        render();
    } catch (error) {
        if (String(error.message).includes("401")) {
            window.location.href = "http://localhost:5173/login";
            return;
        }
        toast(error.message, true);
    }
}

/** Inventory Staff and Admin manage stock; managers can view and allocate. */
function configureRoleInterface() {
    const canManageStock = ["ADMIN", "INVENTORY_STAFF"].includes(currentUser.role);
    document.querySelectorAll(".management-only").forEach(element => {
        element.classList.toggle("role-hidden", !canManageStock);
    });
    $("focusItemBtn").classList.toggle("role-hidden", !canManageStock);
}

/** Rebuilds category, item and event dropdowns after every change. */
function fillSelectors() {
    const categoryOptions = categories
        .map(category => `<option value="${esc(category.name)}">${esc(category.name)}</option>`)
        .join("");

    $("itemCategory").innerHTML = categoryOptions
        || '<option value="">Create a category first</option>';

    $("categoryFilter").innerHTML = '<option value="ALL">All categories</option>'
        + categoryOptions;

    const itemOptions = items.map(item => {
        const available = item.totalQuantity - item.allocatedQuantity;
        return `<option value="${item.id}">${esc(item.name)} · ${available} available</option>`;
    }).join("") || '<option value="">No inventory items available</option>';

    $("adjustItem").innerHTML = itemOptions;
    $("allocationItem").innerHTML = itemOptions;

    const activeEvents = events.filter(event => event.status === "APPROVED");
    $("allocationEvent").innerHTML = activeEvents
        .map(event => `<option value="${event.id}">${esc(event.name)}</option>`)
        .join("") || '<option value="">No approved events available</option>';
}

/** Renders counters and the filtered inventory register. */
function render() {
    $("totalItems").textContent = items.length;
    $("totalUnits").textContent = items.reduce((sum, item) => sum + item.totalQuantity, 0);
    $("allocatedUnits").textContent = items.reduce((sum, item) => sum + item.allocatedQuantity, 0);
    $("lowStock").textContent = items.filter(isLowStock).length;

    const search = $("itemSearch").value.trim().toLowerCase();
    const selectedCategory = $("categoryFilter").value;

    const filtered = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search)
            || item.sku.toLowerCase().includes(search)
            || item.category.toLowerCase().includes(search);
        const matchesCategory = selectedCategory === "ALL"
            || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    $("inventoryRows").innerHTML = filtered.map(item => {
        const available = item.totalQuantity - item.allocatedQuantity;
        const low = isLowStock(item);
        return `
            <tr class="${low ? "low-stock-row" : ""}">
                <td>
                    <strong>${esc(item.name)}</strong>
                    <small>${esc(item.sku)} · ${esc(item.category)}</small>
                </td>
                <td>${item.totalQuantity}</td>
                <td>${item.allocatedQuantity}</td>
                <td><span class="availability ${low ? "low" : "ready"}">${available}</span></td>
                <td><span class="condition condition-${conditionClass(item.conditionStatus)}">${esc(item.conditionStatus)}</span></td>
                <td><div class="row-actions">${actionButtons(item)}</div></td>
            </tr>`;
    }).join("") || '<tr><td colspan="6" class="empty">No matching inventory items found.</td></tr>';
}

function isLowStock(item) {
    return item.totalQuantity - item.allocatedQuantity <= item.minSafetyLimit;
}

function conditionClass(value) {
    return value.toLowerCase().replaceAll(" ", "-");
}

function actionButtons(item) {
    const canManageStock = ["ADMIN", "INVENTORY_STAFF"].includes(currentUser.role);
    const adjustButton = canManageStock
        ? `<button class="btn small secondary" onclick="selectForAdjustment(${item.id})">Adjust</button>`
        : "";
    const deleteButton = canManageStock
        ? `<button class="btn small danger" onclick="removeItem(${item.id})">Delete</button>`
        : "";

    return `${adjustButton}
        <button class="btn small ghost" onclick="selectForAllocation(${item.id})">Allocate</button>
        ${deleteButton}`;
}

window.selectForAdjustment = id => {
    $("adjustItem").value = String(id);
    $("stockDelta").focus();
    document.querySelector(".operations-card").scrollIntoView({behavior: "smooth"});
};

window.selectForAllocation = id => {
    $("allocationItem").value = String(id);
    $("allocationQuantity").focus();
    document.querySelector(".operations-card").scrollIntoView({behavior: "smooth"});
};

window.removeItem = async id => {
    if (!confirm("Delete this inventory item?")) return;

    try {
        await api(`/api/inventory/items/${id}`, {method: "DELETE"});
        toast("Inventory item deleted");
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

$("categoryForm").addEventListener("submit", async event => {
    event.preventDefault();
    const body = {
        name: $("categoryName").value.trim(),
        description: $("categoryDescription").value.trim()
    };

    if (!body.name) {
        toast("Category name is required", true);
        return;
    }

    try {
        await api("/api/inventory/categories", {
            method: "POST",
            body: JSON.stringify(body)
        });
        toast("Category created");
        event.target.reset();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
});

$("itemForm").addEventListener("submit", async event => {
    event.preventDefault();
    const body = {
        sku: $("itemSku").value.trim() || null,
        name: $("itemName").value.trim(),
        category: $("itemCategory").value,
        totalQuantity: Number($("totalQuantity").value),
        minSafetyLimit: Number($("safetyLimit").value),
        conditionStatus: $("conditionStatus").value,
        unitCost: $("unitCost").value ? Number($("unitCost").value) : null
    };

    if (!body.name || !body.category) {
        toast("Item name and category are required", true);
        return;
    }
    if (!Number.isInteger(body.totalQuantity) || body.totalQuantity < 1) {
        toast("Total quantity must be at least 1", true);
        return;
    }
    if (!Number.isInteger(body.minSafetyLimit) || body.minSafetyLimit < 0) {
        toast("Safety limit cannot be negative", true);
        return;
    }

    try {
        await api("/api/inventory/items", {
            method: "POST",
            body: JSON.stringify(body)
        });
        toast("Inventory item created");
        resetItemForm();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
});

$("adjustForm").addEventListener("submit", async event => {
    event.preventDefault();
    const itemId = $("adjustItem").value;
    const body = {
        delta: Number($("stockDelta").value),
        reason: $("stockReason").value.trim()
    };

    if (!itemId || !Number.isInteger(body.delta) || body.delta === 0 || !body.reason) {
        toast("Select an item and enter a non-zero change with a reason", true);
        return;
    }

    try {
        await api(`/api/inventory/items/${itemId}/adjust`, {
            method: "POST",
            body: JSON.stringify(body)
        });
        toast("Stock updated");
        event.target.reset();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
});

$("allocateForm").addEventListener("submit", async event => {
    event.preventDefault();
    const body = {
        eventId: Number($("allocationEvent").value),
        itemId: Number($("allocationItem").value),
        quantity: Number($("allocationQuantity").value)
    };

    if (!body.eventId || !body.itemId || !Number.isInteger(body.quantity) || body.quantity < 1) {
        toast("Select an approved event, an item and a valid quantity", true);
        return;
    }

    try {
        await api("/api/inventory/items/allocate", {
            method: "POST",
            body: JSON.stringify(body)
        });
        toast("Equipment allocated to event");
        $("allocationQuantity").value = 1;
        await load();
    } catch (error) {
        toast(error.message, true);
    }
});

function resetItemForm() {
    $("itemForm").reset();
    $("totalQuantity").value = 1;
    $("safetyLimit").value = 5;
}

$("itemSearch").addEventListener("input", render);
$("categoryFilter").addEventListener("change", render);
$("refreshBtn").addEventListener("click", load);
$("clearItemBtn").addEventListener("click", resetItemForm);
$("focusItemBtn").addEventListener("click", () => {
    $("itemFormCard").scrollIntoView({behavior: "smooth"});
    $("itemName").focus();
});

load();
