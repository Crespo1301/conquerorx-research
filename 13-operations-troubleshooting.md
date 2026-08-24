# Operations & Troubleshooting Log

Living record of real ConquerorX incidents observed at Kings Seaport, with
diagnosis and resolution. Both a reference (what does this alert mean?) and
an incident log (has this happened before? how often?).

## How to use this doc

**When something goes wrong on a shift:**

1. Scan the "Known incident patterns" section for a match by symptom.
2. If found, follow the diagnosis + resolution steps.
3. If not found, log it in the "New incidents" section at the bottom with
   as much detail as you can capture (time, lanes involved, what the guests
   were doing, exact error text).
4. Later — someone (Carlos + Claude) turns new incidents into new "Known
   patterns" as we learn what they mean.

**Field entry template** — copy into a new incident:

```markdown
### Incident: <one-line summary>
- **When:** YYYY-MM-DD HH:MM ET
- **Lanes / terminals:** e.g. lanes 13-14, front desk terminal 1
- **Symptom:** what did staff / guests see
- **In-progress activity:** who was on those lanes doing what
- **Exact message text (if any):** verbatim
- **Duration:** how long from onset to normal
- **Recovery action:** what fixed it (or "self-recovered")
- **Guest impact:** none / minor / had to comp
- **Follow-up:** what still needs to happen (ticket to QubicaAMF, etc.)
- **Diagnosis (added later):** root cause once known
```

---

## Known incident patterns

### Pattern A — "No comms" on a pod, both lanes reset together

**Symptom:** two paired lanes (e.g. 13/14, 15/16) show "No Comms" simultaneously
in the front-desk lane grid, then their score consoles reboot on their own.

**What's happening:** the pod's score console lost heartbeat with the
BowlingAgent daemon on the server, hit its watchdog timeout (~5-15 seconds
of missed pings), and rebooted itself as a recovery. This is built-in
QubicaAMF behavior, not a bug — it's the console's "I've lost my brain,
restart" reflex.

**Comm chain that was interrupted:**
```
Score console → Q2A protocol → BowlingAgent (server 5130/7014)
             → MxSvc → ConquerorServer → Front-desk UI
```

**Most likely root cause, ranked:**

1. **Network glitch on the pod's cable/switch** — Two paired lanes share a
   network run; a flap or bump takes both down. Self-recovers when link
   returns.
2. **Console hard-locked** — bad game state (weird pinfall pattern) froze the
   console. Watchdog kicked in.
3. **Pinsetter fault** — jam trip or overcurrent → pinsetter controller
   reboots → score console loses hardware → resets.
4. **Power dip on the pod** — a lone pod power blip.
5. **BowlingAgent hiccup on the server** — GC pause or brief crash. Would
   affect more pods, so less likely if only 13/14.
6. **Working Copy sync at wrong time** — very rare mid-shift.

**Immediate action:**

1. Give it 60-90 seconds — consoles usually reconnect on their own.
2. Verify in the lane grid that 13/14 return to "Ready" or "In Session".
3. Check with guests on the lanes — did their session/scores restore?
   (They usually do; scores are persisted server-side.)
4. If TCS (Trouble Call System) fired, dismiss / resolve those tickets.

**Follow-up if repeated (>1× per week on the same pod):**

- Ask maintenance to inspect the pod's network cable and switch port.
- Ask maintenance to inspect the pinsetter for intermittent faults.
- File a QubicaAMF support ticket including the SystemLog entries around
  the incident times.

**How to check the logs (needs SQL access):**
- Table: `SystemLog` (in the ConquerorX DB, populated by `qsp_log_insert`)
- Filter by timestamp ± 2 minutes of the incident
- Look for entries mentioning "lane 13", "lane 14", "heartbeat", "no comms",
  "reconnect"
