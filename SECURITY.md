# Security

## Required Runtime Setup

This app reads Firebase config from `REACT_APP_FIREBASE_*` environment variables. Add the same keys as GitHub Actions repository secrets before deploying with GitHub Pages.

Admin access is controlled by Firebase Auth plus an explicit admin grant. The preferred option is a Firebase Auth custom claim. Set `admin: true` on trusted admin users with the Firebase Admin SDK:

```js
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

After changing a claim, the user must sign out and sign in again so the token refreshes.

As an alternative, create a Firestore document at `admins/{uid}` for the trusted Firebase Auth user. Firestore rules treat either `request.auth.token.admin == true` or an existing `admins/{uid}` document as admin access.

`REACT_APP_ADMIN_EMAILS` is only a route-guard convenience for the React app and must be added as a GitHub Actions secret if you want those emails recognized in the deployed build. Protected Firestore reads and writes still require the custom claim or the `admins/{uid}` document. For local development only, `admin@gmail.com` is also accepted by the React route guard.

## Firestore Rules

Deploy rules after reviewing changes:

```sh
firebase deploy --only firestore:rules
```

The current rules:

- Require a Firebase admin grant for admin collections and writes: either `request.auth.token.admin == true` or an `admins/{uid}` document.
- Allow public reads only for published blogs, projects, and icons.
- Validate comment and reaction payload shape, ownership, timestamps, and maximum sizes.
- Only allow public blog view tracking to increment `views` by one and update `lastViewedAt`.

## CI/CD

GitHub Actions now runs tests, build, production dependency audit, CodeQL analysis, Dependabot updates, and GitHub Pages deployment with least-privilege workflow permissions.
