# Session Close-Off, 2026-08-25

Bookmark for the next session so the pick-up is clean.

## What shipped this session

30 numbered docs written and pushed public to
[github.com/Crespo1301/conquerorx-research](https://github.com/Crespo1301/conquerorx-research):

- Full em-dash cleanup pass across all docs (444+ replacements)
- Master Rules compliance verified across the whole doc set: **zero**
  em dashes, **zero** smart quotes, **zero** style-list banned words
- Docs 25 through 31 written this session:
  - 25 Leagues, 26 Tournaments, 27 Security, 28 Time Tracking,
    29 Web + Call Center, 30 Ancillary Modules,
    31 Cameras + Coin-Op + Special Games
- Every doc pushed with a `r{NN}-{topic}-2026-08-25` tag for release
  tracking

Latest three commits on `main`:

```
fda7406 Add doc 31: Cameras, Coin-Op, and Special Games bundle
a3b1580 Ancillary modules deep-read: doc 30 (r30-ancillary-2026-08-25)
2ba757e Web Reservations + Call Center deep-read: doc 29 (r29-web-callcenter-2026-08-25)
```

## Queue for the next session

### High-value CHM sections still uncovered

| CHM section | Start page | Doc slot | Notes |
|---|---|---|---|
| **TROUBLE CALL SYSTEM** | `Conqueror-2-385.html` | 32 | TCS module. Doc 13 already lists TCS codes; a dedicated doc should cover the operator workflow (call tree, escalation, remote-tech handoff). |
| **TERMINAL SETUP** | `Conqueror-2-464.html` | 33 | Per-terminal config (front-desk vs POS vs manager station). Kings-relevant since we may end up automating from a specific terminal role. |
| **TECHNICAL SETUP** | `Conqueror-2-472.html` | 34 | Hardware side (scoring, pinsetter, MMS, lane interfaces). Biggest remaining CHM section (20 sub-topics). |
| **ECONOMIC SETUP** | `Conqueror-2-492.html` | 35 | Prices, taxes, discounts, payment types, credit-card providers. Ties directly into POS doc 19. |
| **MULTI MEDIA SYSTEM** | `Conqueror-2-405.html` | 36 | CHM-side read of MMS (complements the technical read in doc 18). |
| **APPENDIX** | `Conqueror-2-533.html` | 37 | Reference tables. Skim first, may fold into glossary rather than its own doc. |

Six more docs would give the repo full CHM coverage.

### Kings-visit tasks (need physical presence at Kings Seaport)

1. **Live REST probe** of WebBookingApi + FlexyBook APIs
   - Needs elevated PowerShell (Run as Administrator)
   - Runbook already staged in
     [doc 17](17-api-surface.md), section "Live probe runbook"
   - Blocked last session because `Start-Service ConquerorServer`
     hit access-denied under a normal shell
   - Also needs an authenticated request path (JWT? Windows auth?
     API key?), need to sniff a real request from the web widget
     to see the auth header shape
2. **Floor walk with opening manager** to fill
   [doc 23](23-kings-seaport-layout.md) intake template:
   - Room to lane-number mapping (which lanes belong to which
     private room, which are open-floor)
   - Terminal roster (which physical stations run which role)
   - Network layout (server host, switch model, LAN vs Wi-Fi
     terminal count)
   - Local IT / maintenance contact tree
3. **Populate `ROOM_LANE_NUMBER_MAP`** in the reservations-builder
   config once the floor walk is done
   - Repo: `/home/cresp3/Kings/repos/kings-morning-reservations-builder`
   - File: `config.example.json`, add per-room lane arrays
4. ~~**Check on lanes 13 and 14** (No Comms reboot pattern from
   yesterday). Confirm whether Daniel Martines has responded to the
   English email sent 2026-08-24. If technician has looked, capture
   the diagnosis into [doc 13](13-operations-troubleshooting.md).~~
   **CLOSED 2026-08-26.** Daniel replied same day: root cause was a
   UTP cable powering SuperTouch #13, routed under the ball return
   motor at initial assembly, worn through over time. Damaged
   SuperTouch #13 and 5HD HUB replaced, UTP cable replaced and
   rerouted underneath the lanes. Lanes back in service. Follow-up
   owed to Jon Stoyer: reorder replacement spares (SuperTouch, 5HD
   HUB). Full write-up in [doc 13 incident C1](13-operations-troubleshooting.md).

### Deferred technical work

- **DLL decompilation with ILSpy** on `Qbk.WebBookingApi.Server.dll`
  to confirm route list matches our static analysis. Nice-to-have,
  not blocking.
- **Migration of reservations-builder to WebBookingApi HTTP calls**
  once the auth model is understood. Would replace the Excel + AHK
  path with a direct HTTP POST.
- **`Portfolio` weekly maintenance rotation** may want visibility on
  this repo as a CSolutions internal asset (though public, it's
  Kings-specific research, not a portfolio piece). Decide next
  session whether to link it from `projects.ts`.

## What NOT to touch (guardrails)

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
- **Doc count:** 32 (README + 00-31)
- **Total commits on main:** run `git log --oneline | wc -l` for
  current count
- **Latest tag:** `r31-cameras-coinop-specialgames-2026-08-25`
- **Working tree:** clean (verify with `git status` at start of
  next session)

## Pickup instructions for next session

1. `cd /home/cresp3/Kings/docs/conquerorx && git status && git log --oneline -5`
   to confirm state
2. Read `README.md` doc map to see where 31 sits in the flow
3. Pick a doc from the "High-value CHM sections still uncovered"
   table above
4. Extract the outline for that section:
   `grep -A 30 "^- <SECTION NAME>" extracted-strings/chm-en-outline.md`
5. Read the topic pages: `less extracted-strings/chm-en/Conqueror-2-XXX.html`
6. Write the doc, run the em-dash + banned-word compliance sweep,
   update README, commit with a
   `r{NN}-{topic}-YYYY-MM-DD` tag, push
