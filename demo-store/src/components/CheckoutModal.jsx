import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useShop, computeTotals } from "../store";
import { PRODUCTS, riyal, FREE_SHIP, SHIP_COST, COUPON_CODE } from "../data/products";

const CITIES = ["الرياض", "جدة", "الدمام", "الخبر", "مكة المكرمة", "المدينة المنورة", "أخرى"];
const PAYS = [
  { k: "cod", t: "الدفع عند الاستلام", d: "تدفع للمندوب فبّه الطلب", icon: "🏪" },
  { k: "card", t: "مدى / Visa / Apple Pay", d: "وضع العرض — بدون خصم حقيقي", icon: "💳" },
  { k: "bank", t: "تحويل بنكي", d: "تفاصيل التحويل تطلع بعد التأكيد", icon: "🏦" },
];

export default function CheckoutModal() {
  const { checkout, closeCheckout, cart, coupon, user, placeOrder, ping, toast } = useShop();
  const priceOf = useMemo(() => (id) => PRODUCTS.find((p) => p.id === id)?.price || 0, []);
  const toastRender = () => toast && (
    <div className="fixed top-4 right-4 bg-green2 text-cream px-6 py-3 rounded-3xl text-[13px] font-black shadow-lg shadow-green2/20 animate-in fade-in-0 duration-500 w-full max-w-xs z-50">
      {toast.msg}
    </div>
  );
  const nameOf = useMemo(() => (id) => PRODUCTS.find((p) => p.id === id)?.name || "", []);
  const t = computeTotals({ cart, priceOf, couponOn: coupon });

  const [step, setStep] = useState(0);
  const [pay, setPay] = useState("cod");
  const [done, setDone] = useState(null);
  const [f, setF] = useState({
    name: user?.name || "", phone: user?.phone || "", city: user?.city || CITIES[0],
    district: user?.district || "", street: user?.street || "",
    card: "", exp: "", cvc: "",
  });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const close = () => { closeCheckout(); setStep(0); setDone(null); setErr(""); };

  const step1Ok = () => {
    if (f.name.trim().length < 2) { setErr("اكتب الاسم اللي على الهوية"); return false }
    if (!/^(05|\+?9665)\d{8}$/.test(f.phone.replace(/\s|-/g, ""))) { setErr("رقم جوال سعودي صحيح: 05xxxxxxxx"); return false }
    if (!f.district.trim() || !f.street.trim()) { setErr("كمّل الحي والشارع ووصف العنوان"); return false }
    setErr(""); return true;
  };
  const step2Ok = () => {
    if (pay !== "card") { setErr(""); return true }
    if (f.card.replace(/\s/g, "").length < 4) { setErr("دي بلغة العرض — دخل 4 أرقام وأي تاريخ/CVC"); return false }
    if (!/^\d{2}\/\d{2}$/.test(f.exp)) { setErr("التاريخ بشكل MM/YY"); return false }
    if (f.cvc.length < 3) { setErr("CVC ثلاثة أرقام"); return false }
    setErr(""); return true;
  };

  const confirm = () => {
    const id = `ASL-${String(Date.now()).slice(-6)}`;
    const order = {
      id,
      ts: Date.now(),
      items: cart.map((i) => ({ id: i.id, name: nameOf(i.id), qty: i.qty, color: i.color, size: i.size })),
      totals: t,
      addr: { name: f.name, phone: f.phone, city: f.city, district: f.district, street: f.street },
      pay: PAYS.find((x) => x.k === pay)?.t,
      status: "قيد التجهيز",
    };
    const o = placeOrder(order);
    setDone(o);
    ping(`طلبك ${id} وصل لنا ✓`);
  };

  const flow = [
    <div key="addr" className="grid grid-cols-2 gap-3">
      <label className="block col-span-2"><span className="text-[12px] font-black text-muted">الاسم</span>
        <input value={f.name} onChange={set("name")} className="mt-1 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[14px] font-bold outline-none focus:border-green2" /></label>
      <label className="block"><span className="text-[12px] font-black text-muted">الجوال</span>
        <input value={f.phone} onChange={set("phone")} dir="ltr" placeholder="05xxxxxxxx" className="mt-1 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[14px] font-bold text-left outline-none focus:border-green2" /></label>
      <label className="block"><span className="text-[12px] font-black text-muted">المدينة</span>
        <select value={f.city} onChange={set("city")} className="mt-1 w-full bg-white border border-line rounded-2xl px-3 py-3 text-[14px] font-bold outline-none focus:border-green2 cursor-pointer">
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select></label>
      <label className="block"><span className="text-[12px] font-black text-muted">الحي</span>
        <input value={f.district} onChange={set("district")} placeholder="النرجس" className="mt-1 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[14px] font-bold outline-none focus:border-green2" /></label>
      <label className="block"><span className="text-[12px] font-black text-muted">الشارع</span>
        <input value={f.street} onChange={set("street")} placeholder="شارع الأمير، مبنى 12 — أقرب معلم" className="mt-1 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[14px] font-bold outline-none focus:border-green2" /></label>
    </div>,

    <div key="pay" className="space-y-3">
      {PAYS.map((p) => (
        <div key={p.k}>
          <label className={`flex items-center gap-3 border rounded-2xl px-4 py-3.5 cursor-pointer transition-colors ${pay === p.k ? "border-green2 bg-white" : "border-line bg-white/60 hover:border-gold"}`}>
            <input type="radio" name="pay" checked={pay === p.k} onChange={() => setPay(p.k)} className="accent-[#1e5b4f] w-4 h-4 cursor-pointer" />
            <span className="text-xl">{p.icon}</span>
            <span className="flex-1"><b className="block text-[14px]">{p.t}</b><span className="text-[11.5px] font-bold text-muted">{p.d}</span></span>
          </label>
          <AnimatePresence>
            {p.k === "card" && pay === "card" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-2 gap-3 mt-3 pr-8">
                  <input value={f.card} onChange={set("card")} dir="ltr" placeholder="4242 4242 4242 4242" className="col-span-2 w-full bg-white border border-line rounded-2xl px-4 py-3 text-[13px] font-bold text-left outline-none focus:border-green2" />
                  <input value={f.exp} onChange={set("exp")} dir="ltr" placeholder="MM/YY" className="w-full bg-white border border-line rounded-2xl px-4 py-3 text-[13px] font-bold text-left outline-none focus:border-green2" />
                  <input value={f.cvc} onChange={set("cvc")} dir="ltr" type="password" placeholder="CVC" className="w-full bg-white border border-line rounded-2xl px-4 py-3 text-[13px] font-bold text-left outline-none focus:border-green2" />
                </div>
                <p className="text-[10.5px] font-bold text-muted mt-2 pr-8">🔒 وضع العرض التجريبي — ما يصير أي خصم حقيقي.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>,

    <div key="review" className="space-y-4">
      <div className="border border-line rounded-2xl overflow-hidden bg-white">
        {cart.map((i) => (
          <div key={i.key} className="flex items-center gap-3 px-4 py-3 border-b border-line last:border-0">
            <div className="w-10 h-10 rounded-xl bg-sand shrink-0" />
            <b className="text-[13px] flex-1">{nameOf(i.id)}</b>
            <span className="text-[12px] font-black text-muted">×{i.qty}</span>
            <b className="text-[13px] text-green2">{riyal(priceOf(i.id) * i.qty)} ر.س</b>
          </div>
        ))}
      </div>
      <div className="text-[12.5px] font-bold text-ink/85 space-y-1.5 bg-sand/60 rounded-2xl p-4">
        <div className="flex justify-between"><span>الشحن إلى</span><b>{f.city} — {f.district}، {f.street}</b></div>
        <div className="flex justify-between"><span>المستلم</span><b dir="ltr">{f.name} · {f.phone}</b></div>
        <div className="flex justify-between"><span>طريقة الدفع</span><b>{PAYS.find((x) => x.k === pay)?.t}</b></div>
      </div>
      <div className="text-[13px] font-black space-y-1.5">
        <div className="flex justify-between text-muted"><span>المجموع الفرعي</span><b>{riyal(t.subtotal)} ر.س</b></div>
        {t.disc > 0 && <div className="flex justify-between text-green2"><span>خصم {COUPON_CODE}</span><b>−{riyal(t.disc)} ر.س</b></div>}
        <div className="flex justify-between text-muted"><span>الشحن</span><b>{t.ship === 0 ? "مجاني ✓" : `${riyal(t.ship)} ر.س`}</b></div>
        <div className="flex justify-between text-lg pt-2 border-t border-line"><span>الإجمالي</span><b className="text-green2">{riyal(t.total)} ر.س</b></div>
      </div>
    </div>,
  ];

  const titles = ["عنوان التوصيل", "طريقة الدفع", "أكد طلبك"];

  return (
    <AnimatePresence>
      {toastRender()}
      {checkout && (
        <div className="fixed inset-0 z-[90] grid place-items-center p-4">
          <motion.div className="absolute inset-0 bg-ink/55 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.div initial={{ scale: 0.92, y: 34, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.94, y: 18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative bg-cream rounded-3xl max-w-md w-full shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar">

            {!done ? (
              <div className="p-7">
                <div className="flex items-center justify-between mb-5">
                  <button onClick={step > 0 ? () => setStep((s) => s - 1) : close} className="text-muted font-black text-[12px] hover:text-ink cursor-pointer">
                    {step > 0 ? "↩ رجوع" : "✕ إلغاء"}
                  </button>
                  <b className="text-[13px]">{titles[step]}</b>
                  <span className="text-muted text-[11px] font-black">خطوة {step + 1}/3</span>
                </div>
                <div className="flex gap-2 mb-6">{titles.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-gold" : "bg-line"}`} />
                ))}
                </div>
                <motion.div key={step} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28 }}>
                  {flow[step]}
                </motion.div>
                {err && <p className="text-red-500 text-[12px] font-black mt-3">{err}</p>}
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
                  if (step === 0 && !step1Ok()) return;
                  if (step === 1 && !step2Ok()) return;
                  step < 2 ? setStep((s) => s + 1) : confirm();
                }}
                  className="w-full mt-6 bg-green2 text-cream font-black py-3.5 rounded-2xl hover:bg-green transition-colors cursor-pointer shadow-lg shadow-green2/20">
                  {step === 2 ? `أكّد الطلب — ${riyal(t.total)} ر.س` : "التالي ←"}
                </motion.button>
              </div>
            ) : (
              <div className="p-9 text-center">
                <motion.div className="text-6xl mb-4" initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>🎉</motion.div>
                <h3 className="text-2xl font-black mb-1">وصل طلبك! ✦</h3>
                <p className="text-muted font-bold text-[13px] mb-4">رقم الطلب <b dir="ltr" className="text-green2">{done.id}</b> — الأوردر مأخوذ، وبنرسلك تأكيد التوصيل (48 ساعة داخل المملكة).</p>
                <div className="bg-sand/60 rounded-2xl p-4 text-[12.5px] font-bold text-ink/85 text-right mb-5">
                  <div className="flex justify-between mb-1"><span>الإجمالي</span><b>{riyal(done.totals.total)} ر.س</b></div>
                  <div className="flex justify-between mb-1"><span>الدفع</span><b>{done.pay}</b></div>
                  <div className="flex justify-between"><span>الحالة</span><b className="text-gold">{done.status}<span className="inline-block w-2 h-2 rounded-full bg-gold mr-1.5 align-middle" /></b></div>
                </div>
                {done.pay === "bank" && (
                  <p className="text-[12px] font-bold text-muted bg-white border border-line rounded-2xl p-3 mb-5 leading-6">
                    🏦 حوّل على: <b dir="ltr">SA03 8000 0000 6080 1075 1900</b> — حساب وهمي للعرض فقط، ما يصير فيه أي تحويل حقيقي.
                  </p>
                )}
                <div className="flex gap-3">
                  <Link to="/account" onClick={close} className="flex-1 bg-green2 text-cream font-black py-3.5 rounded-2xl text-center text-[13.5px] shadow-lg shadow-green2/20">طلباتي</Link>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={close} className="flex-1 border-2 border-line bg-white font-black py-3.5 rounded-2xl text-[13.5px] cursor-pointer">كمّل تسوّق</motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
