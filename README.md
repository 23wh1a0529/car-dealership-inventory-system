\# AutoLedger — Car Dealership Inventory System
A full-stack inventory management system for a car dealership, built as a TDD kata assessment. Users can browse and search available vehicles and
purchase them; admins can additionally add, edit, delete, and restock vehicles.
\## Tech Stack
\*\*Backend:\*\* Node.js, Express 5, `node:sqlite` (Node's built-in SQLite

module), JWT authentication, `bcryptjs` for password hashing, Jest +

Supertest for testing.



\*\*Frontend:\*\* React (Vite), React Router, Tailwind CSS v4, `fetch`-based

API client with token-based auth context.



Note on database choice: this project uses `node:sqlite`, Node's built-in

SQLite module (stable as of recent Node releases), instead of the

`better-sqlite3` npm package. `better-sqlite3` requires native compilation

via node-gyp, which failed in local development due to Windows toolchain

issues unrelated to the project itself. `node:sqlite` provides the same

synchronous, `prepare().get()/.run()/.all()` API with zero native

dependencies, and is used as a real file-based database (not in-memory)

for the dev/production database, satisfying the assessment's database

requirement.



\## Project Structure



car-dealership/

├── backend/

│ ├── src/

│ │ ├── controllers/ # HTTP request/response handling

│ │ ├── services/ # Business logic (framework-agnostic, unit-testable)

│ │ ├── middleware/ # JWT auth + admin role guards

│ │ ├── routes/

│ │ └── db/ # Database connection, schema, seed script

│ └── tests/

│ ├── unit/

│ └── integration/

├── frontend/

│ └── src/

│ ├── pages/ # Login, Register, Dashboard

│ ├── components/ # VehicleCard, SearchBar, VehicleFormModal, etc.

│ ├── context/ # AuthContext (login/register/logout, token storage)

│ └── api/ # Backend API client

├── screenshots/

├── README.md

├── PROMPTS.md

└── TEST\_REPORT.md





\## Setup \& Run Locally



\### Prerequisites

\- Node.js v22.5 or higher (required for `node:sqlite`) — this project was

&#x20; built and tested on Node v24.19.0

\- npm



\### Backend

```bash

cd backend

npm install

cp .env.example .env

\# Edit .env if you want a custom JWT\_SECRET (a default dev value is fine)

npm run seed

npm run dev

```



\### Frontend

```bash

cd frontend

npm install

npm run dev

```



Open `http://localhost:5173` in your browser. Use the "Use Admin Demo" /

"Use User Demo" buttons on the login page to quickly try both roles, or

register a new account manually (new accounts default to the `user` role).



\### Demo credentials (from the seed script)

| Role  | Email                 | Password |

|-------|-----------------------|----------|

| Admin | admin@autoledger.com  | admin123 |

| User  | buyer@autoledger.com  | user123  |



\## API Endpoints



| Method | Endpoint                   | Auth       | Description                                             |

|--------|-----------------------------|------------|-----------------------------------------------------------|

| POST   | /api/auth/register           | Public     | Register a new user                                       |

| POST   | /api/auth/login               | Public     | Log in, returns a JWT                                      |

| POST   | /api/vehicles                 | User       | Create a vehicle                                           |

| GET    | /api/vehicles                 | User       | List all vehicles                                           |

| GET    | /api/vehicles/search           | User       | Search by make, model, category, price range                |

| PUT    | /api/vehicles/:id              | User       | Update a vehicle                                            |

| DELETE | /api/vehicles/:id              | Admin only | Delete a vehicle                                             |

| POST   | /api/vehicles/:id/purchase      | User       | Purchase a vehicle (decrements quantity, blocked at 0)         |

| POST   | /api/vehicles/:id/restock       | Admin only | Restock a vehicle (increments quantity)                        |



\## Testing



```bash

cd backend

npm test

```



44 tests across authentication, JWT/admin middleware, vehicle CRUD, search

filtering, and inventory purchase/restock — including edge cases like

zero-stock purchase blocking and a race-condition guard on the purchase

