## Requirements for Converting GameMathMaster to a Fully Static Installable PWA Mobile App

### General Goals
- The app must be installable as a Progressive Web App (PWA) on mobile devices and desktops.
- The app must work fully offline after installation (no internet required for any feature).
- All assets, scripts, and data must be bundled and cached locally.
- The app must remain static (no server-side code, no external APIs).

### Technical Requirements
1. **Manifest File**
	- Create a `manifest.json` in `src/` with:
	  - App name, short name, description
	  - App icons (at least 192x192 and 512x512 PNG)
	  - Display mode: `standalone`
	  - Theme and background colors
	  - Start URL: `index.html`

2. **Service Worker**
	- Add a `service-worker.js` in `src/` to:
	  - Cache all static assets (`index.html`, `main.css`, `scripts.js`, icons, manifest)
	  - Serve cached assets when offline
	  - Use the Cache API for efficient asset management
	  - Handle updates gracefully (prompt user to refresh if new version is available)

3. **Offline Support**
	- Ensure all game logic, UI, and assets are available locally
	- No external requests after installation

4. **App Shell Architecture**
	- Structure the app so the UI loads instantly from cache
	- All game features must be accessible without network

5. **Bootstrap and Styling**
	- Continue using Bootstrap classes for layout and styling
	- Bundle Bootstrap CSS locally if not already

6. **No External Dependencies**
	- Remove or bundle any CDN or external resources
	- All fonts, images, and libraries must be local

7. **Install Prompt**
	- Add logic to prompt users to install the app (using PWA install events)

8. **Testing**
	- Test installation and offline usage on Android, iOS, and desktop browsers
	- Validate PWA compliance using Lighthouse or similar tools

### File Changes Needed
- `src/manifest.json`: New file
- `src/service-worker.js`: New file
- `src/index.html`: Link manifest, register service worker, add install prompt logic
- `src/main.css`, `src/scripts.js`: Ensure all assets are referenced locally

### Acceptance Criteria
- App installs and launches as a standalone mobile app
- All features work offline
- No network requests after installation
- Passes PWA audits (Lighthouse)
