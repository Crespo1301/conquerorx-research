# Terminal Setup Reference

Per-terminal configuration. Every physical Conqueror terminal (front
desk PC, POS station, manager station, kiosk) gets its own Terminal
Setup profile. CHM sections `Conqueror-2-464.html` through
`Conqueror-2-471.html`. Split into 7 tabs: Preferences, Devices,
Print, Printers, Externals, Quick Buttons, Credit Card.

Path: **Setup > Terminal Setup.**

Kings context: with multiple physical terminals per location and 10
locations chain-wide, the roster of terminal profiles is
non-trivial. This doc covers what every knob does so a future
provisioning tool (or a per-terminal audit) has a complete
reference.

## The 7 tabs at a glance

| Tab | Scope |
|---|---|
| 1 Preferences | Terminal identity, sector, drawer, language, per-user personalization |
| 2 Devices | Physically-attached peripherals (card reader, drawer, pole display, beverage dispenser, fingerprint sensor, PinPad) |
| 3 Print | Report and receipt content (headers, footers, identifiers, images) |
| 4 Printers | Physical printer hardware config and role assignment |
| 5 Externals | External program integrations (QuickBooks Desktop, BLS, BTM, QCad, Bar) |
| 6 Quick Buttons | Up to 6 programmable per-terminal buttons + Urgent Tasks |
| 7 Credit Card | Credit-card receipt printer and duplicate-receipt behavior |

## Tab 1: Preferences (`Conqueror-2-465.html`)

Terminal identity and per-terminal / per-user personalization.

### Terminal identity

