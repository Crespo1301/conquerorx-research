# Economic Setup Reference

The pricing + payments configuration module. Everything a center
sells (bowling hours, food, drinks, locker rentals, arcade credits,
etc.) is defined here through a chain of concepts: currencies →
taxes → departments → price keys → modifiers → categories →
packages → discounts → denominations. From CHM sections
`Conqueror-2-492.html` through `Conqueror-2-532.html`. 12
sub-sections.

Complements [`19-point-of-sale.md`](19-point-of-sale.md) (the
runtime selling surface) by covering the compile-time definitions
that surface uses.

Path: **Setup > Price Setup.**

## The 12 sub-sections at a glance

| # | Section | What it defines |
|---|---|---|
| 1 | Overview | The concept: currency → tax → department → price key hierarchy |
| 2 | Currencies | Main currency + secondary/other currencies with FX conversion |
| 3 | Taxes | Individual taxes and Tax Groups |
| 4 | Departments | Two-level hierarchy for organizing price keys |
| 5 | Price Keys | The sellable item primitive (24 fields per price key) |
| 6 | Modifiers | Item variations (with/without ketchup, extra cheese, etc.) |
| 7 | Categories | Reorganization of price keys for the POS Sales window |
| 8 | Packages | Bundles combining multiple price keys with a package price |
| 9 | Discounts | Automatic (member-category-tied) and Manual discounts |
| 10 | Denominations | Currency-note breakdowns for cash-drawer counting |
| 11 | Fast Sale Items | Up to 3 quick-sell price keys per resource (lane), auto-shown at lane opening |
| 12 | Lane Orders | BES X food + drink ordering from the score console |

## The build order (`Conqueror-2-493.html`)

The order matters. You cannot create a price key before its tax
group exists, and you cannot create a tax group before the taxes
in it exist:

```
Currencies → Taxes → Tax Groups → Departments → Price Keys → 
Modifiers → Categories → Packages → Discounts → Denominations
```

Fast Sale Items and Lane Orders sit on top of the price-key layer
and are configured last.

## 1. Currencies (`Conqueror-2-494.html`)

The **Main Currency** is the currency the system operates in.
Everything (shifts, reports, payments) is expressed in this currency.
Default: US Dollars.

- **Secondary Currency:** fixed second currency, always visible on
  the Payment window and receipts (useful in border cross-currency
  centers).
- **Other Currencies:** additional currencies available on-demand
  during a transaction.

Sub-sections:

- **2.1 Settings:** global currency behavior
- **2.2 Adding a New Currency:** register a new currency + FX rate
- **2.3 Modifying Currencies:** update rates
- **2.4 Changing the Main Currency:** the destructive one (see
  CHM guidance before running)

Kings-relevance: Main Currency = USD, no secondary needed. Kings
doesn't run cross-currency transactions.

## 2. Taxes (`Conqueror-2-499.html`)

Two layers: individual taxes and Tax Groups.

**Taxes** are calculated on the discounted total (discounts apply
BEFORE tax).

### Individual tax fields (`Conqueror-2-501.html`)

| Field | Purpose |
|---|---|
| **Tax (Name)** | Human-readable name |
| **Percentage / Fixed Value** | Mutually exclusive: percentage of total, or fixed dollar amount |
| **From / To Value** | Value bracket the tax applies within (for tiered tax structures) |
| **RecTrac Code** | External code for RecTrac accounting integration |
| **Rounding Precision** | Value to round to (e.g. 0.01) |
| **Rounding Type** | Down / Up / Nearest |
| **Level** | Tax level (state, county, city) for compound taxation |
| **Included in Price** | Tax-inclusive pricing toggle |
| **Applied to Single Item** | Per-item calculation |
| **Apply to the Total of Item Value of Same Tax Group** | Compound calculation across items |

### Tax Groups (`Conqueror-2-502.html`)

Named bundles of individual taxes applied together to a price key.
Kings example: a "Massachusetts Meals + State" tax group might
combine MA state sales tax + local meals tax + any surcharge.

Kings-relevance: taxes are set once at commissioning and rarely
touched. When they change (state tax hike, new municipal surcharge),
this is the module.

## 3. Departments (`Conqueror-2-503.html`)

