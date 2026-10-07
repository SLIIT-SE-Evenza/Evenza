let events = [];
let currentUser = null;

const $ = id => document.getElementById(id);

const isCustomer = () =>
    currentUser?.role === "CUSTOMER";

const isManager = () =>
    currentUser?.role === "EVENT_MANAGER"
    || currentUser?.role === "ADMIN";

/** Loads the authenticated user from the real login session. */
async function loadCurrentUser() {
    const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        window.location.href =
            "http://localhost:5173/login";
        throw new Error("Login is required");
    }

    currentUser = await response.json();
}

/** Configures the page according to the logged-in role. */
function configureRoleInterface() {
    const formCard = $("eventForm").closest(".card");
    const portfolioCard = $("eventRows").closest(".card");

    if (isCustomer()) {
        // A customer can create events only for themselves.
        $("organiserId").innerHTML = `
            <option value="${currentUser.id}">
                ${esc(currentUser.name)}
            </option>
        `;

        $("organiserId").value =
            String(currentUser.id);

        $("organiserId").disabled = true;

        formCard.style.display = "";
        $("newBtn").style.display = "";

        portfolioCard.classList.remove("span-12");
        portfolioCard.classList.add("span-8");
    } else if (isManager()) {
        // Managers approve and complete events.
        formCard.style.display = "none";
        $("newBtn").style.display = "none";

        portfolioCard.classList.remove("span-8");
        portfolioCard.classList.add("span-12");
    }
}

/** Loads only the events permitted by the backend. */
async function load() {
    try {
        events = await api("/api/events");
        render();
    } catch (error) {
        toast(error.message, true);
    }
}

/** Renders counters and the filtered event table. */
function render() {
    $("total").textContent = events.length;

    $("draft").textContent = events.filter(
        event => event.status === "DRAFT"
    ).length;

    $("approved").textContent = events.filter(
        event => event.status === "APPROVED"
    ).length;

    $("completed").textContent = events.filter(
        event => event.status === "COMPLETED"
    ).length;

    const search =
        $("eventSearch").value.trim().toLowerCase();

    const status = $("statusFilter").value;

    const filteredEvents = events.filter(event => {
        const eventName =
            (event.name || "").toLowerCase();

        const organiserName =
            (event.organiserName || "").toLowerCase();

        const matchesSearch =
            eventName.includes(search)
            || organiserName.includes(search);

        const matchesStatus =
            status === "ALL"
            || event.status === status;

        return matchesSearch && matchesStatus;
    });

    $("eventRows").innerHTML = filteredEvents
        .map(event => `
            <tr>
                <td>
                    <strong>${esc(event.name)}</strong>
                    <br>
                    <small>${esc(event.organiserName)}</small>
                </td>

                <td>
                    ${new Date(event.eventDate).toLocaleString()}
                </td>

                <td>${event.guestCount}</td>

                <td>
                    <span class="badge status-${event.status.toLowerCase()}">
                        ${event.status.replaceAll("_", " ")}
                    </span>
                </td>

                <td>
                    <div class="row-actions">
                        ${actionButtons(event)}
                    </div>
                </td>
            </tr>
        `)
        .join("")
        || `
            <tr>
                <td colspan="5" class="empty">
                    No matching events found.
                </td>
            </tr>
        `;
}

/** Returns only the actions permitted for the logged-in role. */
function actionButtons(event) {
    if (isCustomer()) {
        switch (event.status) {
            case "DRAFT":
                return `
                    <button
                        class="btn small secondary"
                        onclick="editEvent(${event.id})">
                        Edit
                    </button>

                    <button
                        class="btn small ghost"
                        onclick="changeStatus(${event.id}, 'submit')">
                        Submit
                    </button>

                    <button
                        class="btn small danger"
                        onclick="removeEvent(${event.id})">
                        Delete
                    </button>
                `;

            case "PENDING_APPROVAL":
                return `
                    <button
                        class="btn small danger"
                        onclick="changeStatus(${event.id}, 'cancel')">
                        Cancel
                    </button>
                `;

            case "APPROVED":
                return `
                    <button
                        class="btn small danger"
                        onclick="changeStatus(${event.id}, 'cancel')">
                        Cancel
                    </button>
                `;

            case "CANCELLED":
                return `
                    <button
                        class="btn small danger"
                        onclick="removeEvent(${event.id})">
                        Delete
                    </button>
                `;

            default:
                return `
                    <span class="muted-action">
                        No actions
                    </span>
                `;
        }
    }

    if (isManager()) {
        switch (event.status) {
            case "PENDING_APPROVAL":
                return `
                    <button
                        class="btn small ghost"
                        onclick="changeStatus(${event.id}, 'approve')">
                        Approve
                    </button>

                    <button
                        class="btn small danger"
                        onclick="changeStatus(${event.id}, 'cancel')">
                        Cancel
                    </button>
                `;

            case "APPROVED":
                return `
                    <button
                        class="btn small ghost"
                        onclick="changeStatus(${event.id}, 'complete')">
                        Complete
                    </button>

                    <button
                        class="btn small danger"
                        onclick="changeStatus(${event.id}, 'cancel')">
                        Cancel
                    </button>
                `;

            default:
                return `
                    <span class="muted-action">
                        No actions
                    </span>
                `;
        }
    }

    return `
        <span class="muted-action">
            No actions
        </span>
    `;
}

