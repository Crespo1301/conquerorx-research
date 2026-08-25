# Glossary

Terms and acronyms you'll encounter across the ConquerorX system.

## Product family / brand terms

| Term | Meaning |
|---|---|
| **QubicaAMF** | The vendor. Formed from the 2005 merger of Qubica (scoring systems, Italy) and AMF Bowling Products (hardware, USA). HQ Bologna + Mechanicsville VA. |
| **Conqueror X** | Current-generation bowling center management platform. What Kings runs. |
| **QDesk** | The client shell brand, `C:\QDesk\Bin\` is the install root, translation files are `QDesk.<hex>`. Older internal name still used in paths. |
| **QCloud** | QubicaAMF's cloud back-end at `qcloud.qubicaamf.com`. Handles centralization, license, updates. |
| **QPortal** | QubicaAMF's customer-facing web portal at `qportal.qubicaamf.com`. |
| **QPad** | Touchscreen kiosk / handheld terminal for staff. Referenced in privilege strings. |
| **QGetDb / QCert / QCloudTest** | Utility tools shipped with the server install (Q- prefix = Qubica utility). |
| **Qbk** | DLL name prefix for QubicaAMF business logic (`Qbk.Reservations.*`, `Qbk.Customers.*`, etc.). Short for "Qubica". |

## Scoring system generations

| Term | Meaning |
|---|---|
| **BES X** | Current-gen QubicaAMF Bowling Entertainment System. What Kings almost uses. |
| **BES V** | Older BES version. |
| **BES 3QT / RDB** | Hardware variants (3Q Terminal, RDB). |
| **BES NV** | Older BES variant. |
| **Frameworx** | Legacy AMF scoring system. Still supported for backward compat. |
| **BOSS** | Older AMF scoring generation. |
| **AS 80/90** | Even older AMF scoring generations. |
| **Bowland / Bowland-X** | European scoring variant supported by ConquerorX. |
| **QScore** | Alternate lightweight QubicaAMF scoring option. |

Which scoring gen a center runs is chosen at install time (see
`ConquerorSetup.exe` "Choose Score Version" screen).

## System components

| Term | Meaning |
|---|---|
| **MxSvc** | Matrix Configuration Server. The master coordinator Windows service. |
| **Matrix** | QubicaAMF's internal name for the configuration coordination layer. |
| **MMS** | Multimedia Messaging System, score console display / video / animation layer. Runs on Node.js at port 8760. |
| **MMSAppServer** | The Node.js server for MMS. |
| **TCS** | Trouble Call System, the "call attendant" button on lanes. Generates tickets when guests need help. |
| **HAL** | Hardware Abstraction Layer, `Qbk.Lanes.Hal.dll`: talks to pinsetter/pindeck. |
| **Q2A** | Qubica-to-AMF hardware protocol bridge. |
| **Working Copy** | Update distribution system. Terminals rsync from server; server pulls from `dist.qubicaamf.com`. |
| **BowlingAgent** | Daemon that handles lane hardware traffic between MxSvc and the score consoles. |
| **CDE** | Centralized Data Environment, QubicaAMF's multi-center chain management. |

## Data / financial

| Term | Meaning |
|---|---|
| **FBT** | **Frequent Bowler Tracking:** QubicaAMF's loyalty / membership program. Confirmed via the extracted CHM help (top-level section "FREQUENT BOWLER TRACKING", `Conqueror-2-176.html`). `FBT ID` is the membership card ID; `FBTLeague`, `FBTStats`, `FBTLinks` are member-related league tables; `FBTGR`/`FBTGIR`/`FBTCR` are FBT-related reports. |
| **DAR Report** | Daily Activity Report, the shift-end financial summary. |
| **Cash Turn** | A shift's cash session (open/close with drawer counts). |
| **Shift** | A staff work period. `Shifts`, `ShiftOperators`, `ShiftTimeZones` DB tables. |
| **Bowlings** | DB table for actual bowling session records (a party's play on lane X between time A and B). |
| **Reservation** | Future booking. `RsrvHdr` + `RsrvBody` in the DB. Distinct from `Bowlings` (past/current sessions). |
| **Function Sheet** | Banquet Event Order (BEO) equivalent, printed detail sheet for large events. `qsp_lbsrpt_function_sheet_get_data`. |
| **Homonymous** | Duplicate-customer detection (`Qbk.Customers.Homonymous.dll`, `qsp_homonymous_customers`). |
| **Price Key** | A price entry. Related to game pricing, package pricing. `PriceKeys` table. |

## Reservation-specific enums

| Field | Values |
|---|---|
| **Lane type** | 1 = Single (each lane runs own game), 2 = Pair (two lanes share game) |
| **Game opening mode** | 1 = Game (buy N games), 2 = Time (buy N hours, unlimited games) |
| **Gender** | 1 = Male, 2 = Female (0 rejected) |
| **Hand** | 0 = Right, 1 = Left |
| **Bumpers** | 0 = No, 1 = Yes |
| **Status** (Tripleseat side) | DEFINITE, TENTATIVE, PROSPECT, LOST, CANCELED, only DEFINITE exports to ConquerorX in our tool |

## Lane hardware terminology

| Term | Meaning |
|---|---|
| **Pinsetter** | The machine that resets pins after each frame. Physical AMF hardware. |
| **Pindeck** | The deck where pins stand. |
| **Bumpers** | Retractable barriers along the gutters (usually for kids). |
| **Lane grid** | The lane-status visualization in the front-desk UI. |
| **Pod** | A physical pair of lanes sharing hardware (score console, pinsetter controller). Lanes 13/14, 15/16, etc. |
| **Lane Movement** | Transferring a party from one lane to another. `Qbk.LaneMovement.dll`. |

## Modes / opening types

| Term | Meaning |
|---|---|
| **Bowling Mode** | Which game rule set is active on the lane (10-pin, no-tap, 3-6-9, etc.). |
| **Time game** | Buy time on a lane rather than N games. |
| **Special Games** | Mini-games / attractions: Cubes, Lucky Draw, Poker, QFlash, Slot Machine, Tic-Tac-Toe. See `SPG*Sessions` DB tables. |
| **Mad Games** | Novelty game modes (BES X Mad Games). |
| **HyperBowling** | An interactive lane feature with wall projections. `Qbk.HyperBowling*.dll` referenced. |

## Multi-center / chain terms

| Term | Meaning |
|---|---|
| **Center** | Individual bowling location. Kings Seaport is one center; other Kings locations are separate centers. |
| **Center Setup** | The back-office area for configuring a center's parameters. |
| **Centralization** | Multi-center data sync (customers, prices, promos). |
| **Call Center** | Central reservation-taking desk that sees all centers. |
| **Cloud - Customers** | Cloud-synced customer DB across centers. |

## Update / lifecycle terms

| Term | Meaning |
|---|---|
| **Working Copy** | The current in-use install. Distinguished from the "next" copy being downloaded. |
| **Spare server** | Redundant server for failover. |
| **Register terminal** | First-run association of a terminal to its server. |
| **Terminal number** | Numeric ID of this specific PC in the center. |
| **License** | Per-terminal licensing tracked via `TerminalLicenses` DB table. |
| **Aladdin / HASP** | Hardware licensing dongle (Aladdin Knowledge Systems). |

## Localization / language codes

| Code | Language | File |
|---|---|---|
| `0409` | English (US) | `Qdesk.0409`: 858 KB, our master reference |
| `0407` | German | `Qdesk.0407` |
| `040C` | French | `Qdesk.040C` |
| `0410` | Italian | `Qdesk.0410` |
| `0411` | Japanese | `Qdesk.0411` |
| `0419` | Russian | `Qdesk.0419` |
| `0C0A` | Spanish (International) | `Qdesk.0C0A` |
| … | 30 total | see `Languages_Codes.txt` |

## Roles inside a center

| Role | What they do |
|---|---|
| **Opening manager** | Morning shift start. Reviews reservations, sets up lanes. Uses our import tool. |
| **Closing manager** | Evening shift end. Reviews new bookings added mid-day, updates ConquerorX. |
| **Front desk** | Checks guests in, assigns lanes, takes payment. |
| **Attendant** | Handles lanes on the floor. Responds to TCS calls. |
| **Bartender / Server** | Takes food & drink orders. |
| **Center manager** | Runs the location. |
| **Chain operator** | Runs multiple centers. |

## Product-surface terms (added from CHM extraction)

| Term | Meaning |
|---|---|
| **Booking System** | The reservation engine module. The `RsrvHdr`/`RsrvBody`/`RsrvItemDetails` tables live under this. What our tool imports into. |
| **BLS Leagues** | Bowling League Secretary format, a league management standard imported/exported by ConquerorX alongside its own league engine. |
| **Swedish Leagues / Danish Leagues** | Regional league variants, Sweden and Denmark have specific league scoring rules built-in as first-class product modules. |
| **BES X Mad Games / BES Special Games / Bowland Special Games** | Novelty game modes bundled per scoring generation. Different populations of mini-games depending on hardware family. |
| **Experience** | Package/experience management, bundles lane time + food + arcade credit + party assets under a single "experience" template. |
| **Time Tracking System** | Staff time-clock module (punch in/out, hours, wages). Separate from Shift Management. |
| **Coin-Op Installations** | Coin/token operated legacy hardware integration. |
| **Impact Images** | On-lane celebration images shown at strikes/spares. |
| **QCash** | Prepaid credit balance held by an FBT member. Sits alongside physical cards + points. |
| **Marketing Kits** | Pre-authored campaign asset bundles (birthday party themes, etc.) synced from QCloud. |

## Terms we haven't decoded yet

Documented in [`12-open-questions.md`](12-open-questions.md).
