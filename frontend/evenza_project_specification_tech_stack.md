# Evenza — Web-Based Event Planning System
## Complete System Specification, Architecture & Frontend Engineering Blueprint

---

## 1. Project Identity & Academic Context

* **Project Title:** Evenza — Centralized Web-Based Event Planning System
* **Course & Module:** SE2030 – Software Engineering
* **Academic Institution:** Faculty of Computing, Sri Lanka Institute of Information Technology (SLIIT)
* **Academic Calendar:** Year 2, Semester 1 (2026)
* **Group Identifier:** `2026-Y2-S1-MLB-B10G1-02`
* **Industry / Client Stakeholder (Product Owner):** Mr. Nuwan Perera (Operations Manager, Evenza)
* **Scrum Master:** Wickramarathna W.L.S.

### Group Membership & Assigned Core Module Ownership

| Member Name | Student ID | Assigned Core Module | Role in Scrum |
| :--- | :--- | :--- | :--- |
| **Chathuranga B.G.** | IT25101514 | **FR1:** Inquiry, Feedback & Rating Management | Full-Stack Developer |
| **Suriyage O.W.** | IT25100916 | **FR2:** Event Creation & Lifecycle Management | Full-Stack Developer |
| **Gunasekara N.B.** | IT25102923 | **FR3:** Venue & Vendor Booking Management | Full-Stack Developer |
| **Wickramarathna W.L.S.** | IT25102322 | **FR4:** Schedule & Activity Management | Scrum Master / Developer |
| **Keshavan M.** | IT25103301 | **FR5:** Inventory & Asset Management | Full-Stack Developer |
| **Wickramasinghage C.P.W.**| IT25100220 | **FR6:** Promotion & Advertisement Management | Full-Stack Developer |

---

## 2. Technical Stack & Infrastructure Blueprint

### 2.1 Frontend Architecture (Target for Antigravity Code Generation)
* **Core Framework:** React 18+ (SPA architecture)
* **Build System & Dev Server:** Vite (`@vitejs/plugin-react`)
* **Styling Framework:** Tailwind CSS with `@tailwindcss/forms` and `@tailwindcss/typography`
* **UI Primitives & Headless Library:** shadcn/ui built on top of **Radix UI Primitives** (Accessibility-compliant, WAI-ARIA standard)
* **Theme Preset & Typography:** 
  * Preset: **Nova - Lucide / Geist** (Preset ID / Base Token alignment: `b2N4d76zD8`)
  * Fonts: Geist Sans / Inter sans-serif
* **Iconography:** Lucide React (`lucide-react`)
* **Routing:** React Router DOM (v6+) with role-based Route Guards (`<ProtectedRoute />`)
* **Path Resolution & Aliasing:** 
  * Configured via `jsconfig.json` and `vite.config.js`
  * Alias: `@/*` $\rightarrow$ `./src/*` (`@/components`, `@/lib/utils`, `@/pages`, `@/hooks`, `@/services`)
* **HTTP Client:** Axios instance configured with base URL, token interceptors, and error handlers
* **Date & Calendar Tools:** `date-fns`, `react-day-picker`, FullCalendar / custom interactive Gantt/Timeline grid
* **Form Management & Validation:** React Hook Form (`react-hook-form`) with Zod (`zod`) schemas
* **State Management:** React Context API + custom hooks for Auth/Session, WebSocket events, and global toasts

### 2.2 Backend Architecture
* **Language & Runtime:** Java 17+ / Java 21 LTS
* **Framework:** Spring Boot 3.x
* **Architecture Pattern:** Layered Domain-Driven Monolithic REST API transitioning to Microservices
  * Controller Layer (`@RestController`, Request validation, HTTP response wrapping)
  * Service Layer (Business logic, transactional boundaries `@Transactional`)
  * Repository Layer (Spring Data JPA)
* **Security & Authentication:** 
  * Spring Security 6+
  * Stateless JWT (JSON Web Tokens) with refresh token mechanism
  * Password Hashing: BCrypt (`BCryptPasswordEncoder` with work factor 12)
  * Role-Based Access Control (RBAC) via `@PreAuthorize("hasRole('...')")`
