# PrintSwift 4 — offline printing POS (development)

PrintSwift is an offline-first printing-shop point-of-sale and production-management application, built in **Tauri 2 + Svelte 5 + Rust + SQLite**.

> **Status: DEVELOPMENT / NOT READY FOR COMMERCIAL RELEASE.** This repository is being initialized for Codespaces. The full native RC3 source is distributed separately as an archive until imported and native builds pass; do not assume the public repository is a production installer.

## Design and operation

- Large-format and piece-based line items; width × height × quantity × rate; dealer-specific rates.
- Drag/drop artwork with filename-based material and customer matching.
- Delivery date/time in POS; production stages and manually copied WhatsApp messages.
- Dark cinematic glass design with light/dark controls, keyboard shortcuts and F1 quick reference.
- Local SQLite orders, inventory, payments and backup in the native source.

## Try in Codespaces

Click **Code → Codespaces → Create codespace**. Run:

```bash
python3 -m http.server 8000
```

Open forwarded port **8000** and choose `preview.html`. This is a browser demonstration, not the native Rust backend.

## Import the native source

Extract the **PrintSwift 1.0 RC3 Source** archive provided alongside this repository. Upload its contents into this repository (retaining the directory structure), or from a local terminal run:

```bash
git clone https://github.com/rafayamer/printswift-4.git
# Copy the extracted RC3 files into this directory, preserving the existing .git directory.
git add .
git commit -m "Import native PrintSwift RC3"
git push
```

Then run `pnpm install`, `pnpm check`, `pnpm build`, and perform the native Windows Tauri build. **Do not overwrite this repo's `README.md` without preserving this release warning.**

## Security and regulatory release blockers

- Existing native source has legacy embedded-secret licensing. **Replace with public-key signature verification before commercial distribution.**
- The requested 1,000 codes are held in a separate private inventory and are **not activated** by the app yet. Do not commit license codes, private signing keys, customer records or FBR tokens.
- Five-computer LAN operation needs a central single-writer shop server and authenticated terminal API. **Do not share a live SQLite file over a network drive.**
- FBR live integration requires applicable registration, integrator authorization, test scenarios, accepted invoice acknowledgments and production credentials. Tax settings alone do not provide compliance.
- Tested Windows installer, signed updates, cash drawer/receipt printer validation, error handling, restores, refunds and ledger reconciliation remain release gates.

Do not create a public GitHub Release or invoice claiming FBR verification until the release checklist has passed.
