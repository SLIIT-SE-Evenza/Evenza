let bookings = [];
let vendors = [];
let venues = [];
let users = [];
let events = [];
let currentUser = null;

const $ = id => document.getElementById(id);

/**
 * Loads the authenticated user and all permitted booking information.
 */
async function load() {
    try {
        currentUser = await api("/api/auth/me");

        const allowedRoles = [
            "CUSTOMER",
            "EVENT_MANAGER",
            "ADMIN"
        ];

        if (!allowedRoles.includes(currentUser.role)) {
            throw new Error(
                "Your account does not have access to Booking Management."
            );
        }

        /*
         * Customers request only their own bookings.
         * Managers and administrators request every booking.
         */
        const bookingUrl =
            currentUser.role === "CUSTOMER"
                ? `/api/bookings/customer/${currentUser.id}`
                : "/api/bookings";

        [
            bookings,
            vendors,
            venues,
            users,
            events
        ] = await Promise.all([
            api(bookingUrl),
            api("/api/booking-resources/vendors"),
            api("/api/booking-resources/venues"),
            api("/api/schedule/users"),
            api("/api/schedule/events")
        ]);

        configureRoleInterface();
        fillResourceOptions();
        fillCustomerOptions();
        reset();
        render();
    } catch (error) {
        if (error.message.toLowerCase().includes("unauthorized")) {
            window.location.href = "http://localhost:5173/login";
            return;
        }

        toast(error.message, true);
    }
}

/**
 * Hides development controls and prevents customers selecting another user.
 */
function configureRoleInterface() {
    const managementUser =
        currentUser.role === "EVENT_MANAGER"
        || currentUser.role === "ADMIN";

    $("customerId").disabled = !managementUser;

// Demo controls are available only to administrators.
if (currentUser.role !== "ADMIN") {
    $("demoBtn")?.setAttribute("hidden", "");
    $("seedBtn")?.setAttribute("hidden", "");
}

}

/**
 * Loads vendors and venues into their selection fields.
 */
function fillResourceOptions() {
    $("vendorId").innerHTML =
        '<option value="">None</option>'
        + vendors.map(vendor => `
            <option value="${vendor.id}">
                ${esc(vendor.name)} · LKR ${vendor.price}
            </option>
        `).join("");

    $("venueId").innerHTML =
        '<option value="">None</option>'
        + venues.map(venue => `
            <option value="${venue.id}">
                ${esc(venue.name)} · ${venue.capacity} guests
            </option>
        `).join("");

    $("resourceSummary").textContent =
        `${vendors.length} vendors and ${venues.length} venues ready for reservation.`;
}

/**
 * Customers receive only their own account option.
 * Management users can select a customer.
 */
function fillCustomerOptions() {
    let availableCustomers;

    if (currentUser.role === "CUSTOMER") {
        availableCustomers = [currentUser];
    } else {
        availableCustomers =
            users.filter(user => user.role === "CUSTOMER");
    }

    $("customerId").innerHTML =
        availableCustomers.map(customer => `
            <option value="${customer.id}">
                ${esc(customer.name)}
            </option>
        `).join("")
        || '<option value="">No customers available</option>';

    if (currentUser.role === "CUSTOMER") {
        $("customerId").value = String(currentUser.id);
    }

    fillEventOptions();
}

/**
 * Displays only events belonging to the selected customer.
 */
function fillEventOptions(selectedEventId = null) {
    const customerId = Number($("customerId").value);

    const customerEvents =
        events.filter(event =>
            Number(event.organiserId) === customerId
        );

    $("eventId").innerHTML =
        customerEvents.map(event => `
            <option value="${event.id}">
                ${esc(event.name)}
            </option>
        `).join("")
        || '<option value="">No events available for this customer</option>';

    if (selectedEventId !== null) {
        $("eventId").value = String(selectedEventId);
    }
}

/**
 * Renders booking statistics and role-appropriate action buttons.
 */