* **Real-time Communication:** Spring WebSocket with STOMP messaging protocol for instant status updates, calendar locks, and stock alerts
* **Email & Notifications:** `spring-boot-starter-mail` (JavaMailSender for OTPs, invitations, and alerts)
* **Reporting Utilities:** OpenPDF / iText and OpenCSV for dynamic reporting (PDF export and CSV data extraction)
* **Developer Productivity:** Project Lombok (`@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`, `@Slf4j`)

### 2.3 Database & Persistence Layer
* **RDBMS Engine:** PostgreSQL 15+ (or MySQL 8.0+)
* **ORM:** Hibernate with Spring Data JPA
* **Connection Pooling:** HikariCP
* **Data Consistency:** Database transactions with ACID compliance, isolation levels to prevent concurrent booking race conditions

---

## 3. Project Background, Problem Statement & Objectives

### 3.1 Background
The event planning industry represents an intricate ecosystem coordinating clients, event planners, venue hosts, external vendors (catering, photography, entertainment, sound/lighting), operations crew, and attendees. Traditional event management relies on disconnected manual tools such as unsynchronized WhatsApp chats, direct cellular calls, email chains, and shared spreadsheets.

### 3.2 Problem Statement
1. **Fragmented Communication & Workflow Disconnects:** Critical requirements get lost across siloed channels, causing miscommunication and delays.
2. **Double Booking & Resource Collisions:** Simultaneous requests for the same venue or vendor lead to double-booking errors due to lack of real-time calendar slot locking.
3. **Inventory & Asset Shortages:** Equipment such as audio/visual gear, tables, and lighting is deployed without real-time tracking, causing shortages or lost return items.
4. **Isolated Vendor Visibility:** Service providers lack targeted in-platform advertising channels to promote bundles and packages directly to active event organizers.
5. **Absence of Centralized Attendee Feedback:** Organizers and vendors lack unified post-event rating workflows to gather feedback from verified attendees.

### 3.3 Core Objectives
* **Consolidation:** Build a single responsive web portal consolidating event lifecycles, bookings, schedules, inventory, and feedback.
* **Automation:** Automate approval workflows, real-time availability checking, calendar slot locking, and stock notifications.
* **Error Elimination:** Eliminate double bookings, lost booking requests, and stock discrepancies through centralized database synchronization.
* **Role-Tailored Productivity:** Provide intuitive, role-specific dashboards for 6 key stakeholders.

### 3.4 Constraints & Assumptions
* **Browser Requirements:** Modern HTML5/CSS3 browsers (Chrome, Edge, Firefox, Safari) with JavaScript enabled.
* **Network Connectivity:** Version 1.0 is an online cloud system; native offline mode is not supported.
* **Payment Scope:** Version 1.0 records, tracks, and audits payment logs and invoice status; direct third-party gateway integrations (e.g., Stripe) are planned for Version 2.0.
* **Hardware Scope:** Hardware-level RFID physical asset tagging is excluded; asset tracking uses digital tracking IDs and status workflows.

---

## 4. Stakeholder Matrix & Role-Based Access Control (RBAC)

The system enforces granular Role-Based Access Control. Each user role is directed to an authenticated, role-tailored dashboard layout:

