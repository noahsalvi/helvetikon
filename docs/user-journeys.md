# User Journeys

## 1) Search and open a word
1. User visits `/`.
2. UI search component queries `GET /api/words/search/:searchQuery` after debounce.
3. User selects a result.
4. App navigates to `/:dialect/:word`.
5. Word detail page loads from `GET /api/words/:dialect/:word`.

## 2) Browse all words
1. User visits `/worte`.
2. Page loads `GET /api/words`.
3. User clicks a word link.
4. App navigates to the word detail page.

## 3) Register and verify account
1. User opens `/auth/registrieren` and submits form.
2. Frontend calls `POST /api/auth/register`.
3. Backend creates user (unverified) and sends verification email.
4. User opens email link to `/verifizieren?token=...`.
5. Callback route calls `GET /api/auth/verify?token=...`, sets login cookie, redirects home.

## 4) Log in and log out
1. User submits `/auth/anmelden`.
2. Frontend calls `POST /api/auth/login`.
3. Backend validates password + `verified`, sets cookies.
4. User logs out from profile/home.
5. Frontend calls `POST /api/auth/logout` and clears auth cookie.

## 5) Add a new word (authenticated)
1. User opens `/wort-hinzufügen` (redirects to login if unauthenticated).
2. Multi-step form checks availability via `GET /api/words/available/:dialect/:word`.
3. Final step submits `POST /api/words`.
4. User is redirected to the newly created word page.

## 6) Add interpretation or audio sample (authenticated)
Interpretation:
1. User opens `/:dialect/:word/interpretation-hinzufügen`.
2. Form submits `POST /api/words/:wordId/interpretations`.

Audio sample:
1. User opens `/:dialect/:word/hörbeispiel-hinzufügen`.
2. Browser records/uploads blob.
3. Frontend submits `POST /api/words/:wordId/audio-samples`.
4. Backend stores file and converts blob to mp3.

## 7) Vote or edit interpretations (authenticated)
Vote:
1. On word page, user votes on interpretation.
2. Frontend calls `PUT /api/interpretations/:interpretationId/vote`.

Edit:
1. User opens edit page `/:dialect/:word/interpretationen/:interpretationId/bearbeiten`.
2. Page loads `GET /api/interpretations/:interpretationId`.
3. Save triggers `PUT /api/interpretations/:interpretationId`.
4. Backend enforces owner-only edits.
