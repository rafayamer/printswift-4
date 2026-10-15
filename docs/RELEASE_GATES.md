# Release blockers — do not mark a v1.0 product complete yet

- [x] Standalone browser preview in GitHub Codespaces (localStorage demo; no real backend)
- [x] Keyboard routes: F1, F2, F4, F6, Ctrl+Enter; Tab/Shift+Tab via native controls
- [x] Promise dates and overdue copyable message in preview
- [ ] Import complete source tree from native RC3 ZIP into this public repository **after reviewing embedded secrets**
- [ ] Native Rust/Tauri build and SQLite end-to-end testing, including invoices, refunds, payments, and stock
- [ ] Actual 5-terminal single-writer LAN server plus authenticated native clients; shared SQLite network file NOT supported
- [ ] Signed Ed25519/offline license entitlements, 30-day trial hardening, issuer back office; 1000 private license inventory codes not released in repository
- [ ] FBR licensed-integrator sandbox tests, production submission and accepted receipt audit
- [ ] Windows MSI/NSIS build, code signing and SmartScreen reputation management
- [ ] 58/80 mm printers, customer barcode devices, A4 printers and backups tested on real hardware
- [ ] Licensed-account staff roles, audit logs, restricted refunds
- [ ] Real-shop pilot run and confirmed restore test on clean hardware

**Security:** Never commit signing private keys, FBR tokens, machine identifiers, customer databases, 1000 license codes or the legacy hard-coded signing secret.
