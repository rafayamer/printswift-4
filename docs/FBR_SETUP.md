# FBR setup checklist for shop owners — integration not yet certified

This document is guidance, not legal or tax advice, and does **not** claim that PrintSwift currently transmits FBR invoices.

1. Establish the shop's legal status and which FBR POS or digital invoicing obligations apply.
2. Obtain or confirm registration identifiers, required taxpayer and business details through official FBR processes.
3. Review official documentation: https://www.fbr.gov.pk/technical-documentation-di/163085/173959 and https://www.fbr.gov.pk/pos-legal-provisions/163085/163086.
4. Choose an **FBR licensed integrator** when required. Official information: https://www.fbr.gov.pk/faqs/173967/173969. FBR's FAQ says PRAL may act as a free integrator for eligible taxpayers.
5. Secure sandbox credentials and endpoint information directly from FBR/authorized integrator; never paste API tokens into GitHub.
6. Map invoice types, customer identifiers, taxable amounts, tax rates, exempt items and credit notes according to the current API specifications.
7. Execute the integrator's required sandbox scenarios. Check rejected and duplicate invoices, connectivity loss, retries and record reconciliation.
8. Obtain production token/authorization only after passing sandbox requirements.
9. Mark invoices **verified** only after an accepted live acknowledgment and save the server response as an audit record. For disconnected/failed submissions, display pending or rejected status and apply only legally permitted processing procedures.
10. Confirm with a qualified adviser whether the software's tax setting is permitted to be disabled for this particular business.

**Status:** Not integrated in this browser preview. A full implementation requires authenticated submission, an outbox, response persistence, retry rules, and production certification.
