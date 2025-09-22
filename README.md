# GameQuest Platform

GameQuest is a full-stack marketplace for connecting players with expert providers for game-related tasks, coaching, and duo sessions. The MVP ships with authentication, task management, matching, chat, payments, and an admin console, all built on a modern TypeScript stack.

## Tech Stack

- **Next.js 14 (App Router) & React 18** – front-end, layouts, routing, and server components
- **TypeScript** – type safety across client and server code
- **Tailwind CSS** – styling and utility-first design system
- **NextAuth** – email magic-link auth with optional Google/Discord providers
- **Prisma ORM + PostgreSQL** – relational data layer with schema defined in `prisma/schema.prisma`
- **Stripe (test mode)** – checkout sessions and webhook driven order activation
- **Polling chat** – lightweight task conversations with REST endpoints
- **Docker & docker-compose** – local development stack (web, Postgres, Mailhog)
- **ESLint + Prettier** – linting and formatting

## Core Features

- Players can create tasks with budgets, languages, schedules, and tags
- Providers browse/filter tasks, submit offers, and chat after acceptance
- Owners accept offers to create orders, pay via Stripe checkout, and track progress
- Orders capture platform fee and collect ratings from both parties
- Matching endpoint scores top providers using tag similarity, availability overlap, pricing fit, and ratings
- Profiles store availability, languages, games, rates, and tags
- Admin console lists users, tasks, and orders with status overrides

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for the recommended local stack)

### Environment Variables

Create `.env` from the example template:

```bash
cp .env.example .env
```

Populate the secrets for NextAuth, email transport, and Stripe test keys. Update `DATABASE_URL` if you use a local Postgres instance outside docker-compose.

### Install Dependencies

```bash
npm install
```

### Database Setup

Push the Prisma schema and seed demo data:

```bash
npm run db:push
npm run seed
```

### Local Development

Start the Next.js dev server (ensure Postgres is running locally or via Docker):

```bash
npm run dev
```

To spin up the full stack with Postgres and Mailhog using Docker:

```bash
docker-compose up --build
```

Visit `http://localhost:3000` for the app and `http://localhost:8025` for the Mailhog inbox (email magic links).

### Stripe Webhook

Expose the webhook endpoint during development (replace `whsec_test` with your real signing secret):

```bash
stripe listen --forward-to localhost:3000/api/pay/webhook
```

## Project Structure

```
app/
  layout.tsx, page.tsx, routes, and API handlers
components/
  Reusable UI, forms, chat, admin panels
lib/
  Prisma client, auth config, scoring utilities, Stripe helper
prisma/
  schema.prisma, seed.ts
styles/
  globals.css
```

Key API routes live under `app/api/*` and implement task CRUD, offers, orders, messages, matching, payments, and admin functionality.

## Seeding Accounts

`npm run seed` creates:

- Admin user: `admin@example.com`
- Five sample providers with diverse availability, tags, and rates
- Six canonical tags plus three demo tasks

## Scripts

- `npm run dev` – Next.js dev server
- `npm run build` – production build
- `npm start` – start Next.js in production mode
- `npm run lint` – lint with ESLint
- `npm run db:push` – push Prisma schema to the configured database
- `npm run seed` – seed demo data

## Payments Flow

1. Task owner accepts an offer to create an order (status `PENDING_PAYMENT`).
2. Checkout session (`/api/pay/checkout`) redirects the buyer to Stripe.
3. Webhook (`/api/pay/webhook`) confirms payment, sets order `IN_PROGRESS`, and updates the task status.
4. Participants mark completion and optionally rate each other; averages are aggregated per user.

## Matching

`/api/match?taskId=...` returns the top 20 candidates scored by:

```
0.5 * tag jaccard +
0.2 * availability overlap +
0.2 * hourly rate fit +
0.1 * normalized rating
```

Tags are normalized via aliases defined in `lib/tags.ts`, and availability is encoded as a 168-bit string.

## Authentication

- Default: email magic link (Mailhog for local testing)
- Optional providers: Google, Discord (env gated)
- Session strategy: database with Prisma adapter
- Admin role gate keeps `/admin` routes and API endpoints

## Testing & Quality

Automated tests are not included yet. Use the lint command before committing:

```bash
npm run lint
```

## Deployment

- `Dockerfile` builds a production image with compiled Next.js assets
- Adjust environment variables and secrets before deploying

## License

MIT
