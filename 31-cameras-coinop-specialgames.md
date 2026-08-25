# Cameras, Coin-Op, and Special Games Reference

Three peripheral module areas grouped here because none is large
enough for its own doc, and each is tangential to Kings' core
operation:

- **Cameras and Real Time Income** (`Conqueror-2-402.html` to `2-404`)
- **Coin-Op Installations** (`Conqueror-2-436.html` to `2-444`)
- **Special Games**, three sub-variants (`Conqueror-2-288.html` to `2-320`):
  - BES X Mad Games
  - BES Special Games
  - Bowland Special Games

## Cameras and Real Time Income

### Camera Management (from `Conqueror-2-403.html`)

Back-office camera surveillance with real-time viewing. Access via
**Back Office > Cameras and Real Time Income**. Managers can select
a camera from the configured list, view live feed, and PTZ (pan /
tilt / zoom) if the camera supports it. Local or remote viewing
(useful for a chain operator watching multiple centers).

**Camera Setup** fields:

| Field | Purpose |
|---|---|
| **Description** | Human-readable camera name |
| **IP Address** | Camera network location |
| **Type** | Camera driver / manufacturer |
| **Login Name / Password** | Camera auth credentials |

Backed by the `AForge.Video.*` DLL family (see
[`04-modules-and-dlls.md`](04-modules-and-dlls.md)) which is a common
.NET computer-vision + video-capture stack.

### Real Time Income (from `Conqueror-2-404.html`)

Live revenue tracking for the current shift, viewable while the
shift is running. Managers see running totals as sales happen, without
waiting for the shift-close DAR report. Same data pulled from POS
transactions but rendered as a live-updating dashboard rather than a
static report.

### For Kings

- **Cameras:** if Kings uses in-house IP cameras (which any upscale
  entertainment venue should for security), this module could be the
  central viewing surface. More likely Kings uses a dedicated
  surveillance system separate from ConquerorX and this module sits
  idle.
- **Real Time Income:** likely valuable at Kings; managers watch peak
  revenue in real time to gauge shift performance vs targets.

## Coin-Op Installations

### What Coin-Op is (from `Conqueror-2-437.html`)

Coin-operated lane hardware support. Coin-op lanes accept physical
coins (or tokens) as payment; the coin acceptor triggers a lane
opening for N minutes / N games based on coin value. Legacy hardware
model, common in older AMF centers, rare in modern boutique
installations like Kings.

### Coin-op Mode setup path

**Setup > Bowling Setup > Coin-op Mode.** Adds a "Coin Options"
section to the Bowling Mode setup. Three opening types are enabled:

- **Conqueror Only:** standard non-coin flow
- **Free Games:** free-play mode
- **Coin:** coin-triggered opening

Plus a **Number of credits for 1 game** knob controlling how many
coin credits equal one game.

### Coin-op Options (from `Conqueror-2-439.html`)

**Timeouts in Seconds** (from `2-440`) covers 12 timeout knobs:
Environment Choice, Single Player Sign-in, YouToons Pictures, Bowler
Number Choice, Ready to Play Screen, End of Game Choices, Warning
Message, Explanatory Screen, Bowler Throws, SuperTouch App Closure,
Recap Closure, Standing Closure. Each covers a specific coin-op
screen the bowler sees between game phases.

### Best Scores (from `2-441` and `2-442`)

Coin-op leaderboard. Persistent high-score display driven by the same
`BestScoresService` in MMSAppServer (see
[`18-mms-realtime.md`](18-mms-realtime.md)).

### MMS Advertising + Sequences (from `2-443` and `2-444`)

Coin-op configuration for the MMS Advertising surface, letting a
center control what ads roll during coin-op idle periods.

### For Kings

Not applicable. Kings is a modern boutique install with credit-card
payment and reservation-driven bookings. No coin lanes.

## Special Games: three variants

Three separate CHM sections cover novelty score-console mini-games. Each
targets a distinct scoring hardware generation:

| Section | Applies to | CHM sections |
|---|---|---|
| **BES X Mad Games** | BES X scoring | `2-288` to `2-294` |
| **BES Special Games** | Older BES scoring | `2-295` to `2-311` |
| **Bowland Special Games** | Bowland (European) scoring | `2-312` to `2-320` |

Kings runs BES X, so **BES X Mad Games** and **BES Special Games**
both apply.

### BES X Mad Games (from `Conqueror-2-289.html`)

Four Mad Game variants that overlay bowling with entertainment
mini-games shown on the score console:

- **Bowlin'Hood:** Robin Hood themed
- **Battle on the Lanes:** competitive mini-game
- **Character Factory:** build-your-avatar
- **Monsters Factory:** monster-themed avatar builder

Assigned to lanes via **Assigning Mad Games to Lanes** (`2-294`).

### BES Special Games (from `Conqueror-2-296.html`)

7 variants for older BES consoles:

