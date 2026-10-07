let offers = [];
let currentUser = null;

const $ = id => document.getElementById(id);
const managementRoles = new Set(["VENDOR", "ADMIN"]);

function canManage() {
    return currentUser && managementRoles.has(currentUser.role);
}

async function load() {
    try {
        currentUser = await api("/api/auth/me");
        configureRoleView();

        offers = await api(canManage()
            ? "/api/promotion-management"
            : "/api/promotions");

        if (canManage()) {
            renderManagement();
        } else {
            fillCategories();
            renderCustomerOffers();
            recordImpressions();
        }
    } catch (error) {
        toast(error.message, true);
    }
}

function configureRoleView() {
    $("userChip").textContent = `${currentUser.name} · ${currentUser.role.replaceAll("_", " ")}`;

    if (canManage()) {
        $("managementWorkspace").style.display = "grid";
        $("customerWorkspace").style.display = "none";
        $("newBtn").style.display = "inline-flex";
        $("roleMessage").textContent = currentUser.role === "ADMIN"
            ? "Manage every vendor campaign and monitor customer engagement."
            : "Create offers, control publication and track customer engagement.";
    } else {
        $("managementWorkspace").style.display = "none";
        $("customerWorkspace").style.display = "block";
        $("newBtn").style.display = "none";
        $("pageTitle").textContent = "Evenza special offers";
        $("pageSubtitle").textContent = "Discover active packages from trusted event vendors.";
        $("heroTitle").textContent = "More celebration. Better value.";
        $("roleMessage").textContent = "Browse offers that are published and available right now.";
        $("totalLabel").textContent = "Available offers";
        $("activeLabel").textContent = "Categories";
        $("draftLabel").textContent = "Best discount";
        $("scheduledLabel").textContent = "Ending soon";
    }
}

function renderManagement() {
    $("total").textContent = offers.length;
    $("active").textContent = offers.filter(offer => offer.status === "ACTIVE").length;
    $("draft").textContent = offers.filter(offer => offer.status === "DRAFT").length;
    $("scheduled").textContent = offers.filter(offer => offer.status === "SCHEDULED").length;

    const search = $("managementSearch").value.trim().toLowerCase();
    const status = $("managementStatus").value;
    const filtered = offers.filter(offer => {
        const text = `${offer.title} ${offer.packageName} ${offer.serviceCategory}`.toLowerCase();
        return text.includes(search) && (status === "ALL" || offer.status === status);
    });

    $("managementCards").innerHTML = filtered.map(offer => `
        <article class="campaign-card">
            <div class="campaign-top">
                <div>
                    <span class="badge status-${offer.status.toLowerCase()}">${offer.status}</span>
                    <h3>${esc(offer.title)}</h3>
                    <div class="campaign-meta">
                        <span>${esc(offer.serviceCategory)} · ${esc(offer.packageName)}</span>
                        ${currentUser.role === "ADMIN"
                            ? `<span>Owner: ${esc(offer.ownerUsername)}</span>`
                            : ""}
                    </div>
                </div>
                <div class="price-block">
                    <del>LKR ${money(offer.packagePrice)}</del>
                    <strong>LKR ${money(offer.finalPrice)}</strong>
                </div>
            </div>
            <p>${esc(offer.description)}</p>
            <div class="campaign-meta">
                <span>${formatDate(offer.startsAt)} → ${formatDate(offer.endsAt)}</span>
            </div>
            <div class="analytics-row">
                <div class="metric"><strong>${offer.impressions}</strong>Impressions</div>
                <div class="metric"><strong>${offer.clicks}</strong>Clicks</div>
                <div class="metric"><strong>${offer.inquiries}</strong>Inquiries</div>
            </div>
            <div class="actions">${managementActions(offer)}</div>
        </article>
    `).join("") || '<div class="empty">No matching promotions found.</div>';
}

