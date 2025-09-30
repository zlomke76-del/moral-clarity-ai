<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Moral Clarity AI — Pricing</title>
  <style>
    body { font-family: system-ui, Arial, sans-serif; margin: 0; padding: 32px; background:#0b1524; color:#e7eef9; }
    .wrap { max-width: 1000px; margin: 0 auto; }
    h1 { margin: 0 0 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .card { background:#0e1b33; border:1px solid #203356; border-radius:16px; padding:24px; box-shadow: 0 8px 24px rgba(0,0,0,.25); }
    .price { font-size: 32px; font-weight: 800; margin: 8px 0 16px; }
    ul { margin:0 0 16px 18px; line-height:1.5; }
    button { width:100%; padding:14px 16px; border-radius:12px; border:none; font-weight:700; cursor:pointer; background:#e7eef9; color:#0b1524; }
    button[disabled] { opacity: .6; cursor: not-allowed; }
    .note { opacity:.8; margin-top: 10px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Pick a plan</h1>
    <p class="note">You can upgrade or cancel anytime.</p>

    <div class="grid">
      <div class="card">
        <h2>Standard</h2>
        <div class="price">$25 / month</div>
        <ul>
          <li>Neutral, anchored answers</li>
          <li>Email updates</li>
          <li>Basic support</li>
        </ul>
        <button id="btn-standard">Subscribe</button>
      </div>

      <div class="card">
        <h2>Family</h2>
        <div class="price">$50 / month</div>
        <ul>
          <li>Everything in Standard</li>
          <li>Governance guardrails</li>
          <li>Audit-friendly summaries</li>
        </ul>
        <button id="btn-family">Subscribe</button>
      </div>

      <div class="card">
        <h2>Ministry Plan</h2>
        <div class="price">$249 / month</div>
        <ul>
          <li>Anchored analysis for pastors/boards</li>
          <li>Teaching materials</li>
          <li>Church hub + family access</li>
        </ul>
        <button id="btn-ministry">Subscribe</button>
      </div>
    </div>

    <p class="note">Having trouble? Email support@moralclarityai.com.</p>
  </div>

  <script>
    // 🔁 REPLACE these with your actual Stripe price IDs (test or live).
    const PRICE_STANDARD = "price_STANDARD_REPLACE_ME";
    const PRICE_FAMILY   = "price_FAMILY_REPLACE_ME";
    const PRICE_MINISTRY = "price_MINISTRY_REPLACE_ME";

    async function startCheckout(priceId, button) {
      try {
        button.disabled = true;
        button.textContent = "Redirecting…";

        const resp = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId })
        });

        // Expect clean JSON back from the server
        const data = await resp.json();

        if (!resp.ok) {
          throw new Error(data?.error?.message || "Checkout failed");
        }
        if (!data?.url) {
          throw new Error("No checkout URL returned.");
        }
        window.location.href = data.url;
      } catch (err) {
        alert(err?.message || "Something went wrong starting checkout.");
        button.disabled = false;
        button.textContent = "Subscribe";
      }
    }

    document.getElementById("btn-standard").addEventListener("click", (e) => {
      e.preventDefault(); startCheckout(PRICE_STANDARD, e.currentTarget);
    });
    document.getElementById("btn-family").addEventListener("click", (e) => {
      e.preventDefault(); startCheckout(PRICE_FAMILY, e.currentTarget);
    });
    document.getElementById("btn-ministry").addEventListener("click", (e) => {
      e.preventDefault(); startCheckout(PRICE_MINISTRY, e.currentTarget);
    });
  </script>
</body>
</html>
