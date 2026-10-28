import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { resetPassword } from "../lib/api";
import { useShop } from "../store";

const inp = "mt-1.5 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[16px] sm:text-[14px] font-bold outline-none focus:border-green2";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { openAuth } = useShop();
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (pass.length < 6) return setErr("كلمة المرور 6 خانات على الأقل");
    if (pass !== confirm) return setErr("كلمتا المرور غير متطابقتين");
    setErr("");
    setBusy(true);
    try {
      await resetPassword(token, pass);
      setDone(true);
    } catch (e2) {
      setErr(e2.code === "BAD_TOKEN" ? "الرابط غير صالح أو منتهي — اطلب رابطًا جديدًا من تسجيل الدخول." : "تعذّر تحديث كلمة المرور — جرّب بعد قليل.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-line rounded-3xl p-7 md:p-8 text-center">
        {!token || (!done && err && err.includes("الرابط")) ? (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-xl font-black mb-2">الرابط غير صالح</h1>
            <p className="text-[12.5px] font-bold text-muted leading-6 mb-6">الرابط منتهي أو مستخدم من قبل. اطلب رابطًا جديدًا من نافذة تسجيل الدخول.</p>
            <button onClick={() => { navigate("/"); openAuth(); }}
              className="w-full bg-green2 text-cream font-black py-3.5 rounded-2xl">طلب رابط جديد</button>
          </>
        ) : done ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green2 text-cream grid place-items-center text-3xl">✓</div>
            <h1 className="text-xl font-black mb-2">تم تعيين كلمة المرور</h1>
            <p className="text-[12.5px] font-bold text-muted leading-6 mb-6">تقدر تدخل الآن بكلمة المرور الجديدة.</p>
            <button onClick={() => { navigate("/"); openAuth(); }}
              className="w-full bg-green2 text-cream font-black py-3.5 rounded-2xl">تسجيل الدخول</button>
          </>
        ) : (
          <>
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-xl font-black mb-2">كلمة مرور جديدة</h1>
            <p className="text-[12px] font-bold text-muted leading-6 mb-5">اختر كلمة مرور قوية لحسابك في أصل.</p>
            <form onSubmit={submit} className="space-y-3.5 text-right" noValidate>
              <label className="block">
                <span className="text-[11.5px] font-black text-muted">كلمة المرور الجديدة</span>
                <input value={pass} onChange={(e) => { setPass(e.target.value); setErr(""); }} type="password" dir="ltr" autoComplete="new-password"
                  className={`${inp} text-left`} placeholder="••••••" />
              </label>
              <label className="block">
                <span className="text-[11.5px] font-black text-muted">تأكيد كلمة المرور</span>
                <input value={confirm} onChange={(e) => { setConfirm(e.target.value); setErr(""); }} type="password" dir="ltr" autoComplete="new-password"
                  className={`${inp} text-left`} placeholder="••••••" />
              </label>
              {err && <p role="alert" className="text-[12px] font-black text-red-500 leading-5">{err}</p>}
              <button type="submit" disabled={busy}
                className="w-full bg-green2 text-cream font-black py-3.5 rounded-2xl shadow-lg shadow-green2/20 disabled:opacity-60">
                {busy ? "جاري الحفظ…" : "حفظ كلمة المرور"}
              </button>
            </form>
            <p className="text-[10.5px] font-bold text-muted mt-4">وضع تجريبي — ما يتم تخزين كلمة مرور حقيقية.</p>
          </>
        )}
      </motion.div>

      <p className="text-center text-[11.5px] font-bold text-muted mt-6">
        <Link to="/" className="text-green2 underline underline-offset-4">الرجوع للمتجر</Link>
      </p>
    </div>
  );
}