function managementActions(offer) {
    if (offer.status === "ARCHIVED") {
        return `<button class="btn small danger" onclick="removeOffer(${offer.id})">Delete</button>`;
    }

    const publicationButton = ["ACTIVE", "SCHEDULED"].includes(offer.status)
        ? `<button class="btn small ghost" onclick="promotionAction(${offer.id}, 'deactivate')">Deactivate</button>`
        : `<button class="btn small" onclick="promotionAction(${offer.id}, 'publish')">Publish</button>`;

    return `
        <button class="btn small secondary" onclick="editOffer(${offer.id})">Edit</button>
        ${publicationButton}
        <button class="btn small ghost" onclick="promotionAction(${offer.id}, 'archive')">Archive</button>
        <button class="btn small danger" onclick="removeOffer(${offer.id})">Delete</button>`;
}

function fillCategories() {
    const categories = [...new Set(offers.map(offer => offer.serviceCategory))]
        .sort((a, b) => a.localeCompare(b));

    $("categoryFilter").innerHTML = '<option value="ALL">All categories</option>'
        + categories.map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join("");
}

function renderCustomerOffers() {
    const search = $("customerSearch").value.trim().toLowerCase();
    const category = $("categoryFilter").value;
    const filtered = offers.filter(offer => {
        const text = `${offer.title} ${offer.packageName} ${offer.serviceCategory}`.toLowerCase();
        return text.includes(search)
            && (category === "ALL" || offer.serviceCategory === category);
    });

    const categories = new Set(offers.map(offer => offer.serviceCategory));
    const discounts = offers.map(discountPercentage);
    const sevenDays = Date.now() + 7 * 86_400_000;

    $("total").textContent = offers.length;
    $("active").textContent = categories.size;
    $("draft").textContent = discounts.length ? `${Math.max(...discounts).toFixed(0)}%` : "0%";
    $("scheduled").textContent = offers.filter(offer => new Date(offer.endsAt).getTime() <= sevenDays).length;

    $("customerCards").innerHTML = filtered.map(offer => `
        <article class="offer-card">
            <div class="offer-top">
                <div>
                    <span class="offer-category">${esc(offer.serviceCategory).toUpperCase()}</span>
                    <h3>${esc(offer.title)}</h3>
                    <small>${esc(offer.packageName)}</small>
                </div>
                <span class="badge status-active">SAVE ${discountPercentage(offer).toFixed(0)}%</span>
            </div>
            <p>${esc(offer.description)}</p>
            <div class="price-row">
                <div class="price-block">
                    <del>LKR ${money(offer.originalPrice)}</del>
                    <strong>LKR ${money(offer.finalPrice)}</strong>
                </div>
                <small>Ends ${formatDate(offer.endsAt)}</small>
            </div>
            <div class="offer-terms" id="terms-${offer.id}"><b>Terms:</b> ${esc(offer.terms)}</div>
            <div class="actions">
                <button class="btn small" onclick="viewOffer(${offer.id})">View offer</button>
            </div>
        </article>
    `).join("") || '<div class="empty">No active promotions match your search.</div>';
}

function discountPercentage(offer) {
    const original = Number(offer.originalPrice);
    const finalPrice = Number(offer.finalPrice);
    return original > 0 ? ((original - finalPrice) / original) * 100 : 0;
}

function recordImpressions() {
    offers.forEach(offer => {
        api(`/promotions/${offer.id}/impression`, {method: "POST"}).catch(() => {});
    });
}

window.viewOffer = async id => {
    const terms = $(`terms-${id}`);
    terms.classList.toggle("visible");
    try {
        await api(`/promotions/${id}/click`, {method: "POST"});
    } catch (_) {
        // The offer remains viewable if analytics recording is unavailable.
    }
};

function clearForm() {
    $("form").reset();
    $("id").value = "";
    $("version").value = "";
    $("formTitle").textContent = "Create promotion";
    $("saveBtn").textContent = "Save draft";

    const start = new Date(Date.now() + 60_000);
    const end = new Date(Date.now() + 30 * 86_400_000);
    $("startsAt").value = localInput(start);
    $("endsAt").value = localInput(end);
    $("discountType").value = "PERCENTAGE";
    updateFinalPrice();
}

