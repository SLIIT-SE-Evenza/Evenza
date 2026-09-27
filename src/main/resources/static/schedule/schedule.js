/*
 * Evenza Schedule UI
 * ------------------
 * This file uses the browser Fetch API to call the existing Spring REST
 * controllers. No frontend framework is required for the evaluation demo.
 */

const state = {
    events: [],
    staff: [],
    tasks: [],
    milestones: [],
    activeEventId: null,
    editingTaskId: null,
    editingMilestoneId: null,
    assigningTaskId: null
};

const elements = {
    eventSelect: document.querySelector("#event-select"),
    setupBanner: document.querySelector("#setup-banner"),
    activeEventName: document.querySelector("#active-event-name"),
    activeEventMeta: document.querySelector("#active-event-meta"),
    tasksBody: document.querySelector("#tasks-body"),
    tasksEmpty: document.querySelector("#tasks-empty"),
    milestoneGrid: document.querySelector("#milestone-grid"),
    milestonesEmpty: document.querySelector("#milestones-empty"),
    calendarList: document.querySelector("#calendar-list"),
    calendarEmpty: document.querySelector("#calendar-empty"),
    taskDialog: document.querySelector("#task-dialog"),
    milestoneDialog: document.querySelector("#milestone-dialog"),
    assignmentDialog: document.querySelector("#assignment-dialog"),
    loadingOverlay: document.querySelector("#loading-overlay")
};

document.addEventListener("DOMContentLoaded", initialise);

/** Loads lookups, configures default dates and connects all button events. */
async function initialise() {
    bindNavigation();
    bindForms();
    bindPageActions();
    setDefaultCalendarRange();

    try {
        setLoading(true);
        await loadLookups();
        await selectInitialEvent();
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

/** A shared request helper keeps JSON and error handling consistent. */
async function api(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.body ? {"Content-Type": "application/json"} : {}),
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        const raw = await response.text();
        let message = `Request failed (${response.status})`;

        try {
            const data = JSON.parse(raw);
            message = data.detail || data.message || data.error || message;
        } catch (_) {
            if (raw && raw.length < 240) message = raw;
        }
        throw new Error(message);
    }

    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

/** Loads events and assignable users for readable select controls. */
async function loadLookups() {
    [state.events, state.staff] = await Promise.all([
        api("/api/schedule/events"),
        api("/api/schedule/staff")
    ]);

    elements.eventSelect.innerHTML = state.events.length
        ? state.events.map(event => `<option value="${event.id}">${escapeHtml(event.name)}</option>`).join("")
        : `<option value="">No events available</option>`;

    elements.setupBanner.classList.toggle("hidden", state.events.length > 0);
    populateStaffSelects();
}

async function selectInitialEvent() {
    if (!state.events.length) {
        disableEventActions(true);
        renderAll();
        return;
    }

    const savedId = Number(localStorage.getItem("evenza.activeEvent"));
    const selected = state.events.find(event => event.id === savedId) || state.events[0];
    elements.eventSelect.value = String(selected.id);
    state.activeEventId = selected.id;
    disableEventActions(false);
    await loadEventData();
}

/** Reloads both feature lists whenever the active event changes. */
async function loadEventData() {
    if (!state.activeEventId) return;

    [state.tasks, state.milestones] = await Promise.all([
        api(`/api/tasks/event/${state.activeEventId}`),
        api(`/api/milestones/event/${state.activeEventId}`)
    ]);

    localStorage.setItem("evenza.activeEvent", String(state.activeEventId));
    renderAll();
}

function renderAll() {
    renderEventHeader();
    renderStatistics();
    renderTasks();
    renderMilestones();
    populateMilestoneSelects();
}

function renderEventHeader() {
    const event = state.events.find(item => item.id === state.activeEventId);
    elements.activeEventName.textContent = event?.name || "No event selected";
    elements.activeEventMeta.textContent = event
        ? `${formatDateTime(event.eventDate)} · ${formatLabel(event.status)}`
        : "Create demo data or add an event before managing its schedule.";
}

function renderStatistics() {
    document.querySelector("#stat-total").textContent = state.tasks.length;
    document.querySelector("#stat-completed").textContent = state.tasks.filter(task => task.status === "COMPLETED").length;
    document.querySelector("#stat-milestones").textContent = state.milestones.length;
    document.querySelector("#stat-overdue").textContent = state.tasks.filter(task => task.status === "OVERDUE").length;
}

function renderTasks() {
    const query = document.querySelector("#task-search").value.trim().toLowerCase();
    const status = document.querySelector("#status-filter").value;

    const filtered = state.tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(query)
            || (task.description || "").toLowerCase().includes(query);
        const matchesStatus = status === "ALL" || task.status === status;
        return matchesSearch && matchesStatus;
    });

    elements.tasksBody.innerHTML = filtered.map(task => {
        const staff = state.staff.find(person => person.id === task.assignedStaffId);
        const milestone = state.milestones.find(item => item.id === task.milestoneId);
        const canStart = !["IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(task.status);
        const canComplete = !["COMPLETED", "CANCELLED"].includes(task.status);
        const canCancel = !["COMPLETED", "CANCELLED"].includes(task.status);

        return `<tr>
            <td>
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-description">${escapeHtml(task.description || "No description")}</div>
            </td>
            <td>
                ${formatDateTime(task.startTime)}
                <span class="subtext">Deadline: ${formatDateTime(task.deadline)}</span>
            </td>
            <td>
                ${escapeHtml(staff?.name || "Unassigned")}
                <span class="subtext">${escapeHtml(milestone?.name || "No milestone")}</span>
            </td>
            <td><span class="status-badge status-${task.status}">${formatLabel(task.status)}</span></td>
            <td>
                <div class="row-actions">
                    ${canStart ? `<button class="button small ghost" data-task-action="start" data-id="${task.id}">Start</button>` : ""}
                    ${canComplete ? `<button class="button small ghost" data-task-action="complete" data-id="${task.id}">Complete</button>` : ""}
                    <button class="button small ghost" data-task-action="assign" data-id="${task.id}">Assign</button>
                    <button class="button small ghost" data-task-action="edit" data-id="${task.id}">Edit</button>
                    ${canCancel ? `<button class="button small danger" data-task-action="cancel" data-id="${task.id}">Cancel</button>` : ""}
                    <button class="button small danger" data-task-action="delete" data-id="${task.id}">Delete</button>
                </div>
            </td>
        </tr>`;
    }).join("");

    elements.tasksEmpty.classList.toggle("hidden", filtered.length > 0);
}

