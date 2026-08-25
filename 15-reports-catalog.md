# Reports Catalog

Every report that ships with ConquerorX. Two views:

1. **Built-in Statistical Reports menu** (7 top-level, from CHM help) —
   what an operator sees under Back Office → Statistical Reports.
2. **Crystal Reports templates** (182 `.rpt` files under
   `C:\QDesk\Bin\Reports\`) — the actual report definitions the UI and
   scheduled tasks generate.

The relationship: the 7 menu items compose from multiple `.rpt` templates
with different filters/parameters. Individual `.rpt` files also fire from
other modules (Shift end, Historical, Lane Grid, POS, etc.), not just from
the Statistical Reports menu.

## The 7 built-in Statistical Reports

From `Conqueror-2-340.html`:

| # | Menu name | Purpose |
|---|---|---|
| 1 | **Overview** | Landing page for the statistical reports module |
| 2 | **Lane Usage Report (Linage Report)** | Historical utilization per lane — hours booked, hours actually played, occupancy %. "Linage" = lane-usage in industry parlance. |
| 3 | **Comparison Report** | Side-by-side of two time periods (this week vs. last week, this year vs. last, etc.) |
| 4 | **Weekly Income Report** | Revenue by day-of-week + time-zone. Includes Time Zone Setup section for defining dayparts. |
| 5 | **Weekly Games Report** | Game counts by day-of-week + time-zone. Volume parallel to Weekly Income. |
| 6 | **League Attendance Report** | League player attendance across the season. |
| 7 | **Trust Report** | Money held on account / deposits pending. |

## Crystal Reports templates by category

182 `.rpt` files. Categorized by naming prefix and inferred purpose.

### Booking system / reservation reports (LBS = League Booking System, our target module's reports)

- `AllBookingDetails.rpt` — full reservation detail dump
- `BookingTypeCount.rpt` — count of reservations by type
- `LBSBookingDetails.rpt` — reservation details (LBS variant)
- `LBSBookingFunctionSheet.rpt` — banquet event order / function sheet (big events)
- `LBSCancelled.rpt` — cancelled reservations
- `LBSHighSpenders.rpt` — top-spending customers by reservation revenue
- `LBSLowSpenders.rpt` — bottom-spending
- `LBSNoShow.rpt` — no-show tracking
- `LBSOutstandingBalance.rpt` — unpaid reservation balances
- `LBSRevenue.rpt` — reservation revenue rollup

### Shift + cash + POS reports

- `BILLS.rpt` — bills issued
- `EndOfShiftCashOut.rpt` — shift-end cash reconciliation
- `EndOfShiftCashOutBillsAndCoins.rpt` — same, broken by denomination
- `CoinHopper.rpt` — coin hopper (arcade / coin-op)
- `CoinOperated.rpt` — coin-op lane data
- `CreditCard.rpt` — credit card transactions this shift
- `HistoricalCreditCard.rpt` / `HistoricalCreditCardTotals.rpt` — historical CC
- `DarReport.rpt` — Daily Activity Report (the "DAR" is the shift-end summary)
- `HourlySales.rpt` / `HourlySalesTotals.rpt` — sales by hour
- `Invoice.rpt` — invoice printout
- `MainDept.rpt` — main department rollup (largest template at 278 KB — a big cross-department summary)
- `NetTotalIncome.rpt` — net income
- `TaxExemption.rpt` — tax-exempt transactions
- `Tips.rpt` — gratuity report
- `TransactionsList.rpt` — transaction list
- `TrustMoneyRpt.rpt` / `TrustMoneyMiscRpt.rpt` — trust money (deposits held)
- `Void.rpt` — voided transactions
- `UnderOverNotes.rpt` — cash-drawer under/over adjustments

### League + tournament classification / standings

- `ClassificationBestGame.rpt` (+ WithoutTeamColumn variant)
- `ClassificationClubPlayer.rpt`
- `ClassificationGames.rpt`
- `ClassificationGenericSwedishLeague.rpt`
- `ClassificationPlayer.rpt` (+ WithoutTeamColumn variant)
- `ClassificationPlayerOnSeries.rpt` (+ WithoutTeamColumn variant)
- `ClassificationSwedishLeagueElite.rpt`
- `ClassificationSwedishLeagueEliteTeam.rpt`
- `ClassificDetailOrdered.rpt`
- `HighGamesStandingsReport.rpt`
- `HighScores.rpt` / `HighScoresStandingDualMode.rpt`
- `LeagueBestPlayers.rpt` / `LeagueBestTeams.rpt`
- `LeaguePlayerStat.rpt` / `LeagueTeamStat.rpt`
- `LeaguePayments.rpt`
- `LeagueCalendarReport.rpt` / `LeagueCalendarSchedule.rpt` / `LeagueCalendarTeams.rpt`
- `LeagueAttendanceRpt.rpt` (the built-in menu item's underlying template)
- `TeamRoster3.rpt` / `TeamRoster6.rpt` — team roster by size
- `TeamStandings.rpt`
- `TournamentsPlayers.rpt` / `TournamentsPlayersHdcp.rpt`
- `TournamentsTeams.rpt` / `TournamentsTeamsHdcp.rpt`

### FBT (Frequent Bowler Tracking / Customer / Membership) reports

The `FBT*.rpt` files are the customer-facing membership reports:

- `FBTCR.rpt`, `FBTGIR.rpt`, `FBTGR.rpt`, `FBTLR.rpt`, `FBTSCR.rpt`,
  `FBTSIR.rpt`, `FBTSMVER.rpt`, `FBTTLR.rpt`, `FBTTR.rpt`
- `FBTPointsBalance.rpt` — points on file per member
- `BestGamesSupReport.rpt`, `BestPlayerDetails.rpt` (+ WithoutTeamColumn)
- `BowlersAndGames.rpt` — bowlers by games played
- `CenterAvg.rpt` — center average score

The abbreviations aren't documented; likely composed as F=FBT + report-type
codes (LR=list report, SCR=summary card report, etc.).

### Lane / game reports

- `ExtraFrames.rpt` — extra frames (10th frame extras)
- `GamesPriceKeyTList.rpt` / `GamesTList.rpt` — games with price key lookup
- `LaneAssignment.rpt` — lane assignments
- `LastWeekBowling.rpt` / `LastWeekHighScores.rpt` — recent-week rollups
- `MadGamePrint.rpt` — BES X Mad Games printout
- `MagicNumber.rpt` — magic number (league-standings math)
- `UsuraPisteRpt.rpt` — Italian: "Lane Wear Report" (`usura piste` = lane wear)
- `WhatsHotWhatsNot.rpt` — trending items
- `YoutoonsPrint.rpt` — Fox YouToons personalized character print

### Locker reports

- `Lockers.rpt` — locker status
- `LockersAdvice.rpt` — locker expiry advice slips

### TCS (Trouble Call System) reports

- `TCS.rpt` — TCS master
- `TCSDownTime.rpt` — lane downtime from trouble calls
- `TCSErrorPerCenter.rpt` — error counts per center
- `TCSErrorPerLane.rpt` — error counts per lane
- `TCSTypeOfErrorPerCenter.rpt` — error type distribution
- `TCSWorkshop.rpt` — mechanic workshop activity
- `TcsVocalMessages.rpt` — voice-message log

### Time tracking (staff clock)

- `GlobalTimeTracking.rpt` — all-staff time tracking
- `IndividualTimeTracking.rpt` — per-staff time tracking

### Weekly rollups

- `WeeklyGamesRpt.rpt` — matches the built-in Weekly Games Report menu
- `WeeklyIncomeRpt.rpt` — matches the built-in Weekly Income Report menu
- `WeeklyComparisonRpt.rpt` — the built-in Comparison Report

### Tax + operators

- `TAXINC.rpt` / `TAXNTINC.rpt` — tax income / tax non-income
- `OPER.rpt` — operators
- `WTH&NTS.rpt` — withholding & notes (guess)

### Print / layout helpers

Not full reports; support templates the main reports embed:

- `HeaderLogo.rpt`, `IntestazioneStd.rpt` (Italian: "Standard Heading"),
  `NumberOfCopy.rpt`, `License.rpt` (212 KB — the license terms display)

## The 60 vs 182 discrepancy

Earlier docs (`02-filesystem-layout.md`) mentioned "60+ .rpt templates" —
that was a rough count from a `head -30`. The actual total is **182**. Fixed
here as the authoritative number.

## How to open a `.rpt` to see its data columns

The `.rpt` files are Crystal Reports templates. To inspect:

1. **Best:** Crystal Reports Designer (SAP) — not free, but exposes fields
   + parameters + SQL.
2. **Alternative:** ConquerorX itself — `ReportViewerApp.exe` in the install
   opens any of them. Reports appear under the module they belong to plus
   under Back Office → Statistical Reports.
3. **Textual peek:** `strings <file>.rpt` will show table and column names
   but not the layout.

## For our tooling — which reports matter

If we ever want to **verify our imports landed correctly**, the LBS
reports are the ones to look at:

- `LBSBookingDetails.rpt` — should show each of our imported reservations
- `AllBookingDetails.rpt` — full detail dump (broader)
- `LBSNoShow.rpt` — if imports become no-shows because operator never
  advanced them
- `LBSRevenue.rpt` — imports translate into revenue over the day

If we ever want to **automate a chain-wide financial summary**, `DarReport.rpt`
(Daily Activity Report) is the shift-end summary — one per location per
day. Aggregating across 10 Kings locations would give a chain-wide daily
snapshot.

## Reference

- Reports on disk: `C:\QDesk\Bin\Reports\*.rpt` (182 files)
- Full extracted CHM outline: [`extracted-strings/chm-en-outline.md`](extracted-strings/chm-en-outline.md#statistical-reports)
- Filesystem layout notes: [`02-filesystem-layout.md`](02-filesystem-layout.md#c-qdeskbin--the-application)
