# Templates and Import/Export Formats

## The four Excel import templates

Located at `C:\QDesk\Bin\xlt\`. These are the *officially blessed batch
import surfaces*, everything else is either single-record UI entry or a
QubicaAMF-proprietary sync (Cloud, Micros).

| Template file | Imports what | Corresponding DLL |
|---|---|---|
| `ReservationDetailsImport.xlt` | One reservation + its bowlers | `Qbk.Reservations.Importer.dll` |
| `Members.xlt` | Customer / member roster (no ID) | `Qbk.Customers.*.dll` |
| `Members with ID.xlt` | Customer / member roster with pre-assigned IDs | `Qbk.Customers.*.dll` |
| `TournamentPlayers.xlt` | Tournament player roster | `Qbk.Tournaments.*.dll` |

All are Excel 97-2003 `.xlt` (BIFF format). ConquerorX's importer parses
them via `xlwt`-family readers on the .NET side.

## `ReservationDetailsImport.xlt`: the one we integrate with

**This is fully documented in `09-extensibility.md` and the reservations-builder
`HANDOFF.md`.** Two-section layout, one reservation per file.

### Row 0: reservation header (6 columns)

| Col | Header | Value type | Notes |
|---|---|---|---|
| 0 | `Date` | Excel date serial (MM/DD/YYYY format) | Required. Past-dated → rejected |
| 1 | `Time` (hh:mm) | Excel time serial (HH:MM format) | Required |
| 2 | `Reservation Name` | Text | Required |
| 3 | `Lane type` | Numeric enum | 1 = Single, 2 = Pair |
| 4 | `Game opening mode` | Numeric enum | 1 = Game, 2 = Time |
| 5 | `Game per bowler` | Integer | Number of games (ignored when mode = 2) |

### Row 1: reservation data

Fill each column above with the actual value.

### Row 2: bowler header (10 columns)

| Col | Header | Value type | Notes |
|---|---|---|---|
| 0 | `Lane progressive number` | Integer | Which lane this bowler is on |
| 1 | `FBT ID` | Text | Optional, links to existing FBT customer |
| 2 | `Display name` | Text | Bowler-facing name |
| 3 | `HDCP` | Integer | Handicap value |
| 4 | `Gender` | Numeric enum | 1 = Male, 2 = Female. `0` REJECTED |
| 5 | `Bumpers` | Numeric enum | 0 = No, 1 = Yes |
| 6 | `Hand` | Numeric enum | 0 = Right, 1 = Left |
| 7 | `Bowler attribute` | Text | Optional |
| 8 | `Team name` | Text | Groups bowlers into teams |
| 9 | `Team attribute` | Text | Optional |

### Row 3+: one row per bowler

Repeat for every bowler on this reservation. Distribute across lanes by
setting column 0.

### Documented import error messages (from the EN translation file)

- `Please specify the reservation start date in the Excel file`
- `The start date specified in the Excel file is not valid`
- `Please specify the lane type in the Excel file`
- `The lane type specified in the Excel file is not valid`
- `Please specify the reservation name in the Excel file`
- `Please specify the opening type in the Excel file`
- `Please specify the number of games for each player in the Excel file`
- `Please specify all the lane numbers in the Excel file`
- `Not all the team names specified in the Excel file are valid`
- `Not all the genders specified in the Excel file are valid`
- `Unable to import reservations in the past`
- `Unable to import reservation because there are not enough bookable lanes`
- `An error has been detected while importing the file.`

## `Members.xlt` / `Members with ID.xlt`

Not yet inspected in detail. Would need same reverse-engineering pass as the
Reservation template if we ever build a member-import tool.

Related DB tables: `Members`, `FamilyContacts`, `Titles`, `Cards`,
`Industries`, `GroupTypes`, `DiscoverSources`.

Related stored procs (name suggests bulk import support):
- `qsp_cust_upd_customer`
- `qsp_cust_upd_custcategory`
- `qsp_cust_del_customer`
- `qsp_cust_get_by_bowlertrack_id`  ← BowlerTrac ID as a customer key
- `qsp_cust_get_by_email`
- `qsp_customerToActivate_register_member`

## `TournamentPlayers.xlt`

Not inspected. Related DB tables: `T_Players`, `T_PlayersDivisions`, `T_Teams`,
`T_TeamsComposition`.

## Other input formats supported

From the EN translation strings:

- **`.xml`:** BowlerTrac files: `BowlerTrac files (*.xml)|*.xml|OVR files (*.dbf)|*.dbf|Excel files (*.xls)|*.xls|All files (*.*)|*.*||`
- **`.dbf`:** OVR (Old Version Records? Overall?) legacy DBF format
- **`.xls`:** Excel 97-2003, what we use

BowlerTrac is a longtime independent bowling scoring system; QubicaAMF
supports importing customer data from it directly. Would be worth a
separate inspection if any Kings location has legacy BowlerTrac data.

## Output / Export formats

### Crystal Reports (.rpt): 60+ templates in `C:\QDesk\Bin\Reports\`

Runtime: Crystal Reports SDK, hosted by `ReportViewerApp.exe`.

| Category | Examples |
|---|---|
| Financial | `BILLS.rpt`, `EndOfShiftCashOut.rpt`, `EndOfShiftCashOutBillsAndCoins.rpt`, `DarReport.rpt` (Daily Activity Report) |
| Classification / Standings | `ClassificationBestGame.rpt`, `ClassificationSwedishLeagueElite.rpt`, `ClassificationClubPlayer.rpt`, `ClassificationPlayer.rpt`, `ClassificDetailOrdered.rpt` |
| Historical | `BestGamesSupReport.rpt`, `BestPlayerDetails.rpt`, `CenterAvg.rpt` |
| Coin / Payment | `CoinHopper.rpt`, `CoinOperated.rpt`, `CreditCard.rpt` |
| Booking | `AllBookingDetails.rpt`, `BookingTypeCount.rpt` |
| FBT (Bowler Tracking) | `FBTCR.rpt`, `FBTGIR.rpt`, `FBTGR.rpt` |
| Frames | `ExtraFrames.rpt`, `BowlersAndGames.rpt` |

Reports can be exported to Excel, PDF, or printed.

### XML

- Reservation exports mentioned: "Reservation successfully exported into an XML file"
- Micros integration is XML-based

### Micros POS bridge

Sends orders/checks to Oracle Micros POS as XML documents. Bidirectional:
- ConquerorX opens a Micros check
- Adds items
- Micros closes it and returns totals

### Cloud sync

Not really "export", the Cloud sync just replicates customer data,
animations, marketing kits to QCloud for centralization across a chain.

### Cloud Data upload

Individual translations mention "Cloud Data upload", sends aggregated data
(shift totals, activity) up to QubicaAMF's cloud for reporting.

## Import surface summary

| Surface | Format | Batch? | Where |
|---|---|---|---|
| Reservations import | `.xls` (BIFF, one reservation) | ❌ one file at a time | Back Office → Reservations → Import Reservations |
| Member import (basic) | `.xls` per `Members.xlt` | ✅ probably batch | Back Office → Customer Import and Export |
| Member import (with ID) | `.xls` per `Members with ID.xlt` | ✅ probably batch | Back Office → Customer Import and Export |
| Tournament players | `.xls` per `TournamentPlayers.xlt` | ✅ probably batch | Tournament setup |
| BowlerTrac customer import | `.xml` | ✅ batch | Customer Import and Export |
| OVR legacy import | `.dbf` | ✅ batch | Customer Import and Export |
| Micros menu sync | XML | ✅ | Automatic on Micros integration |
| Cloud customer sync | Proprietary | Continuous | If cloud-connected |

## Reference

- Templates on disk: [`inventories/07-templates-and-exchange.txt`](inventories/07-templates-and-exchange.txt)
- Full DDL & procs: [`inventories/13-database-schema-tables.txt`](inventories/13-database-schema-tables.txt)
