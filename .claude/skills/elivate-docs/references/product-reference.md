# Elivate Wallet product reference (for docs)

Snapshot of user-facing behaviour, read from the app repo `elivatepro/elivate-wallet` at
commit `a07bc43` (main, 2026-10-11). Quoted text is exact UI copy. Paths: `FE` =
`frontend/src`, `MIG` = `backend/supabase/migrations`.

**This is a starting point, not the source of truth.** Re-check the cited files before
documenting anything; behaviour may have changed since the snapshot. Update this file
(and the commit above) when you verify something new.

## 0. Apps and surfaces

- Member/leader app: `app.elivatewallet.com` (`frontend/wrangler.jsonc`); routes `/app/*`, auth in `FE/routes/(auth)/*`.
- Platform admin: `admin.elivatewallet.com` (Elivate staff only) — out of scope for customer docs.
- In-app support: `/app/support` → "Start a chat" (Chatwoot); shows the network's own support contacts and "Your UID".

## 1. Roles and permissions

Roles (`FE/lib/labels.ts`): "Member", "Team Leader", "Director", "World Team", "President Team".
Not roles: Financial Evidence Reviewer (named assignment), Billing Owner, rank (profile info).

President Team members have **no personal wallet** ("No wallet in this workspace").

Default permissions (MIG `20261008000800_authz.sql`, labels `FE/lib/org.ts`):

| Permission | M | TL | D | W | P |
|---|---|---|---|---|---|
| Own wallet, financials, statement, withdraw, payout accounts, move own pockets | ✓ | ✓ | ✓ | ✓ | – |
| View managed wallets, Record income, Approve withdrawals, Approve pocket moves, Convert currency, Record returned funds, Reports, Invite members, Manage members | – | ✓ | ✓ | ✓ | ✓ |
| Withdraw on behalf, Credit/debit adjustment, Move/Suspend/End membership | – | – | – | ✓ | ✓ |
| Manage access rules | – | – | ✓ | ✓ | ✓ |
| Request a restore | – | – | – | ✓ | ✓ |
| Subscription, Role permissions, Security settings, Reverse transactions, Transfer presidency, Deactivate workspace, Pockets & split, Team settings & branding | – | – | – | – | ✓ |
| Review financial evidence | assigned by name | | | | |

"Roles & access" (`/app/access`): tabs "Role permissions", "Cross-access", "Evidence reviewers". Saving role permissions needs a reason + PIN, applies right away. Locked rows can't be toggled. "The network keeps at least one President Team Member." Nobody acts on their own membership.

## 2. Network, offices, invitations, onboarding