window.editOffer = id => {
    const offer = offers.find(item => item.id === id);
    if (!offer || offer.status === "ARCHIVED") {
        toast("Archived promotions cannot be edited.", true);
        return;
    }

    $("id").value = offer.id;
    $("version").value = offer.version;
    $("title").value = offer.title;
    $("packageName").value = offer.packageName;
    $("category").value = offer.serviceCategory;
    $("price").value = offer.packagePrice;
    $("discountType").value = offer.discountType;
    $("discount").value = offer.discountValue;
    $("startsAt").value = localInput(offer.startsAt);
    $("endsAt").value = localInput(offer.endsAt);
    $("description").value = offer.description;
    $("terms").value = offer.terms;
    $("formTitle").textContent = "Edit promotion";
    $("saveBtn").textContent = "Save changes";
    updateFinalPrice();
    scrollTo({top: 0, behavior: "smooth"});
};

window.promotionAction = async (id, action) => {
    if (!confirm(`Confirm promotion action: ${action}?`)) return;
    try {
        await api(`/api/promotion-management/${id}/${action}`, {method: "PATCH"});
        toast(`Promotion ${action} action completed`);
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

window.removeOffer = async id => {
    if (!confirm("Permanently delete this promotion?")) return;
    try {
        await api(`/api/promotion-management/${id}`, {method: "DELETE"});
        toast("Promotion deleted");
        clearForm();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

$("form").addEventListener("submit", async event => {
    event.preventDefault();
    const id = $("id").value;
    const body = {
        title: $("title").value.trim(),
        description: $("description").value.trim(),
        packageName: $("packageName").value.trim(),
        serviceCategory: $("category").value.trim(),
        packagePrice: Number($("price").value),
        discountType: $("discountType").value,
        discountValue: Number($("discount").value),
        startsAt: $("startsAt").value,
        endsAt: $("endsAt").value,
        terms: $("terms").value.trim(),
        version: id ? Number($("version").value) : null
    };

    const validation = validatePromotion(body);
    if (validation) {
        toast(validation, true);
        return;
    }

    try {
        await api(id ? `/api/promotion-management/${id}` : "/api/promotion-management", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(body)
        });
        toast(id ? "Promotion updated" : "Promotion draft created");
        clearForm();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
});

function validatePromotion(body) {
    if (!body.title || !body.packageName || !body.serviceCategory) {
        return "Title, package name and category are required.";
    }
    if (!body.description || !body.terms) {
        return "Description and terms are required.";
    }
    if (!(body.packagePrice > 0) || !(body.discountValue > 0)) {
        return "Price and discount must be greater than zero.";
    }
    if (body.discountType === "PERCENTAGE" && body.discountValue > 100) {
        return "Percentage discount cannot exceed 100%.";
    }
    if (body.discountType === "FIXED_AMOUNT" && body.discountValue > body.packagePrice) {
        return "Fixed discount cannot exceed the package price.";
    }
    if (!body.startsAt || !body.endsAt || new Date(body.endsAt) <= new Date(body.startsAt)) {
        return "Campaign end time must be after its start time.";
    }
    if (new Date(body.endsAt) <= new Date()) {
        return "Campaign end time must be in the future.";
    }
    return null;
}

function updateFinalPrice() {
    const price = Number($("price").value) || 0;
    const discount = Number($("discount").value) || 0;
    const finalPrice = $("discountType").value === "PERCENTAGE"
        ? price - price * discount / 100
        : price - discount;

    $("finalPricePreview").textContent = `LKR ${money(Math.max(0, finalPrice))}`;
}

function money(value) {
    return Number(value || 0).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(value) {
    return new Date(value).toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

$("managementSearch").addEventListener("input", renderManagement);
$("managementStatus").addEventListener("change", renderManagement);
$("customerSearch").addEventListener("input", renderCustomerOffers);
$("categoryFilter").addEventListener("change", renderCustomerOffers);
$("price").addEventListener("input", updateFinalPrice);
$("discount").addEventListener("input", updateFinalPrice);
$("discountType").addEventListener("change", updateFinalPrice);
$("newBtn").addEventListener("click", clearForm);
$("clearBtn").addEventListener("click", clearForm);

clearForm();
load();
