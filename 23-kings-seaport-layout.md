# Kings Seaport Physical Layout

Site-specific reference for **Kings Seaport (60 Seaport Blvd, Boston, MA
02210)**. Room to lane mapping, network layout, terminal roster,
maintenance contacts.

**Status:** template pending real values from Kings staff. Answers open
question **Q16** in part; full completion requires walking the floor and
confirming with the opening manager.

## Why this doc exists

Our reservations-builder currently maps only King Pin Lounge → lanes
1-4. Everything else Tripleseat sends over (Royal Room, Kings Corner,
generic room names) falls back to lane 1, which flags on the review
page. That works for a first pass but breaks for a real busy morning
where multiple rooms need distinct lane groups.

To fix it we need the actual room to lane mapping at Kings Seaport.
This doc holds it once collected and becomes the canonical reference
for both the tool and any future Kings-related work.

## Room to lane mapping (fill in)

Structure below is what our tool needs. Fill in each row with the
actual lane number range for that Kings Seaport room.

| Tripleseat Room name | Lane numbers | Group behavior | Confirmed by | Confirmed on |
|---|---|---|---|---|
| King Pin Lounge | 1, 2, 3, 4 | 4-lane group, boutique lounge | Carlos (from repo notes) | 2026-08-24 |
| Kings Corner | 13, 14, 15, 16 | 4-lane group, back-corner private area | Carlos (from Praxis Precision Medicines import test) | 2026-08-26 |
| Royal Room | TBD | TBD | | |
| (other named rooms) | TBD | TBD | | |
| (walk-up lane pool) | TBD (usually the remaining lanes not in a private room) | individual lanes | | |

**Multi-room bookings:** a single Tripleseat event can span multiple
rooms. Confirmed example: the Praxis Precision Medicines booking on
2026-08-26 covered **lane 12 + Kings Corner (lanes 13-16)** as a
single 5-lane group. When the reservations-builder maps only the
first room (or misses the multi-room signal), ConquerorX rejects the
import with a "too many people for lane" error because the party
size exceeds a single lane's capacity. The builder needs to sum
lane inventory across every room named in the booking before
distributing bowlers.

Once filled in, the same table gets copied into
`src/morning_import_builder.py` in the `ROOM_LANE_NUMBER_MAP` dict of
the reservations-builder repo, and the review page stops flagging those
rooms.

## Total lane count at Kings Seaport

**TBD.** Most Kings locations are 20 to 30 lanes total across the
lounges and open bowling area.

## Physical pods

Score consoles and pinsetters at Kings Seaport are paired into pods
(two lanes per pod share hardware). Confirmed pod pairings we've
observed via the reboot incident:

| Pod | Lanes | Notes |
|---|---|---|
| Pod at 13/14 | 13, 14 | Part of Kings Corner (lanes 13-16). Site of the 2026-08-24 No-Comms + reboot incident, resolved 2026-08-26 (worn UTP cable under ball return motor). See [`13-operations-troubleshooting.md`](13-operations-troubleshooting.md#c1-lanes-1314-reset-with-no-comms-then-rebooted-resolved). |
| Pod at 15/16 | 15, 16 | Part of Kings Corner (lanes 13-16). |

Standard QubicaAMF pods pair consecutive odd-even lane numbers
(1/2, 3/4, 5/6, ..., 13/14, 15/16, etc.). Kings Seaport likely follows
this convention.

## Terminal roster

**Partially confirmed.** ConquerorX assigns each PC on the LAN a Terminal
number when it first registers. The list of registered terminals lives
in the DB (`TerminalLicenses` table) and can be viewed at Center Setup >
Basic > Terminals (needs Center Setup access we don't currently have,
see [`CLAUDE.md`](../../repos/kings-morning-reservations-builder/CLAUDE.md)
in the reservations-builder repo for the access-model note). Hostname
and role can still be captured without that privilege via the
[Kings intake scripts](https://github.com/Crespo1301/kings-morning-reservations-builder/tree/main/scripts/kings-intake).

Fill in the rest as collected:

| Terminal # | Location | Role | MAC / hostname | Confirmed |
|---|---|---|---|---|
| TBD | Front desk (likely) | TERMINAL: client shell only, `ConquerorServer` and `MxSvc` both Stopped, only BowlingAgent ports (5130, 7014) listening | `FRONTDESK1`, IP `192.168.71.1/23` on a dedicated `Conqueror NET` interface | 2026-08-26, via intake capture |
| ? | Server host, not yet located | SERVER: should show `ConquerorServer` and `MxSvc` Running | | Not yet captured |
| ... | ... | ... | | |

The dedicated `Conqueror NET` network interface name confirms ConquerorX
traffic runs on its own logical network segment at Kings Seaport,
separate from general office/guest networking, consistent with the
per-pod dedicated network runs noted in
[`13-operations-troubleshooting.md`](13-operations-troubleshooting.md).

## Network layout

**TBD.** Kings network topology (VLAN structure, switch fabric, uplink
to internet) is not documented here. The server host and terminal PCs
sit on the internal LAN. Score consoles have their own dedicated
network run per pod (relevant to Pattern A troubleshooting).

## Server host

**TBD.** Which physical PC runs `ConquerorServer.exe`, `MxSvc`,
`MSSQL$CONQUERORX`, `MMSAppServer`, and holds the master database.
Likely a rack-mounted or under-desk box in the back office.

Fields to confirm:

- Windows version
- ConquerorX version installed (Center Setup > Basic > Activation)
- Backup destination (see [`22-center-setup.md`](22-center-setup.md) Backup section)
- Spare-server setup (yes / no; if yes, host + failover process)

## Maintenance contacts

**TBD.** Fill in as onboarding happens:

| Role | Name | Contact | Notes |
|---|---|---|---|
| Kings maintenance lead (network, cables, switches) | | | |
| Kings mechanical lead (pinsetters, ball returns) | | | |
| QubicaAMF support account | | | Account number, support portal URL |
| Software technician (external) | Daniel Martines | mdaniel391@gmail.com | See 2026-08-24 incident correspondence |

## How to collect this info

Fastest path is a single visit with the opening manager:

1. Walk the floor with a notepad. Note every named room and the lanes
   it contains. Take photos of the lane-number placards.
2. Open ConquerorX at the front desk. Go to Center Setup > Basic >
   Terminals to dump the terminal list. Note each terminal's location.
3. Ask the manager who to call for network vs mechanical vs software
   issues, and whether Kings has a direct QubicaAMF support account.
4. Grab the ConquerorX version from Center Setup > Basic > Activation
   (or the About Conqueror page).
5. Fill this doc in.

After that, the same file becomes reference for every future incident.

## Once filled in

Update the reservations-builder's `ROOM_LANE_NUMBER_MAP` in
`src/morning_import_builder.py` to match this doc's mapping table. Cut
a release. Update the reservations-builder CLAUDE.md to note the
mapping is now complete.

## Reference

- The tool that uses this mapping: [`kings-morning-reservations-builder`](https://github.com/Crespo1301/kings-morning-reservations-builder) (private, separate repo)
- Ongoing troubleshooting log for Kings Seaport lanes: [`13-operations-troubleshooting.md`](13-operations-troubleshooting.md)
- Q16 in [`12-open-questions.md`](12-open-questions.md)