- Hierarchy: Network → "World Team" office → "Directorate" → "Team office" → members. Team office may sit under a World Team or a Directorate. No separate "teams" entity.
- Offices (`/app/offices`): President Team + World Team; "New office" President Team only. Fields "Office name", "Type", "Parent office", leader. "Create and invite" when the leader has no account. Actions "Rename", "Change leader", "Move office", "Close office", "Resend invite". Close/move refusals in `FE/lib/org.ts`.
- Members (`/app/members`): filter "Current", "Active", "Suspended", "Ended"; actions "Suspend membership"/"Reactivate membership", "Move to another office", "Change role", "End membership".
- Invitations (`/app/invitations`, `FE/lib/ui/app/InviteDialog.svelte`): "Invite a member" → "Email address", "Office", "Role" → "Send invitation" (leader role also needs reason + PIN). Links last 7 days; 1 send + 5 resends, 60 s apart. Statuses "Pending", "Accepted", "Expired", "Revoked"; actions "Resend link", "Revoke invitation". Errors: "That person is already a member here.", "There's already a pending invitation for that email here.", "Invitations are paused while the network isn't active.", "This network is full. Move up a plan to add more people."
- Invite email: "You're invited to join {network} on Elivate Wallet" → "Accept invitation". `/join`: "Verify email" → inbox link → "Choose a password" (8–72 chars) → "Accept invitation"; failure "Invitation unavailable".
- Setup wizard (`FE/lib/onboarding-steps.ts`): "Create your PIN" → "Verify your NIN" (11 digits; "Ask my leaders to review") → "Suit up your profile" → "Where should payouts go?". App gated until done. A 2-step "light setup" for President Team / funds-not-managed directors exists in code but was **not yet deployed** at snapshot (PR #59) — don't document.
- Sign-in: email + password + security check, then 4-digit PIN every time. 5 wrong PINs → "Your PIN is locked" → "Email me a reset link" (15 min). App locks after 15 min idle ("Enter your PIN"). Session 7 days. Email changes via support only.

## 3. Balance, currencies, pockets, activity

- Balance card: "Available to withdraw"; chips "Posted", "Reserved"; eye toggle "Hide amounts"/"Show amounts". Available = Posted − reservations (open withdrawals + pocket moves).
- Currencies NGN and USD, shown one at a time; withdrawals NGN only.
- Home actions: "Withdraw", "Move money", "Payout accounts", "Pockets & split". Leaders' home is "Team overview" ("Network overview" for President); own wallet at "My wallet".
- Default split: Point Value 40, Business Investment 10, Personal Investment 15, Upkeep 25, Savings 10; fixed "Debt" pocket (no income). President edits at `/app/split` ("Pockets & split"): rename (≤40 chars), "Add pocket" (1–12), shares in 0.01% steps totalling 100%, "Save split" + reason + PIN → "Saved. New income uses version N." Future income only. Everyone can view versions.
- Pocket moves (`/app/split/move`): "From pocket", "To pocket", "Amount" ("Use max") → "Send request" (no PIN); held until a leader approves; "Waiting for approval" with "Cancel". Debt receives only up to what it owes, never sends. Leaders: `/app/transfers` "Approve & move" (no PIN) / decline with reason. Statuses "Requested", "Moved", "Declined", "Cancelled".
- Activity (`/app/activity`): types "Income", "Withdrawal", "Pocket move", "Reversal"; filters "Money in"/"Money out", date presets, search "Search name, reference or amount"; detail shows "Recorded by", "Copy reference", "Split into pockets".

## 4. Recording income (`/app/income`)

Fields: Member (not yourself; President Team not eligible), "Currency", "Amount received" (>0), "Source" (1–100), "Date received" (≤ today), "Provider reference (optional)", "Fee (optional)" ("Recorded only. It isn't taken off the amount."), "Receipts" ("1 to 5 files · PDF, JPG or PNG", ≤10 MB each), "Notes (optional)" (≤1,000). Split preview "{Name} will receive". "Review and post" → "Post ₦X?" + PIN → "Post income" → "Income posted" ("View in activity", "Record another"). Member gets "Income is in your pockets". **No edit**; only President reversal. Errors: "Your network has no split yet…", "This member can't receive income right now.", unknown outcome → "Checking what happened" / "Check again".

## 5. Withdrawals

- Member (`/app/withdrawals/new`): "From pocket" (not Debt), "Amount" ("Use max"), "To payout account" (usable only; primary default) → review → "Submit request" + PIN → "Request sent". Max = pocket's available; no minimum beyond > 0; several open requests allowed. Errors include "Add a bank account first."
- Member statuses: "Requested", "Approved", "Completed", "Rejected", "Cancelled" (approver sub-states all show as "Approved").
- Cancel: member while Requested (no PIN): "Cancel this withdrawal?" → "Cancel withdrawal"/"Keep it". After approval only an approver, if no payout record, with reason + PIN.
- Queue (`/app/queue`) tabs: "Needs action", "Verifying", "Completed", "Rejected & cancelled". Approver chips: "Requested", "Approved · pay out", "Checking receipt", "Check delayed", "Correction needed", "In review", "Receipt rejected", "Completed", "Rejected", "Cancelled". Approve: no PIN ("Approved. ₦X stays reserved until the payout is verified."). Reject: reason 3–500 chars, visible to member, no PIN. Never your own withdrawal.
- Only the approving leader can reveal the account number, record the payout, fix it or retry the check.
- Balance: reserved at request; on completion pocket debited by amount sent + bank fee, rest of hold released; reject/cancel releases hold. Amount sent + fee ≤ requested.
- Notifications per stage: `MIG 20261009130200_notify_events.sql`; emails `functions/_shared/email/notifications.ts`.
- Returned funds (`/app/queue/returns`): "Record returned funds" → amount, "Seen in account", "Returned by", "Bank reference", "Proof of return" → "Send for checking"; reviewer clears before posting.

## 6. Recording a payout

"Send to" → "Reveal" (PIN). Note "Pay this from your bank app, then record what you actually sent below." Fields "Amount sent", "Date paid" (not future), "Bank reference" (not enforced), "Bank fee (optional)", "Upload the transfer receipt" ("One receipt · PDF or image", ≤10 MB) → "Submit for verification" + PIN. Automated receipt check (amount, currency, full account number, name, success, date). "Correction needed": one fix — "Fix the date"/"Fix the amount"/"Fix the record" or "New receipt" → "Send again" + PIN. Second failure → "In review" (Financial Evidence Reviewer; never the recorder or the member) → "Clear" or "Reject" (then "Record again" or cancel). "Check delayed" = technical failure, doesn't use the fix → "Check the receipt again".

## 7. Statements and reports

- Members `/app/statements`: "PDF statement" / "CSV of transactions"; periods "This month", last month, quarter, year-to-date, "Custom…"; WAT; one currency; no PIN. >1,000 rows → emailed when ready; files kept 7 days; PDF ≤5,000 rows, CSV ≤50,000 ("Too large for one file…").
- Leaders `/app/reports`: totals incl. "Paid out", "Reserved now", "By member"; "Export report": "Whole network"/"Whole office"/"One member"; "Office report · PDF", "Transactions · CSV", "Member balances · CSV"; download requires PIN.

## 8. Notifications

Bell (`/app/notifications`, mapping `FE/lib/notifications.ts`) and emails (`functions/_shared/email/*`): money events, team/account changes, security (password/PIN changed, new sign-in), payout accounts, identity, billing, backups/branding. Bell-only tasks: "Payout to record", "Pocket move to approve", "Identity to review".

## 9. Payout accounts (`/app/payout-accounts`)

"Add bank account" → "Bank", 10-digit "Account number" → "Check account" (PIN) → name checked against NIN name → "Save account". Naira, own name only ("Payouts can only go to an account in your verified name."). Chips "Verified", "Identity check pending", "Name doesn't match", "Primary", "Cooling off · usable {date}". First account usable immediately; later ones wait 24 h. Max 5 active; 10 lookups/hour, 30/day. "Make primary" (PIN), "Replace account" (reason + PIN, new 24 h wait), "Remove account" (reason + PIN).

## 10. Other areas

Profile & security (`/app/account`), NIN reviews (`/app/reviews`), leader tools "Convert", "Adjustment", "Reversals" (President; reasons "Recorded twice", "Recorded for the wrong member", "Wrong amount", "Wrong pocket", "Other"; completed withdrawals can't be reversed — record returned funds), "Member wallets", President settings ("Branding", "Team details", "Backup vault"), Billing (Paystack, yearly NGN), Audit log. Paused states: "{Withdrawals} are paused for now" / "This network is paused…". Common errors: "That PIN is incorrect. N tries left.", "This link has expired or was already used.", "You don't have permission to do that.", "Someone already acted on this. It's been refreshed."

## Known gaps at snapshot (don't document as features)

- Withdraw/move **on behalf** exist in the backend but have no screen.
- Members never see a "Verifying" status; "Payout recorded" is an approver progress step.
- Bank reference not required by the UI.
- Stubs / undrawn: President Team page, payout account "Replace" design, NIN reviews page, cross-access list, help topics in Support.
- Light setup (Slice 22) not deployed; feature flags deferred; Paystack in test mode.
- No PIN threshold for withdrawals defined (PIN always asked).
