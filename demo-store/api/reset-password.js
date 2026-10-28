import { readBody, sendJSON, verifyResetToken } from "./_lib/mail.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return sendJSON(res, 405, { error: "الطريقة غير مسموحة" });

  const body = await readBody(req);
  const email = verifyResetToken(body.token);
  if (!email) return sendJSON(res, 400, { error: "الرابط غير صالح أو منتهي — اطلب رابطًا جديدًا", code: "BAD_TOKEN" });

  const pass = String(body.password || "");
  if (pass.length < 6) return sendJSON(res, 400, { error: "كلمة المرور 6 خانات على الأقل", code: "WEAK_PASSWORD" });

  return sendJSON(res, 200, { ok: true, email });
}