- **Striker**
- **Red Pin Frame**
- **Mega Slot / Lane Lotto / Magic Wheel Mistress**
- **Christmas**
- **Rocky Road Race**
- **Poker**
- **Sledgehammer**

Each is a mini-game that pays out a prize on qualifying scores. Backed
by the `SPG*Sessions` DB tables in the schema (see
[`05-database-schema.md`](05-database-schema.md#special-games-spg-prefix)):
`SPGCubesSessions`, `SPGLuckyDrawSessions`, `SPGPokerSessions`,
`SPGQFlashSessions`, `SPGSlotMachineSessions`, `SPGTicTacToeSessions`.

**Session management** (from `2-304`) exposes per-lane views: Lanes,
Status, Games Played, Prizes Issued, Awarded, Delete.

**Setup surface** (from `2-306`) covers Prestart Games, Reminder
Frequency, Available Prizes, Win Every N, Hot Shot rules, Prestart
Alert, Spin Time (for spinning-wheel-style mini-games).

**Rocky Road Race** has additional settings (`2-307`): Loop Mode,
Hot Shots per Race, Spare configuration.

### Bowland Special Games (from `Conqueror-2-313.html`)

Bowland variant. Not enumerated in detail here since Kings does not
run Bowland hardware. Setup surface parallel to BES Special Games
with Bowland-specific mini-games.

### For Kings

- **BES X Mad Games** and **BES Special Games** are available at
  Kings' BES X consoles but likely disabled for the boutique dining
  concept, which does not want cartoon Robin Hood overlays on lanes
  where adults are having a curated experience.
- Might be enabled selectively for Kids Party bookings or Family Fun
  scenarios.
- Bowland Special Games: not applicable.

## Related SQL tables

From [`05-database-schema.md`](05-database-schema.md):

**Cameras:**
- No dedicated table found; camera list likely in `Options` /
  `Interfaces` with a discriminator

**Coin-Op:**
- No dedicated table found; likely `MultiIO` / `MultiIOStatus`
  handles the coin-acceptor hardware I/O

**Special Games:**
- `SPGCubesSessions`, `SPGLuckyDrawSessions`, `SPGPokerSessions`,
  `SPGQFlashSessions`, `SPGSlotMachineSessions`, `SPGTicTacToeSessions`
- `Prizes`, `PrizeStack`, `PrizeWinners` (prize award records)

## Related DLL family

From [`04-modules-and-dlls.md`](04-modules-and-dlls.md):

**Cameras:**
- `AForge.Video.dll`, `AForge.Video.DirectShow.dll`,
  `AForge.Controls.dll`, `AForge.Imaging.dll`, `AForge.Math.dll`,
  `AForge.dll`
- `AxInterop.AXISMEDIACONTROLLib.dll` (Axis IP-camera SDK interop)

**Special Games:**
- `SpecialGames.dll`
- `BesSpecGamesSetup.dll`
- `Qbk.SpecialGames.Server.dll` (via `Qbk.Bubble.GamesService.dll`)

**Coin-Op:**
- No dedicated top-level DLL; coin-op behavior lives inside
  `Qbk.Lanes.*` and `Qbk.Economical.CoinTech.Server.dll` (see
  [`04-modules-and-dlls.md`](04-modules-and-dlls.md))

## Related Crystal Reports

From [`15-reports-catalog.md`](15-reports-catalog.md):

- `CoinHopper.rpt`, `CoinOperated.rpt` (coin-op reports)
- `MadGamePrint.rpt` (Mad Games score printout)
- `MagicNumber.rpt` (special-games magic number scoring)

## For our tooling

- **Real Time Income** could be an integration target if we ever
  build a chain-wide "live revenue" dashboard aggregating across all
  10 Kings locations. Not a priority today, but the DB and Node.js
  layer to support it already exist.
- **Cameras** integration is out of scope; a separate surveillance
  system is more appropriate.
- **Special Games** would only matter if a future tool needed to
  toggle mini-games per booking (e.g. auto-enable Kids Party mini-games
  when a party reservation opens). Doable via `SPG*` DB writes, but
  we should treat this as vendor-controlled.

## Reference

- Related MMS BestScores service: [`18-mms-realtime.md`](18-mms-realtime.md)
- Related Special Games DB tables: [`05-database-schema.md`](05-database-schema.md)
- Related Prizes tables: [`05-database-schema.md`](05-database-schema.md)
- CHM outline anchors:
  [Cameras](extracted-strings/chm-en-outline.md#cameras-and-real-time-income),
  [Coin-Op](extracted-strings/chm-en-outline.md#coin-op-installations),
  [BES X Mad Games](extracted-strings/chm-en-outline.md#bes-x-mad-games),
  [BES Special Games](extracted-strings/chm-en-outline.md#bes-special-games),
  [Bowland Special Games](extracted-strings/chm-en-outline.md#bowland-special-games)
