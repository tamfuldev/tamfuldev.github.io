# Security

## Required Runtime Setup

This app reads Firebase config from `REACT_APP_FIREBASE_*` environment variables. Add the same keys as GitHub Actions repository secrets before deploying with GitHub Pages.

Admin access is controlled by Firebase Auth. The built-in admin email is `admin@gmail.com` in every environment, including production.

For additional production admins, the preferred option is a Firebase Auth custom claim. Set `admin: true` on trusted admin users with the Firebase Admin SDK:

```js
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

After changing a claim, the user must sign out and sign in again so the token refreshes.

As an alternative, create a Firestore document at `admins/{uid}` for the trusted Firebase Auth user. Firestore rules treat `admin@gmail.com`, `request.auth.token.admin == true`, or an existing `admins/{uid}` document as admin access.

`REACT_APP_ADMIN_EMAILS` is an optional route-guard convenience for adding more admin emails to the React app and must be added as a GitHub Actions secret if you want those extra emails recognized in the deployed build. Protected Firestore reads and writes for extra emails still require the custom claim or the `admins/{uid}` document.

## Firestore Rules

Deploy rules after reviewing changes:

```sh
firebase deploy --only firestore:rules
```

The current rules:

- Require a Firebase admin grant for admin collections and writes: `admin@gmail.com`, `request.auth.token.admin == true`, or an `admins/{uid}` document.
- Allow public reads only for published blogs, projects, and icons.
- Validate comment and reaction payload shape, ownership, timestamps, and maximum sizes.
- Only allow public blog view tracking to increment `views` by one and update `lastViewedAt`.

## CI/CD

GitHub Actions now runs tests, build, production dependency audit, CodeQL analysis, Dependabot updates, and GitHub Pages deployment with least-privilege workflow permissions.