function renderMilestones() {
    elements.milestoneGrid.innerHTML = state.milestones.map(milestone => `
        <article class="milestone-card">
            <div class="milestone-top">
                <h3>${escapeHtml(milestone.name)}</h3>
                <span class="status-badge status-${milestone.status}">${formatLabel(milestone.status)}</span>
            </div>
            <div class="milestone-date"><span>Target date</span><strong>${formatDate(milestone.targetDate)}</strong></div>
            <div class="milestone-actions">
                <button class="button small ghost" data-milestone-action="edit" data-id="${milestone.id}">Edit</button>
                <button class="button small ghost" data-milestone-action="risk" data-id="${milestone.id}">At risk</button>
                <button class="button small ghost" data-milestone-action="achieve" data-id="${milestone.id}">Achieve</button>
                <button class="button small danger" data-milestone-action="delete" data-id="${milestone.id}">Delete</button>
            </div>
        </article>
    `).join("");

    elements.milestonesEmpty.classList.toggle("hidden", state.milestones.length > 0);
}

/** Groups calendar results by their task start date for a timeline view. */
function renderCalendar(tasks) {
    const groups = tasks.reduce((result, task) => {
        const date = task.startTime.substring(0, 10);
        (result[date] ||= []).push(task);
        return result;
    }, {});

    const sortedDates = Object.keys(groups).sort();
    elements.calendarList.innerHTML = sortedDates.map(date => {
        const dateValue = new Date(`${date}T00:00:00`);
        return `<section class="calendar-day">
            <div class="calendar-date"><strong>${dateValue.getDate()}</strong>${dateValue.toLocaleDateString(undefined, {month:"short", year:"numeric"})}</div>
            <div class="calendar-day-tasks">
                ${groups[date].map(task => `<article class="calendar-task">
                    <div><h3>${escapeHtml(task.title)}</h3><p>${formatTime(task.startTime)} – ${formatTime(task.endTime)} · Event #${task.eventId}</p></div>
                    <span class="status-badge status-${task.status}">${formatLabel(task.status)}</span>
                </article>`).join("")}
            </div>
        </section>`;
    }).join("");

    elements.calendarEmpty.classList.toggle("hidden", sortedDates.length > 0);
}

