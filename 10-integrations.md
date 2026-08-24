# Third-Party Integrations

Every external system ConquerorX explicitly speaks to, as evidenced from
DLLs, config, translation strings, and DB tables.

## Point-of-Sale / F&B

### Micros (Oracle)

**The deepest integration in the system.** Bidirectional XML-based bridge.

- **DLLs:** `Qbk.Micros.Server.dll`, `Qbk.Micros.Server.dll.config`
- **DB tables:** `MicroSaleSettings`, `MicroSaleTransactions`
- **How it flows:**
  1. Guest orders food/drinks at ConquerorX POS.
  2. ConquerorX opens or updates a Micros "check" (server->Micros XML).
  3. Micros holds the check open on the kitchen/bar side.
  4. When payment happens on the ConquerorX side, closes the Micros check.
- **Configuration surfaces:** revenue center, order type, service total code
  and description, menu item codes.
- **Failure modes** (translations enumerate them):
  - "A Micros check with the same name already exists"
  - "Communication problem with Micros Server"
  - "It is necessary to manually execute the payment in Micros"
  - "Please close the check window on Micros or add items to a new check"
- **Kings applicability:** unknown whether Kings runs Micros or a different
  POS.

### Square (via CloudPlugin)

- **RoutingDefs entry:** `SquareReceiptPlugin` → `/square-receipt-plugin`
  (not currently a CloudPlugin — served locally but presumably talks to
  Square's cloud).
- **Purpose:** likely prints Square-branded receipts after a Square payment
  runs through their payment terminal.

### Bixolon receipt printers

- **DLLs:** `Qbk.BixolonSPPR210HostProcess.exe`, `BXL.dll`
- Bundled driver for Bixolon SRP-210 receipt printers.

## Bowling / Scoring hardware

### QubicaAMF BES X, Frameworx, BOSS, AS 80/90 (native)

- These are QubicaAMF's own hardware — not "integrations" strictly, but
  they're switchable per install.
- Score-system version chosen at install time via ConquerorSetup.exe.

### Q2A protocol bridge

- `Qbk.Lanes.Q2A.Server.dll` = "Qubica-to-AMF" — bridges Qubica-format score
  data to AMF-format hardware or vice versa. This is the compatibility layer
  that came out of the 2005 merger.

## Legacy customer data imports

### BowlerTrac

- **What it is:** long-established independent bowling scoring / member
  tracking system (Steltronic / others).
- **Support in ConquerorX:**
  - Customer lookup by BowlerTrac ID: `qsp_cust_get_by_bowlertrack_id`
    stored proc.
  - Import `.xml` files: filter mask `BowlerTrac files (*.xml)|*.xml`
  - `BowlerTracRentalShoes.dll` — shoe rental integration.
- **Practical use:** if Kings ever bought a location that ran BowlerTrac,
  ConquerorX can absorb their customer records.

### OVR

- Import `.dbf` files. Filter mask `OVR files (*.dbf)|*.dbf`.
- Format unclear — likely another legacy bowling system.

## Accounting

### QuickBooks

- Mentioned in translation strings (module list).
- Presumably an export to QuickBooks-compatible format for accounting.
- No dedicated `Qbk.QuickBooks*.dll` found — may be implemented as a
  Crystal Report / .xls export.

## Payment processing

### Credit card gateway (built-in)

- **DB tables:** `CreditCardHistory`, `CreditCardTransaction`
- **DLLs:** payment provider DLLs; strings mention `TrancloudHelper.cs`
  ("TranCloud" is a payment processing platform).
- **Configuration surfaces:** payment provider setup, authorization,
  refunds.

### Prepaid cards / Gift cards / Loyalty

- Full built-in support. Not really "third-party" — QubicaAMF's own
  loyalty stack. But integratable with external card providers.

## Cloud services

### QCloud (QubicaAMF)

- Endpoint: `qcloud.qubicaamf.com`
- The main cloud back-end. Handles centralization, license, working copy
  distribution, plugin loading.

### QPortal (QubicaAMF)

- Endpoint: `qportal.qubicaamf.com`
- Customer-facing web portal — where a chain operator would log in to see
  cross-center data.

### Azure Application Insights (Microsoft)

- Full telemetry pipe to Microsoft Azure App Insights. Each environment has
  its own instrumentation key.
- Kings production tier ingests to `eastus-8.in.applicationinsights.azure.com`.

### Azure Blob Storage (Microsoft, hosted by QubicaAMF)

- Endpoint: `resourcesexpoqamfeuw.blob.core.windows.net`
- Hosts shared assets (animations, marketing kits, brand kit).

## Marketing / content partnerships

### Fox YouToons

- **Location:** `C:\ProgramData\QubicaAMF\Bubbles\YouToons\`
- Fox's animated character overlays for kids parties (branded content
  partnership).

### BrandKit

- **Location:** `C:\ProgramData\QubicaAMF\Bubbles\BrandKit\`
- Center-specific branding assets.

### Sally / Dassle (score console personas)

- **Locations:** `C:\ProgramData\QubicaAMF\Bubbles\Sally\` and `Bubbles\Dassle\`
- Character personas for score consoles (chat avatars, celebration
  animations).

## Remote support / management

### VNC

- Bundled `vncviewer.exe` and `VncRepeater\` — QubicaAMF's remote support
  team can screen-share into any terminal.

### TechSupport bundle

- `TechSupport.exe` + `TechSupportClient.exe` build a diagnostic bundle
  (logs, config, DB snapshot) for QubicaAMF support cases.

## Analytics / product telemetry surfaces

- `mixPanelProjectId` reserved (currently empty)
- `amplitudeProjectId` reserved (currently empty)

QubicaAMF may adopt Mixpanel / Amplitude for product analytics in a future
version — the config schema is ready.

## What Kings likely uses (best guess)

Confirm during the next work-terminal visit:

- ✅ QubicaAMF hardware (BES X or similar)
- ✅ QCloud (cloud connection needed for updates & licensing)
- ⚠️ Micros — unknown. Might use a different POS.
- ⚠️ Square — possibly used for on-lane orders?
- ⚠️ Tripleseat → ConquerorX manual entry (what our tool replaces)
- ❌ BowlerTrac — unlikely (Kings is modern QubicaAMF)
- ❌ OVR — legacy
- ❌ QuickBooks — Kings is likely Sage / NetSuite / Oracle at their scale

## Reference

- Integration string catalog: [`inventories/14-features-and-strings.txt`](inventories/14-features-and-strings.txt)