Two-level hierarchy for organizing price keys. Default main
departments include Bowling, Lockers, Time Games, Coin Hoppers.
Sub-departments (level 2) include Game Bowling, Time Bowling, League
Bowling.

### Department fields (`Conqueror-2-505.html`)

| Field | Purpose |
|---|---|
| **Unit of Measurement** | How items in this department are sold (each, per hour, per game) |
| **Display Order** | Sort position |
| **Department Type** | Retail / F+B / Services / etc. |
| **Default Category / Create New Main Category** | Auto-category assignment |
| **Color** | Visual tint in POS surfaces |
| **Printer** | Which printer role handles this department's tickets (kitchen printer for F+B, receipt printer for retail) |

Why departments matter: **the more organized the price key
hierarchy, the more informative the Shift report and the smoother
the QuickBooks Desktop integration.** Departments show up as GL
account categories on the accounting side.

## 4. Price Keys (`Conqueror-2-508.html`)

**The sellable-item primitive.** Every hour of bowling, every
sandwich, every pair of shoes: a price key.

Add/modify/delete happens without stopping other operators; changes
take effect as soon as saved and the Price Setup window closes.

### 24 fields per price key (`Conqueror-2-509.html`)

| Field | Purpose |
|---|---|
| **Name** | Human-readable item name |
| **Price** | Dollar amount (or a dynamic price, see 5.2) |
| **Tax Group** | Applied tax bundle |
| **Quantity** | How many units per sale, in the department's Unit of Measurement |
| **Berg Code** | Berg beverage dispenser code (F+B only). If Berg is shared across terminals via a switch, duplicate the price key per terminal with different codes. |
| **RecTrac Code** | RecTrac accounting code |
| **WinTic Code** | WinTic export code |
| **External Key** | Third-party program key |
| **Bar Code** | UPC / barcode |
| **Gratuity** | Whether this item auto-charges gratuity |
| **Special Price** | Alternative pricing rule |
| **Authorization Required** | Whether a manager PIN is needed to sell |
| **Package Only** | Sellable only as part of a package |
| **Members Only** | Restricted to FBT members |
| **Shoes** | Marks this as a shoe rental (special POS behavior) |
| **Sale Price** | Overridable sale-time price |
| **Point Collection** | Whether FBT points accumulate on this item |
| **Discountable** | Whether this item can be discounted |
| **Note Required** | Prompts operator for a note at sale time |
| **Best Prices** | Best-price-guarantee flag |
| **Kitchen Printable** | Whether this item prints to the kitchen printer |
| **Proportional** | Proportional pricing model |
| **Applicability Dates** | Season-window / date-range validity |

### Related sub-sections

- **5.2 Defining Prices** (dynamic pricing rules by time / day of
  week)
- **5.3 Copying Price Keys** (bulk duplicate for common templates)
- **5.4 Price Key Report** (audit surface for the price list)

Kings-relevance: this is THE most heavily-used part of Economic
Setup. Every menu item, every bowling package, every retail item at
Kings lives here. When Kings adjusts a menu, launches a new special,
or changes hourly rates, this is where the change lands.

## 5. Modifiers (`Conqueror-2-513.html`)

Item variations. **With** and **Without** modifiers change what
gets sent to the kitchen without changing the underlying price key.

- **With modifier** can add a supplement price ("extra Ketchup" =
  no charge; "extra bacon" = +$1.50)
- **Without modifier** does NOT reduce the price

Duplicating groups of modifiers lets a modifier group behave
differently in different contexts (Sauce free with hamburgers, $0.50
with fries).

Sub-sections:

- **6.2 Creating a Modifier**
- **6.3 Linking Price Keys to Modifiers**
- **6.4 Automatic and Optional Modifiers** (auto-applied vs
  operator-choice)
- **6.5 Ordering Modifiers** (display order)

Kings-relevance: dining venue = heavy modifier use. Menu
customizations (build-your-own-burger, gluten-free bun, no ice) all
live here.

## 6. Categories (`Conqueror-2-518.html`)

Reorganization of price keys for the POS Sales window. Two levels:

- **Main category:** vertical column on the right of the Sales
  window (e.g. Drinks, Food, Bowling, Retail)
- **Sub-category:** horizontal row at the bottom (e.g. under
  Drinks: Hot Drinks, Beers, Cocktails)

Sub-tabs:

