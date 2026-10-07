let inquiries = [];
let reviews = [];
let users = [];
let events = [];
let currentUser = null;

const $ = id => document.getElementById(id);
const managementRoles = new Set(["EVENT_MANAGER", "ADMIN"]);

function isManagement() {
    return currentUser && managementRoles.has(currentUser.role);
}

async function load() {
    try {
        currentUser = await api("/api/auth/me");

        [inquiries, reviews, events] = await Promise.all([
            api("/api/inquiries"),
            api("/api/reviews"),
            api("/api/schedule/events")
        ]);

        users = [currentUser];
        if (isManagement()) {
            try {
                users = await api("/api/schedule/users");
            } catch (_) {
                // Names are optional; IDs remain visible if the lookup is restricted.
            }
        }

        configureRoleView();
        fillEventOptions();
        render();
    } catch (error) {
        toast(error.message, true);
    }
}

function configureRoleView() {
    $("userChip").textContent = `${currentUser.name} · ${currentUser.role.replaceAll("_", " ")}`;

    if (isManagement()) {
        $("roleMessage").textContent = "Review customer requests, manage decisions and respond to feedback.";
        $("inquiryFormCard").style.display = "none";
        $("reviewFormCard").style.display = "none";
        $("inquiryListCard").classList.remove("span-8");
        $("inquiryListCard").classList.add("span-12");
        $("reviewListCard").classList.remove("span-8");
        $("reviewListCard").classList.add("span-12");
    } else {
        $("roleMessage").textContent = "Submit an inquiry, follow its progress and review your completed events.";
        $("inquiryCustomerName").value = currentUser.name;
        $("reviewCustomerName").value = currentUser.name;
    }
}

function fillEventOptions() {
    if (isManagement()) return;

    const eligibleEvents = events.filter(event => {
        const isOwner = event.organiserId == null || event.organiserId === currentUser.id;
        return isOwner && event.status === "COMPLETED";
    });

    $("reviewEvent").innerHTML = eligibleEvents
        .map(event => `<option value="${event.id}">${esc(event.name)}</option>`)
        .join("") || '<option value="">No completed events available</option>';

    $("saveReview").disabled = eligibleEvents.length === 0;
}

function render() {
    $("inquiryCount").textContent = inquiries.length;
    $("openCount").textContent = inquiries
        .filter(item => !["APPROVED", "REJECTED"].includes(item.status)).length;
    $("reviewCount").textContent = reviews.length;
    $("average").textContent = reviews.length
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    renderInquiries();
    renderReviews();
}

function renderInquiries() {
    const search = $("inquirySearch").value.trim().toLowerCase();
    const status = $("inquiryStatus").value;

    const filtered = inquiries.filter(item => {
        const text = `${item.eventType} ${item.eventDetails}`.toLowerCase();
        return text.includes(search) && (status === "ALL" || item.status === status);
    });

    $("inquiryRows").innerHTML = filtered.map(item => `
        <tr>
            <td>
                <strong>${esc(item.eventType)}</strong>
                ${isManagement() ? `<br><small>${esc(customerName(item.customerId))}</small>` : ""}
            </td>
            <td>${esc(item.eventDetails).slice(0, 110)}</td>
            <td><span class="badge status-${item.status.toLowerCase()}">${item.status.replaceAll("_", " ")}</span></td>
            <td><div class="row-actions">${inquiryActions(item)}</div></td>
        </tr>
    `).join("") || '<tr><td colspan="4" class="empty">No matching inquiries found.</td></tr>';
}

