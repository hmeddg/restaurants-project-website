# elever — restaurant website

Next.js (App Router) frontend with a FastAPI + MongoDB backend. Visitors can browse
the menu and place pickup orders, reserve a table, and send a contact message; every
submission is stored in MongoDB.

```
app/                    Next.js routes (pages, Server Actions, one Route Handler)
  menu/                 /menu/[category] + order panel layout, actions.ts (orders)
  reserve/              /reserve, actions.ts (reservations)
  contact/              /contact, actions.ts (contact messages)
  our-story/            /our-story
  api/reservations/     availability proxy for the booking calendar
components/
  layout/               header, footer, navigation
  sections/<page>/      page sections (home, menu, reserve, contact, ourstory)
  ui/                   shared primitives (buttons, fields, stepper, success panel)
lib/
  api/                  server-only REST client + one module per resource
  menu/ reservation/ order/ contact/ validation/   shared rules and zod schemas
hooks/                  client hooks (cart)
backend/
  app/
    routers/            HTTP endpoints
    services/           business rules (availability, opening hours, pricing)
    repositories/       MongoDB access
    schemas/            request/response models
    seed/               initial menu
  tests/                pytest suite (+ in-memory server for e2e tests)
tests/
  unit/                 Vitest
  e2e/                  Playwright
```

## 1. Database: MongoDB Atlas

1. Create a free cluster at <https://cloud.mongodb.com>.
2. **Database Access**: add a database user with read/write access.
3. **Network Access**: allow your IP (and your hosting provider's IPs in production).
4. **Connect → Drivers → Python**: copy the connection string.

The API creates its collections and indexes on startup and seeds the menu:
`menu_items`, `reservations`, `slot_bookings`, `orders`, `counters`, `contact_messages`.

## 2. Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
cp .env.example .env        # then fill in MONGODB_URI and API_KEY
```

Generate a key for `API_KEY` with `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`.

```bash
npm run dev:api             # http://127.0.0.1:8000, docs at /docs
```

No Atlas yet? `npm run dev:api:memory` runs the same API on an in-memory database
(nothing is saved; data is lost when it stops).

The site needs **both** servers running: the API and Next.js.

In production run `uvicorn app.main:create_app --factory --host 0.0.0.0 --port 8000`
from `backend/`, with `API_KEY` set and `DOCS_ENABLED=false`.

## 3. Frontend (Next.js)

```bash
npm install
cp .env.example .env.local  # API_URL=http://127.0.0.1:8000 and the same API_KEY
npm run dev                 # http://localhost:3000
```

The browser never talks to the API directly: Server Actions and the availability
Route Handler call it from the server with the `x-api-key` header.

## Tests

```bash
npm run test:api            # backend (pytest, in-memory MongoDB)
npm run lint:api            # backend lint (ruff)
npm run test                # unit tests (Vitest)
npm run test:e2e            # Playwright; starts the API on an in-memory MongoDB
npm run lint && npx tsc --noEmit && npm run build
```

## Rules worth knowing

| Rule                                                                  | Where                                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Time slots 5:30–9:30 PM, parties of 1–7, bookable up to 60 days ahead | `lib/reservation/constants.ts`, `backend/app/schemas/reservation.py` |
| 20 guests per time slot (overbooking is prevented atomically)         | `SLOT_CAPACITY` in `backend/.env`                                    |
| Opening hours (pickup times respect them)                             | `config/site.ts`, `backend/app/services/opening_hours.py`            |
| Order prices always come from the database, never from the browser    | `backend/app/services/orders.py`                                     |

Values that appear in both the frontend and the backend are marked "keep in sync".
