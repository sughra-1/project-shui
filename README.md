# Exam-Shui – digital message board

Shui is a simple digital message board where users can read, publish, edit and delete messages.

The project builds on the existing Shui React starter project. I added a serverless backend on AWS (API Gateway, Lambda, DynamoDB), connected the frontend to it, added registration and login with JWT, and deployed the frontend to S3.

## Links

| | URL |
|---|---|
| **Deployed app (S3)** | http://project-shui-sughra.s3-website.eu-north-1.amazonaws.com |
| **API base URL** | https://8ez7w55yl6.execute-api.eu-north-1.amazonaws.com|

## Tech stack

**Backend:** Node.js 24, Serverless Framework, AWS API Gateway (HTTP API), AWS Lambda, DynamoDB, Middy (middleware), Zod (validation), bcryptjs (password hashing), jsonwebtoken (JWT), uuid

**Frontend:** React (Vite), React Router, TanStack Query

**Deployment:** Backend with `serverless deploy`. Frontend is built with `npm run build` and deployed to S3 automatically by GitHub Actions on every push to `main`.

## Architecture

```text
React (S3)  →  API Gateway  →  Lambda  →  DynamoDB
```

## Project structure

```text
exam-shui/
├── shui-backend/
│   ├── functions/        Lambda handlers (auth, messages)
│   ├── services/         DynamoDB logic (db.mjs, messages.mjs, users.mjs)
│   ├── middlewares/      authentication, authorization, validation, error handling
│   ├── models/           Zod schemas
│   ├── responses/        shared response helper
│   ├── utils/            JWT and password helpers
│   └── serverless.yml    AWS infrastructure (Lambda, API Gateway, DynamoDB)
├── shui-frontend/
│   └── src/
│       ├── api/          fetch functions for the API (auth.js, messages.js)
│       ├── components/   existing components, connected to the API
│       ├── pages/        existing pages + new UserPage
│       └── router/       routes
└── .github/workflows/deploy.yml   automatic frontend deployment to S3
```

---

# API documentation

All responses are JSON. Errors have this format:

```json
{ "success": false, "message": "Message not found." }
```

Protected endpoints need the JWT from login in the header:

```text
Authorization: Bearer <token>
```

## Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | – | Register a user |
| `POST` | `/api/auth/login` | – | Log in, returns a JWT |
| `GET` | `/api/messages` | – | Get all messages |
| `GET` | `/api/messages?username={username}` | – | Get all messages from one user |
| `GET` | `/api/messages/{id}` | – | Get one message |
| `POST` | `/api/messages` | logged In (JWT) |Create a message |
| `PATCH` | `/api/messages/{id}` |  logged In + author of the message | Update a message |
| `DELETE` | `/api/messages/{id}` |  logged In + author of the message | Delete a message |

---

## Register

`POST /api/auth/register`

**Request body**

```json
{
  "username": "sughra",
  "email": "sughra@mail.com",
  "password": "secret123"
}
```

**Validation:** `username` required string · `email` valid email · `password` at least 6 characters

**Response `201`**

```json
{ "success": true, "message": "User registered successfully!" }
```

**Errors:** `400` invalid body · `409` Username already exists

The password is hashed with bcrypt before it is saved and is never stored in plain text.

---

## Login

`POST /api/auth/login`

**Request body**

```json
{
  "username": "sughra",
  "password": "secret123"
}
```

**Response `200`**

```json
{
  "success": true,
  "message": "User logged in successfully!",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

The token contains the user's `id` and `username` and expires after 1 hour.

**Errors:** `400` invalid body · `404` User does not exist · `401` wrong password

---

## Get all messages

`GET /api/messages`

**Query parameters (optional):** `username` – only return messages from this user, e.g. `/api/messages?username=sughra`

**Response `200`** (newest first)

```json
{
  "success": true,
  "messages": [
    {
      "id": "3a5a8452-3020-4fd0-ad3d-90d4c0bedd92",
      "username": "sughra",
      "text": "Hello Shui!",
      "createdAt": "2026-09-28T14:32:00.000Z"
    }
  ]
}
```

---

## Get one message

`GET /api/messages/{id}`

**Path parameters:** `id` – the message id

**Response `200`**

```json
{
  "success": true,
  "message": {
    "id": "3a5a8452-3020-4fd0-ad3d-90d4c0bedd92",
    "username": "sughra",
    "text": "Hello Shui!",
    "createdAt": "2026-09-28T14:32:00.000Z"
  }
}
```

**Errors:** `404` No message found

---

## Create message

`POST /api/messages` · requires token

**Request body**

```json
{ "text": "Hello Shui!" }
```

The username is taken from the JWT, not from the request body, so a user cannot post as someone else. `id` and `createdAt` are created by the backend.

**Validation:** `text` required string, cannot be empty

**Response `201`**

```json
{
  "success": true,
  "message": {
    "id": "3a5a8452-3020-4fd0-ad3d-90d4c0bedd92",
    "username": "sughra",
    "text": "Hello Shui!",
    "createdAt": "2026-09-28T14:32:00.000Z"
  }
}
```

**Errors:** `400` empty or invalid text · `401` missing or invalid token

---

## Update message

`PATCH /api/messages/{id}` · requires token · only the author

**Path parameters:** `id` – the message id

**Request body**

```json
{ "text": "Updated text" }
```

**Response `200`**

```json
{
  "success": true,
  "message": {
    "id": "3a5a8452-3020-4fd0-ad3d-90d4c0bedd92",
    "username": "sughra",
    "text": "Updated text",
    "createdAt": "2026-09-28T14:32:00.000Z",
    "updatedAt": "2026-09-28T15:10:00.000Z"
  }
}
```

**Errors:** `400` empty text · `401` missing or invalid token · `403` You can only change your own messages · `404` Message not found

---

## Delete message

`DELETE /api/messages/{id}` · requires token · only the author

**Path parameters:** `id` – the message id

**Response `200`**

```json
{ "success": true, "message": "Message deleted successfully!" }
```

**Errors:** `401` missing or invalid token · `403` You can only change your own messages · `404` Message not found

---

# DynamoDB design

I use **single-table design** with one table, `shuiTable`, and two Global Secondary Indexes. The keys are designed from the access patterns: every key exists because the application needs to ask that question.

## Access patterns

| # | Access pattern | Solved with |
|---|---|---|
| AP1 | Create a message | `PutItem` with `PK = MESSAGE#<id>`, `SK = METADATA` |
| AP2 | Get all messages (newest first) | `Query` on **GSI1** where `GSI1PK = MESSAGES`, sorted by `GSI1SK` (createdAt) |
| AP3 | Get all messages from a specific user | `Query` on **GSI2** where `GSI2PK = USER#<username>` and `begins_with(GSI2SK, "MESSAGE#")` |
| AP4 | Get a specific message | `GetItem` with `PK = MESSAGE#<id>`, `SK = METADATA` |
| AP5 | Update a message | `UpdateItem` with `PK = MESSAGE#<id>`, `SK = METADATA` |
| AP6 | Delete a message | `DeleteItem` with `PK = MESSAGE#<id>`, `SK = METADATA` |
| VG | Register a user (unique username) | `PutItem` with `PK = USER#<username>`, `SK = PROFILE` and `attribute_not_exists(PK)` |
| VG | Get a user by username (login) | `GetItem` with `PK = USER#<username>`, `SK = PROFILE` |
| VG | Get all messages from the logged-in user | Same as AP3, with the username taken from the JWT |

