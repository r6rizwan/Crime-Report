# MUST_FIX (Demo Closure)

Scope freeze rule: no new features until this list is complete.
Structure freeze rule: frontend/backend folder grouping is finalized for demo; avoid further structural refactors before handoff.

## 1) Auth Completion Paths (User/Investigator)
- Ensure incomplete accounts are routed correctly from `/login`:
  - `register exists + verified=false + no login` -> OTP verify screen
  - `register exists + verified=true + no login` -> set password screen
  - `investigator exists + no login` -> investigator email verify OTP -> set password
- Acceptance:
  - No 401 dead-end for these partial states
  - Same email retries work consistently

## 2) Dev OTP Mode (Local Testing)
- Add env-based local mode:
  - `DEV_MODE=true` logs OTP in backend
  - optional `DEV_EXPOSE_OTP_IN_RESPONSE=true` for local-only fast tests
- Must be hard-disabled in production.
- Acceptance:
  - Local testing works with one inbox
  - Production behavior unchanged

## 3) Remove Native Browser Prompts
- Replace any remaining `window.confirm`/`prompt` with existing custom dialog UI.
- Current known location: super-admin admin delete confirmation.
- Acceptance:
  - No native confirm/prompt used in app flows

## 4) Environment Contract + README Accuracy
- Finalize backend `.env.example` keys and remove stale keys from docs.
- Document required values clearly for server deployment.
- Acceptance:
  - Fresh clone can run with documented steps only

## 5) End-to-End Role Smoke Test (Blocking)
- Run and record one successful flow each:
  - User: register -> verify -> set password -> login -> file complaint
  - Admin: login -> view complaints -> assign investigator
  - Investigator: first login -> verify OTP -> set password -> update case status
- Acceptance:
  - No console/API errors in these core flows

## 6) Password Recovery Smoke Test (Blocking)
- Validate forgot-password for active accounts.
- Ensure reset token flow works and old password no longer works.
- Acceptance:
  - Reset flow succeeds once per token and invalid/expired token is rejected

## 7) Security/Config Production Gate
- Verify before handoff:
  - CORS from env only
  - no dev flags enabled
  - strong JWT/super-admin secrets set
- Acceptance:
  - Server can start with production env and auth works

## 8) Demo Data + Credential Sheet
- Prepare stable demo accounts (User/Admin/Investigator/SuperAdmin) and one sample complaint lifecycle.
- Keep in a local `DEMO_CREDENTIALS.local.md` (not committed if sensitive).
- Acceptance:
  - You can demo all roles without guessing credentials
