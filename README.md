# UPI SplitPay — Payment Planning & Transaction Simulator

UPI SplitPay is an educational full-stack portfolio application for planning a large amount into smaller simulated installments, generating QR representations, tracking simulated transactions, and visualizing analytics.

> **Important:** This project is a simulator. QR codes and UPI handoff links do not guarantee or verify real payment completion. Actual payment fees and transaction rules depend on the applicable provider, payment method, merchant category, payment network, and current rules.

## Modes

### Simulation Mode
The default portfolio/demo flow. Each installment is represented by a mock QR payload containing payment ID, plan ID, amount and `MODE=SIMULATION`. `Simulate Success` and `Simulate Failure` are the only controls that change simulator status.

### UPI Handoff Demo Mode
When a receiver UPI ID or mobile number is supplied, the backend creates a UPI-compatible `upi://pay` URI with receiver, name, amount, reference and INR currency. The frontend can attempt to open a compatible app (Google Pay, PhonePe, Paytm, BHIM or a generic UPI handler) or display a QR for scanning from another device.

Opening a UPI application or scanning a QR **does not verify payment completion**. A real payment must be verified through an authorized payment provider/webhook before it can be considered successful. This project never asks for UPI PIN, OTP, CVV, card numbers, banking passwords or other banking credentials.

## Stack

- React + Vite + React Router
- Recharts + QRCode React + Lucide
- Spring Boot 3.5 + Java 21
- Spring Security + JWT + BCrypt
- Spring Data MongoDB
- BigDecimal for all monetary calculations
- Docker Compose
- Optional AWS S3 abstraction for receipt uploads

## Architecture

Browser → React/Vite → Axios REST API → Spring Boot Controller → Service → MongoDB Repository

Payment creation uses `Controller → Service → Repository`, while `PaymentProvider` abstracts the simulator from a future authorized provider integration. The current implementation is `MockPaymentProvider` only.

## Payment splitting

For `₹4500` with a maximum installment of `₹1999`, the backend uses BigDecimal and repeatedly takes the smaller of remaining amount and maximum amount:

`₹1999 + ₹1999 + ₹502`

Examples covered by tests:

- 4500 / 1999 → 1999, 1999, 502
- 1999 / 1999 → 1999
- 2000 / 1999 → 1999, 1
- 500 / 1999 → 500

## Status rules

Payment statuses: `PENDING`, `SUCCESS`, `FAILED`.

Plan statuses:

- All pending → `PENDING`
- All successful → `COMPLETED`
- Some success with pending/failed → `PARTIALLY_COMPLETED`
- All failed → `FAILED`
- Failed + pending with no success → `FAILED` in the current documented business rule

A finalized payment cannot be changed again.

## Main pages

Landing, Login, Register, Dashboard, Create Payment Plan, Payment Plan Details, Transactions, Analytics, Profile, Admin Dashboard and 404.

## API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Payment plans
- `POST /api/payment-plans`
- `GET /api/payment-plans`
- `GET /api/payment-plans/{id}`
- `DELETE /api/payment-plans/{id}`
- `PATCH /api/payment-plans/payments/{id}/simulate-success`
- `PATCH /api/payment-plans/payments/{id}/simulate-failure`

### Transactions
- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `PATCH /api/transactions/{id}/simulate-success`
- `PATCH /api/transactions/{id}/simulate-failure`

### Analytics
- `GET /api/analytics/summary`
- `GET /api/analytics/daily`
- `GET /api/analytics/status`
- `GET /api/analytics/amounts`
- `GET /api/fees/simulate?amount=4500&rate=1`

### Admin
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/payment-plans`
- `GET /api/admin/transactions`
- `GET /api/admin/audit-logs`

All JSON API responses use `{success,message,data}` for successful application responses and `{success,message,data:null}` for handled errors.

## MongoDB collections and indexes

- `users` — unique email index
- `payment_requests` — user + createdAt compound index
- `payment_transactions` — user/createdAt, plan/createdAt and status/createdAt indexes
- `audit_logs` — user/timestamp and entity/timestamp indexes

## Environment

Copy `.env.example` to your environment and set:

- `MONGODB_URI`
- `JWT_SECRET` (use a random value of at least 32 characters)
- `JWT_EXPIRATION`
- `FRONTEND_URL`
- Optional AWS S3 variables
- Frontend `VITE_API_URL`

Never commit real credentials.

## Local development

### Backend

```bash
mvn test
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm ci
npm test
npm run build
npm run dev
```

The frontend defaults to `http://localhost:5173` and backend to `http://localhost:8080`.

## Docker

```bash
docker compose up --build
```

Services:

- MongoDB: `27017`
- Backend: `8080`
- Frontend: `5173`

## Demo credentials

The current seed runner creates these local demo accounts when they do not already exist:

- USER: `demo@example.com` / `Demo@12345`
- ADMIN: `admin@example.com` / `Admin@12345`

These credentials are for local/demo use only; change or remove the seed accounts before any production deployment.

## Security notes

- BCrypt password hashing
- JWT authentication
- USER/ADMIN authorization
- Input validation and global exception handling
- CORS configuration
- In-memory authentication rate limiter: suitable for single-instance development/demo use only. For production, use a distributed limiter such as Redis-backed rate limiting at the edge/application layer.
- Password hashes and secrets are not returned by user-facing APIs.
- Secrets are environment variables.

## Testing

Backend tests cover the payment splitting algorithm. Frontend tests cover the core split utility. The CI workflow runs frontend `npm ci`, tests and build plus backend Maven tests/package.

## Project structure

```text
frontend/src/
  components/   reusable UI, QR, toast, dialogs
  context/      authentication state
  pages/        application screens
  services/     Axios API client
  __tests__/    frontend tests
src/main/java/com/madhukar/upisplitter/
  controller/   REST endpoints
  service/      business logic and provider abstraction
  repository/   MongoDB repositories
  model/        MongoDB documents
  dto/          request/response DTOs
  security/     JWT and Spring Security
  exception/    API error handling
  config/       configuration and rate limiting
  util/         payment splitting algorithm
.github/workflows/ci.yml
```

## Known limitations / future improvements

- The UPI handoff is intentionally not a payment gateway integration and has no payment verification webhook.
- The browser cannot reliably know whether an external UPI app completed a payment.
- A Redis-backed distributed rate limiter can replace the demo in-memory limiter for multi-instance deployment.
- A real provider can be added later behind `PaymentProvider` after appropriate authorization, compliance, credentials and webhook verification are available.
- S3 receipt upload is optional and disabled unless configured.
