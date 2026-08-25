# Open Questions

Things we don't yet know but should figure out. Each with a proposed path to
an answer.

## Access / auth

### Q1. What credential does ConquerorServer use to reach SQL Server?

- Integrated Windows auth failed for us (MicrosoftAccount login).
- **Guess:** dedicated SQL login (`qdesk_srv` or similar) with the password
  stored in an encrypted `.config` section, or `sa` with a well-known
  default set at install.
- **How to find out:** inspect `CenterReservationSvc.Database.dll.config`
  and other `*.dll.config` files under `ConquerorServer/` for
  `connectionStrings`: they're .NET config format so `System.Configuration`
  may transparently decrypt.
- **Why it matters:** without this we can't do direct read-only reporting
  queries.

### Q2. How does auth work for terminal users right now?

- `AccessRights`, `Profiles`, `UserProfiles`, `Staff` tables hold the model.
- `adb2cAuth: {}` and `oidcAuth: {}` are reserved in config but empty.
- **Guess:** local username/password, or fingerprint sensor, or membership
  card swipe (all three mentioned in translations).
- **How to find out:** watch the login screen on the actual Kings terminal.

## APIs

### Q3. What routes are hosted on ports 8018/8048/8084?  ✅ ANSWERED 2026-08-25

**Full API surface documented in [`17-api-surface.md`](17-api-surface.md).**

Two distinct HTTP stacks inside ConquerorServer.exe:

- **WebBookingApi** (Qbk.WebBookingApi.Server.dll, ASP.NET Core) — 25+
  routes covering the reservation flow: `POST /booking`, `POST /booking/{id}/confirm`,
  `GET /availability`, `GET /scenarios`, `GET /customer/email/{email}`,
  and more. This is the API that could replace our Excel import + AutoHotkey
  workflow with a single HTTP call per event.
- **FlexyBook** (Qbk.FlexyBookApi.Server.dll, WCF ServiceModel.Web) —
  realtime lane operations: `GET /AllLaneStatus`, `POST /Workshop/{lanes}`,
  `GET /Scores/Last/{lanes}`, `POST /PinsetterCycle/{laneNumber}`, waiting
  list management.

Which specific port each API binds to needs a live probe (ports are
runtime-assigned, not hardcoded in DLLs). Also: auth uses JWT bearer
tokens (System.IdentityModel.Tokens.Jwt referenced), issued by
IdentityProviderSvc.Service.dll. Exact token endpoint and per-center
credentials are the next unknowns.

- Strong evidence of ASP.NET Core 2.3 REST endpoints.
- **How to find out:**
  - Live probe: `curl http://<server>:8084/` and enumerate common
    endpoints (`/api/health`, `/swagger`, `/v1/reservations`, etc.).
  - DLL decompilation: open `Qbk.WebSetup.dll` in ILSpy to see the
    controllers.
- **Why it matters:** REST endpoints would be a much cleaner integration
  than driving the file picker.

### Q4. What events does the MMSAppServer Socket.IO channel broadcast?

- Port 8760, Socket.IO protocol.
- **How to find out:** connect a Socket.IO client, subscribe to all events,
  log for a shift. Read-only.
- **Why it matters:** could power a real-time lane-status dashboard.

### Q5. What does the port mapping look like for each WCF service?

- 8 legacy ports (2345 through 7024).
- **How to find out:** each WCF service usually publishes a WSDL at
  `/service/mex`: try that on each port. Also the log4net XML has service
  names.
- **Why it matters:** unlikely we'd integrate here, but knowing the shape
  helps.

## Configuration

### Q6. What selects the environment tier at startup?

- 22 `qdesk-settings/*.json` files exist. Something picks one.
- **Guess:** registry key `HKLM\SOFTWARE\QubicaAMF\Environment` or a
  command-line switch in the shortcut.
- **How to find out:** `reg query HKLM\SOFTWARE\QubicaAMF /s`, or check
  the Conqueror X shortcut's target.

### Q7. What does the `Icon` integer in `RoutingDefs.json` map to?

- Icons 3, 33, 89, 130, 244, 371, 417, 418, 617 seen.
- **Guess:** IDs into a shared icon resource DLL (probably one of the
  `Qbk.*.dll` or `Skin\X\*.png`).
