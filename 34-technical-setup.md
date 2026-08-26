# Technical Setup Reference

Hardware-side configuration. This module is where a QubicaAMF
technician (not front-desk staff, not manager) configures the
pinsetter parameters, camera parameters, Lane Control Box
addressing, TV + sound calibration, HyperBowling tests, and the
per-lane hardware roster. CHM sections `Conqueror-2-472.html`
through `Conqueror-2-491.html`. 11 sub-sections.

**Applies to BES, Bowland, and Bowland-X.** Older scoring generations
do not run most of this module.

## Guardrail

Do NOT modify Technical Setup values without instructions from
QubicaAMF Technical Support. CHM literally states: *"It is not
recommended that operators modify any of these settings without
first having received instructions from a qualified technician at
QubicaAMF Technical Support."* This is vendor-authored calibration
territory.

Also: **the Access to the Pinsetter and Camera Settings** privilege
gates the pinsetter / camera window (see [doc 27](27-security.md)).

This doc documents WHAT surfaces exist and what each does at a
category level. It does NOT enumerate every tuning knob (there are
25+ pinsetter parameters alone) since those belong in the vendor's
technical binder, not our operations reference.

## The 11 sub-sections at a glance

| # | Section | What it does |
|---|---|---|
| 1 | Upload Animation | Push animation programs to the RDB (Rack Distribution Box) after Conqueror updates or feature additions (Special Games, environments) |
| 2 | Lane Control Box Replacement | Swap a broken Lane Control Box: settings transfer automatically from the old unit to the new one |
| 3 | Lane Control Box Address | One-time setup during installation: assign a lane pair (via ID) to each VDB by Serial Number |
| 4 | Com Test | Communication test with the lanes; RDB + VDB only. Visual green/red status per lane, error-type counters |
| 5 | TV and Sound Setup | Overhead-monitor + sound configuration per lane pair (color, brightness, H-Pos, sound test, copy-to) |
| 6 | Pinsetter and Camera | Two-tab per-lane pinsetter parameter set (25+ knobs) and camera parameter set (6 knobs) |
| 7 | Upload to Lanes | Push programs to the Lane Control Box after settings changes; registered in System Log |
| 8 | Lane Setup | Per-lane hardware roster (Bowling Type, MAC Number, monitors, keyboard, intercom, pinsetter type, redemption, reservation setup) |
| 9 | High Scores | HyperBowling module: 10-slot rolling leaderboards for HyperBowl / HyperBowl Pro / HyperActive; 4 predefined + 5 custom standings |
| 10 | HyperBowling Tests | Diagnostic tests for HyperBowling hardware (sensors, LEDs, bumpers, bumpers-up/down) |
| 11 | Calendar Setup | Public holidays + special days (Extra1 / Extra2 / Extra3) that enable special pricing in [Price Setup](22-center-setup.md) |

## 1. Upload Animation (`Conqueror-2-473.html`): BES only

Path: **Setup > Technical Setup > Upload Animation.**

Push animation programs from the Conqueror server's hard drive to
the RDB (Rack Distribution Box).

Buttons: **Import** (BES X only), **Reload** (refresh the file list),
**Upload** (send to selected lanes). On successful upload, source
files are deleted from the Conqueror hard drive, remaining only on
the RDB.

When: after Conqueror updates, after adding features (Special Games,
environments), after RDB replacement.

## 2. Lane Control Box Replacement (`Conqueror-2-474.html`)

Path: **Setup > Technical Setup > Lane Control Box Replacement.**

Runbook for swapping a broken Lane Control Box (LCB):

1. Technician physically disconnects the broken LCB and attaches
   the replacement.
2. Open this module. Select the lanes the LCB serves; they're
   recognized automatically. If not, they're marked with a
   lightning-bolt symbol.
3. If working with an RDB, enter the MAC Number printed on the RDB
   label.
4. Press OK. Programs reload automatically; the settings from the
   old LCB copy onto the new one.