- Also check `LaneHistory` for state transitions (OFF → ON) on 13/14
- `C:\ProgramData\QubicaAMF\BowlingAgent\Logs\` on the server for BA-side
  connection logs

**First observed:** 2026-08-24 mid-shift at Kings Seaport (see incident C1
below).

**Escalation thresholds:**

| Frequency | Response |
|---|---|
| Once a month, self-recovers | Note in shift log, no ticket |
| Same pod > 1× per week | Maintenance check on that pod |
| Multiple pods same day | Server-side issue — file QubicaAMF ticket |
| Session data lost | File QubicaAMF ticket immediately |

---

### Pattern B — Terminal shows "Connection to Conqueror server missing"

**Symptom:** front-desk / back-office terminal can no longer talk to the
server. Shows a persistent error dialog or the app just closes.

**Cause:** either MxSvc, ConquerorServer, or the network between terminal
and server is down.

**Immediate action:**

1. Wait 30 seconds — brief service restarts happen.
2. Ping the server IP from the terminal (Command Prompt: `ping <server-ip>`).
3. If ping fails → network/switch issue.
4. If ping works but Conqueror still errors → server-side service issue.
   On the server:
   - Check Windows Services: `MxSvc` and `MSSQL$CONQUERORX` should both be
     "Running".
   - If not, restart via `RestartServices.exe` (in an elevated PowerShell,
     from `C:\QDesk\Bin\ConquerorServer\`).
5. If services restart cleanly but the error persists, restart the server
   PC — MxSvc has a startup dependency on SQL Server that can get out of
   order.

**Never known to happen without a root cause.** If it happens, log it.

---

### Pattern C — Cloud connection lost

**Symptom:** notification like "Conqueror Server cannot connect to the
Cloud" or "Cloud is temporarily not available".

**What still works locally:** everything — reservations, POS, lane control,
payments. The cloud is only for centralization sync, plugin loading, and
updates.

**What breaks:** new customer signups (if configured to require cloud
validation), cross-center loyalty lookups, CloudPlugin loading, Working
Copy sync of new versions.

**Immediate action:**

- **Wait 5 minutes** — most cloud interruptions are QubicaAMF-side and
  auto-recover.
- Check internet from the server PC (open a browser, load any external
  site).
- Try `QCloudTestConnection.exe` from `C:\QDesk\Bin\ConquerorServer\` — it
  runs a diagnostic to `qcloud.qubicaamf.com`.

**If persistent >30 minutes:** call QubicaAMF support. Local operations can
continue in the meantime.

---

### Pattern D — Reservation import rejected

**Symptom:** the reservation `.xls` upload fails with a "not valid" or
"please specify …" error message.

**Cause:** violates the ConquerorX reservation import contract. All known
error messages and their fixes are documented in
[`08-templates-and-imports.md`](08-templates-and-imports.md#documented-import-error-messages-from-the-en-translation-file)
and the reservations-builder `CHANGELOG.md`.

**Immediate action:** cross-reference the error verbatim to the fixes list.
Common ones:

| Error | Fix |
|---|---|
| "The start date specified in the Excel file is not valid" | Column 0 must be an Excel date serial; also date must be today or future |
| "The lane type specified in the Excel file is not valid" | Column 3 must be `1` (Single) or `2` (Pair) |
| "Please specify the reservation name in the Excel file" | Column 2 must have a non-blank string |
| "Not all the genders specified in the Excel file are valid" | Bowler gender column must be `1` or `2` (0 rejected) |
| "Unable to import reservations in the past" | Date is past-dated — regenerate for today or later |
| "Unable to import reservation because there are not enough bookable lanes" | Assigned lanes don't exist or aren't bookable in ConquerorX for that time |

---

## New incidents

Add new incidents here as they happen. Move them into a "Pattern" section
above once we understand them well enough to write a diagnosis.

### C1 — Lanes 13/14 reset with "no comms" then rebooted

- **When:** 2026-08-24, mid-shift (exact time not captured)
- **Lanes / terminals:** lanes 13, 14
- **Symptom:** lane grid showed "No Comms" on both, then their consoles
  spontaneously started rebooting
- **In-progress activity:** unknown — mid-shift, likely a party bowling
- **Exact message text:** "no comms" (paraphrased from staff report)
- **Duration:** unknown; recovery observed
- **Recovery action:** self-recovered (consoles rebooted, reconnected)
- **Guest impact:** unknown (session state on those lanes not verified in
  the moment)
- **Follow-up:** watch for repeats on this pod; add to shift log for
  pattern tracking
- **Diagnosis:** classic Pattern A above. Most likely a brief network glitch
  on the 13/14 pod or a console watchdog reset. First occurrence — no
  escalation needed yet.

---

## Escalation contacts

Fill in with real Kings-side and QubicaAMF-side contact info once known:

| Situation | Contact |
|---|---|
| Local network / cable issue | Kings maintenance team |
| Pinsetter / lane hardware fault | Kings mechanical team |
| Persistent multi-pod outage | QubicaAMF support |
| Data-loss incident | QubicaAMF support (file with logs) |
| Software bug / crash | QubicaAMF support (build TechSupport bundle first) |

## Building a TechSupport bundle for QubicaAMF

When escalating anything to QubicaAMF:

1. Run `C:\QDesk\Bin\TechSupportClient.exe` (client) or
   `C:\QDesk\Bin\ConquerorServer\TechSupport.exe` (server) — one of them
   packages logs + config + a DB snapshot into a zip.
2. Note the incident time in local timezone (QubicaAMF is in Europe / East
   Coast, be explicit).
3. Attach the bundle to the support ticket.

## Reference

- Comm chain and root-cause reasoning: [`03-services-and-processes.md`](03-services-and-processes.md)
- Log source (`qsp_log_insert` → `SystemLog`): [`05-database-schema.md`](05-database-schema.md)
- BowlingAgent details: [`03-services-and-processes.md`](03-services-and-processes.md#running-processes-owned-by-conquerorx-server-role)
