# Master Architecture Visual

One document, five Mermaid diagrams. Ties every other doc in this set
together at a glance. Read this after `00-executive-summary.md` when a
new reader wants the whole system on one page.

The five diagrams below each answer a distinct question:

1. **Where does everything live?** (physical deployment)
2. **Who talks to whom?** (component + protocol graph)
3. **How does data get in?** (ingest paths from Tripleseat, web reservations, walk-ins)
4. **What state does a reservation move through?** (lifecycle end-to-end)
5. **What are the layers?** (stack, from lane hardware to Azure cloud)

## 1. Physical deployment (where things live)

```mermaid
flowchart TB
    subgraph Kings["Kings Seaport (LAN)"]
        subgraph Server["Conqueror SERVER host (one PC, back office)"]
            CS[ConquerorServer.exe<br/>10+ ports incl. 8018/8048/8084]
            MMS[MMSAppServer<br/>Node.js, port 8760]
            MX[MxSvc<br/>Matrix Config Server]
            BA[BowlingAgent<br/>ports 5130/7014]
            WCS[QWorkingCopyServer<br/>ports 5557/5959]
            DB[(SQL Server<br/>MSSQL$CONQUERORX<br/>142 tables)]
            CS <--> DB
            MMS <--> CS
            MX <--> CS
            BA <--> MX
        end

        subgraph Terminals["Terminal PCs"]
            FD[Front Desk<br/>Conqueror.exe]
            Bar[Bar / Manager PC<br/>Conqueror.exe]
            Kiosk[Optional Kiosk / QPad]
        end

        subgraph Lanes["Lane hardware"]
            SC13["Score console pod<br/>lanes 13/14"]
            SC14["Score console pod<br/>lanes 15/16"]
            SCX["... etc."]
            Pin["MAG 3 pinsetters<br/>1 per lane"]
        end

        Router{"LAN switch"}
        FD <--> Router
        Bar <--> Router
        Kiosk <--> Router
        Router <--> Server
        Router <--> SC13
        Router <--> SC14
        Router <--> SCX
        SC13 <--> Pin
    end

    subgraph Cloud["QubicaAMF Azure Cloud"]
        QC[qcloud.qubicaamf.com<br/>centralization + license]
        DIST[dist.qubicaamf.com<br/>working copy source + CA]
        AI[Azure Application Insights<br/>telemetry]
    end

    subgraph Third["Third-party services"]
        TS[Tripleseat<br/>event booking source]
        Sq[Square<br/>receipt printing plugin]
        CC[Payment processors<br/>PAYware / TranCloud]
    end

    Server -->|HTTPS| QC
    Server -->|HTTPS| DIST
    Server -->|HTTPS| AI
    Server -.->|out-of-band| TS
    Server -->|integration| Sq
    Server -->|integration| CC
```

## 2. Component + protocol graph (who talks to whom)

```mermaid
flowchart LR
    subgraph Client["Client layer"]
        CX[Conqueror.exe<br/>Windows Forms<br/>.NET 4.7.2]
        BROW[Web reservation<br/>widget]
        KIOSK[Kiosk]
    end

    subgraph Server["ConquerorServer.exe (server host)"]
        WCF[WCF services<br/>ports 2345/2387/3535<br/>5555/5556/6767/7024]
        WBA[WebBookingApi<br/>ASP.NET Core<br/>25+ REST routes]
        FBA[FlexyBook API<br/>WCF ServiceModel.Web<br/>11 REST routes]
        Static[WebStaticServer<br/>SPA host]
        Auth[IdentityProviderSvc<br/>JWT issuer]
    end

    MMS[MMSAppServer<br/>Node.js + Socket.IO<br/>port 8760]
    MX[MxSvc<br/>Matrix Config]
    BA[BowlingAgent<br/>5130/7014]
    Lanes[BES X Score Consoles]

    subgraph Data["Persistence"]
        SQL[(MSSQL$CONQUERORX)]
        BALocal[(BowlingAgent<br/>local SQLite)]
    end

    CX <-->|WCF binary| WCF
    CX <-->|HTTPS| Static
    BROW -->|POST /booking| WBA
    BROW -->|GET /availability| WBA
    KIOSK -->|Socket.IO| MMS
    Lanes -->|Socket.IO| MMS
    Lanes -->|Q2A protocol| BA

    WCF --> SQL
    WBA --> SQL
    FBA --> SQL
    MX --> SQL
    BA --> BALocal

    WBA -->|token issuance| Auth
    Auth --> SQL

    MX --> BA
    MMS <-.->|HTTP POST /*.conq<br/>XML messages| WCF
```

## 3. How reservations get in (three ingest paths)

