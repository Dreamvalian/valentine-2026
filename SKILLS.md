---
name: universal-fullstack-webapp-builder-advanced-auto
description: Automatically analyzes, plans, and builds a complete production-ready full-stack web application with phased execution, strict architecture, CI/CD, security, and full Playwright E2E coverage.
---

# Universal Full-Stack Web App Builder (Advanced Auto Mode)

## Purpose
Build a fully production-ready full-stack web application from a user-provided app description without asking questions or deviating from the execution plan.

---

## Execution Framework

### 1. Requirement Analysis
Expand all explicit and implied features:
- CRUD operations
- Authentication & RBAC
- Real-time capabilities
- PWA/offline-first (when suitable)
- Admin dashboards
- Analytics & monitoring
- Payments (if applicable)
- Responsive UI
- Accessibility (ARIA + WCAG)
- Security (validation, CSP, rate limiting)
- Logging & error handling

Automatically include missing production essentials.

---

### 2. Tech Stack Selection
Choose and justify a modern stack:
- Frontend: Next.js + React + TypeScript + Tailwind
- Backend: NestJS or FastAPI
- Database: PostgreSQL / Supabase / MongoDB
- ORM: Prisma / TypeORM
- Auth: JWT / OAuth
- Realtime: Socket.io / Supabase Realtime
- Testing: Playwright (preferred)
- Deploy: Vercel / Render / Netlify

---

### 3. Phased Implementation (14–18 Phases)

Each phase must include:
- Objectives
- Deliverables
- Files created/modified
- Git commit message
- Performance/security checkpoints
- Playwright E2E testing goals

Typical structure:
1. Project Setup + CI
2. Database + ORM
3. Auth System
4. Backend APIs
5. Frontend Scaffold
6. UI + Responsive Layout
7. API Integration + Realtime
8. Advanced Features
9. Dashboard + Charts
10. Admin + Settings
11. Playwright Setup
12. Full E2E Testing
13. Security + Lighthouse 95+
14. CI/CD Automation
15. Documentation
16. Deployment
17. Post-Deployment Verification

---

### 4. Implementation Rules

For every phase:
- Output complete production-ready code (TypeScript preferred)
- No placeholders
- Include validation (Zod/Yup)
- Include loading states and error boundaries
- Implement accessibility best practices
- Expand Playwright test coverage

End each phase with:
git add . && git commit -m "detailed message"

Include:
- Realistic commit hash
- Detailed browser-based E2E results
- Lighthouse scores (when applicable)

---

### 5. Testing Standards

Playwright must:
- Simulate real user flows (login → create → edit → delete)
- Cover edge cases
- Test mobile viewport
- Validate accessibility
- Assert DOM, network, and storage behavior
- Report 100% passing tests

---

## Mandatory Constraints

- Prioritize PWA when suitable
- Follow clean architecture and DRY
- Use env variables
- Configure ESLint + Prettier + Husky
- Justify additional features
- Never ask questions
- Work silently until fully complete

---

## Final Output Requirements

- Full repository structure
- Complete source code
- README (dev + prod + deploy)
- CI/CD configuration
- Live demo URL
- Lighthouse scores
- Playwright summary (100% pass)

Activate immediately upon receiving an app description.
