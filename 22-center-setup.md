# Center Setup Reference

Master configuration for the entire center: security, hours, pricing
model, scoring hardware, receipts, integrations, backups, intercom,
coin hoppers. From CHM sections `Conqueror-2-445.html` through
`Conqueror-2-463.html` (10 sub-sections).

Center Setup is the highest-privilege module. Getting these settings
wrong affects every other module. Only managers with the corresponding
privilege see this menu.

## The 10 top-level Center Setup areas

| # | Area | Purpose |
|---|---|---|
| 1 | **Overview** | Landing page |
| 2 | **Basic** | Security, language, dates, activation, license |
| 3 | **Lane Control** | Lane defaults, opening modes, refresh cadence |
| 4 | **Prices** | Game / Time / Unlimited pricing model per mode |
| 5 | **Payments** | Receipt formatting, gratuity, refund rules, tax printing |
| 6 | **Score** | Per-scoring-generation hardware config (BES, BOSS, AccuScore Plus, AS 80/90, Frameworx) |
| 7 | **System** | External integrations + auto-update + game export |
| 8 | **Backup** | DB backup + cleanup + history archive |
| 9 | **Intercom** | Voice intercom + phone system for lane calls |
| 10 | **Coin Hoppers** | Coin-op hardware config |

Areas 3 (Lane Control), 4 (Prices), and 5 (Payments) are the most
consequential for day-to-day operations. Area 6 (Score) is
hardware-specific and locks in at install time. Area 7 (System) is
where third-party integrations are wired up.

## Basic (`Conqueror-2-447.html`): 25+ settings

Highlights, grouped:

**Security:**
- Password expiration
- Login attempts before disabling
- Time tracking at log on / log off
- Automatic Safe Mode after N minutes idle
- Boss Password (higher-privilege override)

**Localization + display:**
- Database Language
- Mask Language
- Display Translator Codes (dev-only)
- Speed Unit (mph / km/h for ball speed)
- Paper Size
- Normal / Compact Report Font
- Unicode Font for Strike Challenge

**Time + calendar:**
- Current Bowling Day
- First Day of the Week
- Day Changing Time (when a new business day starts, e.g. 04:00)
- System Date / Time
- External Time Server / Et-Host Time

**Center identity:**
- Terminals, registered terminal list
- Activation, the QubicaAMF license activation
- Print License
- Desktop Message
- E-mail Setup

**Reporting:**
- Default Report Export Format (CSV / Excel / PDF)

## Lane Control (`Conqueror-2-448.html`)

Center-wide lane defaults that Lane Management inherits:

- Opening Modes, which modes are enabled center-wide
- FB Confirmation Dialog, prompt for FBT card on lane open
- Force Sign in Screen on Lane, require login at score console
- Default Bowling / Time Game Name Prefix
- Defaults for Reports and Statistics
- **Maximum Number of Players per Lane:** this drives our
  reservations-builder's `bowlers_per_lane` fallback
- Lane Control Refresh Frequency
- Add Games/Time to _
- Estimated Duration
- Default for Time Games
- Warning Message

## Prices (`Conqueror-2-449.html`)

Three sub-sections, one per Opening Mode:

**Game Mode** (`2-450`):
- Frame Payment (charge per frame)
- Pay 11th and 12th Frames (extra frames)
- Price Evaluation Mode (how dynamic pricing evaluates)

**Time Mode** (`2-451`), the one Kings mostly uses:
- Playing Duration
- Charging Mode
- Time Unit for Billing + Rounding Type
- Minimum Billing Time (floor)
- Minimum Time to Pay
- Adding Time Unit
- Price Evaluation Mode
- Charge Double Time (peak-hour multiplier)

**Unlimited Mode** (`2-452`):
- Global Payment
- Price Evaluation Mode
- Charge Double Ticket

## Payments (`Conqueror-2-453.html`): 21 settings

Controls how receipts are formatted, how gratuity works, how refunds
are enforced, how tax appears on the receipt. Highlights:

- **Bowling Default Price Keys:** which price key auto-applies on
  standard lane open
- **Automatic Gratuity Default Percentage:** auto-tip percentage on
  large parties
- **Receipt Detail Level:** summary vs itemized
- **Split Package Revenue:** how a package's revenue splits across
  contributing departments
- **Divide League Income:** pro-rata league income allocation
- **Print Receipt Total before Taxes:** receipt formatting
- **Print Included Taxes in Receipt:** tax display
- **Print Total Zero Receipts:** force print even if free
- **Payment Mode Mandatory:** require a payment mode selection
- **Refund Receipts Using the Same Payment Mode:** refund
  restriction

## Score (`Conqueror-2-454.html`): per-scoring-generation

Five sub-sections, one per supported scoring generation:

| Sub-section | Applies to |
|---|---|
| 6.1 In Bowland and BES Centers (`2-455`) | Kings, BES X falls here |
| 6.2 In BOSS Centers (`2-456`) | AMF BOSS |
| 6.3 In AccuScore Plus Centers (`2-457`) | AMF AccuScore Plus |
| 6.4 In AS 80/90 Centers (`2-458`) | AMF AS 80/90 |
| 6.5 In Frameworx Centers (`2-459`) | AMF Frameworx |

The Bowland/BES section (Kings-relevant) covers:

- Sound, Birthday celebration
- Erase Bowler Names with Stop Key
- Time Pause between Pinsetters On
- F-out Relay Pulse Duration
- Delay in Closing Lanes
- **Lanes to Be Scanned:** which lanes the server polls
- Pinsetter on after Practice
- Automatic Pinspotter Cycle while Lane Opening
- Skip Players with Finished Pre-assigned Games
- SuperTouch Reboot after Daily Tasks
- Lane Control Box Memory
- External Device Controller
- Advanced Foul Device
- Billiard Light Controller Port + Favero Pool Control System
- RAB-12 Setup
- Video Server

## System (`Conqueror-2-460.html`): integrations

External system wiring lives here. Each toggle turns on an
integration:

| Integration | What it is |
|---|---|
| **Hopewiser** | UK postcode / address validation |
| **BLS and BTM** | CDE Software's Bowling League Secretary + Bowler's Journey mix |
| **BES/QDac** | Direct BES-console access + QDac controller |
| **R-Keeper** | Russian POS system integration |
| **DSD** | Direct Store Delivery interface |
| **Zonal** | Zonal POS + accounting integration |
| **RecTrac** | Vermont Systems RecTrac (parks + rec) |

Plus:
- Automatic Game Export Path
- Number of Versions to Maintain (Working Copy retention)
- Automatic New Version Download

## Backup (`Conqueror-2-461.html`)

- Automatic Backup, schedule + retention
- Backup MMS Media Files, MMSAppServer assets
- Transfer Data to Historical Database, archive old data
- Database Cleanup, purge orphans / expired records
- Backup Directory + Second Backup Directory
- History Cleanup, historical DB purge

## Intercom (`Conqueror-2-462.html`): 17 settings

Voice intercom system for lane-to-front-desk voice calls. Kings likely
uses this for the TCS "Mechanic Call" flow. Settings cover:

- Serial Number + Status per lane
- Inter-Hub configuration
- Speaker + Exponential Dynamics (volume normalization)
- Phone Commutation Threshold + Sensitivity Threshold
- Lane Recall Pause + Stop Ring After
- Cancel Call if Busy
- Lane Number Communication

## Coin Hoppers (`Conqueror-2-463.html`)

Coin-op integration, not relevant to modern Kings hardware.

## Where our tool touches Center Setup

Our reservations-builder reads none of these directly. But **the venue
config it needs to know about at import time**, so the operator can
line up defaults, includes:

- **Maximum Number of Players per Lane** (Lane Control), should match
  our `bowlers_per_lane` config
- **Time Mode Playing Duration / Charging Mode** (Prices), affects
  what our `default_games_per_bowler` should be
- **Bowling Default Price Keys** (Payments), the venue's default
  price key we probably want to leave undisturbed

Our import defaults are documented in the reservations-builder's own
CLAUDE.md. Worth cross-referencing when doing a fresh install at a new
Kings location.

## Related SQL tables

From [`05-database-schema.md`](05-database-schema.md):

- `Globals`: center-wide global values
- `QParam`: parameterized config
- `Options`: most Center Setup toggles land here
- `Definitions`: enumerated definitions (e.g. payment modes list)
- `TerminalLicenses`: Terminals list from Basic
- `LangSetup`: language config
- `PriceKeys` + `PriceTime`: price definitions
- `PaymentTypes`: payment modes
- `Interfaces`: external interface config (BES/QDac/etc.)
- `MultiIO` + `MultiIOStatus`: multi-I/O hardware
- `Currencies`: currency codes

## Related module setup docs (not Center Setup itself)

Some setup areas live in their own dedicated modules, not under
Center Setup:

- **TCS Setup:** in the TCS module, see [`13-operations-troubleshooting.md`](13-operations-troubleshooting.md)
- **Reservations Setup:** in the Booking System module, see [`14-booking-system-reference.md`](14-booking-system-reference.md)
- **Member Setup:** in the FBT module, see [`21-fbt-membership.md`](21-fbt-membership.md)
- **Shift Setup:** in the Shift Management module, see [`20-shift-management.md`](20-shift-management.md)
- **POS Setup:** in the POS module, see [`19-point-of-sale.md`](19-point-of-sale.md)

## Reference

- Related runtime configuration (RoutingDefs, qdesk-settings, log4net): [`06-configuration.md`](06-configuration.md)
- The setup screen you see AT INSTALL TIME (score version, optional components): [`inventories/09-help-and-official-docs.txt`](inventories/09-help-and-official-docs.txt)
- CHM outline anchor: [`extracted-strings/chm-en-outline.md`](extracted-strings/chm-en-outline.md#center-setup)