function bindNavigation() {
    document.querySelectorAll(".nav-item").forEach(button => {
        button.addEventListener("click", async () => {
            document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
            document.querySelectorAll(".content-view").forEach(view => view.classList.remove("active"));
            button.classList.add("active");
            document.querySelector(`#${button.dataset.view}`).classList.add("active");

            if (button.dataset.view === "calendar-view") await loadCalendar();
        });
    });
}

function bindPageActions() {
    document.querySelector("#new-task-button").addEventListener("click", () => openTaskDialog());
    document.querySelector("#new-milestone-button").addEventListener("click", () => openMilestoneDialog());
    document.querySelectorAll("[data-open-milestone]").forEach(button => button.addEventListener("click", () => openMilestoneDialog()));
    document.querySelector("#refresh-button").addEventListener("click", refreshEverything);
    document.querySelector("#overdue-button").addEventListener("click", markOverdue);
    document.querySelector("#demo-data-button").addEventListener("click", createDemoData);
    document.querySelector("#load-calendar-button").addEventListener("click", loadCalendar);
    document.querySelector("#task-search").addEventListener("input", renderTasks);
    document.querySelector("#status-filter").addEventListener("change", renderTasks);

    elements.eventSelect.addEventListener("change", async event => {
        state.activeEventId = Number(event.target.value) || null;
        setLoading(true);
        try { await loadEventData(); }
        catch (error) { showToast(error.message, true); }
        finally { setLoading(false); }
    });

    elements.tasksBody.addEventListener("click", handleTaskAction);
    elements.milestoneGrid.addEventListener("click", handleMilestoneAction);

    document.querySelectorAll("[data-close-dialog]").forEach(button => {
        button.addEventListener("click", () => button.closest("dialog").close());
    });
}

function bindForms() {
    document.querySelector("#task-form").addEventListener("submit", saveTask);
    document.querySelector("#milestone-form").addEventListener("submit", saveMilestone);
    document.querySelector("#assignment-form").addEventListener("submit", saveAssignment);
}

function openTaskDialog(task = null) {
    state.editingTaskId = task?.id || null;
    document.querySelector("#task-dialog-title").textContent = task ? "Edit task" : "Create task";
    document.querySelector("#task-submit-button").textContent = task ? "Save changes" : "Create task";
    document.querySelector("#task-title").value = task?.title || "";
    document.querySelector("#task-description").value = task?.description || "";

    const creationFields = document.querySelector(".create-task-fields");
    creationFields.classList.toggle("hidden", Boolean(task));
    creationFields.querySelectorAll("input").forEach(input => input.required = !task);

    if (!task) setSuggestedTaskTimes();
    elements.taskDialog.showModal();
}

function openMilestoneDialog(milestone = null) {
    state.editingMilestoneId = milestone?.id || null;
    document.querySelector("#milestone-dialog-title").textContent = milestone ? "Edit milestone" : "Create milestone";
    document.querySelector("#milestone-submit-button").textContent = milestone ? "Save changes" : "Create milestone";
    document.querySelector("#milestone-name").value = milestone?.name || "";
    document.querySelector("#milestone-date").value = milestone?.targetDate || futureDate(7);
    elements.milestoneDialog.showModal();
}

function openAssignmentDialog(task) {
    state.assigningTaskId = task.id;
    document.querySelector("#assignment-task-name").textContent = task.title;
    document.querySelector("#assignment-staff").value = task.assignedStaffId || "";
    document.querySelector("#assignment-milestone").value = task.milestoneId || "";
    elements.assignmentDialog.showModal();
}

