import { isEmail, readBody, sendEmail, sendJSON, resetEmail, signResetToken, siteUrl } from "./_lib/mail.js";

const hits = new Map();
const limited = (ip, max = 5, win = 15 * 60 * 1000) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  return list.length > max;
};

export default async function handler(req, res) {
  if (req.method !== "POST") return sendJSON(res, 405, { error: "الطريقة غير مسموحة" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  if (limited(`reset:${ip}`)) return sendJSON(res, 429, { error: "محاولات كثيرة — جرّب بعد قليل" });

  const body = await readBody(req);
  const email = String(body.email || "").trim().toLowerCase();
  if (!isEmail(email)) return sendJSON(res, 400, { error: "بريد إلكتروني غير صالح", code: "BAD_EMAIL" });

  const token = signResetToken(email);
  const link = `${siteUrl(req)}/reset-password?token=${encodeURIComponent(token)}`;
  const mail = resetEmail({ email, link });

  try {
    await sendEmail({ to: email, subject: mail.subject, html: mail.html, text: mail.text });
  } catch (err) {
    if (err.code === "EMAIL_NOT_CONFIGURED") {
      return sendJSON(res, 503, { error: "خدمة البريد غير مفعّلة حاليًا", code: "EMAIL_NOT_CONFIGURED" });
    }
    console.error("[forgot-password]", err);
  }

  return sendJSON(res, 200, { ok: true });
}
