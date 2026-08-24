# Database Schema

## Instance

**SQL Server named instance: `MSSQL$CONQUERORX`**
Connection string prefix: `Server=(local)\CONQUERORX`
Confirmed via `C:\QDesk\Bin\ConquerorServer\SqlScripts\qdb.ini`.

Runs SQL Server Express 2022 (bundled installer under
`Repository\Conqueror\SQL Server Express 2022\`).

Integrated Windows auth against a MicrosoftAccount login was **rejected** in
our test — a QubicaAMF service account (probably `sa` or a dedicated
`qdesk_srv` user) is used by ConquerorServer.

## Migration convention

All DDL and migrations ship as UTF-16 encoded `.sql` files in
`C:\QDesk\Bin\ConquerorServer\SqlScripts\`. Filename prefixes:

| Prefix | Meaning |
|---|---|
| `a*` | Application procs/funcs/views (base app-level objects) |
| `cs*` | Create Structure — base tables. `cs0000.sql` is the v2.2.0.0 baseline |
| `cd*` | Create Data — seed rows |
| `cu*` | Create Upgrade — versioned migrations (e.g. `cu02020600.sql` = upgrade to v2.20.06) |
| `cusp*` | Create User Stored Procedures |
| `cuz*` | Create Upgrade — later-series migrations, contains many stored procs |
| `luz*` | Legacy upgrade zone |
| `hs*` / `hu*` | Help / history support |
| `ts*` | Trigger scripts |

**Migration history:** hundreds of `cu*.sql` files, indicating a long-lived
schema that has evolved incrementally rather than being reset. The oldest
`cu00000093.sql` and newest span roughly 20 years of upgrades.

## 142 base tables from `cs0000.sql`

Grouped by domain:

### Reservations (7)
`RsrvHdr` · `RsrvBody` · `RsrvItemDetails` · `RsrvItemStatus` · `RsrvGroups` · `RsrvTypes` · `RsrvContacts`
`RsrvAgencies` · `RsrvColourDefs` · `RsrvHistory` · `RsrvHistoryLogTypes` · `RsrvPaymentHistory` · `RsrvPaymentTypes`

### Customers / Members
`Members` · `FamilyContacts` · `Titles` · `Cards` · `CardTypes` · `Industries` · `GroupTypes` · `DiscoverSources`

### Lanes / Bowling
`Bowlings` · `LaneHWSetup` · `LaneHistory` · `BowlerOptions` · `HHighsMasks` · `MaskInterfaces` · `Modes` · `ModesTG` · `ModesTimeZone` · `ApriPiste` (open lanes) · `PisteLeague` (league lanes)

### Games
`Games` · `TimeGamesItems` · `TimeGamesPlayers` · `StatPlayedFrames`

### League
`FBTLeague` · `FBTLinks` · `FBTStats` · `ClubLeague` · `GiocatoriLeague` (players league) · `LeagueOptions` · `LeaguePayHistory` · `ListaLeague` · `MemoLeague` · `PayLeague` · `SetupLeague`

### Tournaments (T_ prefix)
`T_Divisions` · `T_DivisionsStyles` · `T_Events` · `T_LaneAssignment` · `T_Players` · `T_PlayersDivisions` · `T_PointsCollectionRules` · `T_PointsCollectionStyles` · `T_Squads` · `T_StandingSheetTypes` · `T_Teams` · `T_TeamsComposition` · `T_Tournaments` · `T_TournamentsDivisions`

### Cash / Shift management
`CashStatus` · `CashTurns` · `CashTurnOperators` · `Shifts` · `ShiftOperators` · `ShiftTimeZones` · `Staff` · `StaffLog` · `StaffSectors` · `Sectors` · `Departments`

### Financial / Receipts / Bills / Taxes
`Bills` · `Receipts` · `ReceiptsPaymentRows` · `ReceiptsPointsRows` · `ReceiptsRows` · `ReceiptsTaxRows` · `Transactions` · `TransactionsRows` · `TransactionsStack` · `TransSubRows` · `PaymentTypes` · `PriceKeys` · `PriceTime` · `PointsCollection` · `Currencies` · `Taxes` · `TaxGroups` · `TaxGroupItems` · `Definitions`

### Bar / F&B
`BarGroups` · `BarItems` · `BarOrders` · `BarOrdersItems` · `PackageItems`

### Access control / config
`AccessRights` · `Profiles` · `UserProfiles` · `Options` · `Globals` · `QParam` · `QNotes` · `LangSetup`

### Communications / Messaging
`MenuChoices` · `Mess` · `MsgAddressees` · `MsgList`

### Lockers / Parking
`Lockers` · `LockersBanks` · `LockersWaits` · `ParkingLot`

### Waiting list
`WaitingList` · `WaitingListResourceTypes`

### Prizes / Redemption
`Prizes` · `PrizeStack` · `PrizeWinners` · `PointsCollection`

### Credit card
`CreditCardHistory` · `CreditCardTransaction`

### Effects / attractions
`Effects` · `EffItems`

### Terminal / system
`TerminalLicenses` · `SystemLog` · `StrikerLog` · `Interfaces` · `MultiIO` · `MultiIOStatus`

### Special Games (SPG* prefix)
`SPGCubesSessions` · `SPGLuckyDrawSessions` · `SPGPokerSessions` · `SPGQFlashSessions` · `SPGSlotMachineSessions` · `SPGTicTacToeSessions`

### Micros integration
`MicroSaleSettings` · `MicroSaleTransactions`

### Events / calendar / statistics
`Events` · `Calendar` · `StatCustomers` · `StatPlayedFrames` · `StatTimeZones` · `Weather` · `QueuesElems`

### Central Data Environment
`Cde2Qubica` — bridge for multi-center CDE

## Naming translation

QubicaAMF's Italian heritage means some table names are in Italian:

| Italian | English |
|---|---|
| `ApriPiste` | Open Lanes |
| `PisteLeague` | League Lanes |
| `GiocatoriLeague` | League Players |
| `ListaLeague` | League List |
| `MemoLeague` | League Memo |
| `PayLeague` | League Pay |
| `SetupLeague` | League Setup |

Rest of the schema is English.

## Stored procedures (~100+ documented)

**Naming convention:** `qsp_<area>_<action>`

| Prefix | Domain |
|---|---|
| `qsp_adm_*` | Administrative / DDL (add_column, drop_table, reindex, set_permissions) |
| `qsp_anag_*` | Anagraphic — master data (paymenttypes, pricekeys, staff) |
| `qsp_cust_*` | Customer (get, upd, del, decode_layout, points, cards) |
| `qsp_lbs_*` | Load booking system data (group_list, operator_list, rsrv_type_list) |
| `qsp_lbsrpt_*` | Booking system reporting (canceled, deposit, detail, function_sheet, noshow, outstanding, revenue, spenders) |
| `qsp_shiftreport_*` | Shift report queries |
| `qsp_ut_*` | Utility (helpcols, helpconstraint, set_descr, size_of_dbfiles, space_usage) |
| `qsp_webimage_*` | Web image cleanup |
| `qsp_log_insert` | log4net → DB appender target |

Notable examples:

- `qsp_cust_get_by_bowlertrack_id` — customer lookup by BowlerTrac ID (proves BowlerTrac is a first-class integration path)
- `qsp_cust_get_by_email` — email-based lookup
- `qsp_homonymous_customers` — duplicate detection
- `qsp_merge_customers` — de-duplication
- `qsp_replace_customer` — replace one customer with another (merge target)
- `qsp_lbsrpt_function_sheet_get_data` — the "function sheet" (banquet event order) data pull
- `qsp_lbsrpt_deposit_get_data` — deposit report
- `qsp_customerToActivate_register_member` — new member activation
- `qsp_customersToChangePassword_AddRequest` — password reset request

## Functions (`qfn_*`)

| Function | Purpose |
|---|---|
| `qfn_calculate_points` | Loyalty point calculation |
| `qfn_cust_exists` | Customer existence check |
| `qfn_cust_key_string` | Customer key generation |
| `qfn_glob_id_center` | Get center ID from globals |
| `qfn_lbsrpt_spenders_get_data` | Spenders report data |
| `qfn_shiftreport_selectbowlers` | Shift report bowler selection |
| `qfn_totalbowlers` | Total bowler count |
| `qfn_ut_*` (many) | Column/index utility helpers |

## Views (`qvw_*`)

- `qvw_cust_all_categories` — customer categories rollup
- `qvw_scenariopricekeyswithimage` / `qvw_ScenariosWithImage` — pricing UI helpers
- `qvw_ut_*` — schema-introspection utility views

## Triggers

Only 8 in the base schema, all on frequently-updated tables:

- `Bowlings_ITrig` / `Bowlings_UTrig`
- `CardTypes_ITrig` / `CardTypes_UTrig`
- `Departments_ITrig` / `Departments_UTrig`
- `Members_ITrig` / `Members_UTrig`

(`_ITrig` = INSERT trigger, `_UTrig` = UPDATE trigger.)

## Log ingestion

Every ConquerorServer log line hits the database via
`ADONetBufferedAppender` (from `log4net`). The stored proc target is
`qsp_log_insert` with columns `@Date`, `@Source`, `@Thread`, `@NDC`,
`@Level`, `@Logger`, `@Message`, `@exception`.

This means historical server-side log queries are just SQL queries against
the `SystemLog` table (or whatever `qsp_log_insert` writes to). Very useful
if we ever need to investigate what happened during an import.

## Referring to the schema safely

**Don't write to the DB directly.** ConquerorX bakes rules into triggers and
stored procs (e.g., `Members_ITrig` fires on new members). Bypassing them
would leave the system in an inconsistent state and would fail cloud sync.

**Reading is safer**, but still risky if it's the live production DB —
running a big query could lock tables during a busy shift. If we ever do
read-only queries, either use `WITH (NOLOCK)` (dirty reads) or take a
snapshot backup via `QGetDb.exe` and query the copy.

## Reference

- Full table list, procs, functions, views: [`inventories/13-database-schema-tables.txt`](inventories/13-database-schema-tables.txt)
- SqlScripts folder inventory: [`inventories/12-sql-server-and-schema.txt`](inventories/12-sql-server-and-schema.txt)
