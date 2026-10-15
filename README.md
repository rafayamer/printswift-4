# PrintSwift 4 — proprietary offline POS (development)

**Copyright © 2026 the lawful copyright holder(s) of PrintSwift. All rights reserved.**

> **PROPRIETARY SOFTWARE — NO UNAUTHORIZED COPYING, MODIFICATION, DISTRIBUTION OR RESALE.** Read [LICENSE](LICENSE), [EULA.md](EULA.md) and the [release protection policy](docs/PROPRIETARY_RELEASE_POLICY.md). Third-party dependencies preserve their separate open-source licenses.

> **DEVELOPMENT ONLY / NOT READY FOR COMMERCIAL RELEASE.** This public repository currently provides a Codespaces/browser UI workbench and release documents—not a native installable production application. The complete source is separately packaged as PrintSwift RC4 until safely imported, reviewed and tested. **Do not commit the unmodified native archive to this public repo:** its legacy licensing implementation still contains an embedded secret.

PrintSwift is designed as an offline-first printing-shop POS / production-management desktop application using **Tauri 2 + Svelte 5 + Rust + SQLite**.

## Browser preview in GitHub Codespaces

Choose **Code → Codespaces → Create codespace**. The devcontainer starts a local preview server on port 8000. Open the forwarded port and select `preview.html` (or manually run `python3 -m http.server 8000`).

The interactive preview includes:
- Width × height × quantity × rate for measured jobs; piece-based pricing
- Keyboard-first navigation, F1 help and tab sequencing
- Promised delivery date/time, rush priority and job-stage selection
- Manually copyable WhatsApp delay/status messages
- Compact dark glass design, optional light theme
- Local browser-only demo records; **not the native shop SQLite database**

## Native release roadmap

The separately delivered **PrintSwift 1.0 RC4 Proprietary Licensed Source ZIP** contains the latest native project with updated legal license files. Before moving that source into a public repository, eliminate any embedded license signing secrets, FBR tokens, customer records or licensing inventory, and audit proprietary artwork and dependency notices. For source secrecy, make this repository **private** in GitHub settings. GitHub's terms permit public-repository viewing/forking through the platform even where your proprietary license restricts other use.

The native development prerequisites are documented in the source archive. Native Windows builds, real printer testing, payments/inventory reconciliations, secure offline 30-day trial + signed license activation, and five-PC LAN access are **not yet certified or completed**.

## Business/release blockers

1. Signed license entitlement verification with publisher-only private signing key; keep the 1,000 inventory codes private.
2. Five-computer operation through an authenticated single-writer LAN service, **not** a shared SQLite network file.
3. Full FBR sandbox/live integration through the applicable official/licensed integrator, with real accepted acknowledgments. [Shop-owner FBR setup guidance](docs/FBR_SETUP.md).
4. Native installer, offline backup/restore, hardware, accounting, security and end-to-end testing.
5. Owner acceptance on the exact final version.

No user should be told an FBR invoice is verified until an actual accepted live acknowledgment is recorded. Do not publish a GitHub Release or sell this build as production-ready until [release gates](docs/RELEASE_GATES.md) have passed.
