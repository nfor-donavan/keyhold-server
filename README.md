# Keyhold API

Backend for the Keyhold app. Express + MongoDB (Mongoose), organization-scoped
multi-user accounts, JWT auth, and Cloudinary for photo/PDF uploads.

## How data is scoped

Every record belongs to an **Organization**, not an individual user. When
someone registers, a new Organization is created and they become its
`owner`. They can then share their organization's `inviteCode` with
teammates, who join via `/auth/join` as `member`s of the same org and see
the same shared data. This is what lets a property management company's
whole staff use one shared account instead of everyone having their own
disconnected copy of the data.

## Endpoints

- `POST /auth/register` — `{ name, email, password, companyName }` → creates a new organization + owner account
- `POST /auth/join` — `{ name, email, password, inviteCode }` → joins an existing organization
- `POST /auth/login` — `{ email, password }`
- `GET /auth/me` — current user (requires auth)
- `GET/POST /properties`, `GET/PUT/DELETE /properties/:id`
- `GET/POST /inspections`, `GET/PUT/DELETE /inspections/:id`
- `GET/POST /maintenance`, `GET/PUT/DELETE /maintenance/:id`
- `GET/POST /rent-groups`, `GET/PUT/DELETE /rent-groups/:id`
- `GET/POST /leases`, `GET/PUT/DELETE /leases/:id`
- `POST /upload?type=image|raw` — multipart file upload (photos/PDFs), returns `{ url }`

All routes except `/auth/register`, `/auth/join`, and `/auth/login` require
`Authorization: Bearer <token>`.

## Local setup

```bash
npm install
cp .env.example .env   # fill in real values, never commit this file
npm run dev
```

## What's intentionally NOT built yet

- **Land management module** — PTG also does land management, but nothing
  land-specific has been added. Adding it later just means: a new Mongoose
  model + a new route file using the same `makeCrudRouter` factory used by
  every other module — a small, additive change, not a redesign.
- Role permissions beyond owner/member (e.g. restricting who can delete records)
- Password reset flow