function render() {
    $("total").textContent = bookings.length;

    $("pending").textContent =
        bookings.filter(booking =>
            booking.status === "PENDING"
        ).length;

    $("accepted").textContent =
        bookings.filter(booking =>
            booking.status === "ACCEPTED"
        ).length;

    $("cancelled").textContent =
        bookings.filter(booking =>
            booking.status === "CANCELLED"
        ).length;

    $("rows").innerHTML =
        bookings.map(booking => {
            const vendor =
                vendors.find(item =>
                    item.id === booking.vendorId
                );

            const venue =
                venues.find(item =>
                    item.id === booking.venueId
                );

            const resources =
                [vendor?.name, venue?.name]
                    .filter(Boolean)
                    .join(" + ")
                || "—";

            return `
                <tr>
                    <td>${booking.bookingDate}</td>

                    <td>${esc(resources)}</td>

                    <td>
                        ${booking.startTime.slice(0, 5)}
                        –
                        ${booking.endTime.slice(0, 5)}
                    </td>

                    <td>
                        <span class="badge status-${booking.status.toLowerCase()}">
                            ${booking.status.replaceAll("_", " ")}
                        </span>
                    </td>

                    <td>
                        <div class="row-actions">
                            ${actionButtons(booking)}
                        </div>
                    </td>
                </tr>
            `;
        }).join("")
        || `
            <tr>
                <td colspan="5" class="empty">
                    No bookings found.
                </td>
            </tr>
        `;
}

/**
 * Creates buttons according to the authenticated role and booking status.
 */
function actionButtons(booking) {
    const managementUser =
        currentUser.role === "EVENT_MANAGER"
        || currentUser.role === "ADMIN";

    if (managementUser) {
        switch (booking.status) {
            case "PENDING":
                return `
                    <button class="btn small secondary"
                            onclick="editBooking(${booking.id})">
                        Edit
                    </button>

                    <button class="btn small"
                            onclick="statusBooking(${booking.id}, 'accept')">
                        Accept
                    </button>

                    <button class="btn small ghost"
                            onclick="statusBooking(${booking.id}, 'reject')">
                        Reject
                    </button>

                    <button class="btn small danger"
                            onclick="removeBooking(${booking.id})">
                        Delete
                    </button>
                `;

            case "ACCEPTED":
                return `
                    <button class="btn small danger"
                            onclick="statusBooking(${booking.id}, 'cancel')">
                        Cancel
                    </button>
                `;

            case "REJECTED":
            case "CANCELLED":
                return `
                    <button class="btn small danger"
                            onclick="removeBooking(${booking.id})">
                        Delete
                    </button>
                `;

            default:
                return '<span class="muted-action">No actions</span>';
        }
    }

    // Customer actions apply only to their own bookings returned by the API.
    switch (booking.status) {
        case "PENDING":
            return `
                <button class="btn small secondary"
                        onclick="editBooking(${booking.id})">
                    Edit
                </button>

                <button class="btn small danger"
                        onclick="statusBooking(${booking.id}, 'cancel')">
                    Cancel
                </button>
            `;

        case "ACCEPTED":
            return `
                <button class="btn small danger"
                        onclick="statusBooking(${booking.id}, 'cancel')">
                    Cancel
                </button>
            `;

        case "REJECTED":
        case "CANCELLED":
            return `
                <button class="btn small danger"
                        onclick="removeBooking(${booking.id})">
                    Delete
                </button>
            `;

        default:
            return '<span class="muted-action">No actions</span>';
    }
}

/**
 * Clears the form and applies safe default values.
 */
function reset() {
    $("bookingForm").reset();
    $("bookingId").value = "";
    $("formTitle").textContent = "New booking";

    const today = localDate(new Date());
    const tomorrow =
        localDate(new Date(Date.now() + 86_400_000));

    $("bookingDate").min = today;
    $("bookingDate").value = tomorrow;
    $("startTime").value = "09:00";
    $("endTime").value = "12:00";

    if (currentUser?.role === "CUSTOMER") {
        $("customerId").value = String(currentUser.id);
    }

    fillEventOptions();
}

/**
 * Converts a JavaScript Date into yyyy-MM-dd using local time.
 */
