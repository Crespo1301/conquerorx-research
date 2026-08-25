# Ancillary Modules Reference

Three smaller modules bundled here because each is standalone and
each is small enough that a dedicated doc would be padding: Experience,
Time Games, and Lockers.

- **Experience** (`Conqueror-2-151.html` to `2-154.html`), the
  price-key + environment bundling feature applied at lane opening.
- **Time Games** (`Conqueror-2-332.html` to `2-339.html`), non-lane
  time-billable activities (pool tables, ping pong, arcade rental,
  billiards, etc.).
- **Lockers** (`Conqueror-2-321.html` to `2-331.html`), the locker
  rental system.

## Experience

### What it is (from `Conqueror-2-152.html`)

A newer ConquerorX feature that defines the relationship between a
"service" (environment + games) and its price keys. Instead of
operators picking price keys freely at lane open, the Experience
model **filters price keys and environments per Experience** so only
compatible options are selectable.

Kings-relevant example: an "Adult Cosmic Bowling Package" Experience
locks the lane to cosmic-lighting environments and the matching
adult-price-key set. Operators cannot accidentally apply a kids-party
price to a cosmic booking.

Activation is per-center via **Experience mode**. When on, every lane
open prompts for Experience selection first, then Conqueror filters
the choices downstream.

### Setup surface (from `Conqueror-2-154.html`)

| Element | Purpose |
|---|---|
| **Game/Time/Unlimited Price Keys** | Which price keys belong to this Experience |
| **Environments** | Lane environment presets (cosmic, standard, kids, birthday) |
| **Selecting an Experience** | Runtime picker at lane open |
| **Lane Control: Set Price** | Filters price options to Experience |
| **Lane Control: Lane Options** | Filters bowler options to Experience |
| **Merge/Transfer/Split** | Experience preservation across lane movement |

### Privileges (`2-153`)

Dedicated privilege set. Managers can restrict who can override an
Experience mid-session.

### For Kings

Almost surely in use. Kings is a boutique dining + entertainment
concept where booking types (Weeknight, Birthday Party, Corporate
Outing, Weekend Cosmic) each imply a distinct pricing + environment
package. Experience mode is the technical mechanism that keeps
front-desk staff from applying the wrong price bundle to the wrong
booking.

## Time Games

### What it is (from `Conqueror-2-333.html`)

The "everything at the center that is not a bowling lane" module. All
other billable activities go through here: pool tables, billiards,
table tennis, ping pong, internet stations, arcade rentals, etc.

Same UX shape as Lane Management (Time Game Status + Time Game
Control) but for non-lane resources. Access via **Front Desk > Time
Games**.

### Time Game Status controls (from `Conqueror-2-334.html`)

Same 8 core actions as lanes:

- **Next Item:** cycle to next available Time Game item
- **Workshop:** take a Time Game item out of service
- **Light on / Light off:** for lit tables
- **Waiting List:** queue for a busy game
- **Transfer:** move party to a different item
- **Modify:** mid-session parameter change
- **Open** and **Close:** session lifecycle

### Opening and Closing a Time Game Item (from `Conqueror-2-335.html`)

Parallels lane opening:

- **Inserting Players**
- **Setting Price Keys**
- **Setting Amount of Time**
- **Selling POS Items** (attach F+B / retail to the session)
- **Closing a Time Game Item**

### Time Game Setup (from `Conqueror-2-336.html`)

Center-wide definition of what Time Games exist and how they bill:

