# Filesystem Layout

Every important directory on a ConquerorX install and what lives in it.
Sizes are approximate, captured on 2026-08-24.

## Top-level footprint

| Path | Size | Purpose |
|---|---|---|
| `C:\QDesk\Bin\` | 484 MB | The entire runnable app. All 865 DLLs, ~30 EXEs, help, translations, templates, reports, SQL scripts. |
| `C:\ProgramData\QubicaAMF\` | 1.6 GB | Mutable runtime data — logs, working-copy repositories, animation assets, printer images. |
| `C:\Program Files (x86)\QubicaAMF\` | 0 KB* | Empty on a fresh install; used by ancillary component installers (Font, Third-Party, VncRepeater, BowlingAgent). *(size is dir-only; children install elsewhere)* |
| `C:\Program Files (x86)\QubicaAMF_Internet_Update\` | 244 MB | Working Copy Server + Monitor (multi-language). Update distribution. |

## `C:\QDesk\Bin\` — the application

```
C:\QDesk\Bin\
├── Conqueror.exe                 ← client shell (Windows Forms .NET 4.7.2)
├── Conqueror.exe.config          ← assembly binding redirects
├── Conqueror.log4net.config      ← log4net config for client
├── DailyTaskMonitor.exe          ← scheduled maintenance jobs
├── ReportViewerApp.exe           ← Crystal Reports viewer wrapper
├── StopButton.exe                ← lane emergency stop UI
├── TechSupportClient.exe         ← support screen-share tool
├── Qbk.BixolonSPPR210HostProcess.exe  ← receipt printer driver
├── vncviewer.exe                 ← for remote support
├── Qbk.*.dll                     ← 200+ business-logic DLLs (see 04-modules-and-dlls.md)
├── ConquerorServer\              ← the SERVER-side component (see below)
├── Graphics\                     ← UI skin assets
│   └── Skin\X\LanesGrid.*.png    ← lane-grid glyphs
├── Help\                         ← .chm help files (7 languages, ~10 MB total)
│   ├── ConquerorHelp_EN.chm
│   ├── ConquerorHelp_ES.chm
│   ├── ConquerorHelp_DE.chm      etc.
├── Print\
│   ├── Images\                   ← print-time image assets
│   └── MadGameHeaders\           ← headers for Mad Games score sheets
├── QDeskConfigs\
│   └── RoutingDefs.json          ← plugin route table (SEE extensibility.md)
├── Reports\                      ← 60+ Crystal Reports (.rpt) templates
│   ├── BILLS.rpt
│   ├── EndOfShiftCashOut.rpt
│   ├── LeagueStandings*.rpt
│   ├── DarReport.rpt             (DAR = Daily Activity Report)
│   └── ...
├── Translations\                 ← 30 language files, one per locale
│   ├── Qdesk.0409                (English US — the master reference)
│   ├── QDesk.0410                (Italian)
│   ├── Qdesk.0407                (German)
│   └── ...
├── VirtualWaiterFrontDesk\       ← Qt-based F&B kiosk overlay
├── runtimes\                     ← .NET runtime satellites
└── xlt\                          ← Excel import templates (SEE 08-templates)
    ├── ReservationDetailsImport.xlt
    ├── Members.xlt
    ├── Members with ID.xlt
    └── TournamentPlayers.xlt
