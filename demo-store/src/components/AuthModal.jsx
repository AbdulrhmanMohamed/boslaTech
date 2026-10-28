import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../store";
import useDialogBehavior from "../hooks/useDialogBehavior";
import { requestPasswordReset } from "../lib/api";

const inp = "mt-1 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[16px] sm:text-[14px] font-bold outline-none focus:border-green2";

export default function AuthModal() {
  const { authOpen, closeAuth, login, signup } = useShop();
  const [tab, setTab] = useState("signup");
  const [form, setForm] = useState({ name: "", phone: "", email: "", pass: "" });
  const [err, setErr] = useState("");
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  useDialogBehavior(authOpen, closeAuth);

  useEffect(() => {
    if (!authOpen) return;
    setErr("");
    setForgot(false);
    setSent(false);
    setBusy(false);
  }, [authOpen]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim());

  const sendReset = async (e) => {
    e.preventDefault();
    if (!emailOk) return setErr("اكتب بريدًا إلكترونيًا صحيحًا");
    setErr("");
    setBusy(true);
    try {
      await requestPasswordReset(form.email.trim());
      setSent(true);
    } catch (e2) {
      setErr(e2.code === "EMAIL_NOT_CONFIGURED"
        ? "خدمة البريد غير مفعّلة حاليًا — أضف مفتاح Resend في إعدادات المشروع."
        : "تعذّر إرسال الرابط — جرّب بعد قليل.");
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (forgot) return sendReset(e);
    const phoneOk = /^(05|\+?9665)\d{8}$/.test(form.phone.replace(/\s|-/g, ""));
    if (tab === "signup" && form.name.trim().length < 2) return setErr("اكتب اسمك الكامل");
    if (!phoneOk) return setErr("اكتب رقم جوال سعودي صحيح (05xxxxxxxx)");
    if (form.email.trim() && !emailOk) return setErr("البريد الإلكتروني غير صحيح");
    if (form.pass.length < 4) return setErr("كلمة السر على الأقل 4 خانات (ديمو)");
    setErr("");
    tab === "signup"
      ? signup({ name: form.name, phone: form.phone, email: form.email })
      : login({ name: form.name, phone: form.phone, email: form.email });
  };

  return (
    <AnimatePresence>
      {authOpen && (
        <div className="fixed inset-0 z-[95] grid place-items-center p-5" role="dialog" aria-modal="true" aria-label="الحساب">
          <motion.div className="absolute inset-0 bg-ink/55 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAuth} />
          <motion.div
            initial={{ scale: 0.9, y: 34, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative bg-cream rounded-3xl p-8 max-w-sm w-full shadow-2xl max-h-[92svh] overflow-y-auto no-scrollbar">
            <button onClick={closeAuth} aria-label="إغلاق" className="absolute top-4 left-4 w-8 h-8 grid place-items-center rounded-full border border-line text-muted hover:text-ink cursor-pointer z-10">✕</button>

            {forgot ? (
              <div className="pt-2">
                <div className="text-3xl mb-2">🔑</div>
                <h2 className="text-xl font-black mb-1">استعادة كلمة المرور</h2>
                <p className="text-[12px] font-bold text-muted leading-6 mb-5">
                  {sent
                    ? "إذا كان البريد مسجلًا عندنا، وصلتك رسالة فيها رابط لإعادة التعيين خلال دقيقة. تحقّق من الوارد والمهملات."
                    : "اكتب بريدك المسجل ونرسل لك رابطًا لإعادة التعيين — صالح 15 دقيقة."}
                </p>

                {sent ? (
                  <>
                    <div className="bg-white border border-green2/30 rounded-2xl p-4 text-center text-[13px] font-black text-green2">
                      ✓ تم إرسال رابط الاستعادة
                      <p className="text-[11px] font-bold text-muted mt-1" dir="ltr">{form.email}</p>
                    </div>
                    <button onClick={() => { setForgot(false); setSent(false); setErr(""); }}
                      className="w-full mt-4 bg-green2 text-cream font-black py-3.5 rounded-2xl cursor-pointer">
                      رجوع لتسجيل الدخول
                    </button>
                  </>
                ) : (
                  <form onSubmit={submit} className="space-y-3.5">
                    <label className="block">
                      <span className="text-[12px] font-black text-muted">البريد الإلكتروني</span>
                      <input value={form.email} onChange={set("email")} dir="ltr" type="email" inputMode="email" autoComplete="email"
                        placeholder="name@example.com" className={`${inp} text-left`} />
                    </label>
                    {err && <p role="alert" className="text-red-500 text-[12px] font-black leading-5">{err}</p>}
                    <button type="submit" disabled={busy}
                      className="w-full bg-green2 text-cream font-black py-3.5 rounded-2xl hover:bg-green transition-colors cursor-pointer shadow-lg shadow-green2/20 disabled:opacity-60">
                      {busy ? "جاري الإرسال…" : "أرسل رابط الاستعادة"}
                    </button>
                    <button type="button" onClick={() => { setForgot(false); setErr(""); }}
                      className="w-full text-[12px] font-black text-muted hover:text-ink">
                      رجوع
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <div className="flex gap-2 p-1 bg-sand rounded-2xl mb-7">
                  {[["signup", "حساب جديد"], ["login", "تسجيل دخول"]].map(([k, l]) => (
                    <button key={k} onClick={() => { setTab(k); setErr(""); }}
                      className={`relative flex-1 py-2.5 text-[13px] font-black rounded-xl cursor-pointer transition-colors ${tab === k ? "text-cream" : "text-muted hover:text-ink"}`}>
                      {tab === k && <motion.span layoutId="authtab" className="absolute inset-0 bg-green2 rounded-xl" />}
                      <span className="relative">{l}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="space-y-3.5" noValidate>
                  <motion.div key={tab} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="space-y-3.5">
                    <label className="block">
                      <span className="text-[12px] font-black text-muted">اسمك</span>
                      <input value={form.name} onChange={set("name")} autoComplete="name" placeholder="مثال: سعود الحربي" className={inp} />
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-black text-muted">رقم الجوال</span>
                      <input value={form.phone} onChange={set("phone")} dir="ltr" inputMode="tel" autoComplete="tel-national" placeholder="05xxxxxxxx"
                        className={`${inp} text-left`} />
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-black text-muted">البريد الإلكتروني <span className="text-muted/70">(اختياري)</span></span>
                      <input value={form.email} onChange={set("email")} dir="ltr" type="email" inputMode="email" autoComplete="email" placeholder="name@example.com"
                        className={`${inp} text-left`} />
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-black text-muted">كلمة السر</span>
                      <input value={form.pass} onChange={set("pass")} type="password" dir="ltr" autoComplete={tab === "signup" ? "new-password" : "current-password"} placeholder="••••••"
                        className={`${inp} text-left`} />
                    </label>
                    {tab === "login" && (
                      <button type="button" onClick={() => { setForgot(true); setSent(false); setErr(""); }}
                        className="text-[11.5px] font-black text-green2 underline underline-offset-4">
                        نسيت كلمة المرور؟
                      </button>
                    )}
                  </motion.div>

                  {err && <p role="alert" className="text-red-500 text-[12px] font-black leading-5">{err}</p>}

                  <motion.button whileTap={{ scale: 0.97 }} type="submit"
                    className="w-full bg-green2 text-cream font-black py-3.5 rounded-2xl hover:bg-green transition-colors cursor-pointer shadow-lg shadow-green2/20">
                    {tab === "signup" ? "إنشاء الحساب" : "دخول"}
                  </motion.button>
                  <p className="text-center text-[11px] font-bold text-muted leading-5">
                    متجر تجريبي — ما فيه دفع أو بيانات حقيقية. بياناتك تُحفظ بجهازك فقط.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