| Field | Purpose |
|---|---|
| **Rounding Type** | How partial time bills (up, down, nearest) |
| **Default Price** | Per-item default price key |
| **Walk-down Time** | Free minutes after arrival before the meter starts |
| **Minimum Billing Time** | Floor billing time |
| **Minimum Time to Pay** | Floor payable time |
| **Time Unit for Billing** | Granularity (15 min, 30 min, 1 hour) |
| **Maximum Number of Players** | Cap per item |
| **Time Game Icon** | Icon shown in the Time Game grid |
| **Time Game Items** | Individual physical items (Pool Table #1, #2, etc.) |
| **Table Control Device** | Optional hardware controller (e.g. auto-cue lockers) |

### For Kings

Likely used for anything non-bowling Kings offers per location. Not
every Kings has billiards or arcade rentals, but the ones with
those amenities would run them through this module. Related SQL
tables `TimeGamesItems` and `TimeGamesPlayers` back the module.

## Lockers

### What it is (from `Conqueror-2-322.html`)

Locker rental system. Manages a virtual locker map (mirrors the
physical layout), booking, expiry, waiting list, maintenance, and
reporting. Access via **Front Desk > Lockers**.

### Managing Lockers (from `Conqueror-2-323.html`)

Locker operations:

- **Assigning Lockers** (`2-324`)
  - **Extending Expiry Dates:** renew rental
  - **Vacating a Locker:** end rental
  - **Changing Lockers:** swap tenant to different locker
- **Finding a Rented Locker** (`2-325`), search by tenant / locker number
- **Locker Maintenance** (`2-326`), mark out-of-order, schedule fix
- **Locker Waiting List** (`2-327`), queue for popular locker sizes

### Reporting (from `Conqueror-2-328.html`)

Locker Report filters:

- **All Lockers:** full inventory
- **Available:** currently unrented
- **Rented:** currently occupied
- **Expired:** past expiry date, needs vacate
- **Out of Order:** broken

Plus **Advisory Slips** (`2-330`), printable slips reminding
customers of pending expiry, delivered per league night or by hand.

### Locker Bank Setup (from `Conqueror-2-331.html`)

Physical grouping of lockers:

- **New:** create a locker bank (e.g. "Front Wall", "Back Wall")
- **Delete** / **Modify:** manage banks
- **Select:** set the active bank being viewed

### For Kings

Probably not in heavy use for upscale entertainment concept, since
Kings customers do not usually rent seasonal lockers. Bowling league
centers use this constantly (league bowlers store their ball
between sessions). Kings' league business is smaller so the module
may be off, but the config exists if any Kings location decides to
add lockers.

## Related SQL tables

From [`05-database-schema.md`](05-database-schema.md):

**Experience:**
- No dedicated table found in the base schema; likely lives in
  `Options` / `PriceKeys` with an Experience discriminator column

**Time Games:**
- `TimeGamesItems`: Time Game items (per-table records)
- `TimeGamesPlayers`: active players on Time Game items

**Lockers:**
- `Lockers`: the locker inventory
- `LockersBanks`: physical banks
- `LockersWaits`: waiting list

## Related Crystal Reports

From [`15-reports-catalog.md`](15-reports-catalog.md):

**Lockers:**
- `Lockers.rpt`: main locker report
- `LockersAdvice.rpt`: customer advisory slips

**Time Games / Experience:**
- No dedicated top-level report templates found; likely reuse the
  general POS / shift reports

## Related DLL family

From [`04-modules-and-dlls.md`](04-modules-and-dlls.md):

- `TimeGames.dll`: Time Games client
- `TimeGamesSetup.dll`: Time Games setup UI
- No dedicated Locker or Experience DLLs at the top level; they live
  inside `Qbk.Reservations` and `Qbk.CenterManagement` families

## Reference

- Where Experience relates to lane opening: [`16-lane-management.md`](16-lane-management.md)
- Where Locker rental ties to member accounts: [`21-fbt-membership.md`](21-fbt-membership.md)
- Where Time Game sessions collect payment: [`19-point-of-sale.md`](19-point-of-sale.md)
- CHM outline anchors:
  [Experience](extracted-strings/chm-en-outline.md#experience),
  [Time Games](extracted-strings/chm-en-outline.md#time-games),
  [Lockers](extracted-strings/chm-en-outline.md#lockers)
