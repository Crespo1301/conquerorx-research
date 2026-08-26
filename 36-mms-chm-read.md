# MMS CHM Reference (Operator-Facing Config)

CHM-side deep read of the Multi Media System. Complements
[`18-mms-realtime.md`](18-mms-realtime.md) (which documents the
technical realtime layer, Node.js + Socket.IO on port 8760) by
covering the OPERATOR-FACING configuration surface: what a manager
sees in the Conqueror UI when they configure MMS content. From CHM
sections `Conqueror-2-405.html` through `Conqueror-2-417.html`.
5 sub-sections.

Path: **Setup > Technical Setup > Multi Media System.**

## What operator-facing MMS is

The system that drives the **overhead + wall-mounted TVs** at the
center. Not to be confused with `MMSAppServer` (the underlying
Node.js daemon documented in doc 18). This CHM-side surface is what
a manager touches to define WHAT plays on WHICH screen and WHEN.

Displays five kinds of content by rotation:

- **Live scores** (per lane)
- **Standings** (league / tournament)
- **Waiting list** (customers waiting for a lane)
- **Advertising playlists** (pictures + videos)
- **Price lists** (menu + service prices)
- **TV** (broadcast passthrough with PIP support)
- **Strike Challenge** (cross-lane strike competition)
- **Experiences** (branded content bundles)

## The 5 sub-sections at a glance

| # | Section | What it does |
|---|---|---|
| 1 | MMS Monitor Management | Session-level content definition (Waiting List, Standing, Price List, Score, Advertising, Experiences) |
| 2 | MMS Sequence Setup | Compose sessions into a timed rotation |
| 3 | Strike Challenge | Cross-lane strike competition (BES, Bowland, Bowland-X only) |
| 4 | MMS Monitor Setup | Hardware side: register each physical MMS (Serial Number, MAC, coordinates, Reboot) |
| 5 | MMS Program Upload | Push programs to MMS hardware after Conqueror updates or hardware changes; System Log audited |

## 1. MMS Monitor Management (`Conqueror-2-406.html`)

Session-level content library. Per-monitor scroll menu for
selecting which session displays. Colored dot indicates monitor
status (**green** = functioning, **red** = inactive).

For score, standings, and Strike Challenge sessions, a supplementary
option specifies which lanes to display.

### 1.1 Waiting List (`Conqueror-2-407.html`)

Displays the queue of guests waiting for a lane. Default right-hand
side message: "Go to Front Desk" (overridable).

**Waiting List + PIP TV** mode overlays the waiting list on top of
a picture-in-picture live TV feed.

Kings-relevance: waiting list may or may not be used depending on
whether Kings uses walk-in queuing (unlikely at a reservation-first
venue).

### 1.2 Standing Sessions (`Conqueror-2-408.html`)

