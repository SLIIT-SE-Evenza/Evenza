# Evenza CRUD & UI Evaluation Guide

## Run the application

1. Keep your existing `src/main/resources/application.properties` with the local SQL Server connection.
2. Run `EvenzaApplication` from IntelliJ.
3. Open `http://localhost:8080/` to see the module launcher.

## Fast demonstration flow

1. Open **Event Management** and click **Create demo data**. Create or edit an event, move its status, then delete a temporary event.
2. Open **Booking Management** and click **Prepare demo data**. Create, edit, accept/reject and delete a booking.
3. Open **Schedule Management**. Create a milestone and task, edit them, change task status, show Calendar, then delete a temporary record.
4. Open **Inquiry & Reviews**. Create/edit/delete an inquiry, move its workflow status, and create/edit/respond to/delete a review.
5. Open **Promotion Management**. Click **Create sample offer**, edit it, publish/deactivate it, then delete a temporary offer.
6. Optionally refresh the matching SQL Server tables in SSMS after each operation to prove persistence.

## CRUD endpoint map

| Feature | Create | Read | Update | Delete |
| --- | --- | --- | --- | --- |
| Task | `POST /api/tasks` | `GET /api/tasks/event/{eventId}` | `PUT /api/tasks/{taskId}` | `DELETE /api/tasks/{taskId}` |
| Milestone | `POST /api/milestones` | `GET /api/milestones/event/{eventId}` | `PUT /api/milestones/{milestoneId}` | `DELETE /api/milestones/{milestoneId}` |
| Event | `POST /api/events` | `GET /api/events` | `PUT /api/events/{id}` | `DELETE /api/events/{id}` |
| Booking | `POST /api/bookings` | `GET /api/bookings` | `PUT /api/bookings/{id}` | `DELETE /api/bookings/{id}` |
| Inquiry | `POST /api/inquiries` | `GET /api/inquiries` | `PUT /api/inquiries/{id}` | `DELETE /api/inquiries/{id}` |
| Review | `POST /api/reviews` | `GET /api/reviews` | `PUT /api/reviews/{id}` | `DELETE /api/reviews/{id}` |
| Promotion | `POST /api/promotion-management` | `GET /api/promotion-management` | `PUT /api/promotion-management/{id}` | `DELETE /api/promotion-management/{id}` |

## Evaluation notes

- Inventory is intentionally not included because that module has not been built yet.
- `SecurityConfig` currently permits requests and disables CSRF only for the development demonstration.
- The **Create demo data** operation is explicit; normal application startup does not insert records.
- The UI uses plain HTML, CSS and JavaScript Fetch API calls to the Spring REST controllers.
- Red is used for Event, green for Booking, brown for Inquiry/Review and Promotion; no reference pictures or animations were added.
- Replace the development security configuration with authenticated role-based access after the evaluation.