| Field | Purpose |
|---|---|
| **Sector and Cash Drawer** | Which shift sector this terminal belongs to (e.g. Front Desk) and which cash drawer it's connected to (e.g. Shoes/Bowling/Pro-Shop). Ties the terminal into [`20-shift-management.md`](20-shift-management.md). |
| **Terminal** | Terminal number (dropdown). Visible only when Conqueror is NOT configured for remote mode. |
| **Center** | Only visible in remote mode. Opens the Center Configuration window: select which center this terminal connects to; press New to register a new remote center by Description + Conqueror Server IP address. Enables the [Call Center](29-web-and-call-center.md#call-center-2-418-onward) topology. |
| **Language** | Per-terminal language for the Conqueror UI. Center-wide language override lives in [`22-center-setup.md`](22-center-setup.md). |

### Per-user personalization

| Setting | Behavior |
|---|---|
| **Diversified User Settings** | Requires Security enabled. When on, each operator keeps their own Conqueror preferences (font, Quick Buttons, Language, Last Plugin in Foreground, Clock type, recent modules, Quick Access Module) and they activate on log-on. When off, all local options are shared by every user on that terminal. |
| **Last Plugin in Foreground** | On log-on, Conqueror opens directly to whichever plugin was in front when the user last logged off / exited. |

### Visual / interaction preferences

| Setting | Purpose |
|---|---|
| **Font Anti-aliasing** | Smooth font rendering for on-screen text (worth on for readability on modern LCDs) |
| **Second Click on Tabs** | Whether double-clicking a tab does something distinct from a single click |
| **Available Fonts** | Font selection for the UI |
| **Display Translator Codes** | Diagnostic mode: shows the raw translation string ID next to each label. Useful during localization QA; off in production. |
| **Digital Clock** | Style of the on-screen clock |
| **TCS Pop up Module** | Whether TCS pop-ups fire on this terminal (see [doc 32](32-trouble-call-system.md)) |
| **Skin** | Visual theme |
| **Stop Button** | Configuration for the stop-button surface |
| **Close Stop Button** | Whether the stop button surface auto-closes |
| **Turn off Conqueror Sounds** | Global audio-mute for this terminal |

Kings-relevant call-outs:

- **Diversified User Settings on** is the sensible default at any
  multi-user front desk (hosts, supervisors, managers each get their
  own personalization).
- **TCS Pop up Module** should be enabled on the manager /
  maintenance terminal but likely disabled on POS terminals so a
  pinsetter fault doesn't interrupt an order.
- **Turn off Conqueror Sounds** may be on at the dining-side POS to
  keep the atmosphere clean.

## Tab 2: Devices (`Conqueror-2-466.html`)

Physical peripherals attached to this terminal. Each is a model +
port dropdown pair.

| Device | Extra config |
|---|---|
| **Card Reader** | model, port |
| **Drawer** (cash drawer) | model, port |
| **Display** (customer-facing pole display) | model, port, seconds-until-clear timeout, customized Welcome Message (1 or 2 lines depending on model) |
| **Beverage Dispenser** | model, port (integrates fountain drinks into POS) |
| **Fingerprint Sensor** | model, port (feeds [doc 27](27-security.md) fingerprint recognition mode) |
| **PinPad** | Configured per vendor's technical documentation. First Data and Verifone use net devices, which lets a single PinPad be shared between two or more terminals. |

Kings-relevance: pole displays and beverage dispensers vary per
location. Fingerprint sensors are unlikely at Kings (front-desk
turnover would make enrollment painful); expect card + password
recognition instead. PinPad sharing is worth knowing about if two
POS terminals sit adjacent.

## Tab 3: Print (`Conqueror-2-467.html`)

Report + receipt content. Runs before Tab 4 (which is the physical
printer config).

| Setting | Purpose |
|---|---|
| **Empty Score and Mailing Header** | Header printed on empty score reports, mail, and BES prize reports |
| **Empty Score Report Footer** | Footer message on the empty score report |
| **Print Center Data in Financial Report Header** | Include the center's licensed name + address in financial report headers |
| **Print Score after Closing Lanes** | Auto-print the last session's scores as soon as the lane closes; also select which lanes are linked to which terminal printer |
| **Images** | Insert images (saved in `Conqueror Pro/Print/Images`) into financial reports, receipts (headers + footers), and score reports |
| **Original and Duplicate Receipt Identifiers** | Free-text labels ("Original Receipt", "Duplicate Receipt") printed on receipts when Print Receipt Twice is enabled |
| **Receipt Header and Footer** | 10 lines of receipt-header text (name, address, phone, VAT) and a footer line ("Thank-you for bowling with us") |

Kings-relevance: the Print tab is the primary knob for receipt
branding per location. When Kings adds a new venue, or rebrands a
receipt, changes land here per terminal (or centrally via
[Center Setup](22-center-setup.md) if the receipts are unified).

## Tab 4: Printers (`Conqueror-2-468.html`)

Physical printers and role assignment. Network printers auto-populate
the dropdowns.

### Receipt Printer / Bar Printer

| Setting | Purpose |
|---|---|
| **Type** | Printer model |
| **Port** | Serial / USB port (disabled if network printer chosen) |
| **Columns** | Column width (disabled for network printers) |
| **Linefeed** | Line-feed behavior (disabled for network) |
| **Cutter** | Auto-cut behavior (disabled for network) |
| **Custom Font** | Toggle to customize lane-order receipt layout; disable to revert to default |

### PC Printers (Report role assignment)

Report categories, each assigned to a physical printer:

- **Score Sheets** (games, tournament standings)
- **Recap Sheets**
- **Mailing Labels**
- **Cash Reports** (shifts, Booking System, price keys)
- **Bowler Reports** (members, time tracking)
- **Other Reports** (league payments, licenses, lockers, system +
  staff logs, TCS, statistical reports)

### Prize Printer

Special Games (see [doc 31](31-cameras-coinop-specialgames.md#special-games-three-variants))
prize slip printer, either the Receipt Printer or the Score Sheet
Printer.

Kings-relevance: at least three logical print roles usually apply
(receipt, kitchen/bar order, back-office reports). Prize Printer
almost never applies at Kings since Special Games likely off.

## Tab 5: Externals (`Conqueror-2-469.html`)

Bridge to external programs. Two halves:

- **Left side (export folders):** where files land for QuickBooks
  Desktop, Year + QCad, and Bar exports
- **Right side (executable paths):** the `.exe` for QuickBooks
  Desktop, BLS (Bowling League Secretary, see
  [doc 25 BLS Leagues](25-leagues.md)), and BTM (Bowling Tournament
  Manager, see [doc 26](26-tournaments.md))

Kings-relevance: if a Kings location runs BLS-format leagues, this
is where the export path gets configured on the terminal that
produces the league secretary's files. QuickBooks Desktop is the
integration bridge to Kings' back-office accounting if used
(alternative to the Dassle export path in shift management).

## Tab 6: Quick Buttons (`Conqueror-2-470.html`)

Up to **6 programmable buttons** on the right-hand side of the
Conqueror main-menu external frame, per terminal or per user
(depending on Diversified User Settings, tab 1).

- **Clear Display** Quick Button appears only if a customer-display
  is configured in Tab 2 (Devices).

### Urgent Tasks

New Urgent Tasks Quick Button opens a "Tasks Requiring Immediate
Attention" window. The operator picks which urgent-task categories
this terminal handles:

- **Picture Validation** (photo-consent review)
- **Virtual Waiter** (mobile-order intake)
- **Lane Orders** (F+B orders coming from the score console tab)

Kings-relevance: **Lane Orders** is very likely the top Urgent
Task on the food + beverage POS terminals at Kings, where guests
order from the lane and the kitchen expedites via this queue.
Virtual Waiter may apply if Kings uses the QubicaAMF mobile-order
feature.

## Tab 7: Credit Card (`Conqueror-2-471.html`)

Credit-card receipt printing.

| Setting | Purpose |
|---|---|
| **Credit Card Receipt Printer** | Which printer prints CC receipts. **Required for CC payments to work at this terminal.** If unset, credit cards can't be used as a payment mode from this terminal. Network printers allowed. |
| **Print Receipt Twice** | Duplicate-receipt mode (original + copy) |
| **Original and Duplicate Receipt Identifier** | Free-text labels distinguishing original from copy |
| **Use Standard Receipt Header** | On (default): reuses the header from Tab 3. Off: customize a 4-field CC-specific header. |

Kings-relevance: every Kings POS + front-desk terminal that takes
card payments must have this tab configured. Standard header shared
with the general receipt is fine unless CC receipts need a distinct
merchant-account name.

## Related DB tables

From [`05-database-schema.md`](05-database-schema.md):

- **`Terminals`**: the roster of registered terminals
- **`TerminalConfig`** or **`Options`** with a per-terminal
  discriminator: the config values themselves
- **`Sectors`** and **`CashDrawers`**: the shift-side identifiers
  Tab 1 references

## Related DLL family

From [`04-modules-and-dlls.md`](04-modules-and-dlls.md):

- **`Qbk.CenterManagement.TerminalSetup.*`** (client, server, gui)
- **`Qbk.Peripheral.*`** family: the drivers for the Devices tab
  (card readers, drawers, displays, fingerprint sensors)
- **`Qbk.Printing.*`**: the Print + Printers side

## For Kings specifically

- **Provisioning a new terminal:** step through all 7 tabs in order
  (Preferences first for identity, then Devices for hardware, then
  Print + Printers for output, then Externals + Quick Buttons +
  Credit Card for role finalization).
- **Auditing existing terminals** (a natural follow-up to the doc 23
  floor walk): the roster to fill would be one row per Terminal
  entry, columns being the values across all 7 tabs. Skipped in
  this doc because it needs a physical walk-through.
- **For our reservations-builder:** no direct interaction. Our
  Excel-import path runs from whichever terminal has ConquerorX
  open, and that terminal's Terminal Setup does not change our
  contract with the import.
- **For a future automation service account:** if we ever add a
  headless terminal (a "robot terminal" that submits reservations
  via WebBookingApi), it would still need a Terminal Setup profile
  so shift + drawer accounting stay clean.

## Reference

- Related shift + drawer wiring: [`20-shift-management.md`](20-shift-management.md)
- Related security identity: [`27-security.md`](27-security.md)
- Related center-wide defaults: [`22-center-setup.md`](22-center-setup.md)
- Related remote mode + Call Center: [`29-web-and-call-center.md`](29-web-and-call-center.md)
- Related TCS pop-up: [`32-trouble-call-system.md`](32-trouble-call-system.md)
- CHM outline anchor: [`extracted-strings/chm-en-outline.md`](extracted-strings/chm-en-outline.md#terminal-setup)
