# InternHive — Project Plan

## 1. Project Overview
InternHive is a full-stack internship/job listing platform for university students in
Bangladesh, connecting them with companies offering internships and entry-level roles.
This is a university assignment (production-standard requirement) and also a portfolio
piece. The developer is learning TypeScript by building this project themselves —
do not write full solutions; guide, scaffold, and explain concepts, but let the
developer implement the logic.

Two differentiator features beyond a standard listing app (for portfolio strength):
1. **Skill-Match Score** — each internship listing shows a % match against the logged-in
   user's profile skills.
2. **Application Tracker Dashboard** — a protected `/dashboard` page where students track
   applications through statuses (Applied → Interview → Offer → Rejected) with a
   Recharts visualization (pie/bar chart) of application breakdown.

## 2. Tech Stack
- Frontend: Next.js (App Router), React, TypeScript (mandatory), Tailwind CSS, Recharts
- Backend: Next.js API Routes, TypeScript (mandatory)
- Database: MongoDB (native MongoDB driver for the auth adapter; Mongoose for app data —
  internships, applications)
- Auth: Better Auth (`better-auth`) with `mongodbAdapter`, email/password enabled,
  `nextCookies()` plugin for session cookie handling. Replaces custom JWT/bcrypt.

## 3. Design System
- Max 3 primary colors + neutral (per assignment rule):
  - Primary: Deep Navy Blue `#14213D`
  - Accent: Amber/Orange `#FCA311`
  - Neutral: Off-white background `#F5F5F5`, dark text `#1A1A1A`
- Typography: Bold sans-serif headings (Space Grotesk / Poppins), clean sans-serif body (Inter)
- All cards: identical size, border-radius, and shadow style
- Fully responsive: mobile (1 col), tablet (2 col), desktop (4 col) card grids
- No lorem ipsum / placeholder content — use realistic sample data

## 4. Folder Structure
```
internhive/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── internships/
│   │   ├── page.tsx              (listing: search, filter, sort, pagination)
│   │   ├── [id]/page.tsx         (details: public)
│   │   ├── add/page.tsx          (protected)
│   │   └── manage/page.tsx       (protected — owner only)
│   ├── dashboard/page.tsx        (protected — application tracker + Recharts)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/route.ts   (Better Auth catch-all handler)
│   │   ├── internships/
│   │   │   ├── route.ts          (GET all w/ query params, POST create)
│   │   │   └── [id]/route.ts     (GET one, DELETE — owner only)
│   │   └── applications/
│   │       └── route.ts          (POST apply, GET by current user)
│   ├── layout.tsx
│   └── page.tsx                  (landing page)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── InternshipCard.tsx
│   └── SkeletonCard.tsx
├── lib/
│   ├── dbConnect.ts              (Mongoose connection singleton, for app data only)
│   ├── auth.ts                   (Better Auth server config: betterAuth({...}))
│   └── auth-client.ts            (Better Auth React client: createAuthClient({...}))
├── models/
│   ├── Internship.ts
│   └── Application.ts
│   (No custom User.ts — Better Auth manages user/session/account collections via
│    mongodbAdapter. Add skills + role as additionalFields in lib/auth.ts config.)
├── types/
│   └── index.ts                  (shared TS interfaces)
├── middleware.ts                 (checks Better Auth session cookie for
│                                   /internships/add, /internships/manage, /dashboard)
└── .env.local                    (MONGODB_URI, BETTER_AUTH_SECRET, BETTER_AUTH_URL)
```

## 5. Data Models / Types

```ts
// User is NOT a custom Mongoose model — it's managed by Better Auth's
// mongodbAdapter (collections: user, session, account, verification).
// skills and role are added as additionalFields in the betterAuth() config
// in lib/auth.ts, so they still appear on the session/user object with types.
interface User {
  id: string;
  name: string;
  email: string;
  skills: string[];          // additionalField in Better Auth config
  role: "student" | "admin"; // additionalField in Better Auth config
}

interface Internship {
  id: string;
  postedBy: string;          // User id (FK)
  title: string;
  company: string;
  location: string;
  type: "Remote" | "Onsite" | "Hybrid";
  stipend?: number;
  requiredSkills: string[];
  description: string;
  postedAt: string;
}

interface Application {
  id: string;
  userId: string;            // FK -> User
  internshipId: string;      // FK -> Internship
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  appliedAt: string;
}
```

