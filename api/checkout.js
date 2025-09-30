// api/checkout.js (temporary sanity file)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Log what the function receives so we see it in Vercel logs
  console.log("typeof req.body =", typeof req.body, "value:", req.body);

  return res.status(200).json({
    ok: true,
    receivedType: typeof req.body,
  });
}