function resetForm() {
    $("eventForm").reset();
    $("eventId").value = "";
    $("guestCount").value = 50;
    $("formTitle").textContent = "Create event";
    $("saveBtn").textContent = "Save event";

    const minimum =
        new Date(Date.now() + 60_000);

    $("eventDate").min = localInput(minimum);

    $("eventDate").value = localInput(
        new Date(Date.now() + 86_400_000)
    );

    if (currentUser && isCustomer()) {
        $("organiserId").value =
            String(currentUser.id);
    }

    updateRequirementsCount();
}

window.editEvent = id => {
    if (!isCustomer()) {
        toast(
            "Only customers can edit events.",
            true
        );
        return;
    }

    const event = events.find(
        item => item.id === id
    );

    if (!event || event.status !== "DRAFT") {
        toast(
            "Only draft events can be edited.",
            true
        );
        return;
    }

    $("eventId").value = event.id;
    $("organiserId").value = event.organiserId;
    $("name").value = event.name;
    $("eventDate").value =
        localInput(event.eventDate);

    $("guestCount").value = event.guestCount;
    $("requirements").value =
        event.requirements || "";

    $("formTitle").textContent = "Edit event";
    $("saveBtn").textContent = "Save changes";

    updateRequirementsCount();

    scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

window.changeStatus = async (id, action) => {
    if (!confirm(
        `Confirm event action: ${action}?`
    )) {
        return;
    }

    try {
        await api(`/api/events/${id}/${action}`, {
            method: "PATCH"
        });

        toast("Event status updated");
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

window.removeEvent = async id => {
    if (!isCustomer()) {
        toast(
            "Only the customer owner can delete an event.",
            true
        );
        return;
    }

    if (!confirm(
        "Delete this event? This action cannot be undone."
    )) {
        return;
    }

    try {
        await api(`/api/events/${id}`, {
            method: "DELETE"
        });

        toast("Event deleted");
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

function validateEvent(body) {
    if (!isCustomer()) {
        return "Only customers can create or edit events.";
    }

    if (!body.organiserId) {
        return "A customer organiser is required.";
    }

    if (body.name.length < 3) {
        return "Event name must contain at least 3 characters.";
    }

    if (body.name.length > 150) {
        return "Event name cannot exceed 150 characters.";
    }

    if (!body.eventDate) {
        return "Event date and time are required.";
    }

    if (new Date(body.eventDate) <= new Date()) {
        return "Event date and time must be in the future.";
    }

    if (!Number.isInteger(body.guestCount)
        || body.guestCount < 1
        || body.guestCount > 100000) {

        return "Guest count must be a whole number between 1 and 100000.";
    }

    if (body.requirements.length > 1000) {
        return "Requirements cannot exceed 1000 characters.";
    }

    return null;
}

$("eventForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const id = $("eventId").value;

        const body = {
            organiserId: currentUser.id,
            name: $("name").value.trim(),
            eventDate: $("eventDate").value,
            guestCount:
                Number($("guestCount").value),
            requirements:
                $("requirements").value.trim()
        };

        const validationMessage =
            validateEvent(body);

        if (validationMessage) {
            toast(validationMessage, true);
            return;
        }

        try {
            await api(
                id
                    ? `/api/events/${id}`
                    : "/api/events",
                {
                    method: id ? "PUT" : "POST",
                    body: JSON.stringify(body)
                }
            );

            toast(
                id
                    ? "Event updated"
                    : "Event created"
            );

            resetForm();
            await load();
        } catch (error) {
            toast(error.message, true);
        }
    }
);

function updateRequirementsCount() {
    $("requirementsCount").textContent =
        $("requirements").value.length;
}

$("eventSearch").addEventListener(
    "input",
    render
);

$("statusFilter").addEventListener(
    "change",
    render
);

$("requirements").addEventListener(
    "input",
    updateRequirementsCount
);

$("newBtn").addEventListener(
    "click",
    resetForm
);

$("cancelBtn").addEventListener(
    "click",
    resetForm
);

/** Starts the page only after verifying the login session. */
async function initialisePage() {
    try {
        await loadCurrentUser();
        configureRoleInterface();
        resetForm();
        await load();
    } catch (error) {
        console.error(error);
    }
}

initialisePage();