# Setting Up Stripe Webhook (Local Testing)

## Step 1 — Install Stripe CLI on Windows

**Option A: winget (Windows Package Manager)**
```powershell
winget install Stripe.StripeCLI
```

**Option B: Scoop**
```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Option C: Direct download**
Go to: https://github.com/stripe/stripe-cli/releases/latest
Download: `stripe_X.X.X_windows_x86_64.zip`
Extract `stripe.exe` to a folder in your PATH (e.g. `C:\tools\`)

---

## Step 2 — Login to Stripe CLI

```bash
stripe login
```
This opens a browser. Confirm the pairing code.

---

## Step 3 — Start webhook listener

Open a **new terminal** and run:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You'll see output like:
```
> Ready! You are using Stripe API Version [2024-xx-xx].
> Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx (^C to quit)
```

---

## Step 4 — Copy webhook secret to .env.local

```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Restart Next.js dev server after updating `.env.local`.

---

## Step 5 — Test end-to-end

1. Go to http://localhost:3000/create?story=kosmichesko-priklyuchenie
2. Fill in email + child name, upload photo
3. Complete the preview
4. Click "PDF — €9.90"
5. On the order page, fill in email + child name, click Pay
6. Use Stripe test card: `4242 4242 4242 4242`, exp `12/34`, CVC `123`
7. After payment: watch the terminal for webhook events
8. You'll be redirected to /order/success where the book generates

---

## Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0025 6000 0006` | Insufficient funds |
| `4000 0000 0000 9995` | Card declined |

Any future expiry date and any 3-digit CVC work.

---

## Trigger a test event manually

If you just want to test the webhook handler without going through the full checkout:
```bash
stripe trigger checkout.session.completed
```