```

### `C:\QDesk\Bin\ConquerorServer\` — the server-side component

```
ConquerorServer\
├── ConquerorServer.exe           ← main server process (all business services)
├── ConquerorServer.exe.config    ← includes ASP.NET Core 2.3 refs
├── ConquerorServer.log4net.config ← log4net → SQL Server via qsp_log_insert proc
├── MxSvc.exe                     ← Matrix Configuration Server (a Windows service)
├── MxCtl.exe                     ← Matrix controller CLI
├── DbRepair.exe                  ← ad-hoc DB repair utility
├── QCert.exe                     ← certificate management
├── QGetDb.exe                    ← database dump/restore tool
├── QServerMonitor.exe            ← health monitor
├── QServiceController.exe        ← service control CLI
├── QCloudTestConnection.exe      ← cloud connectivity check
├── RestartServices.exe           ← safely bounces all services in order
├── TechSupport.exe               ← support export bundle builder
├── WebStaticServer.exe           ← static file HTTP server
├── WelcomeMessageEngine.exe      ← lane welcome-message renderer
├── WarningMessageEngine.exe      ← lane warning renderer
├── uftp.exe                      ← UDP file transfer (multicast)
├── 7za.exe                       ← bundled 7-Zip
├── makecab.exe                   ← Windows cab compression
├── CenterReservationSvc.dll      ← reservation domain service
├── CenterCustomerSvc.dll         ← customer domain service
├── CenterBowlingSvc.dll          ← bowling domain service
├── CenterEconomicalSvc.dll       ← revenue/pricing service
├── CenterPaymentSvc.dll          ← payment gateway service
├── CenterSecuritySvc.dll         ← auth + privileges
├── CenterAttractionsSvc.dll      ← redemption/prizes/bar/games
├── BlobStorageEmulatorSvc.dll    ← local blob storage
├── *.dll.config                  ← per-service configs (mostly binding redirects)
├── HeidiSQL\                     ← bundled HeidiSQL for DB browsing
├── MMSAppServer\                 ← Node.js MMS server (see below)
├── QAnimationManager\            ← animation upload/publish tool
├── SqlScripts\                   ← 500+ SQL DDL/migration files
├── qdesk-settings\               ← 22 environment configs
├── StorageConf.json              ← Azure blob storage config
└── HeidiSQL\functions-*.ini      ← HeidiSQL syntax help files per DB engine
```

### `C:\QDesk\Bin\ConquerorServer\MMSAppServer\` — the Node.js layer

```
MMSAppServer\
├── server.config                 ← { experienceIntervals, highscoresInterval, loglevel }
├── server.js                     ← entry
├── runserver.cmd / runserver.js  ← launcher
├── node.cmd                      ← wraps bundled node
├── version.txt                   ← MMS version string
├── data\                         ← runtime data
├── node-builds\                  ← bundled Node.js runtime (Windows binaries)
├── node_modules\                 ← runtime deps
├── lib\
│   ├── client\                   ← client-side JS (delivered to score consoles)
│   │   ├── mms_communication.js
│   │   ├── render_engine.js
│   │   ├── stage_model.js
│   │   ├── stage_presenter.js
│   │   ├── status_observer.js
│   │   ├── video_plugin.js
│   │   └── ...
│   ├── server\                   ← server-side JS
│   │   ├── server.js
│   │   ├── client_dispatcher.js
│   │   ├── request_dispatcher.js
│   │   ├── session_service.js
│   │   ├── status_service.js
│   │   └── video_source_factory.js
│   └── node_modules\             ← nested modules
│       ├── restify               ← the HTTP framework
│       ├── socket.io             ← real-time comms
│       ├── log4js
│       ├── mime, connect, linq, node-xml2js, ...
```

## `C:\ProgramData\QubicaAMF\` — mutable runtime data

```
ProgramData\QubicaAMF\
├── Conqueror\                    ← empty on our install (per-center runtime data)
├── Logs\
│   ├── ConquerorSetup*.log       ← installer logs
│   ├── CrystalSetup.log          ← Crystal Reports installer log
│   ├── Buffer.127.0.0.1.log      ← log4net buffer overflow
│   ├── TerminalsData.json        ← registered terminals map
│   └── WorkingCopyServer\        ← rsync distribution logs
├── Repositories\
│   ├── BesxAnimations\           ← BES X lane animation assets
│   └── Conqueror\
│       └── 15.18.0+22859\        ← current version's repository
│           └── Repository\
│               ├── Conqueror\    ← installer + MSI
│               │   ├── ConquerorSetup.exe
│               │   ├── ConquerorSetup.msi
│               │   ├── ConquerorSetup1.cab
│               │   └── SQL Server Express 2022\   (deps)
│               ├── HelpAndDocs\
│               │   ├── Licenses\License-ReadMe.txt
│               │   └── RegistrationForms\*.pdf   (7 languages)
│               ├── Misc\         ← printer drivers, receipt printer VCOM, etc.
│               └── release.json  ← this version's manifest
├── Bubbles\                      ← UI animation asset cache
│   ├── Animations\
│   ├── BrandKit\
│   ├── YouToons\                 ← Fox YouToons partner integration assets
│   ├── LaneOrder\, LaneServices\
│   ├── Sally\, Dassle\           (score-console personas / themes)
│   └── Pictures\
├── BowlingAgent\
│   ├── Database\
│   │   └── BowlingAgent.db       ← SQLite (separate from main SQL Server)
│   └── Logs\
├── PrintImages\                  ← print asset cache
├── RsyncServer\                  ← rsync serving root (working copy dist)
├── SwapForUpg\                   ← during upgrade — swap directory
└── WorkingCopyServer\            ← working copy state
```

## `C:\Program Files (x86)\QubicaAMF_Internet_Update\` — update pipeline

```
QubicaAMF_Internet_Update\
├── WorkingCopyUpdater.exe        ← Windows service that fetches new versions
├── QWorkingCopy\
└── QWorkingCopyMonitor\
    ├── Monitor\                  ← Desktop tray UI for update status
    │   ├── QWorkingCopyMonitor.exe
    │   ├── cs\, de\, es\, fr\, it\, ja\, ko\, pl\, pt-BR\, ru\, tr\, zh-Hans\, zh-Hant\  (satellite localization DLLs)
    └── Server\                   ← the HTTP server that terminals hit
        ├── QWorkingCopyServer.exe
        ├── Resources\
        └── wwwroot\              ← static content served on 5557/5959
