# contracts/

Legal instruments governing the TOJ ↔ Margin commercial arrangement.

**All documents in this folder are DRAFTS pending attorney review.** Nothing here is executed until:
1. Both principals have read the draft in full
2. Each principal's attorney has reviewed
3. Bracketed `[REVIEW]` items are resolved
4. Both parties sign (DocuSign or wet ink)

---

## Index

| Document | Version | Status | Purpose |
|---|---|---|---|
| `toj-margin-master-operating-agreement.md` | v0.1 | 🟡 Draft · attorney review required | The master commercial + operating agreement between TOJ and Margin Hooks. Codifies the 10% roster revenue share, IP ownership, term, and dispute resolution. |
| `toj-margin-master-operating-agreement.html` | v0.1 | 🟡 Draft (rendered) | Print/DocuSign-ready HTML version of the same agreement. Generated from the .md source. |

---

## Attorney-review workflow

1. **Kyron's attorney** reviews from TOJ's perspective — focus on revenue-share enforcement, audit rights, IP retention on the Operating Brain methodology.
2. **Margin's attorney** reviews from Margin's perspective — focus on IP retention on coaching craft + brand, termination triggers, non-compete boundary, tail cap on revenue share.
3. Both attorneys reconcile bracketed `[REVIEW]` items.
4. Both attorneys sign off on final language.
5. Principals execute via DocuSign (per the existing `docusign-setup.md` pattern used for client contracts).

---

## Why this is in the operating-brain repo

The operating brain (`hooks-os`) codifies the WHAT and HOW of the business. The contracts codify the commercial WHO — who owns what, who gets paid what, who owes what to whom. The contract references the skills and infrastructure by name so the commercial terms and the operational terms stay in sync. If a skill spec changes materially (new revenue-share source tag, new package tier), the contract needs to be updated in the same session.

**The contract is not a static document — it is the commercial layer of the operating brain, and it evolves with the brain.**

---

## Not in this folder

- **Client contracts** — those live wherever the client-facing kit lives (typically `output/contracts/` per client, or in an external DocuSign template library). This folder is for TOJ ↔ Margin internal arrangements only.
- **Trainer Blueprint agreements** — separate commercial track. Governed by its own template outside the master operating agreement.
- **Employee or contractor agreements** — different domain entirely.

---

*Legal instruments are the commercial layer of the operating brain. Every clause references a skill or infrastructure component so terms and operations never drift.*
