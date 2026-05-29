# Auth Sync Check — Coderun

Last updated: develop branch

## Backend Auth Endpoints

Base URL: `http://localhost:8000/api/v1` (dev) / `NEXT_PUBLIC_API_URL` (prod)

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/auth/register` | POST | No | Register new user |
| `/auth/login` | POST | No | Login (OAuth2 form-data) |
| `/auth/refresh` | POST | No | Refresh access token |
| `/auth/me` | GET | Bearer | Get current user profile |
| `/auth/logout` | POST | Bearer | Logout (blacklist token) |
| `/auth/fcm-token` | POST | Bearer | Register FCM push token |

## Register Payload

Backend `UserCreate` schema:
```json
{
  "email": "user@example.com",
  "username": "user_name",
  "password": "Password1"
}
```

**Supported fields:** `email`, `username`, `password`  
**NOT supported:** `full_name`, `name`, `display_name`  
**Password rules:** min 8 chars, at least 1 uppercase, at least 1 digit  
**Username rules:** 3–30 chars, alphanumeric + underscore only

## Login Payload

Backend uses `OAuth2PasswordRequestForm` — must send `application/x-www-form-urlencoded`:
```
username=user@example.com&password=Password1
```
Note: the field is named `username` but the value is the email address.

## Token Response

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

## User Response (`/auth/me`, `/auth/register`)

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "user_name",
  "xp": 0,
  "level": 1,
  "streak": 0,
  "last_active_date": null,
  "is_active": true,
  "is_verified": false,
  "is_superuser": false,
  "created_at": "2026-01-01T00:00:00"
}
```

## Web Auth Contract

- **Login:** sends `URLSearchParams` with `username=<email>&password=<password>` (form-encoded)
- **Register:** sends JSON `{ email, username, password }` — no full_name
- **Token storage:** `js-cookie` — access token (30 min), refresh token (7 days)
- **Auth header:** `Authorization: Bearer <access_token>` via axios interceptor
- **Redirect after login:** `/` (dashboard)
- **Redirect after register:** `/` (dashboard, via auto-login)
- **Forgot password:** safe placeholder page — no backend call

## Mobile Auth Contract

- **Login:** sends `FormData` with `username=<email>&password=<password>` (form-encoded via Dio)
- **Register:** sends JSON `{ email, username, password }` — no full_name
- **Token storage:** `flutter_secure_storage` — `access_token`, `refresh_token`, `is_logged_in`
- **Auth header:** `Authorization: Bearer <access_token>` via Dio interceptor
- **Redirect after login:** `/home` (via GoRouter redirect on `AuthState.authenticated`)
- **Redirect after register:** auto-login then `/home`
- **Forgot password:** safe placeholder screen — no backend call, button disabled

## Web ↔ Mobile Payload Sync

| Field | Web | Mobile | Backend |
|---|---|---|---|
| Login username field | `username=<email>` | `username=<email>` | `OAuth2PasswordRequestForm.username` |
| Login password field | `password=<password>` | `password=<password>` | `OAuth2PasswordRequestForm.password` |
| Register email | `email` | `email` | `email` |
| Register username | `username` | `username` | `username` |
| Register password | `password` | `password` | `password` |
| Register full_name | ❌ not sent | ❌ not sent | ❌ not supported |
| Token key (access) | cookie `coderun_access_token` | secure storage `access_token` | `access_token` |
| Token key (refresh) | cookie `coderun_refresh_token` | secure storage `refresh_token` | `refresh_token` |

## Error Handling

- Backend returns `{ "detail": "..." }` for 4xx errors
- Web: axios interceptor catches errors, auth-store surfaces message
- Mobile: `ApiException.fromDioError` parses detail field, `AuthState.error(message)` surfaces it

## Forgot Password Limitation

Backend does **not** have a `/auth/forgot-password` endpoint.  
Both web and mobile show a safe placeholder:
- Web: `/forgot-password` page with disabled form and info message
- Mobile: `/forgot-password` screen with disabled form and info message

## Admin Panel

- Backend: `/api/v1/admin/*` — all endpoints protected by `get_current_superuser`
- Web: `/admin` route — sidebar link visible only when `user.isSuperuser === true`
- Mobile: no admin panel (web-only feature)

## Required DB Commands (after fresh setup)

```bash
cd backend
alembic upgrade head
python -m app.core.seed  # seed course data
```
