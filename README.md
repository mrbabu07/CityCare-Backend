# CityCare Backend

CityCare is a REST API for reporting and resolving city complaints. Citizens submit location-based requests, administrators route and assign them, staff move them through a controlled workflow, and citizens provide feedback after resolution.

## Stack

Node.js, TypeScript, Express, PostgreSQL, Prisma, Zod, JWT, Google Identity, SSLCommerz, Nodemailer, Helmet and rate limiting.

Complaint evidence uploads use Multer memory storage and Cloudinary. Accepted files are JPEG, PNG, WebP, and PDF up to 4 MB to stay within Vercel's request limit.

## Setup

1. Copy `.env.example` to `.env` and set real credentials.
2. Run `npm install`.
3. Run `npx prisma migrate deploy`.
4. Run `npm run seed` to create the dedicated demo admin.
5. Run `npm run dev` for development or `npm run build && npm start` for production.

The API runs at `http://localhost:5000`; health check: `GET /health`. Import [docs/openapi.yaml](docs/openapi.yaml) into Postman or Swagger UI for endpoint documentation.

## Roles and workflow

- `CITIZEN`: manages their profile and complaints, initiates payment, and submits feedback.
- `STAFF`: sees assigned complaints and performs allowed status transitions.
- `ADMIN`: manages users, departments and categories, assigns staff, and views analytics/audit logs.

Complaint workflow: `SUBMITTED -> UNDER_REVIEW -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED`. Rejection and reassignment are restricted by the state machine.

Refresh tokens are stored only as hashes. `POST /api/v1/auth/refresh` rotates the refresh token, and `POST /api/v1/auth/logout` accepts `{ "refreshToken": "..." }` to revoke that session.

## Quality checks

Run `npm test`. All errors use `{ success: false, message, errors }`; successes use `{ success: true, message, data }`.

Never commit `.env` or submit personal credentials. Use the dedicated `DEMO_ADMIN_EMAIL` and `DEMO_ADMIN_PASSWORD` values when evaluating the project.

## Deploy to Vercel

Vercel detects the default Express export in `src/app.ts` and deploys it as one Node.js function. Do not configure an output directory; `dist/` is local build output and is intentionally ignored by Git.

1. Push the repository to GitHub and import it from the Vercel dashboard.
2. Leave Framework Preset as `Other`, Root Directory as the repository root, and Output Directory empty.
3. Add every required value from `.env.example` under Project Settings > Environment Variables. Set `BACKEND_URL` to the final `https://<project>.vercel.app` URL and `CORS_ORIGIN` to the frontend origin. Multiple origins can be comma-separated.
4. Use a hosted PostgreSQL connection string suitable for serverless workloads as `DATABASE_URL`.
5. Before the first production deployment, apply the checked-in migrations against that production database:

   ```bash
   npx vercel env pull .env.production.local
   npx prisma migrate deploy
   npm run seed
   ```

6. Deploy from the dashboard or run `npx vercel --prod`.
7. Verify `GET https://<project>.vercel.app/health`, then update SSLCommerz callback configuration and Google OAuth authorized origins with the production URL.

For later schema changes, run `npx prisma migrate deploy` with production environment variables before promoting the matching deployment.
