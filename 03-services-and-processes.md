# Services, Processes, and Ports

Snapshot taken 2026-08-24 on our local test install running as SERVER role.
Actual Kings terminal may show a subset (TERMINAL role runs fewer services).

## Windows services (installed and started)

| Service name | Status | Start | Executable | Purpose |
|---|---|---|---|---|
| `MxSvc` | Running | Auto | `C:\QDesk\Bin\ConquerorServer\MxSvc.exe` | Matrix Configuration Server — the master coordinator |
| `QWorkingCopyServer` | Running | Auto | `C:\Program Files (x86)\QubicaAMF_Internet_Update\QWorkingCopyMonitor\Server\QWorkingCopyServer.exe` | Hosts the working-copy distribution to terminals |
| `WorkingCopyUpdater` | Stopped | Manual | `C:\Program Files (x86)\QubicaAMF_Internet_Update\WorkingCopyUpdater.exe /runservice` | Fetches new versions from `dist.qubicaamf.com` |
| `MSSQL$CONQUERORX` | Running | Auto | (SQL Server Express 2022) | The named instance holding the reservation DB |
| `SQLBrowser` | Running | Auto | (SQL Server) | Named-instance discovery on port 1434 UDP |
| `SQLTELEMETRY$CONQUERORX` | Running | Auto | (SQL Server) | Microsoft CEIP telemetry — safe to disable on a locked-down box |

**MxSvc** is the important one. It's the "Matrix" configuration server that
coordinates every terminal, every lane, every score console. If MxSvc is
down, nothing else works.

## Running processes owned by ConquerorX (SERVER role)

| PID (snapshot) | Process | Path | Role |
|---|---|---|---|
| 32976 | `ConquerorServer.exe` | `...\QDesk\Bin\ConquerorServer\` | The big one — all business services, ASP.NET Core layer, most listening ports |
| 29184 | `BowlingAgent` | (BowlingAgent install) | Daemon that talks to lane hardware / scoring; ports 5130, 7014 |
| 35196 | `node.exe` | `...\MMSAppServer\node-builds\node.exe` | MMS Node.js layer; port 8760 |
| 8328 | `QWorkingCopyServer.exe` | (Internet Update path) | Update distribution; ports 5557, 5959 |
| — | `MxSvc.exe` | `...\ConquerorServer\` | Runs as Windows service, not always visible as user process |
| — | `sqlservr.exe` | (SQL Server) | The DB engine, dynamic ephemeral port 64002 in our snapshot |

## Listening TCP ports (owned by QubicaAMF processes)

Sorted by port number.

| Port | Process | Bound | Likely purpose |
|---|---|---|---|
| 873 | rsync | 0.0.0.0 | Working Copy distribution to terminals |
| 2345 | ConquerorServer | 0.0.0.0 | Business services endpoint |
| 2387 | ConquerorServer | 0.0.0.0 | Business services endpoint |
| 3535 | ConquerorServer | 0.0.0.0 | Business services endpoint |
| 5130 | BowlingAgent | ::  (IPv6) | Lane hardware comms |
| 5555 | ConquerorServer | 0.0.0.0 | Business services endpoint |
| 5556 | ConquerorServer | 0.0.0.0 | Business services endpoint |
| 5557 | QWorkingCopyServer | 0.0.0.0 | Working Copy HTTPS |
| 5959 | QWorkingCopyServer | 0.0.0.0 | Working Copy status/monitor |
| 6767 | ConquerorServer | 0.0.0.0 | Business services endpoint |
| 7014 | BowlingAgent | :: | Lane hardware comms (secondary) |
| 7024 | ConquerorServer | 0.0.0.0 | Business services endpoint |
| 8018 | ConquerorServer | 0.0.0.0 | ASP.NET Core HTTP endpoint (likely) |
| 8048 | ConquerorServer | 0.0.0.0 | ASP.NET Core HTTP endpoint (likely) |
| 8084 | ConquerorServer | 0.0.0.0 | Web UI / SPA hosting (WebStaticServer wraps here) |
| 8760 | node (MMS) | 0.0.0.0 | Socket.IO for score displays |
| 64002 | sqlservr | :: | SQL Server (dynamic named-instance port) |

**Ports 2345 / 2387 / 3535 / 5555 / 5556 / 6767 / 7024 / 8018 / 8048 / 8084**
all belong to a single ConquerorServer process. That process hosts many
services simultaneously — each port probably maps to one service/module
(reservation, customer, bowling, cash, payment, etc.). Confirming the
port→service mapping would need either a WCF endpoint dump or a live packet
capture, both out of scope for this pass.

## UDP listeners

Nothing app-specific found under the QubicaAMF process filter. SQL Browser
would be on 1434 UDP but wasn't listed under our filter.

## Windows Firewall rules

Windows Firewall is **enabled** on all three profiles (Domain, Private,
Public) with `DefaultInboundAction = NotConfigured` (block by default). The
ConquerorX installer registers 14 dedicated inbound allow rules, all
scoped to all three profiles:

| Rule display name | Likely covers |
|---|---|
| `Qubica Mx Service` | MxSvc control-plane traffic |
| `Qubica Conqueror server` | The main ConquerorServer port bank (2345, 2387, 3535, 5555, 5556, 6767, 7024, 8018, 8048, 8084) |
| `Qubica SQL Server Instance` | 64002 dynamic named-instance port |
| `Qubica MMS App` | 8760 (Node.js Socket.IO) |
| `Qubica Web static server` | Static SPA host |
| `Qubica Working Copy Server` | 5557, 5959 |
| `Qubica Working Copy Monitor` | Update-monitor tray comms |
| `Qubica Rsync Server` | 873 (Working Copy distribution) |
| `Qubica Score Tcp` | Score-console TCP |
| `Qubica Score Udp` | Score-console UDP |
| `Qubica Bubbles` | Bubbles asset service |
| `Qubica Sally server` | Sally score-console persona server |
| `Qubica Stop Button` | Emergency stop button traffic |
| `BowlingAgent` | 5130 + 7014 lane hardware bridge |

Practical implication: any terminal on the LAN can reach any of these
services on the server host, but external networks are blocked by the
default `NotConfigured` inbound stance. Cloud outbound (to
`qcloud.qubicaamf.com`, etc.) is not restricted by these rules — that flows
via the default outbound allow.

To audit live at any time:

```powershell
Get-NetFirewallRule | Where-Object DisplayName -match 'Qubica|BowlingAgent' |
  Select-Object DisplayName, Enabled, Direction, Action, Profile |
  Format-Table -AutoSize
```

## Utility executables (not services — invoked as tools)

| Executable | Purpose |
|---|---|
| `RestartServices.exe` | Bounces the whole service stack in dependency order |
| `QCloudTestConnection.exe` | Runs a diagnostic against `qcloud.qubicaamf.com` |
| `DbRepair.exe` | Ad-hoc DB integrity / repair |
| `QGetDb.exe` | Dump / restore the SQL Server DB |
| `QCert.exe` | Rotate the local CA-signed certificate |
| `TechSupportClient.exe` / `TechSupport.exe` | Build support export bundle |
| `vncviewer.exe` | Included for QubicaAMF remote-support sessions |
| `DailyTaskMonitor.exe` | Scheduled maintenance jobs |

## Reference

- Full raw port listing: [`inventories/06-network-and-ipc.txt`](inventories/06-network-and-ipc.txt)
- Full service dump: [`inventories/02-executables-and-services.txt`](inventories/02-executables-and-services.txt)
