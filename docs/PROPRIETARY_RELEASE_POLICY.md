# Proprietary PrintSwift release policy

## Required protections
- Proprietary original code: see the root [LICENSE](../LICENSE). No permission to copy, modify, redistribute or resell without written authorization.
- Third-party components: retain the original MIT/Apache-2.0/other notices and license rights; audit the complete dependency tree before delivery.
- Treat original icons/artwork as proprietary **only when rights to those assets are confirmed**.
- Do not publish a signed installer before completing the release checklist and testing.
- The public GitHub repository is **visible and forkable under GitHub platform terms**. If the owner wants source secrecy, switch repository visibility to **private** in GitHub Settings → General → Danger Zone → Change repository visibility. A legal notice alone cannot prevent people from seeing/downloading a public repository.
- This repository currently holds a browser preview and documentation, not the complete validated native program. Do not present it as an installed or certified POS.

## License enforcement engineering
A root LICENSE file establishes usage terms; it does not technically enforce them.

1. Remove the legacy embedded activation secret from all distributable builds and tools.
2. Use a cryptographic signature model such as Ed25519: issuer keeps the private signing key offline, app embeds only the public verification key.
3. Bind signed entitlements to the authorized shop/devices/seat counts with clear reissue policy and clock rollback defenses appropriate to an offline 30-day trial.
4. On expiry, display the activation screen and block write features consistently, without damaging users' underlying data. Retain lawful access to export/backup data.
5. Keep the 1,000 randomly generated 24-character license inventory codes **private**; those codes alone are not secure signed entitlements.
6. Test licensing on clean Windows installs, expired trial, device changes, time manipulation, backup restore, offline multi-PC operation and refund/deactivation processes.
7. For five-PC operation, license terminals and single-writer LAN server as a single shop deployment; never rely on a shared SQLite file on a network drive.

**Before release:** Have a lawyer review the governing license/EULA for the intended jurisdictions, and keep a software bill of materials plus third-party notices.