| Role | System Scope & Primary Privileges | Dashboard Focus |
| :--- | :--- | :--- |
| **Administrator (`ROLE_ADMIN`)** | Platform governance, user verification, system configuration, master audit logs, global analytics. | Platform metrics, user directories, global logs, override tools. |
| **Customer (`ROLE_CUSTOMER`)** | Event creation, venue/vendor browsing & bookings, itinerary viewing, bill tracking, ratings. | My Events, Booking Requests, Payment Logs, Timeline Tracker. |
| **Event Manager (`ROLE_MANAGER`)** | Event plan approval, activity schedule construction, staff task assignments, booking review. | Approval Queue, Master Timeline/Calendar, Task Dispatcher. |
| **Vendor / Provider (`ROLE_VENDOR`)** | Service package cataloging, schedule availability management, booking acceptance/rejection, ads. | Service Portfolio, Inbound Booking Requests, Ads & Metrics. |
| **Inventory Staff (`ROLE_INVENTORY`)** | Equipment cataloging, stock allocations to approved events, condition audits, return logs. | Stock Counts, Checkout/Checkin Console, Low-Stock Alerts. |
| **Guest / Attendee (`ROLE_GUEST`)** | Event agenda viewing, attendance RSVP, inquiries, post-event feedback & 1-5 star ratings. | Event Hub, My Schedule, Inquiry/Feedback Portal. |

---

## 5. In-Depth Breakdown: 6 Member-Owned Core Functional Modules

```
                        +----------------------------------------+
                        |        Evenza Web Platform (SPA)       |
                        +----------------------------------------+
                                            |
                                            v
                        +----------------------------------------+
                        |   Authentication & Session Filter      |
                        +----------------------------------------+
                                            |
      +-----------------+-------------------+------------------+------------------+
      |                 |                   |                  |                  |
      v                 v                   v                  v                  v
+------------+   +------------+      +------------+     +------------+     +------------+
|    FR1     |   |    FR2     |      |    FR3     |     |    FR4     |     |    FR5     |
| Inquiry &  |   |   Event    |      |  Venue &   |     | Schedule & |     | Inventory  |
|  Feedback  |   | Management |      |   Vendor   |     | Activities |     | Management |
+------------+   +------------+      +------------+     +------------+     +------------+
      |                 |                   |                  |                  |
      +-----------------+-------------------+------------------+------------------+
                                            |
                                            v
                                     +------------+
                                     |    FR6     |
                                     |  Promotion |
                                     |   & Ads    |
                                     +------------+
                                            |
                                            v
                        +----------------------------------------+
                        |   Centralized Relational Database      |
                        +----------------------------------------+
```

### Module FR1: Inquiry, Feedback & Rating Management
* **Assigned Member:** Chathuranga B.G. (`IT25101514`)
* **Target Users:** Guest / Attendee, Customer, Vendor, Event Manager
* **Detailed Description:** Provides an end-to-end communication channel for pre-event inquiries and verified post-event evaluations. Guests can submit inquiries regarding event logistics, and verified attendees can submit reviews and 1–5 star ratings for both events and vendors.
* **Sub-Functions:**
  1. Submit event inquiry ticket with category tagging (logistics, ticketing, special accommodations).
  2. Inquiry inbox with threaded messaging for coordinators and vendors to reply directly.
  3. Post-event attendee feedback form with dynamic 1–5 star ratings and qualitative reviews.
  4. Review verification engine (ensures only confirmed attendees can submit ratings).
  5. Feedback analytics aggregator generating average scores, sentiment summaries, and performance charts for vendor profiles and manager dashboards.
* **Frontend Views Required for Antigravity:**
  * `InquiryModal.jsx`: Modal to submit pre-event questions.
  * `InquiryManagementDashboard.jsx`: Split-pane view of incoming tickets, filterable by status (Open, Answered, Resolved).
  * `EventFeedbackForm.jsx`: Star rating interactive selector with text feedback and criteria chips.
  * `VendorRatingSummaryCard.jsx`: Metric widget displaying average star score, total review count, and rating distribution progress bars.

---

### Module FR2: Event Creation & Lifecycle Management
* **Assigned Member:** Suriyage O.W. (`IT25100916`)
* **Target Users:** Customer, Event Manager, Administrator
* **Detailed Description:** Serves as the operational hub of Evenza. Enables customers to draft, plan, and submit events, while granting event managers tools to inspect, request changes, approve, track, or cancel events throughout their lifecycle.
* **Lifecycle States:** `Draft` $\rightarrow$ `Pending Approval` $\rightarrow$ `Approved` $\rightarrow$ `In Progress` $\rightarrow$ `Completed` (or `Cancelled`).
* **Sub-Functions:**
  1. Multi-step Event Creation Wizard (Event Type, Title, Expected Guests, Date/Time, Budget, Special Notes).
  2. Centralized Event Explorer and detail summary page (agenda, assigned coordinator, linked bookings).
  3. Event parameter modification interface (allows draft and pending state updates).
  4. Event cancellation and soft-delete workflow with reason recording.
  5. Manager Approval Queue with "Approve", "Reject", and "Request Modifications" action dialogs.
