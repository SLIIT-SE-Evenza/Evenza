# UI/UX Specification: Evenza Inventory & Equipment Management Module (FR5)

## 1. System Overview & Module Architecture

- **Application Context**: Evenza Web-Based Event Planning Platform
- **Module ID**: Function 5 (FR5) – Inventory & Equipment Management
- **Assigned Developer**: Keshavan M. (IT25103301)
- **Primary Stakeholders / Target Users**: Inventory Staff, Event Managers, System Administrators
- **Access Route**: `/dashboard/inventory`
- **Design System & Foundation**: Modern Tailwind CSS, Radix/shadcn UI design primitives, Lucide Icons, clean corporate dashboard layout.

---

## 2. Design System Tokens & Color Palette

- **Backgrounds**:
  - Main App Background: `#F8FAFC` (Slate 50)
  - Card & Container Surface: `#FFFFFF` (White)
  - Secondary/Muted Fill: `#F1F5F9` (Slate 100)
- **Borders & Dividers**: `#E2E8F0` (Slate 200)
- **Typography & Text**:
  - Primary Headers & Body: `#0F172A` (Slate 900)
  - Muted Text / Labels: `#64748B` (Slate 500)
- **Brand & Semantic Colors**:
  - Brand Primary: `#2563EB` (Blue 600) / Hover: `#1D4ED8` (Blue 700)
  - Success / In-Stock: `#16A34A` (Green 600) / Surface: `#DCFCE7` (Green 100)
  - Warning / Low Stock: `#D97706` (Amber 600) / Surface: `#FEF3C7` (Amber 100)
  - Danger / Out of Stock / Damaged: `#DC2626` (Red 600) / Surface: `#FEE2E2` (Red 100)

---

## 3. Global Dashboard Shell & Layout Structure

The module renders within the authenticated dashboard layout:

- **Left Collapsible Sidebar (Width: 260px)**:
  - Header: Evenza Brand Logo + "Inventory Portal" pill badge.
  - Navigation Item List:
    1. **Overview & Metrics** (`/dashboard/inventory`)
    2. **Stock Catalog** (`/dashboard/inventory/catalog`)
    3. **Allocate to Event** (`/dashboard/inventory/allocate`)
    4. **Returns & Damage Logging** (`/dashboard/inventory/returns`)
    5. **Stock Logs & Audits** (`/dashboard/inventory/logs`)
- **Top App Bar**:
  - Breadcrumb trail (e.g., `Dashboard / Inventory / Stock Catalog`).
  - Search trigger shortcut (`Ctrl + K`).
  - Low-Stock Alert Bell (interactive popover listing items under threshold).
  - User profile badge: "Keshavan M. (Inventory Staff)".

---

## 4. Screen 1: Inventory Overview & KPI Metrics

**Route**: `/dashboard/inventory`

### 4.1 KPI Statistic Cards (Grid: 4 columns on desktop, 2 on tablet, 1 on mobile)

1. **Total Asset Types**:
   - Primary metric: `142`
   - Sub-label: "+6 categories active"
   - Icon: `Package`
2. **Total Units in Warehouse**:
   - Primary metric: `4,850`
   - Sub-label: "Chairs, Tables, AV, Decor"
   - Icon: `Boxes`
3. **Active Allocations**:
   - Primary metric: `1,280 Units`
   - Sub-label: "Allocated across 8 upcoming events"
   - Icon: `CalendarCheck`
4. **Low Stock Alerts**:
   - Primary metric: `3 Items` (Badge: Red warning)
   - Sub-label: "Below minimum safe reserve"
   - Icon: `AlertTriangle`

### 4.2 Quick Action Panel & Urgent Alert Feed

- Two-column split layout below KPIs:
  - **Left (60%) - Critical Low-Stock Watchlist**: Compact table showing `Item Name`, `Category`, `Available`, `Threshold`, and a fast "+ Restock" action button.
  - **Right (40%) - Quick Allocation Quick-Action Card**: Dropdown to select an approved event, quick select item, and launch the allocation drawer.

---

## 5. Screen 2: Master Stock Catalog (Full CRUD Interface)

**Route**: `/dashboard/inventory/catalog`  
**Related User Stories**: US-17, US-18 (Tasks T-16.1 – T-17.6)

### 5.1 Controls & Filter Bar

- **Search Input**: Full-text filter on item name, SKU, or model.
- **Category Filter Dropdown**: `All Categories`, `Seating (Chairs)`, `Tables & Staging`, `Audio/Visual (AV)`, `Lighting`, `Decorations & Props`.
- **Condition Filter**: `All`, `Good`, `Needs Maintenance`, `Damaged`.
- **Primary Action Button**: `[+ Add New Inventory Item]` (Solid blue, opens Modal).

### 5.2 Stock Data Table Structure

Columns:

