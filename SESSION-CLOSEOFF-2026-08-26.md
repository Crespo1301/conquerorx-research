# Session Close-Off, 2026-08-26

Bookmark for the next session. Supersedes
`SESSION-CLOSEOFF-2026-08-25.md`.

## What shipped this session (2026-08-26)

Six more docs (32-37) plus the incident C1 resolution and a GitHub
release published as `v2026.08.25` covering the prior batch.

New docs pushed today:

| # | Doc | Tag |
|---|---|---|
| 32 | Trouble Call System deep-read | `r32-trouble-call-system-2026-08-26` |
| 33 | Terminal Setup deep-read | `r33-terminal-setup-2026-08-26` |
| 34 | Technical Setup deep-read | `r34-technical-setup-2026-08-26` |
| 35 | Economic Setup deep-read | `r35-economic-setup-2026-08-26` |
| 36 | MMS operator-facing config | `r36-mms-chm-read-2026-08-26` |
| 37 | Appendix + CHM coverage checkpoint | (pending) |

Plus:

- **Incident C1 (lanes 13/14) RESOLVED.** Daniel Martines's
  diagnosis captured in doc 13, Pattern A guidance updated with the
  confirmed physical mechanism (UTP cable routed under ball return
  motor, gradually worn through). Fix parts: SuperTouch #13 +
  5HD HUB + rerouted UTP cable. Ops follow-up owed to Jon Stoyer:
  reorder replacement spares.

## Milestone: full CHM coverage

**Every one of the 30 top-level CHM sections is now covered by the
numbered `.md` series.** See doc 37 for the full checklist.

The repo is now the exhaustive vendor-product reference we set out
to build. Every module a Kings operator, technician, or manager
would touch has a corresponding deep-read doc, plus cross-references
into the SQL schema, DLL family, Crystal Reports catalog, and MMS
service layer.

## Queue for the NEXT session

CHM coverage is done. Remaining work is Kings-visit-gated or is
optional enhancement.

### Kings-visit tasks (still need physical presence)

1. **Live REST probe** of WebBookingApi + FlexyBook APIs
   - Needs elevated PowerShell (Run as Administrator)
   - Runbook in [doc 17](17-api-surface.md), section "Live probe
     runbook"
   - Also needs an authenticated request path (JWT? Windows auth?
     API key?), sniff a real request from the web widget to see
     the auth header shape
2. **Floor walk with opening manager** to fill
   [doc 23](23-kings-seaport-layout.md) intake template:
   - Room to lane-number mapping
   - Terminal roster + Terminal Setup profile per station (now
     that [doc 33](33-terminal-setup.md) documents every field)
   - Network layout (server host, switch model, LAN vs Wi-Fi)
   - Local IT / maintenance contact tree
3. **Populate `ROOM_LANE_NUMBER_MAP`** in the reservations-builder
   config once the floor walk is done
   - Repo: `/home/cresp3/Kings/repos/kings-morning-reservations-builder`
   - File: `config.example.json`, add per-room lane arrays
4. **Verify Kings-relevance hypotheses** flagged across the new
   docs during the same floor walk:
   - TCS alarm surfaces at Kings (which of the 6 Alarm Checks
     are on: Phone, Light, Back-end Leds expected; Sound + Speaker
     likely off; see [doc 32](32-trouble-call-system.md))
   - Whether Kings uses HyperBowling anywhere (see
     [doc 34 section 9](34-technical-setup.md))
   - Whether Kings uses Experience mode (see
     [doc 30](30-ancillary-modules.md))
   - Which Kings terminals have Lane Orders enabled and whether
     "Automatically Save in Tab and Print" is off (see
     [doc 35 section 11](35-economic-setup.md))
5. **Follow up with Jon Stoyer** on the parts reorder Daniel
   flagged (SuperTouch and 5HD HUB spares)

### Optional enhancement work

- **DLL decompilation with ILSpy** on `Qbk.WebBookingApi.Server.dll`
  to confirm route list matches our static analysis
- **Migration of reservations-builder to WebBookingApi HTTP calls**
  once the auth model is understood; would replace the Excel + AHK
  path with a direct HTTP POST
- **Icon glossary for doc 37 Appendix:** OCR / visual identification
  of the 13 Quick Access Menu Icons and record the mapping in
  [`11-glossary.md`](11-glossary.md)
- **Portfolio linkage decision:** whether to reference this repo
  from `carloscrespo.info/projects.ts` as a CSolutions research
  asset. Skewed private-ops right now; no clear portfolio angle.
- **Second GitHub release** bundling this session's work
  (`v2026.08.26`) once doc 37 is committed
- **Weekly review integration:** consider whether this repo
  belongs in the Wednesday Portfolio + public-proof rotation from
  [WORKSPACE_INDEX.md](/home/cresp3/WORKSPACE_INDEX.md)

## What NOT to touch (guardrails)

Same as prior session, restated for standing rule visibility:

- Do NOT commit any real Kings guest, employee, event, payment, or
  employer-confidential data into this repo
- Do NOT add browser automation against ConquerorX without explicit
  approval (only the current AutoHotkey file-picker helper is
  authorized)
- Do NOT do direct SQL writes on the real Kings DB, only read-only
  observation via the static SQL scripts
- Real exports must remain outside Git. Regression tests use dummy
  data only.

## Repo state snapshot

- **Location:** `/home/cresp3/Kings/docs/conquerorx/`
- **GitHub:** [Crespo1301/conquerorx-research](https://github.com/Crespo1301/conquerorx-research) (public)
- **Doc count:** 38 (README + 00-37 numbered)
- **CHM coverage:** 30 of 30 top-level sections (100%)
- **Latest release:** `v2026.08.25` (docs 25-31 batch); a
  `v2026.08.26` release for docs 32-37 is optional next step
- **Master Rules compliance:** verified across all 38 docs (0 em
  dashes, 0 smart quotes, 0 banned words)

## Pickup instructions for the next session

CHM coverage is complete, so the "pick a CHM section and write a
doc" workflow no longer applies. Instead:

1. Start with the Kings-visit task list above if physically at
   Kings Seaport
2. Otherwise, pick from the Optional enhancement work list
3. To publish a v2026.08.26 release bundling docs 32-37:
   ```bash
   cd /home/cresp3/Kings/docs/conquerorx
   gh release create session-closeoff-2026-08-26 \
     --repo Crespo1301/conquerorx-research \
     --title "v2026.08.26: docs 32-37, CHM coverage complete" \
     --notes-file <notes.md>
   ```
