# Flight Booking Mini

Lightweight NestJS skeleton focused on booking workflows for live demos.

## Prerequisites

- Node.js >= 18
- npm >= 9

## Setup

```bash
npm install
npm run start:dev
```

Endpoints are exposed at `http://localhost:3000`:

- `POST /bookings` – create a booking (pending implementation)
- `GET /bookings` – list all bookings
- `GET /bookings/:id` – fetch single booking
- `PATCH /bookings/:id/status` – update booking status

The service and repository methods intentionally throw `NotImplementedException` errors so you can fill them in during the workshop demo.
