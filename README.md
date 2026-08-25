# ConquerorX Research Documentation

Reverse-engineered notes on **QubicaAMF Conqueror X** (bowling-center management
platform), captured from a local install on 2026-08-24. Built to give future
integration work at Kings Seaport a full-picture reference of what the system
is, how it's built, and where it exposes seams for external tools.

Nothing here is official QubicaAMF documentation. Everything is derived from
file paths, DLL string tables, config JSON, SQL scripts, and translation
files on a live install at `C:\QDesk\Bin\`.

## Study target

| | |
|---|---|
| **Product** | Conqueror X (a.k.a. QDesk client + Conqueror Server) |
| **Vendor** | QubicaAMF Worldwide (Bologna, Italy) |
| **Version studied** | 15.18.0+22859 (installed 2026-08-22) |
| **Install machine** | Carlos Crespo's Windows dev laptop (in-house test rig) |
| **Live customer target** | Kings Seaport bowling center (real ConquerorX terminal) |

## Document map

Start with `00-executive-summary.md`. Every subsequent doc is a deep-dive into
one system area.

| # | Doc | What it covers |
|---|---|---|
| 00 | [executive-summary.md](00-executive-summary.md) | Elevator pitch, key architecture facts, extensibility TL;DR |
| 01 | [architecture.md](01-architecture.md) | Server, Terminal, Cloud, Working Copy update pipeline |
| 02 | [filesystem-layout.md](02-filesystem-layout.md) | Every important folder and what lives in it |
| 03 | [services-and-processes.md](03-services-and-processes.md) | Windows services, listening ports, running processes |
| 04 | [modules-and-dlls.md](04-modules-and-dlls.md) | The `Qbk.*` DLL family grouped by feature area |
| 05 | [database-schema.md](05-database-schema.md) | SQL Server `CONQUERORX` instance, tables, procs, functions, views, triggers |
| 06 | [configuration.md](06-configuration.md) | `.config`, `.json`, `.log4net.config`, `qdesk-settings/` |
| 07 | [network-and-api.md](07-network-and-api.md) | Local ports, cloud endpoints, MMSAppServer Node.js layer |
| 08 | [templates-and-imports.md](08-templates-and-imports.md) | The four Excel templates and other exchange formats |
| 09 | [extensibility.md](09-extensibility.md) | RoutingDefs plugins, Add-ons, in-tree Plugin DLLs |
| 10 | [integrations.md](10-integrations.md) | Micros, QuickBooks, Square, BowlerTrac, OVR, Cloud sync |
| 11 | [glossary.md](11-glossary.md) | BES X, Frameworx, MMS, TCS, QCloud, QDesk, QPad, FBT, etc. |
| 12 | [open-questions.md](12-open-questions.md) | What we still don't know and how to find out |
| 13 | [operations-troubleshooting.md](13-operations-troubleshooting.md) | **Living incident log:** patterns, symptoms, diagnoses (including full TCS reference + comm-chain sequence diagram). Update this after real shifts. |
| 14 | [booking-system-reference.md](14-booking-system-reference.md) | **Booking System deep-read:** 12-status reservation lifecycle (Mermaid state diagram), required fields, our tool's placement in the flow. |
| 15 | [reports-catalog.md](15-reports-catalog.md) | Every one of the 182 Crystal Reports templates categorized + the 7 built-in Statistical Reports. |
| 16 | [lane-management.md](16-lane-management.md) | **Lane Management deep-read:** opening modes, lane lifecycle (Mermaid state diagram), control panel actions, per-scoring-family behavior. |
| 17 | [api-surface.md](17-api-surface.md) | **REST + WCF API inventory:** WebBookingApi (25+ ASP.NET Core routes for reservations, availability, customers) and FlexyBook (WCF lane realtime API). The migration path away from Excel import + AutoHotkey. |
| 18 | [mms-realtime.md](18-mms-realtime.md) | **MMSAppServer deep-read:** Node.js Socket.IO real-time fan-out layer on port 8760, 10 service channels, message-flow sequence diagram, path to a live lane dashboard. |
| 19 | [point-of-sale.md](19-point-of-sale.md) | **POS deep-read:** sales, tabs, tips, deposits, refunds, tax exemption, credit-card providers, payment types, related SQL tables and reports. |
| 20 | [shift-management.md](20-shift-management.md) | **Shift Management deep-read:** sectors, cash drawer sessions (Mermaid state diagram), personal drawers, shift reporting, privileges, QuickBooks/Dassle exports. |
| 21 | [fbt-membership.md](21-fbt-membership.md) | **FBT (Frequent Bowler Tracking) deep-read:** member records, cards, QCash + Points + Games-on-Account balances (ER + flow diagrams), duplicate detection, import/export, mail merge, reporting. |
| 22 | [center-setup.md](22-center-setup.md) | **Center Setup deep-read:** the master configuration module. 10 sub-areas covering security, lane defaults, pricing model per opening mode, receipt formatting, per-scoring-generation hardware config, integrations, backups, intercom. |
| 23 | [kings-seaport-layout.md](23-kings-seaport-layout.md) | **Site-specific intake template** for Kings Seaport: room-to-lane mapping, terminal roster, network + server host, maintenance contacts. Fill from a single floor walk with the opening manager. |
| 24 | [master-architecture.md](24-master-architecture.md) | **Master architecture visual:** the whole ConquerorX system on one page across 5 Mermaid diagrams (physical deployment, component graph, ingest paths, reservation state machine, layer stack). Read this after doc 00 for the wide-angle view. |
| 25 | [leagues.md](25-leagues.md) | **Leagues deep-read:** all four league variants (standard, BLS, Swedish, Danish), 17-field creation form for standard, financial model (linage, prize fund, banquet fund), Peterson Points, handicap systems, Mermaid league-night lifecycle. |
| 26 | [tournaments.md](26-tournaments.md) | **Tournaments deep-read:** three-layer hierarchy (Tournament, Event, Squad), auto-movement engine, roster + team + player setup, standings, Mermaid tournament lifecycle. Complement to Leagues. |
| 27 | [security.md](27-security.md) | **Security deep-read:** staff roster, profiles with 6 privilege tabs (Operate, Shifts, Prices, Technical, Management, Reservations), 3 recognition modes (fingerprint / card / password), Safe Mode, Quick Authorization, System Log, Suspect Actions. Mermaid ER + login sequence. |

## Market context: why we care about this platform

[`research/01-market-context.md`](research/01-market-context.md), Web
research on Lyons Group / Kings Dining & Entertainment ownership, the
industry duopoly (QubicaAMF vs Brunswick), why Kings runs Conqueror X
specifically (hardware lock-in, not preference), competitor pricing
benchmarks, and what other bowling chains use. Answers "why does this
matter for our tools", the same platform runs across all 10 Kings
locations, so anything we build has chain-wide leverage.

## Official product documentation (extracted)

`extracted-strings/` holds the officially-shipped English help file, mined
in full:

| File | What |
|---|---|
| `chm-en-outline.md` | Complete table of contents (2035 lines, 2026 entries across 30 top-level product areas) |
| `chm-en-corpus.txt` | 835 KB plain-text corpus of all 535 help topics, grep for any feature question |
| `chm-en/` | Raw extracted HTML + CSS + images, original files as QubicaAMF ships them |

Extracted via Windows `hh.exe -decompile` from
`C:\QDesk\Bin\Help\ConquerorHelp_EN.chm` (v15.18.0). Six other language
CHMs sit alongside, extract with the same method if a non-English
reference is needed.

## Raw evidence

All inventories live in [`inventories/`](inventories/), these are the raw
tool outputs the summary docs are built from. Kept committed so a future
reader can verify claims against the actual filesystem snapshot.

| File | Source |
|---|---|
| `01-filesystem-topology.txt` | `find` + `du` over all QubicaAMF paths |
| `02-executables-and-services.txt` | Windows service catalog, running processes, TCP listeners |
| `03-dll-inventory.txt` | 865 DLLs in `C:\QDesk\Bin\` grouped by prefix |
| `04-config-files.txt` | Every `.config`, `.ini`, `.json`, `.xml` config file path |
| `05-database-and-data.txt` | SQL Server services, database files, connection-string search |
| `06-network-and-ipc.txt` | Listening TCP/UDP ports, firewall rules, MMSAppServer inventory |
| `07-templates-and-exchange.txt` | `.xlt` templates, `.rpt` Crystal reports, `.cer` files |
| `08-localization-inventory.txt` | 30 language translation files (Qdesk.0409 = English) |
| `09-help-and-official-docs.txt` | `.chm` files, PDFs, README files bundled with the install |
| `10-config-content.txt` | Contents of key config files (secrets redacted) |
| `11-key-configs-verbatim.txt` | `RoutingDefs.json`, `StorageConf.json`, all `qdesk-settings/*.json` |
| `12-sql-server-and-schema.txt` | `MSSQL$CONQUERORX` instance, `SqlScripts/` folder |
| `13-database-schema-tables.txt` | 142 tables, 100+ stored procs, functions, views, triggers |
| `14-features-and-strings.txt` | Dialog names, menus, reports, permissions, integrations extracted from EN translation |
| `15-mmsappserver-and-plugins.txt` | MMSAppServer Node.js source layout, RoutingDefs plugin table |

## How the extraction was done

- Filesystem walks via `find` over `/mnt/c/QDesk`, `/mnt/c/ProgramData/QubicaAMF`,
  `/mnt/c/Program Files (x86)/QubicaAMF*`.
- Service and process enumeration via `powershell.exe Get-CimInstance` and
  `Get-NetTCPConnection`.
- DLL grouping by naming prefix (`Qbk.Reservations.*`, `Qbk.Customers.*`, …).
- Translation strings via `strings` on the flat UTF-8 `Qdesk.0409` file.
- SQL DDL via `iconv -f UTF-16LE` on the SQL script files, then `grep` for
  CREATE statements.
- Config file contents via `sed` with basic password/apikey/token redaction.
- No processes, services, or files were modified. All reads.

## Not investigated (deliberately)

- **Live SQL Server queries:** the instance rejected our Microsoft-account
  Integrated Security, and rather than reset the sa password on a working test
  install we relied on the static DDL scripts, which are more useful anyway.
- **DLL decompilation:** the `Qbk.*` assemblies are .NET and could be opened
  in ILSpy/dnSpy, but we didn't. Structural evidence (names + config +
  translation strings + templates) has been enough so far.
- **CHM help contents:** `.chm` extraction needs Windows-side tooling; the
  file paths are logged but the pages are not yet mined.

## Update flow

When ConquerorX gets upgraded on the local install:

1. Re-run all `inventories/*.txt` gatherers (they're idempotent, safe to
   overwrite).
2. Diff against the committed versions.
3. Update the summary docs where a real change happened, not for every
   patch-level version bump.
