# Skillbridge API Server

Freelance service marketplace REST API built with Express 5, TypeScript, Prisma 7, and PostgreSQL.

## Quick Start

```bash
# install dependencies
npm install

# generate Prisma client
npm run prisma:generate

# run migrations
npm run prisma:migrate -- --name init

# start development server
npm run dev

# build for production
npm run build
npm start
```

## API Documentation

Interactive API documentation is available via Swagger UI once the server is running:

- **Swagger UI:** [https://skill-bridge-server-s2o3.onrender.com/api-docs](https://skill-bridge-server-s2o3.onrender.com/api-docs)
- **OpenAPI JSON:** [https://skill-bridge-server-s2o3.onrender.com/api-docs-json](https://skill-bridge-server-s2o3.onrender.com/api-docs-json)

The spec is generated using `swagger-jsdoc` (JSDoc annotations in controllers/routes) and served with `swagger-ui-express`.

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint           | Access | Description                             |
| ------ | ------------------ | ------ | --------------------------------------- |
| POST   | `/register`        | Public | Register a client or freelancer         |
| POST   | `/login`           | Public | Login with email and password           |
| POST   | `/refresh-token`   | Public | Exchange refresh token for access token |
| GET    | `/google`          | Public | Initiate Google OAuth                   |
| GET    | `/google/callback` | Public | Google OAuth callback                   |
| GET    | `/github`          | Public | Initiate GitHub OAuth                   |
| GET    | `/github/callback` | Public | GitHub OAuth callback                   |

### Users — `/api/users`

| Method | Endpoint | Access      | Description                                   |
| ------ | -------- | ----------- | --------------------------------------------- |
| GET    | `/`      | Admin       | Get all users (paginated, filterable by role) |
| GET    | `/me`    | Auth        | Get logged-in user's profile                  |
| GET    | `/:id`   | Auth        | Get user profile by ID                        |
| PATCH  | `/:id`   | Owner/Admin | Update profile (name, bio, phone, profileImg) |
| DELETE | `/:id`   | Admin       | Soft delete user                              |

### Categories — `/api/categories`

| Method | Endpoint | Access | Description          |
| ------ | -------- | ------ | -------------------- |
| POST   | `/`      | Admin  | Create category      |
| GET    | `/`      | Public | Get all categories   |
| GET    | `/:id`   | Public | Get category by ID   |
| PATCH  | `/:id`   | Admin  | Update category      |
| DELETE | `/:id`   | Admin  | Soft delete category |

### Services — `/api/services`

| Method | Endpoint                    | Access      | Description                                                            |
| ------ | --------------------------- | ----------- | ---------------------------------------------------------------------- |
| POST   | `/`                         | Freelancer  | Create a service listing                                               |
| GET    | `/`                         | Public      | Get all services (filter: category, price range, search, pagination)   |
| GET    | `/:id`                      | Public      | Get service by ID (includes category, freelancer, avg rating, reviews) |
| PATCH  | `/:id`                      | Owner/Admin | Update service                                                         |
| DELETE | `/:id`                      | Owner/Admin | Soft delete service                                                    |
| GET    | `/freelancer/:freelancerId` | Public      | Get all services by one freelancer                                     |

### Orders — `/api/orders`

| Method | Endpoint           | Access           | Description                                                                                       |
| ------ | ------------------ | ---------------- | ------------------------------------------------------------------------------------------------- |
| POST   | `/`                | Client           | Place an order for a service                                                                      |
| GET    | `/`                | Admin            | Get all orders (paginated)                                                                        |
| GET    | `/my-orders`       | Client           | Get logged-in client's orders                                                                     |
| GET    | `/received-orders` | Freelancer       | Get orders received on freelancer's services                                                      |
| GET    | `/:id`             | Owner/Admin      | Get order by ID                                                                                   |
| PATCH  | `/:id/status`      | Freelancer/Admin | Update order status (state machine: PENDING → ACCEPTED → IN_PROGRESS → COMPLETED, or → CANCELLED) |
| DELETE | `/:id`             | Admin            | Soft delete order                                                                                 |

### Reviews — `/api/reviews`

| Method | Endpoint              | Access      | Description                                                             |
| ------ | --------------------- | ----------- | ----------------------------------------------------------------------- |
| POST   | `/`                   | Client      | Create review (only if order status is COMPLETED, one review per order) |
| GET    | `/service/:serviceId` | Public      | Get all reviews for a service                                           |
| GET    | `/:id`                | Public      | Get review by ID                                                        |
| PATCH  | `/:id`                | Owner/Admin | Update own review                                                       |
| DELETE | `/:id`                | Owner/Admin | Soft delete review                                                      |

### Health & Docs

| Method | Endpoint  | Access | Description                        |
| ------ | --------- | ------ | ---------------------------------- |
| GET    | `/health` | Public | Check if the API server is running |

## Response Format

All responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Description of what happened",
  "data": {} | [],
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Description of the error",
  "errorSources": [{ "path": "field", "message": "Details" }]
}
```

## Status Codes

| Code | Meaning                      |
| ---- | ---------------------------- |
| 200  | Success (GET, PATCH, DELETE) |
| 201  | Created (POST)               |
| 400  | Validation error             |
| 401  | Unauthorized                 |
| 403  | Forbidden                    |
| 404  | Not found                    |
| 409  | Conflict                     |
| 500  | Internal server error        |

## Business Rules

1. A **CLIENT** cannot create a Service.
2. A **FREELANCER** cannot order their own service.
3. Order status follows a state machine: `PENDING → ACCEPTED → IN_PROGRESS → COMPLETED`. Can jump to `CANCELLED` from `PENDING` or `ACCEPTED`.
4. Reviews can only be created for `COMPLETED` orders, one review per order.
5. All list endpoints support pagination (`page`, `limit`). Soft-deleted records are always excluded.
6. Passwords are never included in any API response.
7. All deletions are soft deletes (`isDeleted: true`).
