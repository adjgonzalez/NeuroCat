# NeuroCat Lab Planner

A small cat-themed lab planner for neuroscience study, deadlines, readings, and experiment checklists.

## Run on your computer

```powershell
python -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## Run on an iPhone

iPhones run native apps as iOS app bundles, usually distributed as `.ipa` files through the App Store, TestFlight, or direct developer tools.

This project is a Progressive Web App instead. That means she can run it on an iPhone through Safari:

1. Put the files online with GitHub Pages, Netlify, Vercel, or another static web host.
2. Open the site in Safari on her iPhone.
3. Tap Share.
4. Tap Add to Home Screen.

After that, NeuroCat opens from her Home Screen like a regular app and stores planner data on the phone.

## Native iPhone option

If you want a true `.ipa` later, wrap this app with Capacitor or rebuild it in SwiftUI. The PWA version is the easiest first version because it does not need Xcode, an Apple Developer account, App Store review, or TestFlight.

## Add More Cat Scenes

Scene choices live in two places:

1. Add an option in `index.html` inside `#sceneSelect`.
2. Add the scene id to the `scenes` array in `app.js`.
3. Add matching CSS using `.cat-panel[data-scene="your-id"]`.

The current scenes are night park, city walk, and campus path.

## Lab Cat Reactions

The cat reacts to planner actions, feeding, and petting. A few pets in a row are fine, but repeated petting makes the cat annoyed and then angry.