## Key design

**Main table**

| Entity | PK | SK |
|---|---|---|
| Message | `MESSAGE#<id>` | `METADATA` |
| User | `USER#<username>` | `PROFILE` |

**GSI1 – all messages**

| Entity | GSI1PK | GSI1SK |
|---|---|---|
| Message | `MESSAGES` | `<createdAt>` |

**GSI2 – messages per user**

| Entity | GSI2PK | GSI2SK |
|---|---|---|
| Message | `USER#<username>` | `MESSAGE#<createdAt>` |

## Why this design

- **One message = one item.** `PK = MESSAGE#<id>` gives direct access to a single message for get, update and delete (AP4–AP6) without searching.
- **GSI1** puts all messages in the same partition (`MESSAGES`) with `createdAt` as sort key, so all messages can be fetched with one query, sorted by date (AP2).
- **GSI2** groups messages by author (`USER#<username>`), so one user's messages can be fetched with one query instead of scanning the whole table (AP3).
- **Users and messages share the table.** The prefixes `USER#` and `MESSAGE#` keep the entity types apart. Using the username as the user's key makes login a direct lookup, and `attribute_not_exists(PK)` guarantees unique usernames.
- Users are not written to GSI1 or GSI2, so the indexes only contain messages.

---

# Authentication and authorization

- **Registration:** passwords are hashed with bcrypt.
- **Login:** a JWT with the user's `id` and `username` is returned.
- **Authentication:** the `authenticateUser` middleware verifies the JWT on create, update and delete, and puts the user in `event.user`.
- **Authorization:** the `authorizeUser` middleware fetches the message and returns `403` if it does not belong to the logged-in user. The frontend only shows Edit/Delete on your own messages, but the backend always checks.
- **Everyone** can read messages without logging in.

---

# Frontend

Built on the existing Shui starter project. The existing components (`MessageFlow`, `Message`, `MessageForm`, `LoginForm`, `RegisterForm`, `Header`, `Navigation`) are reused and connected to the API.

- The example data is replaced with data from DynamoDB via the API.
- `MessageForm` is reused for both creating and editing messages.
- After login, the navigation shows the username and a logout button.
- Edit and delete icons are only shown on your own messages.
- **VG:** usernames are clickable and link to `/users/:username`, which shows all messages from that user.
- Errors from the API are shown to the user, so the app does not crash if a request fails.

---

# Run the project locally

## Requirements

- Node.js
- AWS account with configured AWS CLI credentials
- Serverless Framework (`npm install -g serverless`)

## Backend

1. Go to the backend folder and install packages:

   ```bash
   cd shui-backend
   npm install
   ```

2. Create `shui-backend/config.yml` (not included in the repo because it contains secrets):

   ```yaml
   role: arn:aws:iam::<account-id>:role/<lambda-role-with-dynamodb-access>
   jwtSecret: <a-long-random-string>
   ```

3. Deploy to AWS:

   ```bash
   serverless deploy
   ```

   The API base URL is shown under **endpoints** in the output.

## Frontend

1. Go to the frontend folder and install packages:

   ```bash
   cd shui-frontend
   npm install
   ```

2. If you use your own backend, set your API base URL in `src/api/auth.js` and `src/api/messages.js`.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local address shown in the terminal, usually http://localhost:5173.

## Deploy the frontend

Every push to `main` builds the frontend and uploads it to S3 through GitHub Actions (`.github/workflows/deploy.yml`). To deploy manually:

```bash
cd shui-frontend
npm run build
aws s3 sync dist/ s3://project-shui-sughra --delete
```
