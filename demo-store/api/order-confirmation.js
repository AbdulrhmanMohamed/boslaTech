import { isEmail, readBody, sendEmail, sendJSON, orderEmail, siteUrl, escapeHtml } from "./_lib/mail.js";

const hits = new Map();
const limited = (ip, max = 10, win = 15 * 60 * 1000) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  return list.length > max;
};

export default async function handler(req, res) {
  if (req.method !== "POST") return sendJSON(res, 405, { error: "الطريقة غير مسموحة" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  if (limited(`order:${ip}`, 20)) return sendJSON(res, 429, { error: "محاولات كثيرة — جرّب بعد قليل" });

  const body = await readBody(req);
  const email = String(body.email || "").trim();
  const order = body.order;

  if (!isEmail(email)) return sendJSON(res, 400, { error: "بريد إلكتروني غير صالح", code: "BAD_EMAIL" });
  if (!order || typeof order !== "object" || !order.id || !Array.isArray(order.items) || !order.addr) {
    return sendJSON(res, 400, { error: "بيانات الطلب غير مكتملة", code: "BAD_ORDER" });
  }
  if (order.items.length > 30) return sendJSON(res, 400, { error: "عدد المنتجات كبير", code: "BAD_ORDER" });

  const safe = {
    id: escapeHtml(String(order.id)).slice(0, 40),
    items: order.items.slice(0, 30).map((i) => ({
      name: String(i.name || "").slice(0, 120),
      qty: Math.max(1, Math.min(99, Number(i.qty) || 1)),
      price: Math.max(0, Number(i.price) || 0),
      size: String(i.size || "").slice(0, 40),
      color: String(i.color || "").slice(0, 40),
    })),
    totals: {
      subtotal: Math.max(0, Number(order.totals?.subtotal) || 0),
      disc: Math.max(0, Number(order.totals?.disc) || 0),
      ship: Math.max(0, Number(order.totals?.ship) || 0),
      total: Math.max(0, Number(order.totals?.total) || 0),
    },
    addr: {
      name: String(order.addr.name || "").slice(0, 120),
      phone: String(order.addr.phone || "").slice(0, 20),
      city: String(order.addr.city || "").slice(0, 60),
      district: String(order.addr.district || "").slice(0, 60),
      street: String(order.addr.street || "").slice(0, 200),
      notes: String(order.addr.notes || "").slice(0, 200),
      email,
    },
    pay: String(order.pay || "").slice(0, 60),
    payment: order.payment && typeof order.payment === "object" ? {
      provider: String(order.payment.provider || "").slice(0, 20),
      id: String(order.payment.id || "").slice(0, 60),
      status: String(order.payment.status || "").slice(0, 20),
      amount: Math.max(0, Number(order.payment.amount) || 0),
      currency: String(order.payment.currency || "SAR").slice(0, 3),
      company: String(order.payment.company || "").slice(0, 20),
      last4: String(order.payment.last4 || "").slice(0, 4),
    } : null,
  };

  const link = `${siteUrl(req)}/order/${encodeURIComponent(safe.id)}`;
  const mail = orderEmail({ order: safe, link });

  try {
    const data = await sendEmail({ to: email, subject: mail.subject, html: mail.html, text: mail.text });
    return sendJSON(res, 200, { ok: true, id: data.id || null });
  } catch (err) {
    if (err.code === "EMAIL_NOT_CONFIGURED") {
      return sendJSON(res, 503, { error: "خدمة البريد غير مفعّلة حاليًا", code: "EMAIL_NOT_CONFIGURED" });
    }
    console.error("[order-email]", err);
    return sendJSON(res, 502, { error: "تعذّر إرسال البريد — حاول لاحقًا", code: "SEND_FAILED" });
  }
}
