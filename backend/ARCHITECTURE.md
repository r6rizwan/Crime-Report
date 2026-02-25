# Backend Structure Guide

This backend is organized by **domain/module** (not by role folder).

## Why
- Keeps all complaint/case logic together.
- Avoids duplicating routes by role.
- Access control remains explicit in each route via middleware (`requireRole`, `requireSelfEmailOrRole`, etc.).

## Folder Map

### `controllers/auth`
- login, registration, passwords, super-admin auth/admin management

### `controllers/admin`
- admin-only dashboard stats

### `controllers/investigator`
- investigator onboarding and investigator management

### `controllers/user`
- profile and feedback

### `controllers/core`
- complaints, case files, case activity

### `routes/auth`
- auth endpoints and super-admin endpoints

### `routes/admin`
- admin dashboard endpoints

### `routes/investigator`
- investigator management and onboarding

### `routes/user`
- user profile/feedback endpoints

### `routes/core`
- complaint lifecycle, case files, case activity

## Important Note For New Developers
- “Admin endpoints” are not only inside `routes/admin`.
- Many admin-protected endpoints are in `routes/core` and `routes/investigator`, protected by middleware:
  - `requireRole(["Admin"])`
  - `requireRole(["Admin", ...])`

This is intentional and keeps feature modules cohesive.
