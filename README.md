# NeuroCat Lab Planner

NeuroCat is a lightweight Progressive Web App for organizing study, shared plans, and cozy downtime. It combines practical planning tools, shared backlog screens, capsule-style random pickers, and an animated pixel-art cat.

## Features

- To-do list with categories
- Deadline tracker
- Reading list
- Experiment checklist
- Local progress and mood meter
- Animated lab cat with feeding and petting interactions
- Selectable pixel-art scenes
- Home screen with NeuroCat strolling through selectable scenes
- Home cinema backlog for movies and series with a capsule picker
- Full monthly treat and takeout calendar
- Shared date idea backlog with a capsule picker
- Optional Firebase Firestore sync for two-person remote use
- Offline-capable PWA behavior through a service worker

## Local Development

Run a local static server from the project folder:

```powershell
python -m http.server 5173
```

Open:

```text
http://localhost:5173
```

## GitHub Pages

This project can be hosted directly with GitHub Pages because it is a static site.

Recommended Pages settings:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

Once deployed, the site should be available at:

```text
https://adjgonzalez.github.io/NeuroCat/
```

## iPhone Installation

On iPhone, open the deployed site in Safari:

1. Tap Share.
2. Tap Add to Home Screen.
3. Open NeuroCat from the Home Screen.

Planner data is stored locally until Firebase is configured. After Firebase is configured, the shared planner state syncs through Firestore.

## Remote Sync

NeuroCat can sync between two phones with Firebase Firestore.

1. Create a Firebase project at `https://console.firebase.google.com/`.
2. Add a Web app to the Firebase project.
3. Add the Firebase config values as GitHub repository secrets.
4. Create a Firestore database.
5. Publish Firestore rules for the shared NeuroCat document.

Required GitHub repository secrets:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

The committed `firebase-config.js` intentionally contains blank placeholders. During GitHub Pages deployment, `.github/workflows/pages.yml` writes the real config from repository secrets into the deployed artifact.

Example Firestore rules for a simple shared two-person app:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /neurocat/shared-planner {
      allow read, write: if true;
    }
  }
}
```

These rules make the shared planner document writable by anyone who knows the site URL. For private access, add Firebase Authentication and tighten the rules before sharing broadly.

## Adding Scenes

To add another cat scene:

1. Add an option in `index.html` inside `#sceneSelect`.
2. Add the scene id to the `scenes` array in `app.js`.
3. Add matching CSS using `.cat-panel[data-scene="your-id"]`.

Current scenes:

- Night park
- City walk
- Campus path