- **How to find out:** look at `Skin\X\` PNG names or use ILSpy on a client
  DLL.

### Q8. Where is the Bowling Agent database used?  ✅ ANSWERED 2026-08-24

- SQLite at `C:\ProgramData\QubicaAMF\BowlingAgent\Database\BowlingAgent.db`.
- Only 12 KB, contains a single table: `__EFMigrationsHistory` (Entity
  Framework Core migrations tracker). The table is empty.
- **Conclusion:** BowlingAgent uses **EF Core** for persistence. On the
  local test install nothing has triggered a migration yet, so the DB is a
  bare scaffold. On a live center it presumably fills with per-lane
  message queues, connection state, or diagnostic data once the daemon
  actually runs long enough to persist something. Schema will only appear
  after first live use.

## Cloud & external

### Q9. What data flows out to QCloud during normal operation?

- We know: license status, working-copy sync, customer sync (if enabled),
  animations / marketing kits sync.
- **Unknown:** transaction data? Analytics? Chain-consolidated reporting?
- **How to find out:** enable HTTPS decryption on a test terminal and watch
  the traffic to `qcloud.qubicaamf.com`.
- **Legal caveat:** decrypting Kings traffic is potentially covered by their
  IT AUP, get permission first.

### Q10. What's the process to become a QubicaAMF partner and publish a CloudPlugin?

- Unknown.
- **How to find out:** contact QubicaAMF partner relations. Search for
  "QubicaAMF partner program" or ask through the Kings account rep.
- **Why it matters:** the strongest possible integration path.

### Q11. Which Azure App Insights instance is Kings' data landing in?

- Production tier hits `eastus-8.in.applicationinsights.azure.com`.
- **Guess:** QubicaAMF owns the App Insights tenant; centers don't get
  direct access.
- **Why it matters:** if Kings wants their own telemetry, they'd need to
  own it separately.

## Reservation import

### Q12. Are there any un-decoded ConquerorX errors that could break our tool?

- We have the full list of 12+ "Please specify …" and "Not valid" errors.
- **Unknown:** version-specific behavior (does v15.19 change any requirements?).
- **How to find out:** monitor the release notes when new versions ship
  and diff the string table.

### Q13. Can multiple reservations be batched via anything BUT `ReservationDetailsImport.xlt`?

- Confirmed no via DLL scan.
- **Unknown:** any hidden test/QA endpoints that could accept batch data?
- **How to find out:** unlikely to change anything even if we found one.

## Operations

### Q14. What does the DAR Report actually include?

- `DarReport.rpt` in Crystal Reports templates.
- **How to find out:** open one from a shift end in ConquerorX and inspect.

### Q15. Where do server-side logs actually land, and how long are they retained?

- `qsp_log_insert` stored proc → some DB table (best guess `SystemLog`
  based on cs0000.sql).
- **Unknown:** retention policy, size, ability to purge.
- **How to find out:** query `SELECT TOP 10 * FROM SystemLog ORDER BY [Date] DESC`
  once we can reach the DB.

## Kings-specific

### Q16. What room / lane mapping exists at Kings Seaport?

- We only know King Pin Lounge → lanes 1-4.
- Royal Room, Kings Corner unmapped.
- **How to find out:** ask the opening manager, or look at the physical
  floorplan; then update `ROOM_LANE_NUMBER_MAP` in
  `src/morning_import_builder.py`.

### Q17. What POS does Kings use? (Micros? Toast? Square?)

- Unknown; matters if a food/beverage-linked reservation integration ever
  gets built.

### Q18. What ConquerorX version is Kings on right now?

- Our local test is 15.18.0+22859. Kings production may be a couple
  versions behind (chains often lag).
- **How to find out:** About dialog on any Kings terminal.

### Q19. What's Kings' Working Copy update cadence?

- QubicaAMF pushes updates via `dist.qubicaamf.com`. Center chooses when
  to accept.
- **How to find out:** ask the center IT team.

## Documentation

### Q20. What's in the CHM help file (`ConquerorHelp_EN.chm`)?  ✅ ANSWERED 2026-08-24

Extracted via Windows `hh.exe -decompile`. **535 HTML topic pages, 2026 TOC
entries, 30 top-level product areas.** Full outputs live in
`extracted-strings/`:

- `chm-en-outline.md`: the complete navigable TOC (2035 lines)
- `chm-en-corpus.txt`: plain-text corpus for grep (835 KB)
- `chm-en/`: the raw extracted HTML pages, CSS, images

Top-level product surface confirmed as: MAIN MENU, POINT OF SALE, LANE
MANAGEMENT, EXPERIENCE, SHIFT MANAGEMENT, FREQUENT BOWLER TRACKING,
LEAGUES, BLS LEAGUES, TOURNAMENTS, SWEDISH LEAGUES, DANISH LEAGUES,
BES X MAD GAMES, BES SPECIAL GAMES, BOWLAND SPECIAL GAMES, LOCKERS,
TIME GAMES, STATISTICAL REPORTS, SECURITY, TIME TRACKING SYSTEM,
BOOKING SYSTEM, TROUBLE CALL SYSTEM, CAMERAS AND REAL TIME INCOME,
MULTI MEDIA SYSTEM, CALL CENTER, WEB SETUP, COIN-OP INSTALLATIONS,
CENTER SETUP, TERMINAL SETUP, TECHNICAL SETUP, ECONOMIC SETUP, APPENDIX.

The reservation import flow lives under **BOOKING SYSTEM**
(`Conqueror-2-364.html` onward), 22 sub-sections including creating
reservations, mixed/recurring reservations, reservation types, deposits,
web reservations. Worth a targeted read when we next extend the import
tool.

### Q21. What's in the QubicaAMF Registration Form PDFs?

- 7 language variants at
  `C:\ProgramData\QubicaAMF\Repositories\Conqueror\<ver>\Repository\HelpAndDocs\RegistrationForms\`.
- **Guess:** initial center registration paperwork for QubicaAMF-side setup.

## Terms we haven't decoded

- **FBT:** best guess "Frame By Twist" but not confirmed. `FBTLeague`,
  `FBTStats`, `FBTLinks`, `FBTCR/GIR/GR` reports.
- **CDE:** Centralized Data Environment. Confirmed but shape/API unclear.
- **Q2A** vs **Q3A** protocols, Q2A confirmed as "Qubica-to-AMF"; Q3A
  possibly a newer variant.
- **Cde2Qubica** table, bridge table for something.

## Update this document as we learn

New answers → move to the appropriate summary doc and mark answered here.
This is a living TODO for the ConquerorX doc set.