Real-time league / tournament standings. Different classifications
can rotate within one session ("Team standings, then Individual
standings, then Handicap-adjusted standings"). Configured per
league / tournament via [doc 25 Leagues](25-leagues.md) and
[doc 26 Tournaments](26-tournaments.md).

### 1.3 Price Lists (`Conqueror-2-409.html`)

Menu-price display. Left pane: center's price keys divided by
department (tree structure). Right pane: what to show on the
MMS screen.

**Price groups** within a price list: sandwiches, soft drinks,
pro-shop merchandise, each with its own highlighted title.

Multiple price lists possible ("Sunday evening menu", "children's
party menu"), assigned per-monitor via the Monitors tab.

Each list starts with a Top Message, Logo, and Special Offer
promotional message.

Kings-relevance: expect at least a bowling-hours price list and an
F+B price list. Special-event lists (weekend, cosmic, party
packages) plausibly configured.

### 1.4 Score Sessions (`Conqueror-2-410.html`): RDB hardware + BES/Bowland/Bowland-X/AS+

Live per-lane score display. 2-lane-display or 4-lane-display mode.

Per-session options:

- **Carry over Game Total:** cumulative score across previous
  games in the same session
- **Display Game Total with Handicap:** add handicap to displayed
  total
- **Score line content:** total only, team's scratch, handicap +
  bonus + total, no additional info

Kings-relevance: on for standard bowling; the specific config depends
on whether Kings hosts league play (would want handicap-adjusted
totals for those).

### 1.5 Advertising Playlists (`Conqueror-2-411.html`)

Picture + video playlists for the ad rotation.

Actions:

- Load media via **+** under Available Images and Videos
- Create / rename / delete playlist via top-right buttons
- **Insert** to move media into the selected playlist
- Order media with up / down arrows
- Set **Picture Display Time** (seconds per still)
- **Active** toggle: only Active playlists are assignable to lanes
- Active playlists can't be edited (must deactivate first)

Recommended formats (from `2-411`): specific to QubicaAMF's media
pipeline. Non-recommended formats trigger a Conversion Warning that
the file will be transcoded on upload.

Kings-relevance: heavy. Kings runs branded content, promotions,
and event advertising across the venue. This is the surface where
that content lands.

### 1.6 Experiences (`Conqueror-2-412.html`)

Branded content bundles tied to an Experience (see
[`30-ancillary-modules.md`](30-ancillary-modules.md#experience)).

Per Experience:

- Pick from Experience list
- **Opening Type** and **Graphic Set** auto-populate; can be
  overridden
- Same Experience can be added multiple times with different
  Opening Types
- Each Experience linked to a NUMBER so it stays stable across
  monitor assignments (Experience 2 can play on Entrance 2 and VIP
  Area 2 simultaneously)
- **Price Subtitle** and second **Tagline** field optional (useful
  for max-players info)
- Displayed price = the Experience's default price key

Kings-relevance: fits Kings' boutique concept. An "Adult Cosmic
Bowling" or "Corporate Package" Experience with matching branded
MMS content is likely in use.

## 2. MMS Sequence Setup (`Conqueror-2-413.html`)

**Compose sessions into a timed rotation.**

- Create new sequence via **+**
- Give it a name
- Add sessions one by one via **+** under the table; each with a
  duration
- Reorder with up / down arrows
- **Save** to push to monitors

CHM example rotation:

- 10 seconds advertising
- 30 seconds waiting list
- 1 minute TV
- 15 seconds standings
- ...loop

Kings-relevance: each monitor at Kings probably runs a curated
sequence blending brand content, live scores for the lanes it
overlooks, food-and-beverage promotions, and (during events) league
or tournament standings.

## 3. Strike Challenge (`Conqueror-2-414.html`): BES / Bowland / Bowland-X

Cross-lane strike competition. Lanes race by achieving strikes;
first to N strikes wins.

- **Loop Mode:** continue after the first winner until all prizes
  are awarded

### 3.1 Strike Challenge Management (`Conqueror-2-415.html`)

Access: **Lane Status > Special Functions > Strike Challenge**
(Bowland) or **Setup > Bowling Setup > Special Games** (BES).
Privilege: **Access to the Special Games configuration.**

Per-session controls:

| Field | Purpose |
|---|---|
| **Strikes per Race** | How many strikes to reach the finish |
| **Available Prizes** | Prize pool for the race |
| **Prizes Issued** | Read-only counter |
| **Loop Mode** | Keep going after first winner until all prizes gone |
| **Prestart Alert** | Pre-launch notification |
| **Lanes** | Which lanes participate |
| **Status** | Session status |
| **Awarded** | Which prizes have been given |
| **Delete** | Remove a session |

Kings-relevance: fits Family Fun bookings and Kids Party
bookings. Probably off during adult-oriented services.

## 4. MMS Monitor Setup (`Conqueror-2-416.html`)

Hardware registration. **Setup > Technical Setup > Multi Media
System.**

Per physical MMS:

- **New:** register a new MMS in the scroll menu (auto-named "MMS 1",
  "MMS 2", ...)
- **Serial Number:** required
- **MAC Address:** required for RDB hardware
- **Monitor specifications + image coordinates:** set once
- **Reboot:** soft-reboot the MMS
- **Delete:** remove the MMS

RDB-only extra: **Message Displayed when Lane Available:** the
blinking right-hand-column text when a lane becomes available.
Default: "Go to Front Desk"; overridable. If blank, only the player
name blinks.

Kings-relevance: set at install per monitor; rarely touched. Would be
touched during hardware replacement (analogous to the 2026-08-26 5HD
HUB replacement documented in
[doc 13 incident C1](13-operations-troubleshooting.md#c1-lanes-1314-reset-with-no-comms-then-rebooted-resolved)).

## 5. MMS Program Upload (`Conqueror-2-417.html`)

Push programs to MMS hardware after Conqueror updates or MMS
hardware changes.

Progress display: step 1 of 12, step 2 of 12, ..., "Upload
successfully completed."

**Registered in System Log** given the delicate nature. Same
audit-trail model as
[Upload to Lanes](34-technical-setup.md#7-upload-to-lanes-conqueror-2-481html).

Kings-relevance: happens automatically when Working Copy pushes a
Conqueror update. Manual runs would be rare, only during MMS
hardware replacement.

## How this doc relates to doc 18 (MMS realtime)

- **This doc (36)** covers the CONFIG surface: what plays where,
  as configured through Conqueror's Setup UI.
- **Doc 18** covers the DELIVERY layer: the Node.js MMSAppServer
  on port 8760, the 10 service channels, Socket.IO message flow.

Read together:

- A manager configures a Score Session here → the SessionsService
  in MMSAppServer streams live scores to the monitor.
- A manager configures an Advertising Playlist here → the
  AdvertisingService plays it in the configured slot.
- A manager configures a Waiting List display here → the
  WaitingListService pushes live queue updates.

## Related SQL tables

From [`05-database-schema.md`](05-database-schema.md):

- **`MMSSessions`**, **`MMSSequences`**, **`MMSMonitors`**: the
  config layer
- **`Playlists`**, **`PlaylistItems`**: advertising media queue
- **`PriceLists`**, **`PriceListGroups`**, **`PriceListItems`**:
  menu-display definitions
- **`StrikeChallenge`**, **`StrikeChallengeSessions`**: Strike
  Challenge state
- **`SystemLog`**: Upload audit trail

## Related DLL family

From [`04-modules-and-dlls.md`](04-modules-and-dlls.md):

- **`Qbk.MMS.*`**: MMS config surfaces
- **`Qbk.MMS.Server.dll`**: server-side MMS logic
- **`MMSAppServer/`** Node.js daemon: delivery layer (doc 18)

## For Kings specifically

- **Advertising Playlists (1.5)** is the surface where a Kings
  marketing team drops in new promo content. Worth knowing that:
  active playlists cannot be edited (deactivate first).
- **Experiences (1.6)** ties MMS content to booking types. If Kings
  runs Experience mode (very likely), MMS content per Experience
  is configured here.
- **Sequences (2)** is the highest-leverage surface: 5 minutes
  spent building a well-paced rotation drives what every guest
  sees for hours.
- **Strike Challenge (3)** is probably off at adult-dining service;
  worth flagging as a Kids Party upsell tool.
- **For our reservations-builder:** no direct interaction.

## Reference

- Related realtime delivery layer (Node.js + Socket.IO): [`18-mms-realtime.md`](18-mms-realtime.md)
- Related Experiences module: [`30-ancillary-modules.md`](30-ancillary-modules.md#experience)
- Related Leagues / Tournaments standings feeds: [`25-leagues.md`](25-leagues.md), [`26-tournaments.md`](26-tournaments.md)
- Related Coin-Op MMS Advertising: [`31-cameras-coinop-specialgames.md`](31-cameras-coinop-specialgames.md#mms-advertising--sequences-from-2-443-and-2-444)
- Related HyperBowling High Scores service: [`34-technical-setup.md`](34-technical-setup.md#9-high-scores-conqueror-2-484html-hyperbowling-only)
- Related System Log audit for Upload: [`34-technical-setup.md`](34-technical-setup.md#7-upload-to-lanes-conqueror-2-481html)
- CHM outline anchor: [`extracted-strings/chm-en-outline.md`](extracted-strings/chm-en-outline.md#multi-media-system)