1. **Item ID / SKU**: `#INV-1029` (Monospace font, muted).
2. **Item Name & Details**: Bold title (e.g., _Ergonomic Banquet Chair_), subtitle category (_Seating_).
3. **Category**: Styled badge (e.g., blue for Seating, purple for AV).
4. **Total Stock**: Number format (e.g., `500`).
5. **Allocated**: Number format (e.g., `350`).
6. **Available**: Dynamic calculated field (`Total - Allocated`). Highlighted in Green if `> Threshold`, Amber if `<= Threshold`, Red if `0`.
7. **Condition**: Badge (`Good`, `Under Repair`, `Damaged`).
8. **Row Actions Menu** (`...` dropdown):
   - `Adjust Quantity (+/-)`
   - `Edit Item Specifications`
   - `View Allocation History`
   - `Delete Item` (Triggers destructive confirmation modal)

### 5.3 Modal: "Add Inventory Item" (T-16.1, T-16.5)

- **Dialog Overlay**: Centered modal with backdrop blur.
- **Form Fields**:
  - `Item Name`: Text input (Required, min 3 chars).
  - `Category`: Single-select dropdown (`Seating`, `Tables`, `AV Equipment`, `Lighting`, `Decor`).
  - `Initial Quantity`: Positive integer input (`min: 1`).
  - `Minimum Safety Limit`: Numeric threshold input for low-stock warnings (Default: 10).
  - `Condition Status`: Select (`New`, `Good`).
  - `Unit Cost / Replacement Fee (LKR)`: Currency numeric input.
- **Validation**:
  - Client-side validation triggers on blur; disables submit button until all fields pass.
- **Actions**: `[Cancel]` (Ghost button), `[Save & Record Item]` (Primary button).

### 5.4 Modal: "Adjust Stock Quantity" (T-17.1, T-17.4)

- **Context Banner**: Displays selected item name and current available count.
- **Radio Toggle**: `[+] Add New Stock (Restock)` vs `[-] Reduce Stock (Damaged / Retired)`.
- **Quantity Delta Input**: Number field.
- **Reason / Note Dropdown**: `Supplier Delivery`, `Found Stock`, `Damage/Broken`, `Missing Asset`, `Manual Audit Reconciliation`.
- **Actions**: `[Update Stock Levels]`.

---

## 6. Screen 3: Equipment Allocation Interface

**Route**: `/dashboard/inventory/allocate`  
**Related User Stories**: US-19 (Tasks T-18.1 – T-18.6)

### 6.1 Layout: Two-Column Event Assignment Builder

- **Step 1: Event Selector (Left Panel - 35% width)**:
  - Select Approved Event dropdown: Fetches approved events from FR2 (e.g., _Perera Wedding Gala - 2026-10-12_).
  - Event metadata summary: Event date, venue location, coordinator contact, expected attendees.
  - Active reservation list for this event.

- **Step 2: Equipment Reservation Cart (Right Panel - 65% width)**:
  - Searchable equipment picker.
  - Dynamic Stock Availability Indicator:
    - Displays `In Warehouse` vs `Available for Date`.
    - Input quantity selector with hard max bound equal to `Available Stock`.
    - Real-time error state: If user inputs `55` when only `50` are available, field turns red with helper text: `"Cannot exceed available quantity (50 remaining)"`.
  - Staging Table:
    - Added item row, requested count, remove item button (`Trash` icon).
  - Footer Action: `[Confirm & Lock Resource Allocation]`.
    - Confirmation alert shows deduction preview and updates inventory state in real-time.

---

## 7. Screen 4: Returns & Damaged Equipment Logging

**Route**: `/dashboard/inventory/returns`  
**Related User Stories**: US-20 (Post-event intake and condition audit)

### 7.1 Post-Event Return Intake Form

- **Filter Completed Events**: Search for events marked as `Completed` with pending inventory returns.
- **Check-In Table**:
  - Displays all items previously allocated to the event.
  - Columns:
    - `Item Name`
    - `Allocated Qty`
    - `Returned in Good Condition` (Number input)
    - `Damaged Qty` (Number input)
    - `Lost / Missing Qty` (Number input)
    - `Damage Assessment Notes` (Textarea input)
- **Validation Rule**:
  - `Returned Good + Damaged + Lost` must strictly equal `Allocated Qty`. If mismatched, display warning badge: `Discrepancy: Missing X units`.
- **System Action on Submission**:
  - `Returned Good` units are restored back to `Available Stock`.
  - `Damaged` units are deducted from `Available Stock` and recorded into `Maintenance / Damaged Log`.
  - `Lost` units trigger an incident report draft for coordinator review.

---

## 8. Mobile & Tablet Responsiveness

- **Desktop (>= 1280px)**: Persistent left sidebar, 4-column KPI cards, multi-column data tables with fixed action columns.
- **Tablet (768px - 1279px)**: Collapsed icon-only sidebar, 2-column KPI cards, horizontal table scrolling enabled.
- **Mobile (< 768px)**: Bottom drawer / hamburger navigation, stacked single-column KPI cards, data table converted to card-based list layout with tap-to-expand actions.
