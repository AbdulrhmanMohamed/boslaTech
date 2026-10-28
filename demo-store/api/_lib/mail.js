import { createHmac, timingSafeEqual } from "node:crypto";

const RESEND_API = "https://api.resend.com/emails";

export const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const escapeHtml = (v) => String(v ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

export const siteUrl = (req) => (process.env.SITE_URL || `https://${req.headers?.host || "demo.boslatech.com"}`).replace(/\/+$/, "");

export const money = (n) => Number(n || 0).toLocaleString("en-US");

export async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 100_000) return {};
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) } catch { return {} }
}

export function sendJSON(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

export async function sendEmail({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    const err = new Error("EMAIL_NOT_CONFIGURED");
    err.code = "EMAIL_NOT_CONFIGURED";
    throw err;
  }
  const from = process.env.RESEND_FROM || "أصل <onboarding@resend.dev>";
  const recipient = process.env.RESEND_TO || to;
  const r = await fetch(RESEND_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [recipient], subject, html, text, reply_to: process.env.RESEND_REPLY_TO || undefined }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(data.message || "RESEND_ERROR");
    err.code = "RESEND_ERROR";
    err.status = r.status;
    throw err;
  }
  return data;
}

const RESET_TTL = 15 * 60 * 1000;
const secret = () => process.env.RESET_SECRET || process.env.RESEND_API_KEY || "asl-demo-reset-secret";