**Kings relevance:** the 2026-08-26 fix for lanes 13/14 (see
[doc 13 incident C1](13-operations-troubleshooting.md#c1-lanes-1314-reset-with-no-comms-then-rebooted-resolved))
included a **5HD HUB** replacement, which is topologically the same
kind of operation as this module handles for LCBs. Daniel likely
ran this workflow (or the analogous one for the 5HD HUB) as part of
the fix.

## 3. Lane Control Box Address (`Conqueror-2-475.html`): one-time

Path: **Setup > Technical Setup > Lane Control Box Address.**

Used **once** during initial installation by the QubicaAMF install
team. Assigns each VDB (Video Distribution Box) to a lane pair.

- **Serial Number:** 9-digit number on the VDB label + shown on the
  monitor during start-up
- **ID:** 1 for the VDB controlling lanes 1 and 2, 2 for lanes 3
  and 4, and so on

Kings-relevance: already run when Kings Seaport was commissioned;
should never need to be re-run unless the entire VDB layer is
replaced.

## 4. Com Test (`Conqueror-2-476.html`): RDB + VDB only

Path: **Setup > Technical Setup > Com Test.**

Diagnostic communication test with the lanes.

- Select lanes via **Lanes to Test**, press **Start**.
- Healthy lanes shade green with all 4 error counters at zero.
- Faulting lanes turn red; the relevant error-type counter
  increments per failure cycle.
- Counter at the base of each box shows total cycles completed.
- Press **Stop** to end.

Kings-relevance: this is the module the front-desk manager should
know exists to hand to a remote technician during a suspected
comms issue. Running it during a "No Comms" pattern would give the
technician quantified evidence before they arrive on site.

## 5. TV and Sound Setup (`Conqueror-2-477.html`)

Path: **Setup > Technical Setup > TV and Sound Setup.**

Overhead-monitor and sound configuration per lane pair. Set once at
install, rarely changed.

| Field | Purpose |
|---|---|
| **Lanes** | Which lane pair to configure |
| **Copy to** | Duplicate the selected pair's settings onto another pair |
| **Sound Test** | Beep test; adjustable volume via cursor for TVs far from front desk |
| **TV Adjust** | Color, Brightness, H-Pos (Horizontal Position), and other monitor calibration |
| **Modify** | Enter modification mode |

Kings-relevance: was almost surely run when Kings Seaport was
commissioned. May be re-run when the projector at lanes 9/10 and
11/12 was installed on 2026-08-26 (see doc 13 C1 write-up).

## 6. Pinsetter and Camera (`Conqueror-2-478.html`)

Path: **Setup > Technical Setup > Pinsetter and Camera.**
Privilege: **Access to the Pinsetter and Camera Settings.**

Per-lane pinsetter and camera parameter tuning. Two tabs:

### 6.1 Pinsetter Parameters (`Conqueror-2-479.html`): 25+ knobs

Categories:

- **Timing knobs:** First/Second Ball Delay, First/Second Read,
  Delay, Reset Time, Pulse Cycle, Pulse Reset, Time Out, Strike
  Time, Pulse W 1/2, Pause 1/2
- **Position / sensor knobs:** Cm, Level, Sensor Polarity, FBox+,
  Pin Add Mode
- **Mode knobs:** Mode, Auto Power, Impulse Divided, Short Pulse,
  Automatic Foul, Strike N.C., Swap from Left to Right
- **Auxiliary knobs:** Aux, Second Lamp, Second Lamp Tenth Frame,
  Pinsetter Signal

Every knob is vendor-calibrated and pinsetter-model-specific. Do
not adjust without QubicaAMF instructions.

### 6.2 Camera Parameters (`Conqueror-2-480.html`): 6 knobs

Categories:

- **Auto** (auto-adjust mode)
- **Save Image** (persist a diagnostic capture)
- **Level** (exposure / gain)
- **Last** (recall last-captured image)
- **Info** (diagnostic overlay)
- **Image** (viewer / capture surface)

Used by the technician when the pinsetter's pin-recognition camera
misreads pins (wrong scoring). Requires an on-site adjustment
session.

## 7. Upload to Lanes (`Conqueror-2-481.html`)

Path: **Setup > Technical Setup > Upload to Lanes.**

Push programs to the Lane Control Box. Required after Conqueror
updates and after Lane Setup changes to activate them. **Registered
in System Log** given the delicate nature.

Actions:

| Button | Purpose |
|---|---|
| **Select Lanes** | Pick which lane pairs to target |
| **Select Mask** (VDB only) | If no Nextia programs, sets the mask for player-name entry from the lane keyboard |
| **Table** | Progress display: "step 1 of 12", "step 2 of 12", ..., "Upload successfully completed" |
| **Erase Memory** | DESTRUCTIVE: closes currently-open lanes and erases their memory. Session data is LOST. |
| **Send HDC** | Send the HDC file |
| **Boot from Network** | Trigger network boot on the target LCB |
| **Reset** | Reset the LCB |
| **Upload** | Trigger the upload |
| **Reinitialize** | Reinitialize the LCB post-upload |

Kings-relevance: any pinsetter parameter change from section 6
requires an Upload to Lanes to take effect. The System Log entry
is a natural audit hook if we ever want to correlate a hardware
tweak with a shift-over-shift change in fault rate.

## 8. Lane Setup (`Conqueror-2-482.html`)

Path: **Setup > Technical Setup > Lane Setup.**

The per-lane hardware roster. Set **Number of Lanes in the Center**,
then define Common Data (settings that apply to every lane) and
modify per-lane exceptions.

Per-lane fields:

| Field | Purpose |
|---|---|
| **Available** | Whether the lane appears in Lane Status. Unselect when a lane cannot be opened as a pair (e.g. broken partner). |
| **Bowling Type** | Standard, Cosmic, HyperBowling, etc. |
| **MAC Number** | Hardware MAC identifier |
| **Action Replay Device** | Configuration for the replay-camera hardware |
| **Keyboard** | Lane keyboard model |
| **Intercom** | Whether the lane has an intercom, plus device config |
| **Console Speaker** | Speaker config on the score console |
| **Lane Monitors** | Number and layout of monitors |
| **Default Mask** | Player-name entry mask for the lane keyboard |
| **Monitors on Lanes** | Physical monitor topology |
| **Pinsetter Type** | The pinsetter model on that lane |
| **Redemption** | Whether redemption tickets tie into this lane's game (arcade-style prize integration) |
| **Lane Settings** | Miscellaneous lane-specific knobs |
| **Lane Usage** | Utilization tracking flags |
| **Reservation Setup** | Lane-specific reservation defaults |
| **HDMI Monitor Settings** | HDMI-monitor-specific config |

### 8.1 Lane Counters (`Conqueror-2-483.html`)

Wear-counter tools per lane.

| Button | Purpose |
|---|---|
| **Reset Total** | Zero the lane's cumulative counter (typically at pinsetter overhaul) |
| **Decrease** | Adjust the counter down by a specific number (correct over-counts) |

Kings-relevance: **HDMI Monitor Settings** and **Lane Monitors** may
have been touched during the 2026-08-26 projector install for lanes
9/10 and 11/12. The **Reservation Setup** field is the per-lane
setting that constrains which reservations can land on which lane
(feeds into the [ROOM_LANE_NUMBER_MAP](SESSION-CLOSEOFF-2026-08-25.md)
work still pending).

## 9. High Scores (`Conqueror-2-484.html`): HyperBowling only

The HyperBowling High Scores module. Rolling top-10 leaderboards for
HyperBowl, HyperBowl Pro, and HyperActive games.

- 4 predefined standings + 5 custom standings, each defined by the
  user
- Rotates on overhead monitors via the MMS "High Scores" service
  (see [doc 18](18-mms-realtime.md#service-channels))
- When lanes are closed, standings also show on overhead monitors
  and SuperTouch screens
- Pre-populated with 10 "dummy" sessions so a fresh leaderboard
  doesn't display near-zero scores. Center can set an entry-score
  threshold matching the tenth-place score.

Sub-tabs:

- **9.1 High Score Standings**: user-facing standings display
- **9.2 Standings**: configuration
- **9.3 Setup Tab**: setup surface
- **9.4 Settings Tab**: fine-tuning

Kings-relevance: HyperBowling is a QubicaAMF upsell hardware +
software feature. Unknown whether any Kings location has it
installed. Probably not at Kings Seaport (upscale dining concept,
not a competitive-attraction concept).

## 10. HyperBowling Tests (`Conqueror-2-489.html`): HyperBowling only

Path: **Setup > Technical Setup > HyperBowling Tests.**
Privilege: **Access the Hyper Bowling tests module.**

Diagnostics for HyperBowling hardware. Two tabs:

- **Overview:** all-lane status grid; selecting a lane highlights
  its frame in yellow
- **Details:** per-lane detail; left / right arrows navigate lanes

Test buttons (identical in both tabs):

- **Test Sensors**
- **Test LEDs**
- **Test Bumpers**
- **Bumpers Up/Down**

Kings-relevance: only if HyperBowling is present.

## 11. Calendar Setup (`Conqueror-2-491.html`)

Path: **Setup > Calendar Setup.**

Public holidays and special days per center. Also flags days for
special-pricing behavior (defined in [Price Setup](22-center-setup.md)).

- First day of the bowling week defaults to Monday; override in
  Center Setup Basic tab
- 3 special-day statuses, each color-coded:
  - **Extra1:** blue
  - **Extra2:** yellow
  - **Extra3:** green
- Each special day gets a Description (e.g. "New Year", "Center
  Anniversary", "Family Night Wednesdays")

Kings-relevance: high. Kings likely uses Extra statuses for events
like:

- Public holidays (Christmas, New Year, July 4th, etc.)
- Recurring special promotions (weekly cosmic nights, monthly
  themed events)
- Corporate blackout dates (private buyouts)

When our reservations-builder assigns lanes for a booking, it does
not currently check Calendar Setup. Long-term integration would
respect Extra day statuses to prevent conflicting bookings on
buyout days.

## Related DB tables

From [`05-database-schema.md`](05-database-schema.md):

- **`Lanes`**: the lane roster
- **`LaneOptions`** / **`LaneConfig`**: per-lane hardware settings
- **`LaneCounters`**: the wear counters from section 8.1
- **`HighScores`** or **`HypBowlHighScores`**: the HyperBowling
  leaderboard rows
- **`Calendar`** / **`CalendarDays`**: the Calendar Setup entries
- **`SystemLog`**: audit trail for Upload to Lanes (section 7)

## Related DLL family

From [`04-modules-and-dlls.md`](04-modules-and-dlls.md):

- **`Qbk.TechnicalSetup.*`**: this module's surfaces
- **`Qbk.Lanes.*`**: LCB / RDB / VDB communication
- **`Qbk.Pinsetter.*`**: pinsetter parameter marshaling
- **`Qbk.HyperBowling.*`**: HyperBowling-specific surfaces
- **`Qbk.Calendar.*`**: Calendar Setup

## For Kings specifically

- **Vendor-gated:** almost every knob here is set at install and
  should not be touched without QubicaAMF authorization. Do NOT
  modify without a support ticket open.
- **Awareness value:** the Com Test (section 4) is worth knowing
  about for future comms diagnostics; the Lane Control Box
  Replacement runbook (section 2) is worth knowing about for
  incident triage.
- **Calendar Setup (section 11)** is the one sub-section that
  Kings management CAN and probably SHOULD touch, for holidays
  and recurring specials.
- **Upload to Lanes (section 7) is DESTRUCTIVE** when Erase Memory
  is checked. Never authorize this without an active QubicaAMF
  support session.
- **For our reservations-builder:** Reservation Setup (section 8)
  and Available (section 8) both feed into what our tool can
  target. If a lane is not Available in Technical Setup, our
  Excel import cannot book it.

## Reference

- Related lane control at runtime: [`16-lane-management.md`](16-lane-management.md)
- Related TCS coverage: [`32-trouble-call-system.md`](32-trouble-call-system.md)
- Related incident C1 (hardware fix on 2026-08-26): [`13-operations-troubleshooting.md`](13-operations-troubleshooting.md#c1-lanes-1314-reset-with-no-comms-then-rebooted-resolved)
- Related MMS High Scores service: [`18-mms-realtime.md`](18-mms-realtime.md)
- Related pricing tied to Calendar special days: [`22-center-setup.md`](22-center-setup.md)
- CHM outline anchor: [`extracted-strings/chm-en-outline.md`](extracted-strings/chm-en-outline.md#technical-setup)
