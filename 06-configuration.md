# Configuration

Where behavior comes from. Every file listed here is a settings input to
the ConquerorX runtime.

## The two config categories

1. **`.config` files:** standard .NET assembly configs (binding redirects,
   supported runtime, log4net include). Boring but shows framework
   dependencies.
2. **`.json` files:** actual behavior configuration (routing, environments,
   storage, MMS server). This is where the interesting settings live.

## The high-value config files

### `C:\QDesk\Bin\QDeskConfigs\RoutingDefs.json`: plugin routes

**The single most important config file on the system for extensibility.**

Declares every route (screen/button) that shows up in the ConquerorX
front-end. Each entry:

```json
{
  "Name":         "SquareReceiptPlugin",
  "RelativePath": "/square-receipt-plugin",
  "Icon":         418,
  "SingleInstance": true,
  "CloudPlugin":   true
}
```

Fields:
- `Name`: display / lookup key
- `RelativePath`: the internal route URI
- `Icon`: icon ID in the ConquerorX icon library
- `SingleInstance`: only one instance visible at a time
- `CloudPlugin`: served from QubicaAMF's Azure cloud, not from disk

**Current routes** (12 total):

| Name | Path | Cloud | Single |
|---|---|---|---|
| `Home` | `/` | n/a |, |
| `Pos` | `/pos` | n/a |, |
| `LaneOptions` | `/lane-options` | n/a |, |
| `Loyalty` | `/loyalty` | n/a |, |
| `CashlessRecharge` | `/cashless/recharge` | n/a |, |
| `CashlessPay` | `/cashless/pay` | n/a |, |
| `MultiAttractions` | `/ma-reservations` | n/a | ✅ |
| `SquareReceiptPlugin` | `/square-receipt-plugin` | n/a | ✅ |
| `PictureValidation` | `/picture-validation` | ✅ | n/a |
| `Calculator` | `/unicorn-calculator` | ✅ | n/a |
| `CashDrawer` | `/cash-drawer` | ✅ | n/a |
| `CashDrawerReport` | `/cash-drawer-report` | ✅ | n/a |

Deep-dive: [`09-extensibility.md`](09-extensibility.md).

### `C:\QDesk\Bin\ConquerorServer\qdesk-settings\`: environment tiers

22 JSON files, one per environment × channel combo. Each contains:

```json
{
  "environment":         "production",
  "channel":             "stable",
  "cloudBackendUrl":     "https://qcloud.qubicaamf.com",
  "localCA":             "https://dist.qubicaamf.com/localca/QubicaAMF-LocalCA.cer",
  "appInsightsConnString": "InstrumentationKey=fb12b2df...",
  "qportalUrl":          "https://qportal.qubicaamf.com",
  "accountPageUrl":      "",
  "helpSiteUrl":         "",
  "bowlerUrl":           "",
  "adb2cAuth":           {},
  "oidcAuth":            {},
  "mixPanelProjectId":   "",
  "amplitudeProjectId":  ""
}
```

**Environments:**

| Env | Backend | Portal | Analytics |
|---|---|---|---|
| `production/stable` | `qcloud.qubicaamf.com` | `qportal.qubicaamf.com` | Azure App Insights (East US) |
| `production/beta` | `qcloud-beta.qubicaamf.com:44301` | `qportal-beta.qubicaamf.com` | Azure App Insights |
| `staging/beta` | `qcloud-staging.qubicaamf.com:44301` | `qportal-staging-beta.qubicaamf.com` | Azure App Insights (East US) |
| `expo/stable` | `qcloud-expo.qubicaamf.com` | `qportal-expo.qubicaamf.com` | Azure App Insights |
| `expo/beta` | `qcloud-expo.qubicaamf.com:44301` | `qportal-expo-beta.qubicaamf.com` | Azure App Insights |
| `development/stable` | `qcloud-develop.qubicaamf.com` | `qportal-develop-qamfeuw.azurewebsites.net` | Azure App Insights (West Europe) |
| `development/beta` | `qcloud-develop.qubicaamf.com:44301` | `qportal-develop-qamfeuw-beta.azurewebsites.net` | Azure App Insights |
| `local/stable` + `local/beta` | `qcloud-develop.qubicaamf.com` | `localhost:5001` | Azure App Insights |
| `testing-slot-01`…`05` × `stable`/`beta` | `qcloud-test0N.qubicaamf.com[:44301]` | Slot-specific azurewebsites.net | Slot-specific App Insights |

**Auth surfaces (empty on all environments in the install):**
- `adb2cAuth: {}`: Azure AD B2C
- `oidcAuth: {}`: OpenID Connect
- Both are structurally reserved for future auth flows; not active yet.

**Analytics surfaces (also empty):**
- `mixPanelProjectId: ""`
- `amplitudeProjectId: ""`

**The Kings live install runs `production/stable`.** Anything else is a red
flag, likely means someone flipped the environment for testing and forgot.

### `C:\QDesk\Bin\ConquerorServer\StorageConf.json`

Points at QubicaAMF's Azure Blob Storage assets:

```json
{ "Url": "https://resourcesexpoqamfeuw.blob.core.windows.net" }
```

Used for downloading assets (animations, marketing kits, etc.).

### `C:\QDesk\Bin\ConquerorServer\SqlScripts\qdb.ini`

```ini
Server=(local)\CONQUERORX
```

The database instance name. Everything else in the SQL layer follows from
this.

### `C:\QDesk\Bin\ConquerorServer\MMSAppServer\server.config`

```json
{
    "experienceIntervals": { "static": 10000, "video": 6000 },
    "highscoresInterval": 20000,
    "loglevel": "TRACE"
}
```

Poll intervals (ms) for the MMS Node.js layer:
- `experienceIntervals.static`: static content refresh every 10 seconds
- `experienceIntervals.video`: video refresh every 6 seconds
- `highscoresInterval`: high-scores every 20 seconds
- `loglevel: TRACE`: noisy logging by default (dev-like setting)

## The log4net configs

- `C:\QDesk\Bin\Conqueror.log4net.config`: client
- `C:\QDesk\Bin\ConquerorServer\ConquerorServer.log4net.config`: server

Both configure appenders including:
- `ADONetBufferedAppender` → SQL Server via `qsp_log_insert` stored proc
- `CloudLogAppender` → also to SQL, forwarded to cloud
- File-based buffers (`Buffer.127.0.0.1.log`)

`ADONetBufferedAppender` batches 50 log entries before flushing to DB, which
is why individual log lines don't show up in DB queries for the last few
seconds.

## Environment-tier switching

The environment is chosen by which `qdesk-settings/*.json` file gets loaded
at startup. There's likely a registry key or an environment variable that
selects it. Not yet identified, one for the open-questions doc.

To confirm which environment a running center is on, look at
`TerminalsData.json` in `C:\ProgramData\QubicaAMF\Logs\` or check the About
dialog in the ConquerorX UI.

## Reference

- Full config file listing: [`inventories/04-config-files.txt`](inventories/04-config-files.txt)
- Verbatim key configs: [`inventories/11-key-configs-verbatim.txt`](inventories/11-key-configs-verbatim.txt)
