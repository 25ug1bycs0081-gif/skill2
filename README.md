# PIRATES HMS

PIRATES Hospital Management System is a modern full-stack healthcare application built with React, Vite, Tailwind CSS, Express, Prisma, PostgreSQL, JWT, and role-based access control.

## Branding
- Product: PIRATES HMS
- Hospital: PIRATES Hospital
- Tagline: Smart Healthcare. Better Patient Care.

## Features
- Admin dashboard and analytics
- Patient registration and management
- Doctor and staff management
- Appointment scheduling
- Nurse and ward coordination
- Pharmacy and medicine inventory
- Laboratory and test tracking
- Billing, invoices and payment overview
- Admissions, beds and room readiness
- Patient portal and reminders
- Notifications and report summaries
- Secure role-based access control and audit-ready server design

## Tech stack
- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts
- Backend: Node.js, Express.js, JWT, bcrypt, Zod, Helmet, rate limiting
- Database: PostgreSQL + Prisma ORM

## Project structure
- src/ - React frontend
- server/ - Express API and mock data
- server/prisma/ - Prisma schema, migration SQL, seed script
- .env.example - environment template
- vite.config.js - frontend proxy config
- package.json - app scripts and dependencies

## Local setup

1. Install Node.js 18+ and PostgreSQL.
2. Create a database named pirates_hms.
3. Copy `.env.example` to `.env` and adjust values.
4. Install dependencies:

```bash
npm install
```

5. Run Prisma generation and migrations:

```bash
npx prisma generate --schema=server/prisma/schema.prisma
npx prisma migrate dev --schema=server/prisma/schema.prisma --name init
```

6. Start the application:

```bash
npm run dev -- --host 0.0.0.0
```

## Environment variables

Example values:

```env
PORT=5000
JWT_SECRET=pirates-hms-super-secret-key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pirates_hms?schema=public
CLIENT_URL=http://localhost:5176
NODE_ENV=development
```

## Demo accounts

- Super Admin: admin@pirateshms.com / pirates123
- Hospital Admin: hospitaladmin@pirateshms.com / hospital123
- Receptionist: reception@pirateshms.com / reception123
- Doctor: doctor@pirateshms.com / doctor123
- Nurse: nurse@pirateshms.com / nurse123
- Pharmacist: pharmacist@pirateshms.com / pharmacist123
- Lab Staff: lab@pirateshms.com / lab123
- Accountant: accountant@pirateshms.com / accountant123
- Patient: patient@pirateshms.com / patient123

## API overview

- GET /api/health
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- GET /api/dashboard
- GET /api/patients
- GET /api/doctors
- GET /api/appointments
- GET /api/reports/overview
- GET /api/billing
- GET /api/labs

## Notes

This project is fully runnable as a local healthcare dashboard and API demo. The frontend and backend are connected and secured with JWT cookie auth, validation, and role-aware route checks.

The Prisma schema and migration scaffold are included; a live PostgreSQL connection is intended for production persistence, while the app currently ships with realistic demo/mock data so it can run instantly in local development without requiring an external database service.

## Production review

Before production deployment, review and harden:
- real PostgreSQL connection setup and migration execution
- audit log storage and retention policies
- patient data access controls and encryption
- file attachments and medical document storage
- backup strategy and monitoring
- CI/CD, automated tests, and security scanning