function localDate(date) {
    const year = date.getFullYear();
    const month =
        String(date.getMonth() + 1).padStart(2, "0");
    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Places an existing pending booking into the edit form.
 */
window.editBooking = id => {
    const booking =
        bookings.find(item => item.id === id);

    if (!booking || booking.status !== "PENDING") {
        toast("Only pending bookings can be edited.", true);
        return;
    }

    $("bookingId").value = booking.id;
    $("customerId").value = booking.customerId;

    fillEventOptions(booking.eventId);

    $("vendorId").value = booking.vendorId || "";
    $("venueId").value = booking.venueId || "";
    $("bookingDate").value = booking.bookingDate;
    $("startTime").value =
        booking.startTime.slice(0, 5);
    $("endTime").value =
        booking.endTime.slice(0, 5);
    $("formTitle").textContent = "Edit booking";

    scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

/**
 * Accepts, rejects or cancels a booking.
 */
window.statusBooking = async (id, action) => {
    if (!confirm(`Confirm booking action: ${action}?`)) {
        return;
    }

    try {
        /*
         * Cancel no longer includes a customerId query parameter.
         * Ownership is taken safely from the authenticated session.
         */
        await api(`/api/bookings/${id}/${action}`, {
            method: "PATCH"
        });

        const messages = {
            accept: "Booking accepted",
            reject: "Booking rejected",
            cancel: "Booking cancelled"
        };

        toast(messages[action] || "Booking updated");
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

/**
 * Deletes an eligible booking.
 */
window.removeBooking = async id => {
    if (!confirm("Delete this booking?")) {
        return;
    }

    try {
        await api(`/api/bookings/${id}`, {
            method: "DELETE"
        });

        toast("Booking deleted");
        await load();
    } catch (error) {
        toast(error.message, true);
    }
};

/**
 * Performs browser-side validation before sending data to Spring Boot.
 */
function validateBooking(body) {
    if (!body.customerId) {
        return "Please select a customer.";
    }

    if (!body.eventId) {
        return "Please select an event belonging to the customer.";
    }

    if (!body.vendorId && !body.venueId) {
        return "Please select at least one vendor or venue.";
    }

    if (!body.bookingDate) {
        return "Booking date is required.";
    }

    if (!body.startTime || !body.endTime) {
        return "Start time and end time are required.";
    }

    if (body.endTime <= body.startTime) {
        return "End time must be after start time.";
    }

    const bookingStart =
        new Date(
            `${body.bookingDate}T${body.startTime}`
        );

    if (bookingStart <= new Date()) {
        return "Booking start date and time must be in the future.";
    }

    const selectedEvent =
        events.find(event =>
            event.id === body.eventId
        );

    if (!selectedEvent
            || Number(selectedEvent.organiserId)
            !== body.customerId) {

        return "The selected event does not belong to this customer.";
    }

    return null;
}

$("bookingForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const id = $("bookingId").value;

        const body = {
            customerId:
                Number($("customerId").value),

            eventId:
                Number($("eventId").value),

            vendorId:
                $("vendorId").value
                    ? Number($("vendorId").value)
                    : null,

            venueId:
                $("venueId").value
                    ? Number($("venueId").value)
                    : null,

            bookingDate:
                $("bookingDate").value,

            startTime:
                $("startTime").value,

            endTime:
                $("endTime").value
        };

        const validationMessage =
            validateBooking(body);

        if (validationMessage) {
            toast(validationMessage, true);
            return;
        }

        try {
            await api(
                id
                    ? `/api/bookings/${id}`
                    : "/api/bookings",
                {
                    method: id ? "PUT" : "POST",
                    body: JSON.stringify(body)
                }
            );

            toast(
                id
                    ? "Booking updated"
                    : "Booking created"
            );

            await load();
        } catch (error) {
            toast(error.message, true);
        }
    }
);

// Changing the customer refreshes the permitted event list.
$("customerId").addEventListener(
    "change",
    () => fillEventOptions()
);

$("clearBtn").addEventListener(
    "click",
    reset
);

/*
 * Demo resource creation remains available only when the administrator
 * can see and click these controls.
 */
$("demoBtn")?.addEventListener(
    "click",
    async () => {
        try {
            await ensureDemo();
            await seed();
            await load();
        } catch (error) {
            toast(error.message, true);
        }
    }
);

$("seedBtn")?.addEventListener(
    "click",
    async () => {
        try {
            await seed();
            await load();
            toast("Demo resources ready");
        } catch (error) {
            toast(error.message, true);
        }
    }
);

async function seed() {
    const [existingVendors, existingVenues] =
        await Promise.all([
            api("/api/booking-resources/vendors"),
            api("/api/booking-resources/venues")
        ]);

    if (!existingVendors.length) {
        await api("/api/booking-resources/vendors", {
            method: "POST",
            body: JSON.stringify({
                name: "Emerald Catering",
                category: "Catering",
                price: 85000,
                available: true,
                description: "Buffet service for events"
            })
        });
    }

    if (!existingVenues.length) {
        await api("/api/booking-resources/venues", {
            method: "POST",
            body: JSON.stringify({
                name: "Grand Garden Hall",
                location: "Colombo",
                capacity: 300,
                available: true
            })
        });
    }
}

load();