- **Creating Categories**
- **Linking Categories to Terminals** (a POS terminal can be
  restricted to certain categories, e.g. a bar POS doesn't need
  Bowling or Retail)
- **Category Display Order in the Sales Window**
- **Choosing the Category Price Keys** (which price keys appear
  under which category)
- **Price Key Display Order in the Sales Window**

**Import button:** reuses the price-key department structure as
the category structure. Faster than manual setup if departments
are already well-organized.

Kings-relevance: at least three POS categories (bowling, food,
beverage) with sub-categories per menu section. Terminal-scoped
category linking is the mechanism that keeps a bar POS focused on
drinks while a front-desk POS covers everything.

## 7. Packages (`Conqueror-2-519.html`)

Bundles combining multiple price keys under a package price.

Example from CHM: 1 game ($5) + 1 sandwich ($3) = package for $6.50.

Package Items (`Conqueror-2-520.html`) can be generic ("1 soft
drink") with an **Open Choice Menu** (`Conqueror-2-521.html`)
resolving the specific choice at sale time (Coke / Sprite /
Lemonade).

Kings-relevance: heavily used. Kings offers party packages, cosmic
packages, corporate-outing packages. Every one is a Package
definition under this section, tied to the price keys underneath.

## 8. Discounts (`Conqueror-2-522.html`)

Percentage or fixed-amount discounts applied at payment.

### Two discount types (`Conqueror-2-523.html`)

- **Automatic Discounts:** auto-applied when a customer belongs
  to a member category with a bound discount (e.g. Scouts get 15%
  automatically on card read)
- **Manual Discounts:** operator-applied at their discretion at
  payment time

Discounts CAN be dynamic (different rates on different days /
time-of-day) and can be applied to specific price keys OR the
entire bill (including taxes).

**Never applied to:** deposits or member-card recharges.

### Discount fields (`Conqueror-2-524.html`)

- **Rate / Fixed Amount**
- **Authorization Required** (manager PIN gate)
- **Apply Discount also to Other Bowlers** (extend the discount to
  the whole party, not just the member)
- **Member Category Only**
- **External Key**
- **Italian and Romanian Market** (region-specific tax-law
  compliance flag)

**9.3 Linking Discounts to Member Categories:** the wiring that
makes Automatic Discounts trigger on the right members.

Kings-relevance: expect discounts for corporate accounts, weekday-
daytime specials, and possibly a Kings Club member tier. Every one
lives here.

## 9. Denominations (`Conqueror-2-526.html`)

Currency-note breakdowns for cash-drawer counting at shift close.
Operator enters (for example) "9 ten-dollar bills = $90, 10
five-dollar bills = $50" and the system totals.

Also supports non-cash Payment Modes (credit card, QCash, etc.) so
end-of-shift reconciliation covers every payment channel.

**Special Payment Settings** (`Conqueror-2-527.html`): per-payment-
type behavior.

Kings-relevance: yes, standard cash reconciliation. Kings hosts
handle cash daily, so this feeds directly into
[`20-shift-management.md`](20-shift-management.md).

## 10. Fast Sale Items (`Conqueror-2-528.html`)

Up to **3 quick-sell price keys per resource** (per lane).

When a lane opens from Lane Status or Booking System, these 3
items pre-appear in the sale surface for one-tap selection.

Kings-relevance: expect shoe rentals and one standard-package price
key as the fast items for lane opening.

## 11. Lane Orders (`Conqueror-2-530.html`): BES X, BES, Bowland, Bowland-X

**Customers order food and drink from the score console.** Order
flows from the SuperTouch to a front-desk Urgent Task queue for
operator review and processing.

### Bowler-side flow (`Conqueror-2-531.html`)

1. Bowler taps **Food & Drink Orders** on SuperTouch
2. Order-builder window opens (browse, select, adjust quantities
   with +/-)
3. Bowler presses **Confirm**
4. Optional prompt for amount tendered (helps operator prepare
   change)

### Operator-side flow (`Conqueror-2-531.html`)

1. **Urgent Tasks Quick Button** blinks on the operator terminal
   (see [doc 33 Quick Buttons](33-terminal-setup.md#tab-6-quick-buttons-conqueror-2-470html))
2. Operator clicks; pending Lane Orders list appears
3. Operator clicks an order; POS module opens with the lane's tab
   and the new order items
4. Operator reviews, modifies if needed, confirms
5. On confirmation: order saves to tab, prints to bar receipt
   printer + kitchen printers (per Terminal Setup config)

### Lane Orders Settings (`Conqueror-2-532.html`)

| Setting | Purpose |
|---|---|
| **Menu Mode** | Which menu the score-console picker shows |
| **Pictures** | Enable dish photos in the picker |
| **Display Without Taxes Notice on Console** | Whether the SuperTouch shows a "prices exclude tax" disclaimer |
| **Skip Amount Tendered** | Skip the tender-amount prompt on Confirm |
| **Automatically Save in Tab and Print** | Auto-approve orders (no operator review) |
| **Customized Font** | Font override for the picker |
| **Quick Button for Urgent Tasks** | Whether the Urgent Tasks button is enabled for Lane Orders |

Kings-relevance: very likely on. Kings' whole model rests on
guests ordering F+B from the lane. This is the config surface behind
that guest experience. **Automatically Save in Tab and Print** is
likely OFF at Kings (operators want to review orders before firing
to kitchen).

## Related SQL tables

From [`05-database-schema.md`](05-database-schema.md):

- **`Currencies`**, **`ExchangeRates`**: currency layer
- **`Taxes`**, **`TaxGroups`**, **`TaxGroupTaxes`**: tax layer
- **`Departments`**, **`SubDepartments`**: department hierarchy
- **`PriceKeys`**, **`PriceKeyDeptLink`**: price-key layer
- **`Modifiers`**, **`ModifierGroups`**, **`PriceKeyModifiers`**:
  modifier wiring
- **`Categories`**, **`CategoryPriceKeys`**, **`CategoryTerminals`**:
  category layer
- **`Packages`**, **`PackageItems`**, **`OpenChoiceMenus`**: package
  layer
- **`Discounts`**, **`DiscountRules`**, **`MemberCategoryDiscounts`**:
  discount layer
- **`Denominations`**: cash-drawer counting
- **`FastSaleItems`**: per-resource quick items
- **`LaneOrders`**, **`LaneOrderItems`**: BES X order queue

## Related DLL family

From [`04-modules-and-dlls.md`](04-modules-and-dlls.md):

- **`Qbk.Economical.*`**: the core Economic Setup family
- **`Qbk.PriceSetup.*`**: the price-key surfaces
- **`Qbk.POS.*`** (see [doc 19](19-point-of-sale.md)): runtime
  consumer of every definition here
- **`Qbk.LaneOrders.*`**: BES X ordering integration

## For Kings specifically

- **Heaviest-touched Setup module.** Every menu change, price
  adjustment, party package, member discount, seasonal special ends
  up in here.
- **Change discipline matters.** Because changes take effect
  live (as soon as saved), a mistake here immediately affects
  in-progress transactions. Recommend touching Economic Setup
  outside peak hours.
- **Lane Orders is a Kings-native feature.** The whole
  score-console food-order flow described in section 11 is
  fundamental to how Kings operates. Any future automation
  targeting Kings' F+B service touches this surface.
- **QuickBooks Desktop bridge.** Department structure (section 3)
  and price-key organization directly affect what shows up on the
  QuickBooks side (see [doc 33 Externals tab](33-terminal-setup.md#tab-5-externals-conqueror-2-469html)).
  If Kings uses QuickBooks Desktop for accounting, department
  structure is a shared surface between operations and finance.
- **For our reservations-builder:** no direct interaction. Our
  Excel import operates on Reservations (which land on lanes),
  not on POS transactions. But a booked reservation eventually
  turns into POS sales, and those sales draw from THIS module's
  definitions.

## Reference

- Related runtime selling surface: [`19-point-of-sale.md`](19-point-of-sale.md)
- Related shift-close cash reconciliation: [`20-shift-management.md`](20-shift-management.md)
- Related FBT member categories that drive Automatic Discounts: [`21-fbt-membership.md`](21-fbt-membership.md)
- Related terminal-side printer routing: [`33-terminal-setup.md`](33-terminal-setup.md)
- Related Center Setup pricing-model wiring: [`22-center-setup.md`](22-center-setup.md)
- CHM outline anchor: [`extracted-strings/chm-en-outline.md`](extracted-strings/chm-en-outline.md#economic-setup)
