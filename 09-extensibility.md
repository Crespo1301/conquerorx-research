# Extensibility Surfaces

Every place a third-party (us, or anyone) can hook into ConquerorX,
ordered from most accessible to least.

## 1. Excel batch imports: the surface we already use

- **Templates:** `C:\QDesk\Bin\xlt\*.xlt` (4 files).
- **How to hook:** produce a valid `.xls` matching the template contract,
  upload via ConquerorX Back Office.
- **Bulk automation:** manual file picker only. No CLI, no folder-select for
  reservations. We shim this with an AutoHotkey helper that drives the file
  picker.
- **Skills required:** understanding of the .xls format for the specific
  template.
- **Documented at:** [`08-templates-and-imports.md`](08-templates-and-imports.md).

## 2. RoutingDefs Cloud Plugins: the modern extension model

This is the most interesting surface for someone building a new integration.

**File:** `C:\QDesk\Bin\QDeskConfigs\RoutingDefs.json`

Every entry with `CloudPlugin: true` is an Azure-hosted HTML plugin that
loads inside the ConquerorX front-end as a first-class screen:

```json
{
  "Name": "SquareReceiptPlugin",
  "RelativePath": "/square-receipt-plugin",
  "Icon": 418,
  "SingleInstance": true
}
```

**Currently registered CloudPlugins:**
- `PictureValidation`: image capture / validation flow
- `Calculator` (unicorn-calculator), the "unicorn" prefix suggests an internal
  codename or feature-flag name
- `CashDrawer`: cash drawer control UI
- `CashDrawerReport`: cash drawer reporting

**Currently registered non-cloud plugins** (local, in-tree):
- `Home`, `Pos`, `LaneOptions`, `Loyalty`, `MultiAttractions`,
  `CashlessRecharge`, `CashlessPay`, `SquareReceiptPlugin`

**How CloudPlugins probably work** (inferred):
1. Front-end reads `RoutingDefs.json` at startup.
2. For `CloudPlugin: true` entries, front-end fetches HTML/JS from
   `qcloud.qubicaamf.com` (or the environment-specific backend) at the
   plugin's route.
3. Plugin loads inside a WebView/iframe with access to some ConquerorX
   context APIs (session, current lane, current reservation, etc.).
4. Communication back to ConquerorX is via a JS bridge or postMessage.

**Why this matters:**
- **Third parties get first-class UI real-estate** inside ConquerorX without
  changing the .NET code.
- **CloudPlugins can be updated by the vendor** (e.g. Square) without
  redeploying ConquerorX.
- **New plugins can be added just by editing `RoutingDefs.json`** and
  pushing content to the referenced cloud path.

**Accessibility for us:**
- Editing `RoutingDefs.json` locally is possible but the next Working Copy
  sync would probably overwrite it.
- Publishing a real CloudPlugin requires QubicaAMF partner enrollment, the
  process is not publicly documented.
- If Kings management + QubicaAMF sales channel are both agreeable, this
  is the correct home for a "CSolutions Reservation Sync" or similar
  Kings-branded integration.

## 3. In-tree Plugin DLLs

The `Qbk.*.Plugin.dll` files are ConquerorX's internal plugin model:

| DLL | Purpose |
|---|---|
| `Qbk.Kiosk.AssistancePlugin.dll` | Kiosk help / assistance |
| `Qbk.Lanes.Tilt.TiltPlugin.dll` | Tilt sensor handling |
| `Qbk.Economical.TipPlugin.dll` | Gratuity feature |
| `Qbk.OrderReprintPlugin.dll` | Receipt reprint |
| `Qbk.PrintGames.Plugin.dll` | Historical game print |
| `TCSPlugin.dll` | Trouble Call System |

Coupled with `Qbk.PluginParams.dll` for per-plugin config.

This is a **real plugin API** but appears to be for QubicaAMF's own internal
team, no obvious public SDK. Would need DLL decompilation to reverse the
interface contract.

## 4. Micros POS integration (XML-based)

Deep integration with Oracle Micros POS. From the EN translation strings:

- ConquerorX exports orders/checks to Micros
- Micros sends payment completion back
- Micros codes are configured per menu item, per revenue center, per
  service total code

If Kings ever adopts Micros, this is a substantial integration surface. Not
useful for us today.

## 5. Cloud sync / CDE (Centralized Data Environment)

For multi-center chains (e.g. Bowlero-scale). Data flows up to QCloud,
enabling:
- Centralized customer database
- Cross-center loyalty
- Consolidated reporting

Extension point: QubicaAMF could theoretically expose a partner API against
QCloud (e.g. for a data warehouse or BI tool), but this would require
partner enrollment.

## 6. Working Copy repository content

New assets (animations, marketing kits, images) can be published via QCloud
and pulled by centers automatically. This is how partner content (like Fox
YouToons, brand kits) reaches the lanes.

## 7. MMSAppServer Socket.IO

The Node.js MMS server on port 8760 uses Socket.IO for real-time comms.
Potentially observable by any LAN-connected client, could power a
read-only dashboard.

**Risks:** undocumented protocol, may break between versions, may need auth
we haven't discovered.

## 8. Direct SQL Server access

The `MSSQL$CONQUERORX` instance is on the LAN and accepts connections with
the right credentials. Every table, view, and stored procedure is available.

- **Read** is technically possible with `WITH (NOLOCK)` for reporting.
- **Write is unsafe:** bypasses triggers, business rules, cloud sync.
- Not documented, not supported. Would require careful DBA cooperation.

## 9. Report definitions (.rpt)

Crystal Reports templates in `C:\QDesk\Bin\Reports\`. Custom reports could
theoretically be added if Crystal Reports Designer is used, but changes
would be overwritten by Working Copy updates.

## 10. Not-really-extensibility surfaces

- **Physical hardware injection:** plug in lane hardware speaking the Q2A
  protocol. Not applicable to software integrations.
- **DLL replacement:** override a `Qbk.*.dll` with a modified version.
  Would fail assembly signing checks. Do not do this.

## What we should build against, ranked

For a Kings-focused CSolutions tool:

1. **Excel batch imports** (current tool). Solid, safe, no vendor
   dependency. Ceiling: one file per reservation.
2. **AutoHotkey / RPA layer on top of #1.** What we ship today. Ceiling: same
   as manual clicks, just faster.
3. **CloudPlugin submission** (long-term). If Kings + QubicaAMF agree, this
   gives us native UI real-estate. Requires business relationship.
4. **Read-only SQL reporting** (with DBA blessing). Powerful but touchy.
5. **Direct integration with QCloud** (long-term, requires QubicaAMF
   partnership). Would enable "sync from Tripleseat → QCloud → all centers"
   pattern.

## Reference

- RoutingDefs verbatim: [`inventories/11-key-configs-verbatim.txt`](inventories/11-key-configs-verbatim.txt)
- Plugin DLLs: [`inventories/15-mmsappserver-and-plugins.txt`](inventories/15-mmsappserver-and-plugins.txt)
