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
- Treat and takeout calendar
- Shared date idea backlog with a capsule picker
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

Planner data is stored locally in the browser on the device.

## Adding Scenes

To add another cat scene:

1. Add an option in `index.html` inside `#sceneSelect`.
2. Add the scene id to the `scenes` array in `app.js`.
3. Add matching CSS using `.cat-panel[data-scene="your-id"]`.

Current scenes:

- Night park
- City walk
- Campus path
