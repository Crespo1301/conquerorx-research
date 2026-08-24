# Modules and DLLs — Feature Map

The `Qbk.*` DLL family maps 1:1 to product feature areas. This is the
best structural view of everything ConquerorX does.

**Total:** 865 DLLs in `C:\QDesk\Bin\` (plus more in `ConquerorServer\`).
The following are the ones with a clear feature meaning; low-level Microsoft
and third-party dependencies are omitted.

## Naming convention

Every business DLL is `Qbk.<Area>[.<Sub>].{dll}` and comes in up to four flavors:

| Flavor | Loaded by | Purpose |
|---|---|---|
| `Qbk.X.dll` | Both server and client | Shared types, interfaces |
| `Qbk.X.Server.dll` | ConquerorServer only | Backend logic, DB access, business rules |
| `Qbk.X.Client.dll` | Conqueror.exe only | Client-side logic, calls server |
| `Qbk.X.Gui.dll` | Conqueror.exe only | Windows Forms UI |
| `Qbk.X.Interop.dll` | Either | COM interop to legacy C/C++ code |

## Feature areas by module family

### Reservations (14 DLLs)

Everything about booking lanes, F&B, deposits, extended availability.

| DLL | Role |
|---|---|
| `Qbk.Reservations.dll` | Shared types |
| `Qbk.Reservations.Server.dll` / `.Interop.dll` | Server domain logic |
| `Qbk.Reservations.Client.dll` / `.Interop.dll` | Client-side reservation ops |
| `Qbk.Reservations.Gui.dll` | Windows Forms UI |
| `Qbk.Reservations.Importer.dll` | **The .xls import engine — what our tool feeds** |
| `Qbk.Reservations.Server.CloudData.dll` | Cloud-sync layer for multi-center |
| `Qbk.Reservations.DynamicDiscountsSetup.dll` | Dynamic pricing/discount setup |
| `Qbk.Reservations.ExtendedAvailability.Client.dll` / `.Server.dll` / `.Gui.dll` | Extended-availability calendar feature |
| `Qbk.Reservations.Promotion.Setup.dll` | Promotional pricing tied to reservations |

### Customers (6 DLLs)

CRM, member management, homonymous (duplicate) detection.

- `Qbk.Customers.dll` / `Server.dll` / `Client.dll`
- `Qbk.Customers.Server.Interface.dll`
- `Qbk.Customers.Homonymous.dll` — duplicate detection engine

### Leagues (12 DLLs)

League play — bowlers, teams, scoresheet, standings.

- `Qbk.Leagues.dll` / `Server.dll` / `ClientLib.dll` / `CDE.dll`
- `Qbk.Leagues.BowlersAndTeams.dll`
- `Qbk.Leagues.LaneStatus.dll`
- `Qbk.Leagues.ScoreSheet.dll`
- `Qbk.Leagues.Setup.dll`
- `Qbk.Leagues.Standings.dll` / `Standings.Client.dll`

### Tournaments (9 DLLs)

- `Qbk.Tournaments.dll` / `Server.dll` / `Client.dll` / `Gui.dll` / `Interop.dll`
- `Qbk.Tournament.Gui.dll` / `Tournament.Standing.dll`

### Lanes (25 DLLs) — the biggest area

Everything about the physical lane surface and its state machine.

| DLL | Role |
|---|---|
| `Qbk.Lanes.dll` / `Server.dll` / `Interop.dll` / `Gui.dll` / `Gui.Interop.dll` | Core lane state |
| `Qbk.Lanes.Data.Server.dll` | Score data |
| `Qbk.Lanes.GameDataExport.dll` | Export game data |
| `Qbk.Lanes.Gui.Score.dll` | Score display in the client |
| `Qbk.Lanes.Hal.dll` | Hardware abstraction layer for the pinsetter/pindeck |
| `Qbk.Lanes.OpeningMessages.dll` | Welcome messages shown on lanes |
| `Qbk.Lanes.Q2A.Server.dll` | Q2A protocol (Qubica2AMF hardware bridge) |
| `Qbk.Lanes.Tilt.TiltPlugin.dll` | Tilt-sensor detection plugin |
| `Qbk.LaneMovement.dll` / `Interop.dll` | Move a party from one lane to another |
| `Qbk.LaneServices.dll` | Auxiliary lane RPC |
| `Qbk.LaneControl.dll` | The direct lane-control UI/API |

### Point of Sale / F&B / Cash

Discovered via strings + individual DLL search:

- `Qbk.CashDrawer.dll` — cash drawer control
- `Qbk.Payment*.dll` — payment gateway integrations
- `Qbk.PricingSetup*.dll` — price key definitions
- `Qbk.Discount*.dll` — discounts
- `Qbk.Promotion*.dll` — promotions
- `Qbk.LaneOrder*.dll` — order-taking at the lane
- `Qbk.Kiosk.AssistancePlugin.dll` — kiosk help/assistance mode
- `Qbk.Economical.TipPlugin.dll` — gratuity handling
- `Qbk.OrderReprintPlugin.dll` — receipt reprint

### Scoring / Games / Bowler

- `BowlingMode.dll`, `TimeGames.dll`, `TimeGamesSetup.dll`
- `SpecialGames.dll`, `BesSpecGamesSetup.dll`
- `GamesManager.dll`
- `Qbk.HistoricalGames.Gui.dll`
- `Qbk.PrintGames.dll` / `PrintGames.Plugin.dll`
- `Qbk.Bowler*.dll`
- `BowlerTracRentalShoes.dll`

### Redemption / Prizes

- `Qbk.Redemption*.dll`
- Prizes tables live in the SQL schema (`Prizes`, `PrizeStack`, `PrizeWinners`)

### TCS (Trouble Call System)

- `TCSPlugin.dll` — the "call attendant" system for lanes
- Multiple DLLs mention `TCSCloudBuilder`, `TCS Reports`

### Reports

- `Qbk.Reports.dll`
- `ReportViewerApp.exe` (Crystal Reports host)
- `Reports\*.rpt` — 60+ Crystal Reports templates

### Web / API layer

- `Qbk.WebSetup.dll`
- `Microsoft.AspNetCore.*` — ~15 AspNet Core 2.3 DLLs, hosted in-process
- `WebStaticServer.exe` — static file server, likely serves the SPA

### Loyalty / Cards / Prepaid

- `Qbk.Loyalty*.dll`
- Prepaid card + gift card DLLs
- Card tables (`Cards`, `CardTypes`) in the DB

### Security / Access Control

- `Qbk.Security*.dll` (via CenterSecuritySvc)
- `AccessRights`, `UserProfiles`, `Profiles`, `Staff`, `StaffLog` tables

### Advertising / Announcements

- Advertising modules — `Advertising.dll`
- Deck lighting effects
- YouToons integration (Fox partnership assets)

### Special integrations

- `Qbk.Micros.Server.dll` — Micros POS bridge
- `Aggiungi.dll` — Italian for "Add" (legacy)
- `BXL.dll` — Bixolon printer driver
- `AForge.*.dll` — computer vision libraries (camera + video)
- `BouncyCastle.Crypto.dll` — cryptography
- `AudioResampleWrapper.dll` — audio playback

### Multi-center (CDE)

- `CDE` = **Centralized Data Environment** — multi-center management
- `Qbk.Leagues.CDE.dll` — CDE-aware league handling
- `Cde2Qubica` table in DB

### Cloud sync

- `Qbk.Reservations.Server.CloudData.dll`
- Various Cloud/Working Copy DLLs
- Azure telemetry via Application Insights

### Third-party (bundled)

- `AForge.*.dll` — computer vision
- `BouncyCastle.Crypto.dll`
- `Newtonsoft.Json.dll`
- Microsoft.AspNetCore.*
- Microsoft.Extensions.*
- log4net

## The four "Plugin" DLLs (in-tree extensibility)

These are the extension points ConquerorX already exposes internally:

| DLL | Purpose |
|---|---|
| `Qbk.Kiosk.AssistancePlugin.dll` | Adds assistance UI to kiosk mode |
| `Qbk.Lanes.Tilt.TiltPlugin.dll` | Tilt sensor handling |
| `Qbk.Economical.TipPlugin.dll` | Gratuity feature |
| `Qbk.OrderReprintPlugin.dll` | Receipt reprint |
| `Qbk.PrintGames.Plugin.dll` | Historical game print |
| `TCSPlugin.dll` | Trouble Call System |

Combined with `Qbk.PluginParams.dll` — parameters for plugin config — this is
a real internal plugin model. But it's for QubicaAMF internal team use, not
open to third parties.

## The `Qbk` prefix

`Qbk` almost certainly stands for **Qubica** — the scoring-system company
that merged with AMF Bowling Products in 2005 to form QubicaAMF Worldwide.
Every business DLL carries the Qubica lineage in its name.

## Reference

- Full DLL listing: [`inventories/03-dll-inventory.txt`](inventories/03-dll-inventory.txt)
- Extensibility patterns: [`09-extensibility.md`](09-extensibility.md)