function inquiryActions(item) {
    if (!isManagement()) {
        if (item.status !== "SUBMITTED") {
            return '<span class="muted-action">Awaiting management</span>';
        }
        return `
            <button class="btn small secondary" onclick="editInquiry(${item.inquiryId})">Edit</button>
            <button class="btn small danger" onclick="deleteInquiry(${item.inquiryId})">Delete</button>`;
    }

    switch (item.status) {
        case "SUBMITTED":
            return `<button class="btn small ghost" onclick="moveInquiry(${item.inquiryId}, 'forward')">Forward</button>
                    ${adminDeleteInquiry(item.inquiryId)}`;
        case "FORWARDED":
            return `<button class="btn small ghost" onclick="moveInquiry(${item.inquiryId}, 'review')">Start review</button>
                    ${adminDeleteInquiry(item.inquiryId)}`;
        case "UNDER_REVIEW":
            return `<button class="btn small" onclick="moveInquiry(${item.inquiryId}, 'approve')">Approve</button>
                    <button class="btn small danger" onclick="moveInquiry(${item.inquiryId}, 'reject')">Reject</button>
                    ${adminDeleteInquiry(item.inquiryId)}`;
        default:
            return adminDeleteInquiry(item.inquiryId) || '<span class="muted-action">Decision completed</span>';
    }
}

function adminDeleteInquiry(id) {
    return currentUser.role === "ADMIN"
        ? `<button class="btn small danger" onclick="deleteInquiry(${id})">Delete</button>`
        : "";
}