* **Frontend Views Required for Antigravity:**
  * `CreateEventWizard.jsx`: Multi-step form with step indicators and draft auto-saving.
  * `EventDetailsView.jsx`: Header with status badge, organizer info, countdown timer, and modular tabs (Overview, Bookings, Schedule, Budget).
  * `ManagerApprovalQueue.jsx`: Data table with badge filters, search, and action modals for approvals/rejections.
  * `CustomerEventList.jsx`: Grid of event cards with progress bars and quick actions.

---

### Module FR3: Venue & Vendor Booking Management
* **Assigned Member:** Gunasekara N.B. (`IT25102923`)
* **Target Users:** Customer, Vendor / Service Provider, Event Manager
* **Detailed Description:** Facilitates discovery, real-time availability checks, and booking requests for venues and service providers (caterers, photographers, decorators, sound engineers). Implements calendar slot locking to prevent double bookings and records payment audit logs.
* **Sub-Functions:**
  1. Search & Filter directory for venues and vendors (filter by category, price, capacity, and date availability).
  2. Real-time availability checker with calendar slot locking mechanism.
  3. Booking request submission modal linked to a specific event ID.
  4. Vendor Booking Response Dashboard (Accept, Decline, Counter-propose).
  5. Payment Status Logger (Pending, Partial Deposit, Paid in Full, Refunded) with receipt number tracking.
  6. Reservation modification and cancellation flow.
* **Frontend Views Required for Antigravity:**
  * `VendorDirectoryPage.jsx`: Filter sidebar (category, price range, rating) with responsive vendor cards.
  * `VendorProfileView.jsx`: Showcase gallery, service packages, reviews, and availability calendar.
  * `BookingRequestDialog.jsx`: Slot selector, requirement inputs, and estimated price calculator.
  * `VendorBookingInbox.jsx`: Kanban or tabbed list (Pending, Confirmed, Completed, Declined) with direct action triggers.
  * `PaymentStatusTracker.jsx`: Invoice summary table with manual payment recording modal for cash/bank transfers.

---

### Module FR4: Schedule & Activity Management
* **Assigned Member:** Wickramarathna W.L.S. (`IT25102322`)
* **Target Users:** Event Manager, Operational Staff, Guest / Attendee
* **Detailed Description:** Structures event agendas into interactive timelines, milestone charts, and operational task lists. Coordinators can assign tasks with deadlines to staff members, monitor execution in real time, and publish itineraries for guests.
* **Sub-Functions:**
  1. Master event itinerary builder (creates chronological sessions, stage activities, and breaks).
  2. Operations task delegation module (assigns tasks to specific staff with deadlines and priority levels).
  3. Task execution status tracker (To Do, In Progress, Blocked, Done) with checklist items.
  4. Interactive calendar and visual timeline views (Day, Week, Month, and Agenda views).
  5. Automated notification and milestone reminders for approaching deadlines.
* **Frontend Views Required for Antigravity:**
  * `EventTimelineBuilder.jsx`: Drag-and-drop or ordered timeline editor for day-of schedules.
  * `StaffTaskKanban.jsx`: Kanban task board with status columns, priority badges, and assignee avatars.
  * `InteractiveCalendarView.jsx`: Master schedule calendar supporting multi-event filtering and detailed day drawers.
  * `GuestItineraryView.jsx`: Clean mobile-first schedule timeline with live "Current Activity" highlighting.

---