```mermaid
flowchart TB
    subgraph Sources["Reservation sources"]
        A[Kings staff walk-up<br/>at front desk]
        B[Web reservation widget<br/>Kings public site]
        C[Tripleseat<br/>third-party event mgmt]
    end

    subgraph Paths["Ingest paths into ConquerorX"]
        A -->|Conqueror.exe UI<br/>New Reservation button| WCF[WCF service]
        B -->|POST /booking<br/>on WebBookingApi| WBA[WebBookingApi]
        C -->|export CSV/XLSX<br/>then run reservations-builder| Tool
        Tool[reservations-builder<br/>morning_import_builder.py]
        Tool -->|writes conquerorx-import-DATE folder<br/>one .xls per event| XLS
        XLS[per-event .xls files]
        XLS -->|manual click or<br/>AutoHotkey helper| ImportDLL[Qbk.Reservations.Importer.dll]
    end

    subgraph Landing["Where they land"]
        WCF --> RsvTable[(RsrvHdr + RsrvBody tables<br/>status = Confirmed)]
        WBA --> RsvTable
        ImportDLL --> RsvTable
    end

    RsvTable --> Grid[Reservation Sheet<br/>front desk grid view]
```

Our `reservations-builder` is the third path. Documented in
[`14-booking-system-reference.md`](14-booking-system-reference.md).
The API path (WebBookingApi) is the migration target documented in
[`17-api-surface.md`](17-api-surface.md).

## 4. Reservation state machine (the 12 statuses)

Full lifecycle from creation to complete. See
[`14-booking-system-reference.md`](14-booking-system-reference.md) for
per-status detail; this compressed version shows the whole picture.

```mermaid
stateDiagram-v2
    [*] --> Provisional : create (no deposit)
    [*] --> Confirmed : create (deposit)

    Provisional --> Confirmed : deposit paid
    Provisional --> Cancelled : deposit expires
    Confirmed --> Late : customer late
    Confirmed --> Cancelled : deleted
    Confirmed --> Arrived : Set Arrived
    Confirmed --> NoShow : never arrives

    Late --> Arrived : arrives
    Late --> NoShow : never arrives

    Arrived --> Ready : Set Ready
    Arrived --> Delayed : start time expires

    Delayed --> Ready : becomes ready
    Delayed --> Running : lane opened anyway

    Ready --> Running : lane opens (auto or manual)
    Ready --> CustomerWaiting : lane not opened at start time

    CustomerWaiting --> Running : lane finally opens

    Running --> Finished : customer stops playing
    Finished --> IncompletePayment : closed unpaid
    Finished --> Complete : paid and closed

    IncompletePayment --> Complete : payment settled

    Complete --> [*]
    Cancelled --> [*]
    NoShow --> [*]
```

## 5. Layer stack (bottom-up)

```mermaid
flowchart BT
    L1[Layer 1: Physical hardware<br/>MAG 3 pinsetters · BES X score consoles · MMS displays · POS printers · cash drawers]
    L2[Layer 2: Hardware bridge<br/>BowlingAgent · Q2A protocol · MMSAppServer Node.js]
    L3[Layer 3: Windows services + coordinator<br/>MxSvc · SQL Server MSSQL$CONQUERORX · QWorkingCopyServer]
    L4[Layer 4: Business logic<br/>Qbk.*.Server.dll domain services · CenterReservationSvc · CenterCustomerSvc · CenterPaymentSvc etc.]
    L5[Layer 5: API façades<br/>WebBookingApi (ASP.NET Core) · FlexyBook (WCF) · WCF legacy service ports]
    L6[Layer 6: Front-end clients<br/>Conqueror.exe · Web reservation widget · Kiosk · Score console UI]
    L7[Layer 7: Cloud + telemetry<br/>QCloud · QPortal · Azure Application Insights · Working Copy update pipeline]

    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> L6
    L6 -.-> L7
    L3 -.-> L7
    L4 -.-> L7
```

## Reading order for a new team member

1. Start here (`24-master-architecture.md`) for the 30-second picture
2. Then [`00-executive-summary.md`](00-executive-summary.md) for the 10-key-facts elevator pitch
3. Then [`01-architecture.md`](01-architecture.md) for the deployment-model detail
4. Then whichever module doc matches the day's job:
   - Working on reservations: [`14-booking-system-reference.md`](14-booking-system-reference.md)
   - Working on lanes: [`16-lane-management.md`](16-lane-management.md)
   - Working on POS: [`19-point-of-sale.md`](19-point-of-sale.md)
   - Working on membership: [`21-fbt-membership.md`](21-fbt-membership.md)
   - Working on shifts: [`20-shift-management.md`](20-shift-management.md)
   - Working on config: [`22-center-setup.md`](22-center-setup.md)
   - Working on integrations: [`10-integrations.md`](10-integrations.md), [`17-api-surface.md`](17-api-surface.md), [`18-mms-realtime.md`](18-mms-realtime.md)
   - Working on troubleshooting: [`13-operations-troubleshooting.md`](13-operations-troubleshooting.md)

## Reference

- Full doc index: [`README.md`](README.md)
- Raw evidence backing every claim: [`inventories/`](inventories/)
- Official product docs mined in full: [`extracted-strings/`](extracted-strings/)
