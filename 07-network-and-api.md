# Network & API Surface

Every network endpoint ConquerorX opens, and everything we know about what
speaks each one.

## LAN-side (on the center's own network)

### The main `ConquerorServer.exe` port bank

One .NET process listens on 10 TCP ports simultaneously. Each is bound to
`0.0.0.0` (all interfaces), so they're reachable from any terminal on the
LAN, and from the internet if the box is exposed.

| Port | Best guess for what's on it |
|---|---|
| 2345 | Legacy business-services RPC (round-number = human-picked) |
| 2387 | Legacy business-services RPC |
| 3535 | Legacy business-services RPC |
| 5555 | Legacy business-services RPC |
| 5556 | Legacy business-services RPC (paired with 5555, likely primary+backup) |
| 6767 | Legacy business-services RPC |
| 7024 | Legacy business-services RPC |
| **8018** | ASP.NET Core HTTP endpoint (evidence: `Microsoft.AspNetCore.*` DLLs in server folder) |
| **8048** | ASP.NET Core HTTP endpoint (paired?) |
| **8084** | Web SPA + static files (evidence: `WebStaticServer.exe` alongside) |

The 4-digit port numbers with even patterns and the presence of ASP.NET Core
2.3 assemblies strongly suggest 8018/8048/8084 host REST endpoints. Not yet
verified with a live probe.

### Working Copy update distribution

| Port | Service | What |
|---|---|---|
| 873 | rsync | Terminal file-sync from server (Working Copy) |
| 5557 | `QWorkingCopyServer.exe` | HTTPS distribution endpoint |
| 5959 | `QWorkingCopyServer.exe` | Status / monitor endpoint |

### Lane hardware bridge

| Port | Service | What |
|---|---|---|
| 5130 | `BowlingAgent` (IPv6) | Primary lane hardware channel |
| 7014 | `BowlingAgent` (IPv6) | Secondary lane hardware channel |

### MMS (score-console real-time comms)

| Port | Service | What |
|---|---|---|
| 8760 | `node.exe` (MMSAppServer) | Socket.IO for score displays |

### Database

| Port | Service | What |
|---|---|---|
| 64002 (dynamic) | `sqlservr.exe` (MSSQL$CONQUERORX) | Client access to the DB. Named-instance port is dynamic, SQL Browser (UDP 1434) helps clients find it. |

## Cloud-side (out to QubicaAMF's Azure infrastructure)

All from `qdesk-settings/production-stable.json`:

| Endpoint | Purpose |
|---|---|
| `qcloud.qubicaamf.com` | Main cloud back-end for centralization, cloud data, license, cloud plugins |
| `qportal.qubicaamf.com` | Web portal, the customer-facing management site |
| `dist.qubicaamf.com` | Update distribution + `/localca/QubicaAMF-LocalCA.cer` for internal HTTPS trust |
| `resourcesexpoqamfeuw.blob.core.windows.net` | Azure Blob for shared assets (animations, marketing kits) |
| `eastus-8.in.applicationinsights.azure.com` | App Insights telemetry ingest (production tier) |
| `qportal-*.azurewebsites.net` | Development/testing portals |

All outbound HTTPS. The `qcloud.qubicaamf.com` connection is stateful, the
translation strings warn "Conqueror Server cannot connect to the Cloud
because another Conqueror Server is already connected", suggesting each
center gets one active cloud connection (with spare-server failover).

## What we know about the API shape

### From binary and translation evidence

- **ASP.NET Core 2.3** is loaded by `ConquerorServer.exe`: implies REST /
  Web API endpoints exist (Microsoft.AspNetCore.Mvc.Core, .Mvc.Formatters.Json,
  Microsoft.AspNetCore.Routing, .Http.Abstractions all present).
- **`WebStaticServer.exe`** serves the SPA, probably hosts a single-page
  app under one of the 80xx ports.
- **Socket.IO** on 8760 (MMSAppServer) is the real-time channel, used to
  push score updates and lane status changes to the score consoles.
- **restify** is bundled in MMSAppServer's `node_modules`: that means the
  Node.js side of MMS also exposes HTTP endpoints, not just Socket.IO.

### Legacy vs modern

- The **round-number ports** (2345, 3535, 5555, 6767, etc.) look like
  hand-picked WCF service endpoints, the legacy .NET Framework style.
- The **8018/8048/8084** bank is where the modern ASP.NET Core surface
  likely lives.
- Suggests ConquerorX is in a slow migration from WCF → ASP.NET Core, which
  fits the pattern of a long-lived enterprise product incrementally
  modernizing.

### Auth

- `adb2cAuth: {}` and `oidcAuth: {}` are reserved in the config schema ,
  authentication support is being built out but not yet used in the shipped
  environments we can see.
- Current auth is presumably local (username + password stored in
  `AccessRights`/`Profiles`/`UserProfiles` DB tables) or fingerprint /
  membership card (evidence from translation strings).

## MMSAppServer: the Node.js layer

Bundled Node.js server that handles real-time score/status comms. Source
lives at `C:\QDesk\Bin\ConquerorServer\MMSAppServer\lib\`.

**Server-side files:**
- `server.js`: main entry
- `client_dispatcher.js`: routes incoming client messages
- `request_dispatcher.js`: routes HTTP requests
- `session_service.js`: session management
- `session_factory.js`: session creation
- `status_service.js`: lane/console status API
- `video_source_factory.js`: video source management
- `arguments_parser.js`: CLI argument parsing
- `current_session_notifier.js`: session change notifications
- `device_decoder.js`: device type decoding
- `log_manager.js`: logging
- `message_cache.js`: message caching

**Client-side files** (JavaScript delivered to score consoles):
- `mms_communication.js`: the client's socket wrapper
- `render_engine.js`: display rendering
- `stage_model.js` / `stage_presenter.js`: MVP for stage content
- `status_observer.js`: status change watcher
- `translator.js`: localization
- `video_plugin.js`: video playback

**Deps bundled:**
- `restify`: HTTP framework
- `socket.io` + `socket.io-client`: real-time
- `log4js`: logging
- `mime`, `connect`, `linq`, `node-async`, `node-formidable`, `node-static`,
  `node-xml2js`, `modulr`, `uglify-js`

**Only one HTTP route grep-hit found in the sources:**
- `httpClient.get('/recovery/' + side)`: recovery endpoint used by client dispatcher

That's a very thin API surface visible in the source, the bulk of the
comms happens over the Socket.IO channel.

## Practical implications for integration

- **If we ever want a live lane-status dashboard**, the cleanest path is to
  connect to the MMSAppServer Socket.IO port (8760) and observe the same
  events the score consoles receive. Read-only, no DB writes required.
- **REST integration** on 8018/8048/8084 is possible if we discover the
  endpoint routes, needs live probing or DLL decompilation.
- **The WCF ports** (2345/…/7024) are less accessible; even if we found the
  contract, WCF SOAP integration is heavyweight.
- **QCloud** is QubicaAMF-branded, third parties can't call it, but partner
  services (Square receipt plugin, Picture Validation) do.

## Reference

- All live ports: [`inventories/06-network-and-ipc.txt`](inventories/06-network-and-ipc.txt)
- MMSAppServer inventory: [`inventories/15-mmsappserver-and-plugins.txt`](inventories/15-mmsappserver-and-plugins.txt)
