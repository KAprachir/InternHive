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
- Database: MongoDB (Mongoose ODM)
- Auth: JWT (jsonwebtoken) stored in httpOnly cookie, bcryptjs for password hashing

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
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
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
│   ├── dbConnect.ts              (MongoDB connection singleton)
│   └── auth.ts                   (hashPassword, comparePassword, signToken, verifyToken)
├── models/
│   ├── User.ts
│   ├── Internship.ts
│   └── Application.ts
├── types/
│   └── index.ts                  (shared TS interfaces)
├── middleware.ts                 (protects /internships/add, /internships/manage, /dashboard)
└── .env.local                    (MONGODB_URI, JWT_SECRET)
```

## 5. Data Models / Types

```ts
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  skills: string[];
  role: "student" | "admin";
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
Browser (React components, fetch calls)
  → Next.js pages (App Router: listing, details, dashboard, forms)
  → Next.js API routes (verify JWT, validate, run logic)
  → MongoDB Atlas (users, internships, applications)
  → JSON response + httpOnly cookie sent back to browser

## 7. Authentication Flow & Security (JWT)

To ensure production-grade security, the authentication system uses **JWT (JSON Web Tokens)** stored in secure cookies, combined with client-side state management.

### Token & Cookie Strategy
1. **JWT Payload:** Includes key user claims to minimize database lookup on protected routes:
   ```ts
   interface JWTPayload {
     userId: string;
     email: string;
     role: 'student' | 'admin';
   }
   ```
2. **HttpOnly Cookie Configuration:**
   - `httpOnly: true` (Shields token from XSS/client-side access).
   - `secure: process.env.NODE_ENV === 'production'` (Transmitted only via HTTPS in production).
   - `sameSite: 'strict'` (Protects against CSRF attacks).
   - `maxAge: 86400` (1 day expiration, matching JWT `expiresIn: '1d'`).
   - `path: '/'` (Available site-wide).

### Authentication Actions
*   **Registration (`POST /api/auth/register`):**
    1. Validate input data (valid email format, password min 6 chars).
    2. Hash password using `bcryptjs` with a salt factor of `12`.
    3. Save user record. Return user info without password.
*   **Login (`POST /api/auth/login`):**
    1. Find user by email (case-insensitive).
    2. Verify password hash using `bcryptjs.compare()`.
    3. Generate JWT with payload (id, email, role) signed with `JWT_SECRET`.
    4. Set token in cookie and return user info. Exposes demo account login.
*   **Logout (`POST /api/auth/logout`):**
    1. Clear cookie by setting maxAge to 0.
*   **Verification (`GET /api/auth/me`):**
    1. Read token from cookie, verify signature, and return authenticated user object.

### Middleware & Redirection (`middleware.ts`)
- Runs on protected paths: `/internships/add`, `/internships/manage`, `/dashboard`.
- Decodes and validates JWT token signature.
- **Dynamic Redirect:** If verification fails or token is missing, redirect to `/login?redirect=<original-path>` (e.g. `/login?redirect=/dashboard`).
- After successful login, redirect the user back to the requested page.

### Client-Side State (`context/AuthContext.tsx`)
- Provides an `AuthProvider` wrapping the application.
- Exposes `user`, `loading`, `login()`, `logout()`, and `register()` handlers.
- Queries `/api/auth/me` on initial mount to restore user session.

## 8. API Endpoint Design

| Method | Route | Auth? | Purpose |
|---|---|---|---|
| POST | /api/auth/register | No | Create user (hash password) |
| POST | /api/auth/login | No | Verify credentials + set JWT cookie |
| POST | /api/auth/logout | Yes | Clear cookie |
| GET | /api/auth/me | Yes | Get logged-in user info |
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