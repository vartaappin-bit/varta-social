# Varta Basic Template

Static HTML + Firebase (Auth + Firestore). No build tools needed.

## Enable in Firebase
1. Authentication → Get started → Google provider → Enable.
2. Firestore Database → Create database → Start in **production mode**.
3. Rules → use the snippet below and publish.

```
// Allow only signed-in users to create posts. Everyone can read feed.
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.text is string && request.resource.data.text.size() <= 240;
    }
  }
}
```

## Run
Just host these files (GitHub Pages works). Open `index.html`.
