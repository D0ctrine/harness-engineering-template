# Authentication Flow

## Scope

The PWA lets a visitor write today's meditation before login. The browser keeps a local draft under `meditation_draft_<YYYY-MM-DD>` while the server remains the source of truth for authenticated saves.

## Frontend Flow

1. The note editor writes every body change to local storage.
2. The save button first persists the local draft.
3. If `/me` reports no authenticated session, the UI opens the SSO login modal and marks the draft as pending server save.
4. After OAuth redirects back to `/app`, the Auth Context reloads `/me`.
5. If the session needs onboarding, the onboarding modal collects name, age, and church details.
6. After onboarding or an existing-user login, the pending draft is posted to `/meditation`.
7. On successful server save, the local draft and pending-save marker are cleared.

## Backend Flow

The Worker exposes these endpoints under the configured API prefix:

- `GET /auth/login?provider=google|kakao|naver`
- `GET /auth/callback`
- `GET /me`
- `POST /signup`
- `POST /meditation`

`/auth/login` stores a signed OAuth state cookie and redirects to the provider. `/auth/callback` exchanges the OAuth code for provider user info, then either sets a session cookie for an existing user or a pending-signup cookie for onboarding. Both cookies are httpOnly JWTs signed with `JWT_SECRET`.

`/signup` accepts only a valid pending-signup cookie. `POST /meditation` accepts only a valid session cookie; it never trusts frontend auth state.

## Persistence

The Worker repository expects a Cloudflare D1 binding named `DB`. The baseline schema is in `apps/api/migrations/0001_auth_and_meditation.sql` and contains:

- `users`
- `meditations`

The repository also runs `CREATE TABLE IF NOT EXISTS` guards so local and preview environments fail less abruptly while the D1 migration workflow is being finalized.

## Runtime Configuration

Set these values in local `.env` and Cloudflare environment/secrets:

- `WEB_APP_BASE_URL`
- `API_PUBLIC_BASE_URL`
- `JWT_SECRET`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `KAKAO_OAUTH_CLIENT_ID`
- `KAKAO_OAUTH_CLIENT_SECRET`
- `NAVER_OAUTH_CLIENT_ID`
- `NAVER_OAUTH_CLIENT_SECRET`

Register OAuth redirect URIs as:

- `<API_PUBLIC_BASE_URL>/auth/callback`

For local development with the default sample env, that is `http://localhost:4000/api/auth/callback`.