### Module FR5: Inventory & Asset Management
* **Assigned Member:** Keshavan M. (`IT25103301`)
* **Target Users:** Inventory Staff, Event Manager, Administrator
* **Detailed Description:** Oversees the physical inventory of event assets (chairs, tables, stages, microphones, projectors, cables, decorative lighting). Tracks total, allocated, and available stock, alerts managers when thresholds are breached, and manages check-out/check-in logs.
* **Sub-Functions:**
  1. Master asset registry (Item name, SKU, Category, Total Qty, Damaged Qty, Base Location).
  2. Equipment allocation workflow (locks stock units against approved event IDs).
  3. Stock return and condition audit console (marks items Returned Good, Damaged, or Missing).
  4. Low-stock automated threshold warnings and safe operational limit alerts.
  5. Asset utilization and maintenance history reports.
* **Frontend Views Required for Antigravity:**
  * `InventoryCatalogTable.jsx`: Data table with search, category filters, and stock level progress bars.
  * `AssetAllocationModal.jsx`: Event picker and item quantity slider with real-time availability validation.
  * `ReturnAndAuditConsole.jsx`: Check-in scanner/form recording condition notes and damage penalties.
  * `StockAlertBanner.jsx`: Warning badges and alert dropdown for items breaching minimum safety margins.

---

### Module FR6: Promotion & Advertisement Management
* **Assigned Member:** Wickramasinghage C.P.W. (`IT25100220`)
* **Target Users:** Vendor / Service Provider, Customer, Administrator
* **Detailed Description:** Allows vendors to run promotional campaigns, publish discounts, and display advertisement banners. Customers discover these promotions during event creation and vendor search workflows. Includes engagement analytics (impressions, clicks, conversions).
* **Sub-Functions:**
  1. Campaign creation wizard for vendors (Ad title, banner image upload, discount code, validity period, target category).
  2. Promotion banner management console (Activate, Pause, Archive campaigns).
  3. Customer promotional showcase (Carousel and discount badge displays integrated into the vendor directory).
  4. Voucher/deal claim tracker that links a promo code to an active booking request.
  5. Campaign performance analytics dashboard (impressions, click-through rate, inquiries converted).
* **Frontend Views Required for Antigravity:**
  * `CreatePromotionModal.jsx`: Form with banner preview, discount percentages, and date-range pickers.
  * `VendorCampaignDashboard.jsx`: Performance grid featuring impression counters, click graphs, and active status toggles.
  * `PromotionalBannerCarousel.jsx`: Modern, animated banner carousel for the customer home/search screens.
  * `PromoCodeBadge.jsx`: Click-to-copy promo badge component for checkout and booking modals.

---

## 6. Minor Supporting & Utility Functions

These functions provide baseline support without taking away from the 6 major domain modules:

1. **Session & Authentication Management:**
   * User registration with role selection (`Customer` or `Vendor`).
   * Secure login with JWT token storage in `localStorage` or `httpOnly` cookies.
   * Self-service password recovery with email OTP verification.
   * Graceful logout with session invalidation.
2. **System Alerting & Notification Engine:**
   * WebSocket client (`stompjs` / `sockjs-client`) for real-time notifications.
   * Floating notification bell with unread badge counter and instant toast alerts.
3. **Data Reporting & Exports:**
   * Front-end triggering of backend OpenPDF / OpenCSV generators for booking receipts, event summary briefs, and inventory status reports.

---

## 7. Frontend UI Architecture & Antigravity Generation Guidelines

### 7.1 Design Tokens & Theme Specification
* **Base Preset:** shadcn/ui `Nova` with Geist / Inter typography and Lucide React icons.
* **Color Palette (CSS Variables & Tailwind Config):**
  * `Primary`: `#2563EB` (Tailwind `blue-600`) / Hover: `#1D4ED8` (`blue-700`)
  * `Primary Foreground`: `#FFFFFF`
  * `Secondary / Neutral`: `#475569` (Tailwind `slate-600`)
  * `Background`: `#F8FAFC` (Tailwind `slate-50`)
  * `Surface / Card`: `#FFFFFF`
  * `Accent / Highlighting`: `#8B5CF6` (Tailwind `violet-500`)
  * `Success`: `#10B981` (Tailwind `emerald-500`)
  * `Warning`: `#F59E0B` (Tailwind `amber-500`)
  * `Destructive / Danger`: `#EF4444` (Tailwind `rose-500`)
  * `Border`: `#E2E8F0` (Tailwind `slate-200`)