async function saveTask(event) {
    event.preventDefault();
    const editing = Boolean(state.editingTaskId);

    const payload = editing ? {
        title: document.querySelector("#task-title").value.trim(),
        description: document.querySelector("#task-description").value.trim()
    } : {
        eventId: state.activeEventId,
        milestoneId: numberOrNull(document.querySelector("#task-milestone").value),
        assignedStaffId: numberOrNull(document.querySelector("#task-staff").value),
        title: document.querySelector("#task-title").value.trim(),
        description: document.querySelector("#task-description").value.trim(),
        startTime: document.querySelector("#task-start").value,
        endTime: document.querySelector("#task-end").value,
        deadline: document.querySelector("#task-deadline").value
    };

    setLoading(true);
    try {
        await api(editing ? `/api/tasks/${state.editingTaskId}` : "/api/tasks", {
            method: editing ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        elements.taskDialog.close();
        await loadEventData();
        showToast(editing ? "Task updated successfully." : "Task created successfully.");
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

async function saveMilestone(event) {
    event.preventDefault();
    const editing = Boolean(state.editingMilestoneId);
    const payload = {
        ...(editing ? {} : {eventId: state.activeEventId}),
        name: document.querySelector("#milestone-name").value.trim(),
        targetDate: document.querySelector("#milestone-date").value
    };

    setLoading(true);
    try {
        await api(editing ? `/api/milestones/${state.editingMilestoneId}` : "/api/milestones", {
            method: editing ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        elements.milestoneDialog.close();
        await loadEventData();
        showToast(editing ? "Milestone updated successfully." : "Milestone created successfully.");
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

async function saveAssignment(event) {
    event.preventDefault();
    const staffId = numberOrNull(document.querySelector("#assignment-staff").value);
    const milestoneId = numberOrNull(document.querySelector("#assignment-milestone").value);

    if (!staffId && !milestoneId) {
        showToast("Choose a staff member or milestone.", true);
        return;
    }

    setLoading(true);
    try {
        if (staffId) await api(`/api/tasks/${state.assigningTaskId}/assign-staff/${staffId}`, {method: "PATCH"});
        if (milestoneId) await api(`/api/tasks/${state.assigningTaskId}/assign-milestone/${milestoneId}`, {method: "PATCH"});
        elements.assignmentDialog.close();
        await loadEventData();
        showToast("Assignment updated successfully.");
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

async function handleTaskAction(event) {
    const button = event.target.closest("[data-task-action]");
    if (!button) return;
    const task = state.tasks.find(item => item.id === Number(button.dataset.id));
    if (!task) return;

    const action = button.dataset.taskAction;
    if (action === "edit") return openTaskDialog(task);
    if (action === "assign") return openAssignmentDialog(task);

    if (action === "delete" && !confirm(`Delete task “${task.title}”?`)) return;
    const endpoints = {
        start: {url: `/api/tasks/${task.id}/start`, method: "PATCH"},
        complete: {url: `/api/tasks/${task.id}/complete`, method: "PATCH"},
        cancel: {url: `/api/tasks/${task.id}/cancel`, method: "PATCH"},
        delete: {url: `/api/tasks/${task.id}`, method: "DELETE"}
    };

    await performAction(endpoints[action], `Task ${action} operation completed.`);
}

async function handleMilestoneAction(event) {
    const button = event.target.closest("[data-milestone-action]");
    if (!button) return;
    const milestone = state.milestones.find(item => item.id === Number(button.dataset.id));
    if (!milestone) return;

    const action = button.dataset.milestoneAction;
    if (action === "edit") return openMilestoneDialog(milestone);
    if (action === "delete" && !confirm(`Delete milestone “${milestone.name}”? Related tasks may also be affected.`)) return;

    const endpoints = {
        risk: {url: `/api/milestones/${milestone.id}/at-risk`, method: "PATCH"},
        achieve: {url: `/api/milestones/${milestone.id}/achieve`, method: "PATCH"},
        delete: {url: `/api/milestones/${milestone.id}`, method: "DELETE"}
    };
    await performAction(endpoints[action], `Milestone ${action} operation completed.`);
}

async function performAction(request, successMessage) {
    setLoading(true);
    try {
        await api(request.url, {method: request.method});
        await loadEventData();
        showToast(successMessage);
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

async function markOverdue() {
    setLoading(true);
    try {
        const count = await api("/api/tasks/mark-overdue", {method: "POST"});
        await loadEventData();
        showToast(`${count} overdue task${count === 1 ? "" : "s"} updated.`);
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

async function loadCalendar() {
    const start = document.querySelector("#calendar-start").value;
    const end = document.querySelector("#calendar-end").value;
    if (!start || !end) return;

    setLoading(true);
    try {
        const tasks = await api(`/api/tasks/calendar?start=${start}T00:00:00&end=${end}T23:59:59`);
        renderCalendar(tasks);
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

async function createDemoData() {
    setLoading(true);
    try {
        const result = await api("/api/schedule/demo-data", {method: "POST"});
        await loadLookups();
        state.activeEventId = result.eventId;
        elements.eventSelect.value = String(result.eventId);
        disableEventActions(false);
        await loadEventData();
        showToast(result.message);
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

async function refreshEverything() {
    setLoading(true);
    try {
        await loadLookups();
        if (state.activeEventId) await loadEventData();
        showToast("Schedule refreshed.");
    } catch (error) {
        showToast(error.message, true);
    } finally {
        setLoading(false);
    }
}

function populateStaffSelects() {
    const options = state.staff.map(person =>
        `<option value="${person.id}">${escapeHtml(person.name)} · ${formatLabel(person.role)}</option>`
    ).join("");
    document.querySelector("#task-staff").innerHTML = `<option value="">Unassigned</option>${options}`;
    document.querySelector("#assignment-staff").innerHTML = `<option value="">Keep current staff</option>${options}`;
}

function populateMilestoneSelects() {
    const options = state.milestones.map(milestone =>
        `<option value="${milestone.id}">${escapeHtml(milestone.name)}</option>`
    ).join("");
    document.querySelector("#task-milestone").innerHTML = `<option value="">No milestone</option>${options}`;
    document.querySelector("#assignment-milestone").innerHTML = `<option value="">Keep current milestone</option>${options}`;
}

function disableEventActions(disabled) {
    ["#new-task-button", "#new-milestone-button", "#overdue-button"].forEach(selector => {
        document.querySelector(selector).disabled = disabled;
    });
}

function setDefaultCalendarRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    document.querySelector("#calendar-start").value = dateInputValue(start);
    document.querySelector("#calendar-end").value = dateInputValue(end);
}

function setSuggestedTaskTimes() {
    const start = new Date();
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    document.querySelector("#task-start").value = dateTimeInputValue(start);
    document.querySelector("#task-end").value = dateTimeInputValue(end);
    document.querySelector("#task-deadline").value = dateTimeInputValue(end);
    document.querySelector("#task-milestone").value = "";
    document.querySelector("#task-staff").value = "";
}

function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = `toast${isError ? " error" : ""}`;
    toast.textContent = message;
    document.querySelector("#toast-container").appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
}

function setLoading(visible) {
    elements.loadingOverlay.classList.toggle("hidden", !visible);
}

function numberOrNull(value) { return value ? Number(value) : null; }
function formatLabel(value = "") { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase()); }
function formatDate(value) { return value ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {day:"numeric", month:"short", year:"numeric"}) : "—"; }
function formatDateTime(value) { return value ? new Date(value).toLocaleString(undefined, {day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"}) : "—"; }
function formatTime(value) { return new Date(value).toLocaleTimeString(undefined, {hour:"2-digit", minute:"2-digit"}); }
function dateInputValue(date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; }
function dateTimeInputValue(date) { return `${dateInputValue(date)}T${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`; }
function futureDate(days) { const date = new Date(); date.setDate(date.getDate() + days); return dateInputValue(date); }

/** Escapes database text before inserting it into generated HTML. */
function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
