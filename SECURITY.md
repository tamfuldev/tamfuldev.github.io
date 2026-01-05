# Security

## Required Runtime Setup

This app reads Firebase config from `REACT_APP_FIREBASE_*` environment variables. Add the same keys as GitHub Actions repository secrets before deploying with GitHub Pages.

Admin access is controlled by a Firebase Auth custom claim, not by a hard-coded email. Set `admin: true` on trusted admin users with the Firebase Admin SDK:

```js
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

After changing a claim, the user must sign out and sign in again so the token refreshes.

For local development only, `admin@gmail.com` and emails in `REACT_APP_ADMIN_EMAILS` can pass the React route guard. Production builds still require the Firebase custom claim, and Firestore rules always require `request.auth.token.admin == true` for protected writes.

## Firestore Rules

Deploy rules after reviewing changes:

```sh
firebase deploy --only firestore:rules
```

The current rules:

- Require `request.auth.token.admin == true` for admin collections and writes.
- Allow public reads only for published blogs, projects, and icons.
- Validate comment and reaction payload shape, ownership, timestamps, and maximum sizes.
- Only allow public blog view tracking to increment `views` by one and update `lastViewedAt`.

## CI/CD

GitHub Actions now runs tests, build, production dependency audit, CodeQL analysis, Dependabot updates, and GitHub Pages deployment with least-privilege workflow permissions.