function renderReviews() {
    const search = $("reviewSearch").value.trim().toLowerCase();
    const filtered = reviews.filter(review => {
        const event = eventById(review.eventId);
        return `${review.comment} ${event?.name || ""}`.toLowerCase().includes(search);
    });

    $("reviewRows").innerHTML = filtered.map(review => {
        const displayName = review.anonymous ? "Anonymous customer" : customerName(review.customerId);
        return `
            <article class="review-card">
                <div class="review-top">
                    <div>
                        <strong>${esc(eventById(review.eventId)?.name || `Event #${review.eventId}`)}</strong>
                        <div><span class="stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span></div>
                    </div>
                    <span class="badge">${esc(displayName)}</span>
                </div>
                <p>${esc(review.comment)}</p>
                ${review.response ? `<div class="manager-response"><b>Management response:</b> ${esc(review.response)}</div>` : ""}
                <div class="row-actions">${reviewActions(review)}</div>
            </article>`;
    }).join("") || '<div class="empty">No matching reviews found.</div>';
}

function reviewActions(review) {
    if (!isManagement()) {
        return `
            <button class="btn small secondary" onclick="editReview(${review.reviewId})">Edit</button>
            <button class="btn small danger" onclick="deleteReview(${review.reviewId})">Delete</button>`;
    }

    return `
        <button class="btn small ghost" onclick="respondToReview(${review.reviewId})">
            ${review.response ? "Update response" : "Respond"}
        </button>
        ${currentUser.role === "ADMIN"
            ? `<button class="btn small danger" onclick="deleteReview(${review.reviewId})">Delete</button>`
            : ""}`;
}

function customerName(id) {
    return users.find(user => user.id === id)?.name || `Customer #${id}`;
}

function eventById(id) {
    return events.find(event => event.id === id);
}

function clearInquiryForm() {
    $("inquiryForm").reset();
    $("inquiryId").value = "";
    $("inquiryCustomerName").value = currentUser?.name || "";
    $("inquiryTitle").textContent = "New inquiry";
    $("saveInquiry").textContent = "Save inquiry";
    updateInquiryCharacters();
}

function clearReviewForm() {
    $("reviewForm").reset();
    $("reviewId").value = "";
    $("reviewCustomerName").value = currentUser?.name || "";
    $("reviewTitle").textContent = "New review";
    $("saveReview").textContent = "Save review";
}

window.editInquiry = id => {
    const item = inquiries.find(inquiry => inquiry.inquiryId === id);
    if (!item || item.status !== "SUBMITTED") {
        toast("Only submitted inquiries can be edited.", true);
        return;
    }
    $("inquiryId").value = item.inquiryId;
    $("eventType").value = item.eventType;
    $("eventDetails").value = item.eventDetails;
    $("attachmentPath").value = item.attachmentPath || "";
    $("inquiryTitle").textContent = "Edit inquiry";
    $("saveInquiry").textContent = "Save changes";
    updateInquiryCharacters();
    scrollTo({top: 0, behavior: "smooth"});
};

window.moveInquiry = async (id, action) => {
    if (!confirm(`Confirm inquiry action: ${action.replaceAll("-", " ")}?`)) return;
    try {
        await api(`/api/inquiries/${id}/${action}`, {method: "PUT"});
        toast("Inquiry status updated");
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

window.deleteInquiry = async id => {
    if (!confirm("Delete this inquiry?")) return;
    try {
        await api(`/api/inquiries/${id}`, {method: "DELETE"});
        toast("Inquiry deleted");
        clearInquiryForm();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

window.editReview = id => {
    const review = reviews.find(item => item.reviewId === id);
    if (!review) return;
    $("reviewId").value = review.reviewId;
    $("reviewEvent").value = review.eventId;
    $("rating").value = review.rating;
    $("comment").value = review.comment;
    $("anonymous").checked = review.anonymous;
    $("reviewTitle").textContent = "Edit review";
    $("saveReview").textContent = "Save changes";
    scrollTo({top: $("reviewFormCard").offsetTop - 20, behavior: "smooth"});
};

window.respondToReview = async id => {
    const existing = reviews.find(review => review.reviewId === id)?.response || "";
    const response = prompt("Enter the management response:", existing);
    if (response == null || !response.trim()) return;
    try {
        await api(`/api/reviews/${id}/response`, {
            method: "PUT",
            body: JSON.stringify({response: response.trim()})
        });
        toast("Response saved");
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

window.deleteReview = async id => {
    if (!confirm("Delete this review?")) return;
    try {
        await api(`/api/reviews/${id}`, {method: "DELETE"});
        toast("Review deleted");
        clearReviewForm();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

$("inquiryForm").addEventListener("submit", async event => {
    event.preventDefault();
    const id = $("inquiryId").value;
    const body = {
        customerId: currentUser.id,
        eventType: $("eventType").value.trim(),
        eventDetails: $("eventDetails").value.trim(),
        attachmentPath: $("attachmentPath").value.trim() || null
    };

    if (!body.eventType || !body.eventDetails) {
        toast("Event type and inquiry details are required.", true);
        return;
    }

    try {
        await api(id ? `/api/inquiries/${id}` : "/api/inquiries", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(body)
        });
        toast(id ? "Inquiry updated" : "Inquiry submitted");
        clearInquiryForm();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
});

$("reviewForm").addEventListener("submit", async event => {
    event.preventDefault();
    const id = $("reviewId").value;
    const eventId = Number($("reviewEvent").value);

    if (!eventId) {
        toast("A completed event is required before writing a review.", true);
        return;
    }

    const body = {
        eventId,
        customerId: currentUser.id,
        rating: Number($("rating").value),
        comment: $("comment").value.trim(),
        photoPath: null,
        anonymous: $("anonymous").checked
    };

    if (!body.comment) {
        toast("Feedback is required.", true);
        return;
    }

    try {
        await api(id ? `/api/reviews/${id}` : "/api/reviews", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(body)
        });
        toast(id ? "Review updated" : "Review submitted");
        clearReviewForm();
        await load();
    } catch (error) {
        toast(error.message, true);
    }
});

function updateInquiryCharacters() {
    $("inquiryCharacters").textContent = $("eventDetails").value.length;
}

$("inquirySearch").addEventListener("input", renderInquiries);
$("inquiryStatus").addEventListener("change", renderInquiries);
$("reviewSearch").addEventListener("input", renderReviews);
$("eventDetails").addEventListener("input", updateInquiryCharacters);
$("clearInquiry").addEventListener("click", clearInquiryForm);
$("clearReview").addEventListener("click", clearReviewForm);

load();
