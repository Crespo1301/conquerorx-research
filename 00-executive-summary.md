# ConquerorX: Executive Summary

## What ConquerorX is

**Conqueror X** is QubicaAMF's centralized management platform for a bowling
center. It runs the front desk, POS, lane control, reservations, leagues,
tournaments, food & beverage, cashless payments, customer database, shift
reports, and the connection to QubicaAMF's cloud services. Everything a
Kings-style location does behind the scenes goes through it.

Kings Seaport (and every other AMF-branded modern bowling center) runs on
this. It's the de facto standard for the industry.

## Origin and vendor

- **QubicaAMF Worldwide:** headquartered in Bologna, Italy, with a US arm.
  Formed from the merger of Qubica (scoring) and AMF Bowling Products
  (hardware). Italian roots are visible everywhere in the code, internal
  table names like `ApriPiste` (open lanes), `GiocatoriLeague` (league
  players), `PisteLeague` (league lanes).
- Conqueror X is the current-generation product; predecessors were
  "Conqueror Pro" and "Conqueror 2000". Score-system generations (BES V,
  BES X, Frameworx, AS 80/90, BOSS) are all supported and switchable per
  install.

## Architecture in one sentence

**A .NET Framework 4.7.2 client-server system backed by SQL Server, extended
by an ASP.NET Core 2.3 web layer, a Node.js MMS communication server, and a
QubicaAMF cloud back-end for updates and multi-center features.**

## Key facts (10 that shape everything)

1. **`C:\QDesk\Bin\`:** the entire install lives here, ~484 MB, 865 DLLs,
   ~30 EXE files.
2. **SQL Server named instance `MSSQL$CONQUERORX`:** the whole customer,
   reservation, league, and financial data model. 142 base tables, ~100
   stored procedures, all defined in DDL scripts under
   `C:\QDesk\Bin\ConquerorServer\SqlScripts\`.
3. **`ConquerorServer.exe`:** one giant Windows service (PID 32976 in our
   snapshot) that listens on 10+ TCP ports (2345, 2387, 3535, 5555, 5556,
   6767, 7024, 8018, 8048, 8084) and hosts most of the API surface.
4. **`Conqueror.exe`:** the client GUI (Windows Forms). Every workstation
   in the center is a "Terminal" pointing at a Server.
5. **Two-tier install: SERVER vs TERMINAL**, chosen at setup time. Our test
   box first installed as TERMINAL, then had to add SERVER to have anything
   to connect to.
6. **QCloud** at `qcloud.qubicaamf.com`: production cloud back-end. Six
   environment tiers (`production`, `staging`, `expo`, `development`,
   `testing-slot-01`…`05`), each with `stable`/`beta` channels. Full config
   files for all 26 combinations ship in `qdesk-settings/`.
7. **Working Copy:** QubicaAMF's version distribution system.
   `QWorkingCopyServer.exe` on port 5557/5959 pulls updates from the mothership
   and distributes them to terminals over rsync (port 873 is running).
8. **MMSAppServer:** a Node.js server (port 8760) bundled inside the
   ConquerorX install, running on QubicaAMF's own `node-builds/` toolchain.
   Uses `restify` + `socket.io` for real-time comms with score displays.
9. **RoutingDefs plugin system:** the ConquerorX front-end declares a
   pluggable route table (`RoutingDefs.json`) with `CloudPlugin` flag for
   Azure-hosted plugins (SquareReceiptPlugin, PictureValidation, Calculator,
   CashDrawer, CashDrawerReport) and local plugins (LaneOptions, Loyalty,
   MultiAttractions, CashlessRecharge/Pay, Home, Pos).
10. **Four Excel import templates** live in `C:\QDesk\Bin\xlt\`:
    `ReservationDetailsImport.xlt`, `Members.xlt`, `Members with ID.xlt`,
    `TournamentPlayers.xlt`. This is the officially-blessed batch input
    surface. There are no CLI or REST batch import endpoints.

## What our tool (kings-morning-reservations-builder) hooks into

The reservation-import tool feeds *the same* `.xls` shape that
ConquerorX's manual back-office import expects, one reservation per file,
per the `ReservationDetailsImport.xlt` template. The AutoHotkey helper
automates the file-picker portion of the manual import dialog. Nothing
touches the ConquerorX process, database, or network directly.

## Extensibility surfaces (from most to least accessible)

1. **Excel batch imports:** the four `.xlt` templates. What we already use.
2. **QCloud plugins:** third-party HTML plugins loaded into ConquerorX via
   `RoutingDefs.json` `CloudPlugin: true`. This is how Square receipt printing,
   image capture validation, and other partner integrations show up as
   first-class buttons inside the ConquerorX UI. Would need QubicaAMF partner
   status to publish one properly.
3. **Micros POS integration:** deeply built-in. XML-based. Every menu item,
   revenue center, and order flows out through it. If Kings had a Micros F&B
   system this is the pipe.
4. **QuickBooks export:** mentioned in the translations, no other detail yet.
5. **BowlerTrac XML / OVR DBF imports:** legacy customer-data import formats
   supported alongside Excel.
6. **Direct SQL Server access:** possible on the local network with the
   right credentials, but touching the ConquerorX DB directly is unsupported
   and would risk data integrity.
7. **Socket.IO connection to MMSAppServer:** the Node.js layer speaks
   Socket.IO for score display comms. Not documented, potentially useful for
   a lane-status dashboard.

## Threat model for our integration work

- **Read-only observation:** always safe. What this whole doc set is.
- **Manual file-picker automation (our AutoHotkey helper):** safe, no
  different from a human doing it faster.
- **Direct database writes:** unsafe. ConquerorX has triggers, computed
  fields, and business rules in stored procs that we'd bypass.
- **Faking Working Copy updates:** unsafe. Cryptographically signed, would
  fail signature check.
- **Publishing a CloudPlugin:** requires QubicaAMF partner enrollment ,
  unknown process, no public docs.

## Guiding principle

QubicaAMF built this for a specific vertical over ~20 years. The internals
are dense and non-obvious but they're internally consistent. When we
integrate, we should **follow the seams they built** (Excel imports, cloud
plugins, Micros hooks) instead of inventing new ones (direct DB access,
process injection). The rest of this doc set maps out where those seams are.
