# Atharva Badgujar — Beneath the Surface

A cinematic portfolio with a real-time Three.js sculpture, scroll-driven camera journey, looping project collections, and direct section navigation.

## Deploy to Vercel

1. In Vercel, choose **Add New → Project** and import `Art200507/Atharva_Badgujar_PW`.
2. Use branch **main** and leave **Root Directory** at the repository root (`./`).
3. Set **Framework Preset** to **Other**. The included `vercel.json` configures an empty build command and output directory **dist**.
4. No install command, environment variables, or backend setup is required. Click **Deploy**.

## Local preview

Run `python3 -m http.server 3000 --directory dist`, then open `http://localhost:3000`.

## Edit the site

- `dist/portfolio-data.js`: project and experience descriptions.
- `dist/index.html`: page structure and contact email.
- `dist/app.js`: navigation, cards, and camera choreography.
- `dist/style.css` and `dist/gallery.css`: layout and styling.
- `dist/hero-hologram.js`, `dist/exhibit-finish.js`, and `dist/shaft-scene.js`: Three.js scene components.
- `dist/adaptive-quality.js`: adaptive rendering resolution.

All browser assets are included in `dist`. Three.js is bundled locally under its MIT license (`dist/vendor/THREE-LICENSE.txt`). Google Fonts use system font fallbacks.

## Résumé

The downloadable PDF is a draft based on the supplied portfolio entries; education details are pending. Regenerate it with `python tools/build_resume.py` after installing ReportLab and DejaVu Sans.

## Verification

Navigation, carousel loops, keyboard controls, dialog behavior, geometry, and adaptive quality have passed automated simulations. The résumé PDF has been rendered and visually checked. Browser layout, GPU rendering, and real-device frame rates have not been verified in the authoring environment. See `DESIGN_REVIEW.md` for details.