* **Component Styling Principles:**
  * Rounded corners: `rounded-xl` (`0.75rem`) for cards and dialogs; `rounded-lg` for inputs/buttons.
  * Elevation: Soft shadows (`shadow-sm` default, `shadow-md` hover states).
  * High-density, accessible layout: Clear data tables, collapsible sidebars, and sticky headers.

### 7.2 Component Directory Structure
When generating frontend code, Antigravity must follow this directory layout:

```text
src/
├── assets/                  # Static images, brand logos
├── components/
│   ├── ui/                  # shadcn/ui components (button, card, dialog, input, etc.)
│   ├── shared/              # Navbar, Sidebar, Footer, ProtectedRoute, PageHeader
│   ├── modules/
│   │   ├── feedback/        # FR1: Inquiry, Reviews, StarRatings, RatingDistribution
│   │   ├── events/          # FR2: EventWizard, EventCard, ApprovalQueue, StatusBadge
│   │   ├── bookings/        # FR3: VendorCard, BookingModal, AvailabilityGrid, Payments
│   │   ├── schedule/        # FR4: TimelineEditor, TaskKanban, CalendarView
│   │   ├── inventory/       # FR5: StockTable, AllocationModal, CheckinForm, LowStockAlert
│   │   └── promotions/      # FR6: PromoBanner, CampaignCard, MetricChart, PromoBadge
├── context/                 # AuthContext, NotificationContext, ThemeContext
├── hooks/                   # useAuth, useWebSocket, useFetch, useDebounce
├── lib/
│   └── utils.js             # cn() helper (clsx + tailwind-merge)
├── pages/                   # Top-level routed views (Dashboard, Events, Vendors, etc.)
├── services/                # Axios API call modules (api.js, eventService.js, etc.)
├── App.jsx                  # Main router and provider configuration
├── index.css                # Tailwind directives and CSS root variables
└── main.jsx                 # React root DOM mount
```

### 7.3 Path Aliasing & Utility Reference
Ensure all imports use the clean path alias `@/` pointing directly to `src/`:
```javascript
// Correct import pattern:
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

The standard utility helper located at `src/lib/utils.js`:
```javascript
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

---

## 8. Development Timeline & Sprint Plan

| Sprint / Week | Timeframe | Core Focus & Major Deliverables |
| :--- | :--- | :--- |
| **Week 3** | Proposal Phase | Requirements gathering, proposal documentation, team task allocations. |
| **Week 4 – 5** | System Analysis | Finalizing SRS, Use Case specifications, and architecture validation. |
| **Week 6 – 7** | Design & Setup | ER diagram, database schema design, UI wireframes, React + Tailwind setup. |
| **Week 8 – 10** | Backend Sprint | Spring Boot REST API implementation, JPA entities, BCrypt security for FR1–FR6. |
| **Week 11 – 12** | Frontend & Integration | React + shadcn/ui implementation, API binding via Axios, unit testing. |
| **Week 13** | Quality Assurance | User Acceptance Testing (UAT), bug remediation, performance optimization. |
| **Week 14** | Deployment & Final Viva| System deployment, code freeze, presentation, and final report submission. |

---

## 9. Antigravity Prompting Guide (How to Use This File)

To instruct Antigravity to build any specific view or the entire frontend, provide this context prompt:

> *"Refer to `PROJECT_SPECIFICATION_AND_TECH_STACK.md` for the Evenza Web-Based Event Planning System. Generate the React component with Tailwind CSS and shadcn/ui for **[Module Name / View Name]**. Ensure it complies with our color palette, uses `@/*` path aliases, integrates with the specified REST API endpoints, and follows our role-based authorization matrix."*