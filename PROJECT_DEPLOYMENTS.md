# Project deployment review — 2026-11-16

## Published through the portfolio

The static previews below are copied from the public project repositories into `dist/projects`. They deploy with this portfolio; they do not require a new hosting project. Updates to the source repositories must be copied and verified here before publishing a new preview.

| Project | URL | What visitors get |
| --- | --- | --- |
| Crius07 | https://atharvabadgujar.vercel.app/projects/crius07/ | Project and installation site; the extension itself runs in Chrome |
| MindMirror | https://atharvabadgujar.vercel.app/projects/mindmirror/ | Standalone app preview; camera/MorphCast integration still needs real-browser verification |
| UB ACM Cookie Clicker | https://atharvabadgujar.vercel.app/projects/cookie-clicker/ | Playable workshop project |
| interChat | https://claude-interchat.vercel.app | Existing Vercel project site, updated from its Git repository |

Fourteen matching portfolio cards have GitHub links; hosted cards have separate destination links. The Personal Projects floor also has an All repositories directory covering 27 repositories, including six explicitly labeled private. No private repository content was published. Tailr, WN4SS, and gprop do not have a verified matching repository in this account; no URL was invented for them.

## Apps requiring configuration or further runtime verification

| Repository | Work completed | Remaining requirement |
| --- | --- | --- |
| BonVoyage | Removed tutorial Firebase project, added Firebase sign-in and owner rules, moved Gemini calls to an authenticated server endpoint; production build and mocked API tests pass | Configure own Firebase project, Google provider, authorized domain, deploy Firestore rules, set Maps restrictions and server-only Gemini key; verify complete sign-in/generate/save/reload flow |
| themiddleman | Authenticate protected APIs, derive identity server-side, redact private transaction fields, verify Stripe payment amount/currency/ownership/status, reject live Stripe keys, fail visibly without DB | Firebase/Storage setup, MySQL schema, Stripe test keys, ownership and redirect-flow tests, signed webhook reconciliation; not a real-money escrow service |
| FakeNews / VERIDICA | Input validation, server-only provider key, timeouts, missing-config health response, invalid-provider-response handling; build and API tests pass | Configure Perplexity, provider budget/rate limits, repair the broken stable production alias, then verify analysis/chat |
| AD / ADHD support | Bounded expiring history bound to server cookie, validated input, lazy provider setup, generic privacy-aware UI, crisis-support guidance; API tests pass with mocked retrieval/provider | Container hosting, Groq key, reviewed source documents and built Chroma index, provider limits, live retrieval/streaming tests |
| latency-report-pipeline | Operator authorization for publishing; scheduler opt-in; public dashboard read-only; frontend build and authorization tests pass | Long-running container host, persistent SQLite/audio storage, provider/storage/feed credentials; no publishing jobs were run |
| SchemaMorph | Unique temporary upload names, narrower file validation, same-origin default, removal of generated downloads; synthetic Flask API tests pass | Host the Flask app and built frontend from `Faculty-Excel-Converter`, set secret/configuration, verify full workbook workflow; web uploads are limited to 16 MB |
| InsightLens | Added missing Streamlit web dependency and isolated container recipe | Container or Streamlit host; build and browser-test the real Streamlit UI. Existing Vercel config refers to a missing React package |
| Proximity | Documented actual PHP/MySQL/mail dependencies and same-origin session requirements | PHP host, DB configuration/migrations, mail setup and auth/authorization tests. Existing university endpoint returned HTTP 503 |
| MindMirror / mindmirrorai | Removed browser Spotify client secret; canonical standalone preview handles SDK timeout and camera error cleanup | Rotate exposed Spotify secret; other extension-only OAuth modules still need PKCE migration; live camera and license/domain verification |

Vercel reported successful Git deployments for the updated BonVoyage, themiddleman, FakeNews, interChat and MindMirror repositories. This is build evidence, not evidence that external services work. Protected deployment URLs and broken stable aliases were not added as live demos.

## Source-only and duplicate repositories

- Quantum-Research, MobileVM, Recording, cicd-practical, AI-Assistant and the-latency-podcast are research, CLI, configuration, feed or documentation repositories; source links are provided.
- PersonalWebsite is the earlier portfolio; its existing public URL remains available in the repository directory.
- mindmirrorai duplicates MindMirror and has no root entry page; the portfolio uses the canonical MindMirror preview.
- faculty-analysis, Faculty-Analysis-Code, Valentine, Cohort, Cohort-Personal and Cohort-final are private; only access-controlled GitHub links are provided.

## Access blockers and verification limits

The Vercel connection could not authorize `gods-projects-0f75d2f3` (team not found). Existing Git integration can deploy repositories already connected, but this connection cannot create new projects, configure aliases or manage environment variables there. GitHub Pages creation also returned 403: resource not accessible by integration.

Configure secrets in the provider dashboard, not in chat or source code. The removed Spotify secret remains in Git history and must be rotated.

Verification includes production builds, provider-independent request tests, live HTTP checks, card-link DOM tests, carousel/navigation simulations and local asset checks. No browser/GPU tool was available, so visual appearance, camera permissions, authenticated provider workflows and real-device performance are not claimed as verified.