```

## File extension summary

**Under `C:\QDesk\Bin\`** (top 15 by count):

| Extension | Approx count | What |
|---|---|---|
| `.dll` | 865 | Business logic, third-party libs |
| `.config` | 30+ | .NET assembly/binding configuration |
| `.rpt` | 60+ | Crystal Reports templates |
| `.log4net.config` | 4 | Logging configuration |
| `.chm` | 7 | Compiled help |
| `.sql` | 500+ | DDL and migration scripts (in `ConquerorServer/SqlScripts/`) |
| `.js` | many | MMSAppServer Node.js |
| `.png` | many | Skin and glyph assets |
| `.xlt` | 4 | Excel batch import templates |
| `.exe` | ~30 | Executables |
| `.ini` | ~8 | HeidiSQL syntax files, `qdb.ini` |
| `.json` | 25+ | RoutingDefs, StorageConf, qdesk-settings |

## Data files worth knowing

| Path | What |
|---|---|
| `C:\ProgramData\QubicaAMF\BowlingAgent\Database\BowlingAgent.db` | SQLite DB, separate from main SQL Server — likely for Bowling Agent daemon state |
| `C:\ProgramData\QubicaAMF\Logs\TerminalsData.json` | Live list of registered terminals |
| `C:\ProgramData\QubicaAMF\Repositories\Conqueror\<version>\Repository\release.json` | This version's release manifest |
| `C:\QDesk\Bin\ConquerorServer\qdesk-settings\production-stable.json` | The environment config that live centers actually run |
| `C:\QDesk\Bin\QDeskConfigs\RoutingDefs.json` | Plugin route registry — CloudPlugin flags |
| `C:\QDesk\Bin\xlt\ReservationDetailsImport.xlt` | The reservation import contract our tool builds against |

## Log locations

Log4net writes both to disk **and** into the SQL Server via
`qsp_log_insert` stored proc. Disk log locations:

| Log | Location |
|---|---|
| Setup/installer | `C:\ProgramData\QubicaAMF\Logs\ConquerorSetup*.log`, `ConquerorInstaller.log` |
| Working Copy | `C:\ProgramData\QubicaAMF\Logs\WorkingCopyServer\*.log` |
| ConquerorServer runtime | Buffered file `Buffer.127.0.0.1.log` then flushed to DB via `ADONetBufferedAppender` |

To read runtime logs, query the SQL Server table populated by
`qsp_log_insert` (name unknown without live DB access — best guess `SystemLog`
based on the schema, since we saw a `SystemLog` table in `cs0000.sql`).