export function signResetToken(email) {
  const payload = Buffer.from(JSON.stringify({ e: email.trim().toLowerCase(), exp: Date.now() + RESET_TTL })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyResetToken(token) {
  try {
    const [payload, sig] = String(token || "").split(".");
    if (!payload || !sig) return null;
    const expected = createHmac("sha256", secret()).update(payload).digest();
    const got = Buffer.from(sig, "base64url");
    if (got.length !== expected.length || !timingSafeEqual(got, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Date.now() || !isEmail(data.e)) return null;
    return data.e;
  } catch {
    return null;
  }
}

export function layout({ preheader, title, body, footer }) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f7f3ec;font-family:Tahoma,Arial,sans-serif;color:#23241d">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ec;padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e7e0d2;border-radius:20px;overflow:hidden">
<tr><td style="background:#163e36;padding:26px 30px">
  <div style="font-size:26px;font-weight:700;color:#c9a24b;letter-spacing:2px">أصل</div>
  <div style="font-size:12px;color:#efe0bf;margin-top:4px">عطور شرقية فاخرة · الرياض</div>
</td></tr>
<tr><td style="padding:30px">
  <h1 style="margin:0 0 10px;font-size:22px;line-height:1.5">${escapeHtml(title)}</h1>
  ${body}
</td></tr>
<tr><td style="padding:20px 30px 26px;background:#f7f3ec;border-top:1px solid #e7e0d2;font-size:11px;line-height:1.9;color:#6f6a5e">
  ${footer || ""}
  <div style="margin-top:8px">متجر تجريبي — لا يتم خصم أي مبالغ. للاستفسار: <a href="https://wa.me/966576944605" style="color:#1e5b4f">واتساب</a></div>
  <div style="margin-top:6px">© أصل — جميع الحقوق محفوظة</div>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

const btn = (href, label) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0"><tr><td style="background:#1e5b4f;border-radius:12px"><a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 28px;color:#f7f3ec;font-size:14px;font-weight:700;text-decoration:none">${escapeHtml(label)}</a></td></tr></table>`;

export function orderEmail({ order, link }) {
  const a = order.addr || {};
  const t = order.totals || {};
  const rows = (order.items || []).map((i) => `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f0e9dc;font-size:13px">
      <b>${escapeHtml(i.name)}</b>
      <div style="color:#6f6a5e;font-size:11px">${escapeHtml([i.size, i.color].filter(Boolean).join(" · "))}</div>
    </td>
    <td align="center" style="padding:10px 6px;border-bottom:1px solid #f0e9dc;font-size:12px;color:#6f6a5e">×${Number(i.qty) || 1}</td>
    <td align="left" style="padding:10px 0;border-bottom:1px solid #f0e9dc;font-size:12px;font-weight:700;white-space:nowrap">${money((i.price ?? 0) * (i.qty || 1))} ر.س</td>
  </tr>`).join("");

  const items = (order.items || []).map((i) => `${i.name} ×${i.qty}`).join("\n");
  const html = layout({
    preheader: `طلبك ${order.id} وصلنا — الإجمالي ${money(t.total)} ر.س`,
    title: "تم استلام طلبك ✓",
    footer: `<div>رقم الطلب: <b dir="ltr" style="color:#163e36">${escapeHtml(order.id)}</b></div>`,
    body: `
      <p style="margin:0 0 16px;font-size:13px;line-height:1.9;color:#444">شكرًا ${escapeHtml(a.name || "")}، طلبك وصلنا وجارٍ تجهيزه. هذا ملخص طلبك:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e0d2;border-radius:14px;padding:4px 16px">
        ${rows}
        <tr><td colspan="3" style="padding:12px 0 4px">
          <table width="100%" style="font-size:12px;color:#6f6a5e">
            <tr><td>المجموع</td><td align="left">${money(t.subtotal)} ر.س</td></tr>
            ${t.disc ? `<tr><td>الخصم</td><td align="left" style="color:#1e5b4f">−${money(t.disc)} ر.س</td></tr>` : ""}
            <tr><td>الشحن</td><td align="left">${t.ship ? `${money(t.ship)} ر.س` : "مجانًا"}</td></tr>
            <tr><td style="padding-top:8px;font-weight:700;color:#23241d">الإجمالي</td><td align="left" style="padding-top:8px;font-weight:700;color:#163e36">${money(t.total)} ر.س</td></tr>
          </table>
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;background:#f7f3ec;border-radius:14px;padding:14px 16px;font-size:12px;line-height:1.9">
        <tr><td>
          <b>التوصيل إلى</b><br>
          ${escapeHtml(a.name || "")} · <span dir="ltr">${escapeHtml(a.phone || "")}</span><br>
          ${escapeHtml(a.city || "")} — ${escapeHtml(a.district || "")}، ${escapeHtml(a.street || "")}
          ${a.notes ? `<br><span style="color:#6f6a5e">📝 ${escapeHtml(a.notes)}</span>` : ""}
          <div style="margin-top:8px;color:#1e5b4f"><b>طريقة الدفع:</b> ${escapeHtml(order.pay || "")}</div>
          ${order.payment?.status === "paid" ? `<div style="margin-top:6px">تم الدفع عبر ميسر · رقم العملية: <span dir="ltr">${escapeHtml(order.payment.id)}</span>${order.payment.last4 ? ` · •••• ${escapeHtml(order.payment.last4)}` : ""}</div>` : ""}
          ${order.pay === "تحويل بنكي" ? `<div style="margin-top:6px">حوّل على: <b dir="ltr">SA03 8000 0000 6080 1075 1900</b></div>` : ""}
        </td></tr>
      </table>
      ${btn(link, "تتبع طلبك")}
      <p style="margin:0;font-size:11px;line-height:1.8;color:#6f6a5e">وصلت هذه الرسالة إلى ${escapeHtml(order.addr?.email || "")} بعد تأكيد طلبك من متجر أصل.</p>`,
  });

  const text = `تم استلام طلبك لدى أصل

رقم الطلب: ${order.id}
${items}

المجموع: ${money(t.subtotal)} ر.س
${t.disc ? `الخصم: −${money(t.disc)} ر.س\n` : ""}الشحن: ${t.ship ? `${money(t.ship)} ر.س` : "مجانًا"}
الإجمالي: ${money(t.total)} ر.س

التوصيل إلى:
${a.name} · ${a.phone}
${a.city} — ${a.district}، ${a.street}
${a.notes ? `ملاحظات: ${a.notes}\n` : ""}طريقة الدفع: ${order.pay}
${order.payment?.status === "paid" ? `رقم عملية ميسر: ${order.payment.id}\n` : ""}

تتبع الطلب: ${link}`;

  return { subject: `تأكيد طلبك ${order.id} — أصل`, html, text };
}

export function resetEmail({ email, link }) {
  return {
    subject: "إعادة تعيين كلمة المرور — أصل",
    html: layout({
      preheader: "رابط إعادة تعيين كلمة المرور صالح لمدة 15 دقيقة",
      title: "إعادة تعيين كلمة المرور",
      footer: "<div>إذا ما طلبت إعادة التعيين، تجاهل هذه الرسالة بأمان.</div>",
      body: `
        <p style="margin:0 0 16px;font-size:13px;line-height:1.9;color:#444">وصلنا طلب لإعادة تعيين كلمة المرور لحسابك <b dir="ltr">${escapeHtml(email)}</b>.</p>
        <p style="margin:0;font-size:13px;line-height:1.9;color:#444">اضغط الزر بالأسفل واختر كلمة مرور جديدة. الرابط صالح لمدة <b>15 دقيقة</b> ولمرة واحدة.</p>
        ${btn(link, "تعيين كلمة مرور جديدة")}
        <p style="margin:0;font-size:11px;line-height:1.8;color:#6f6a5e;word-break:break-all">أو انسخ الرابط: <span dir="ltr">${escapeHtml(link)}</span></p>`,
    }),
    text: `إعادة تعيين كلمة المرور — أصل

افتح الرابط التالي لاختيار كلمة مرور جديدة (صالح 15 دقيقة):
${link}

إذا ما طلبت ذلك، تجاهل الرسالة.`,
  };
}
