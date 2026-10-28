import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../store";

export default function AuthModal() {
  const { authOpen, closeAuth, login, signup } = useShop();
  const [tab, setTab] = useState("signup");
  const [form, setForm] = useState({ name: "", phone: "", pass: "" });
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const phoneOk = /^(05|\+?9665)\d{8}$/.test(form.phone.replace(/\s|-/g, ""));
    if (tab === "signup" && form.name.trim().length < 2) return setErr("اكتب اسمك كامل ياخوي");
    if (!phoneOk) return setErr("اكتب رقم جوال سعودي صحيح (05xxxxxxxx)");
    if (form.pass.length < 4) return setErr("كلمة السر على الأقل 4 خانات (ديمو)");
    setErr("");
    tab === "signup"
      ? signup({ name: form.name, phone: form.phone })
      : login({ name: form.name, phone: form.phone });
  };

  return (
    <AnimatePresence>
      {authOpen && (
        <div className="fixed inset-0 z-[95] grid place-items-center p-5">
          <motion.div className="absolute inset-0 bg-ink/55 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAuth} />
          <motion.div
            initial={{ scale: 0.9, y: 34, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative bg-cream rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <button onClick={closeAuth} aria-label="إغلاق" className="absolute top-4 left-4 w-8 h-8 grid place-items-center rounded-full border border-line text-muted hover:text-ink cursor-pointer">✕</button>

            <div className="flex gap-2 p-1 bg-sand rounded-2xl mb-7">
              {[["signup", "حساب جديد"], ["login", "تسجيل دخول"]].map(([k, l]) => (
                <button key={k} onClick={() => { setTab(k); setErr(""); }}
                  className={`relative flex-1 py-2.5 text-[13px] font-black rounded-xl cursor-pointer transition-colors ${tab === k ? "text-cream" : "text-muted hover:text-ink"}`}>
                  {tab === k && <motion.span layoutId="authtab" className="absolute inset-0 bg-green2 rounded-xl" />}
                  <span className="relative">{l}</span>
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-3.5">
              <motion.div key={tab} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="space-y-3.5">
                <label className="block">
                  <span className="text-[12px] font-black text-muted">اسمك</span>
                  <input value={form.name} onChange={set("name")} placeholder="مثال: سعود الحربي"
                    className="mt-1 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[14px] font-bold outline-none focus:border-green2" />
                </label>
                <label className="block">
                  <span className="text-[12px] font-black text-muted">رقم الجوال</span>
                  <input value={form.phone} onChange={set("phone")} dir="ltr" placeholder="05xxxxxxxx"
                    className="mt-1 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[14px] font-bold text-left outline-none focus:border-green2" />
                </label>
                <label className="block">
                  <span className="text-[12px] font-black text-muted">كلمة السر</span>
                  <input value={form.pass} onChange={set("pass")} type="password" dir="ltr" placeholder="••••••"
                    className="mt-1 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[14px] font-bold text-left outline-none focus:border-green2" />
                </label>
              </motion.div>

              {err && <p className="text-red-500 text-[12px] font-black">{err}</p>}

              <motion.button whileTap={{ scale: 0.97 }} type="submit"
                className="w-full bg-green2 text-cream font-black py-3.5 rounded-2xl hover:bg-green transition-colors cursor-pointer shadow-lg shadow-green2/20">
                {tab === "signup" ? "سجّل ودخول العالم الأصيل" : "دخول"}
              </motion.button>
              <p className="text-center text-[11px] font-bold text-muted leading-5">
                متجر تجريبي — ما فيه دفع أو بيانات حقيقية لأنه الدفع غير مفعّل هنا. بياناتك تُحفظ بجهازك فقط.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