endpoint (see `TEST\_REPORT.md` for full output and coverage).



\## What I Prioritized and Why



Given the assessment timeline, I prioritized in this order:

1\. \*\*Core backend logic with real TDD discipline\*\* — especially the

&#x20;  purchase/restock endpoints, since they have the most meaningful edge

&#x20;  cases (zero-stock blocking, negative-quantity prevention, a

&#x20;  database-level atomic guard against a race condition on the last unit

&#x20;  in stock).

2\. \*\*Full auth + role-based access control\*\* — register/login/JWT, plus

&#x20;  `authenticate` and `requireAdmin` middleware, since almost every other

&#x20;  endpoint depends on this being correct.

3\. \*\*A complete, polished frontend\*\* covering every functional requirement

&#x20;  in the brief: search/filter, purchase (disabled at zero stock), and a

&#x20;  full admin UI (add/edit/delete/restock).

4\. \*\*Design and small UX details\*\* — a custom color/type system, a

&#x20;  seed script for realistic demo data, a splash screen, and demo

&#x20;  quick-login buttons — since the brief explicitly invites creativity

&#x20;  and a "great user experience."



What I intentionally did not build, given the timeline: password reset

(the UI has a "Forgot password?" link, but it shows an honest message

rather than a fake flow, since real password reset needs email

infrastructure outside this assessment's scope), and pagination on the

vehicle list.



\## My AI Usage



\*\*Tools used:\*\* Claude (Anthropic), used throughout via conversational

pair-programming for the full build.



\*\*How I used it:\*\*

\- Scaffolding the RED-GREEN-REFACTOR structure for each backend endpoint —

&#x20; I asked for a failing test first, ran it myself to confirm it failed for

&#x20; the right reason, then asked for the minimum implementation to pass it.

\- Debugging real environment issues as they came up: a Windows node-gyp

&#x20; compilation failure on `better-sqlite3` (resolved by switching to

&#x20; Node's built-in `node:sqlite`), a SQLite "database is locked" error

&#x20; caused by Jest running test files in parallel processes against the

&#x20; same file-based test database (resolved by switching to an in-memory

&#x20; database in test mode), and a corrupted `package.json` from a

&#x20; PowerShell heredoc encoding issue.

\- Design system planning: I asked for a distinctive, non-templated visual

&#x20; direction (avoiding generic AI-design defaults) and iterated on the

&#x20; color palette and typography based on my own feedback (moved from an

&#x20; initial dark graphite theme to the current warm ivory/teal palette after

&#x20; I asked for something lighter and more premium-feeling).

\- Generating the admin/regular-user conditional UI logic and the atomic

&#x20; database-level guard against the purchase race condition.



\*\*Where I corrected or overrode AI suggestions:\*\*

I made several design and usability decisions based on my own preferences and the needs of the demo. For the login page, I suggested adding a "Forgot Password?" option and quick demo-access buttons that automatically fill the appropriate admin or user credentials, instead of requiring the

credentials to be entered manually each time. I also changed the initial dark-graphite visual direction to a lighter warm-ivory and teal color

palette because I preferred a cleaner, more modern, and premium feel for the application.



\*\*Reflection:\*\*

Using AI conversationally, one step at a time with a test-first

discipline enforced at each step, meant I could move quickly without

losing track of why each piece of code existed — every implementation

was written in direct response to a test I had already seen fail, and I verified each result before moving on rather than accepting large blocks

of ungrounded code. The most valuable use of AI wasn't writing code I

couldn't have written myself, but debugging environment-specific issues

(node-gyp, encoding, test isolation) far faster than I could have by

searching alone, which kept me from losing hours of a tight deadline to

tooling problems rather than the actual assessment.



\## Screenshots



!\[Login page](screenshots/01-login.png)

!\[Dashboard - regular user](screenshots/02-dashboard-user.png)

!\[Dashboard - admin](screenshots/03-dashboard-admin.png)

!\[Add/Edit vehicle modal](screenshots/04-add-vehicle-modal.png)

!\[Search and filter](screenshots/05-edit.png.png)

