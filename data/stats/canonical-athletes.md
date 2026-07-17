# Canonical Athletes — Name Resolution Table

**The single source of truth for athlete_id ↔ display-name ↔ variant resolution.** Every athlete_id used anywhere in `skills/weekly-stats-cards/` MUST exist here first. The parser (`scripts/parse-stats.mjs`) reads this file, matches raw-paste names against the `variants` list, and resolves to the canonical id. Missing variants → `PENDING-MATCH` → parser exits 1 → Kyron reconciles.

**Populated during:** the first ingest run of the season (post-August walkthrough). Grows week-over-week as new variants surface in Margin's raw pastes.

**Managed athletes (`_management-clients/`)** and **training clients (`_training-clients/`)** both land here — the folder path is captured in `hooks_folder` so downstream scripts know where to write the per-athlete season rollup.

---

## Schema (one YAML block per athlete, inside the fenced block below)

```yaml
- id: kaydon-finley                          # kebab-case, unique across the file
  canonical_name: Kaydon Finley              # display name — this is what shows on cards
  variants: [Kaydon Finley, K. Finley]       # every spelling Margin has ever used or might use
  school: Aledo HS                           # long-form school name for cards
  school_short: Aledo                        # short-form for tight card layouts / leaderboard rows
  position: WR                               # primary position — WR / QB / RB / DB / LB / OL / DL / etc.
  class_year: 2027                           # HS graduation year (helps with age/consent logic)
  status: active                             # active | committed | signed | inactive
  committed_to: null                         # e.g. "Baylor" once committed; null while open
  hooks_folder: null                         # e.g. "_management-clients/finley-kaydon" — null if not yet foldered
  consent_public_stats: true                 # required for any card to generate
  guardian_signed_release_on_file: true      # REQUIRED for minors (_training-clients/) — default deny
```

### Status values

| status | Meaning |
|---|---|
| `active` | Playing HS/college/pro, cards generate every week they play |
| `committed` | Has verbally committed to a college — cards can note the commitment |
| `signed` | Has signed a National Letter of Intent or pro contract — same as committed for card logic |
| `inactive` | Injured for season, graduated out, moved on — no cards generate |

### Consent flags (hard rules — see `skills/weekly-stats-cards/SKILL.md` §Consent Check)

- `_management-clients/` (adult athletes) — need `consent_public_stats: true` to generate a card. If false or missing → card lands in `output/cards/YYYY-WW/_pending-consent/`.
- `_training-clients/` (minors by default) — need **both** `consent_public_stats: true` **and** `guardian_signed_release_on_file: true`. If either is missing → no card generates at all, flagged in the weekly brief.

---

## Athletes (populate below — one YAML entry per athlete)

```yaml
# ─────────────────────────────────────────────────────────────
# Management clients (signed adult athletes — NFL + Power 4)
# ─────────────────────────────────────────────────────────────

# - id: example-athlete
#   canonical_name: Example Athlete
#   variants: [Example Athlete, E. Athlete]
#   school: Example University
#   school_short: Example U
#   position: WR
#   class_year: 2024
#   status: signed
#   committed_to: null
#   hooks_folder: _management-clients/athlete-example
#   consent_public_stats: true
#   guardian_signed_release_on_file: true


# ─────────────────────────────────────────────────────────────
# Training clients (HS + youth — minors by default)
# ─────────────────────────────────────────────────────────────

# - id: kaydon-finley
#   canonical_name: Kaydon Finley
#   variants: [Kaydon Finley, K. Finley]
#   school: Aledo HS
#   school_short: Aledo
#   position: WR
#   class_year: 2027
#   status: active
#   committed_to: null
#   hooks_folder: _training-clients/finley-kaydon
#   consent_public_stats: false
#   guardian_signed_release_on_file: false
```

---

## Reconciliation Log (append every time a new variant is added)

| Date | Athlete ID | Change | Reason |
|---|---|---|---|
|  |  |  |  |

---

*Every entry in this file is a decision. Every variant added is a case Margin's audience already saw drift on. The file grows with the season; the drift shrinks with the file.*
