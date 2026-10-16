# Invoice regression plan

The invoice renderer is a **development preview**, not an FBR-compliant tax system.

Run from the repository root in GitHub Codespaces:

```sh
node tests/invoice.test.cjs
```

The committed smoke checks cover A4 and 80 mm output, exact displayed totals, the FBR warning, and invalid advance/quantity rejection. Additional required tests: HTML escaping, invalid dates, unsupported paper, popup blockers, printer margins, and independent comparison with saved orders.

**CI not verified:** workflow-file creation was rejected during this iteration. This branch must not be merged or released on the strength of manual checks alone.