### Entity Relationships
- USERS ||--o{ INTERNSHIPS : posts
- USERS ||--o{ APPLICATIONS : submits
- INTERNSHIPS ||--o{ APPLICATIONS : receives

## 6. Architecture Flow
Browser (React components, `authClient` calls for auth, plain `fetch` for app data)
  → Next.js pages (App Router: listing, details, dashboard, forms)
  → Next.js API routes:
      - `/api/auth/[...all]` → handled entirely by Better Auth (`toNextJsHandler`)
      - `/api/internships`, `/api/applications` → custom route handlers, read
        session via `auth.api.getSession()`, then query Mongoose models
  → MongoDB Atlas (Better Auth's own collections + internships + applications)
  → JSON response + session cookie (set automatically by Better Auth's
    `nextCookies()` plugin) sent back to browser

## 7. Authentication Flow (Better Auth)
**Setup (lib/auth.ts):**
```ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { client } from "./mongoClient"; // native MongoDB client, not Mongoose

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      skills: { type: "string[]", required: false, defaultValue: [] },
      role: { type: "string", required: false, defaultValue: "student" },
    },
  },
  plugins: [nextCookies()],
});
```

**Catch-all route (app/api/auth/[...all]/route.ts):**
```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { POST, GET } = toNextJsHandler(auth);
```

**Client (lib/auth-client.ts):**
```ts
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
```

**Register/Login (from React components):** `authClient.signUp.email({ name, email, password })`
and `authClient.signIn.email({ email, password })` — Better Auth handles hashing,
session creation, and cookie setting internally. No manual bcrypt/JWT code needed.

**Demo login button:** call `authClient.signIn.email({ email: "demo@internhive.com",
password: "demo1234" })` with a pre-seeded demo account.

**Protected request:** `middleware.ts` (or server components) call
`auth.api.getSession({ headers })` — valid session: allow; no session: redirect to
/login. Same pattern replaces the old manual JWT-verify middleware.

## 8. API Endpoint Design

| Method | Route | Auth? | Purpose |
|---|---|---|---|
| ALL | /api/auth/[...all] | Handled by Better Auth | register, login, logout, session, all auth operations — no custom code needed |
| GET | /api/internships | No | List all (supports ?search=&type=&location=&sort=&page=) |
| POST | /api/internships | Yes | Create internship (postedBy = current user) |
| GET | /api/internships/[id] | No | Single internship + match % (if logged in) |
| DELETE | /api/internships/[id] | Yes (owner only) | Delete own posted internship |
| POST | /api/applications | Yes | Apply to an internship |
| GET | /api/applications | Yes | Get current user's applications (for dashboard) |

### API Response Format (consistent across all endpoints)
```ts
// Success
{ success: true, data: {...} }

// Error
{ success: false, message: "Invalid credentials" }
```

### Authorization Rule
DELETE /api/internships/[id] must check both JWT validity AND that
`internship.postedBy === currentUserId` before allowing deletion — this is an
authorization check, distinct from authentication.

## 9. Skill-Match Score Logic
```ts
function calculateMatch(userSkills: string[], requiredSkills: string[]): number {
  const matched = requiredSkills.filter(skill => userSkills.includes(skill));
  return Math.round((matched.length / requiredSkills.length) * 100);
}
```

## 10. Pages & Assignment Requirement Mapping

**Landing page** — sticky navbar (min 3 routes logged out / 5 logged in), hero section
(60-70% viewport height, interactive CTA), minimum 7 sections (Featured Internships,
How It Works, Categories, Platform Statistics, Testimonials, Top Companies, Newsletter),
fully functional footer with working links + contact info + socials.

**Listing page (/internships)** — search bar, filtering on at least 2 fields (category,
location, type, stipend range), sort dropdown, pagination, 4 cards per row on desktop,
skeleton loader while loading, each card: image, title, short description, meta info
(stipend/location/type), skill-match % badge, "View Details" button.

**Details page (/internships/[id])** — publicly accessible, description/overview section,
key info/specifications, related internships, apply button.

**Auth pages (/login, /register)** — validation + error handling, demo login button
(auto-fill credentials), clean professional UI.

**Protected: Add (/internships/add)** — redirect to /login if not authenticated, form
fields: title, short description, full description, stipend, location, type, required
skills, optional image URL, submit button.

**Protected: Manage (/internships/manage)** — table/grid of user's posted internships,
View and Delete actions, responsive layout.

**Protected: Dashboard (/dashboard)** — application tracker, summary cards (Total Applied,
Interview, Offers, Rejected), Recharts pie/bar chart of status breakdown, list/table of
applications with status badges.

**Additional pages** — /about, /contact (minimum 2 required).

## 11. UX Rules
- No placeholder/lorem ipsum content anywhere
- Fully responsive across mobile, tablet, desktop
- Consistent spacing, alignment, card sizing across the app
- All buttons and links must be functional

## 11a. Auth Provider Decision
Using Better Auth instead of hand-rolled JWT/bcrypt. Rationale: Better Auth is
type-safe out of the box (generates types from the config), handles password
hashing, session/cookie management, and CSRF protection internally, reducing
custom security-sensitive code. This also matches prior hands-on experience with
Better Auth (used previously on the IdeaVault project).

## 12. Learning Goal (Important Constraint)
The developer does not know TypeScript yet and is using this project specifically to
learn it. When generating code or plans: explain concepts, scaffold structure, and
guide implementation — do not silently do everything for them. Prioritize clarity of
TS typing patterns (interfaces, generics in useState, typed function params/returns,
typed event handlers) since that is the primary learning objective alongside completing
the assignment.

## 13. Timeline (5-day assignment deadline)
- Day 1: TypeScript basics + project setup + folder structure + models/types
- Day 2: Auth (JWT) + /api/internships CRUD + /api/applications
- Day 3: Landing page + Listing page (with match %) + Details page
- Day 4: Dashboard (Recharts) + Add/Manage protected pages
- Day 5: Polish, responsive fixes, deploy, buffer for bugs