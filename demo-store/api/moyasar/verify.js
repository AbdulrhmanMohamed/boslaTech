import { readBody, sendJSON } from "../_lib/mail.js";

const PAYMENTS_API = "https://api.moyasar.com/v1/payments";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hits = new Map();

const limited = (ip, max = 30, win = 15 * 60 * 1000) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  return list.length > max;
};

export default async function handler(req, res) {
  if (req.method !== "POST") return sendJSON(res, 405, { error: "الطريقة غير مسموحة" });

  const secret = process.env.MOYASAR_SECRET_KEY;
  if (!secret) {
    return sendJSON(res, 503, { error: "بوابة الدفع غير مفعّلة", code: "PAYMENT_NOT_CONFIGURED" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  if (limited(`pay:${ip}`)) return sendJSON(res, 429, { error: "محاولات كثيرة — جرّب بعد قليل", code: "RATE_LIMITED" });

  const body = await readBody(req);
  const id = String(body.id || "").trim();
  if (!UUID.test(id)) return sendJSON(res, 400, { error: "رقم عملية غير صالح", code: "BAD_PAYMENT_ID" });

  let r;
  try {
    r = await fetch(`${PAYMENTS_API}/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}`,
        Accept: "application/json",
      },
    });
  } catch {
    return sendJSON(res, 502, { error: "تعذّر الاتصال ببوابة الدفع", code: "PAYMENT_UPSTREAM" });
  }

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const missing = r.status === 404;
    return sendJSON(res, missing ? 404 : 502, {
      error: missing ? "ما لقينا هذه العملية" : "تعذّر التحقق من العملية",
      code: missing ? "PAYMENT_NOT_FOUND" : "PAYMENT_UPSTREAM",
    });
  }

  const src = data.source || {};
  return sendJSON(res, 200, {
    ok: true,
    payment: {
      id: data.id,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      description: data.description || null,
      created_at: data.created_at || null,
      metadata: data.metadata || {},
      source: {
        type: src.type || null,
        company: src.company || null,
        name: src.name || null,
        number: src.number || null,
        mobile: src.mobile || null,
        message: src.message || null,
      },
    },
  });
}
