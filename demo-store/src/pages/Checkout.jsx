import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useShop, computeTotals } from "../store";
import { PRODUCTS, riyal, FREE_SHIP, COUPON_CODE } from "../data/products";
import { sendOrderEmail } from "../lib/api";
import { hasLocal, hydrate, read, remove, write } from "../lib/storage";

const CITIES = ["الرياض", "جدة", "الدمام", "الخبر", "مكة المكرمة", "المدينة المنورة", "أخرى"];

const DISTRICTS = {
  الرياض: ["النرجس", "الملقا", "حطين", "العليا", "المروج", "الياسمين", "القيروان", "السويدي", "أخرى"],
  جدة: ["الشاطئ", "الروضة", "الحمراء", "السلامة", "أبحر الشمالية", "الفيصلية", "أخرى"],
  الدمام: ["الشاطئ الغربي", "الفيصلية", "الجلوية", "الروضة", "أحد", "أخرى"],
  الخبر: ["العقربية", "الثقبة", "الراكة", "الحزام الذهبي", "أخرى"],
  "مكة المكرمة": ["العزيزية", "الششة", "العوالي", "الروضة", "النسيم", "أخرى"],
  "المدينة المنورة": ["العوالي", "قباء", "الخالدية", "النصر", "أخرى"],
};

const ETA = {
  الرياض: "24–48 ساعة",
  جدة: "2–3 أيام عمل",
  الدمام: "2–3 أيام عمل",
  الخبر: "2–3 أيام عمل",
  "مكة المكرمة": "2–4 أيام عمل",
  "المدينة المنورة": "2–4 أيام عمل",
  أخرى: "3–5 أيام عمل",
};

const EXPRESS = [
  { k: "card", t: "مدى / Visa", note: "بطاقة بنكية" },
  { k: "stcpay", t: "STC Pay", note: "محفظة الجوال" },
];

const PAYS = [
  { k: "card", t: "مدى / Visa / Mastercard", d: "دفع آمن عبر ميسر", icon: "💳" },
  { k: "stcpay", t: "STC Pay", d: "ادفع من محفظتك عبر ميسر", icon: "📱" },
  { k: "cod", t: "الدفع عند الاستلام", d: "تدفع للمندوب عند وصول الطلب", icon: "🏪" },
  { k: "bank", t: "تحويل بنكي", d: "نرسل لك تفاصيل الحساب بعد التأكيد", icon: "🏦" },
];

const PAY_LABEL = {
  stcpay: "STC Pay — ميسر",
  card: "بطاقة — ميسر",
  cod: "الدفع عند الاستلام",
  bank: "تحويل بنكي",
};

const DRAFT_KEY = "asl_checkout_draft";
const PENDING_KEY = "asl_pending_order";
const ONLINE = new Set(["card", "stcpay"]);
const readDraft = () => read(DRAFT_KEY, {});

const digits = (v) => v.replace(/\D/g, "");
const priceOf = (id) => PRODUCTS.find((p) => p.id === id)?.price || 0;
const nameOf = (id) => PRODUCTS.find((p) => p.id === id)?.name || "";

const inp = "mt-1.5 w-full bg-white border rounded-2xl px-4 py-3 text-[16px] sm:text-[14px] font-bold outline-none transition-colors placeholder:text-muted/60";

export default function Checkout() {
  const { cart, coupon, applyCoupon, user, placeOrder, updateOrder, ping } = useShop();
  const navigate = useNavigate();

  const t = useMemo(() => computeTotals({ cart, priceOf, couponOn: coupon }), [cart, coupon]);

  const [f, setF] = useState(() => ({
    name: "", phone: "", email: "", city: CITIES[0], district: "", street: "", notes: "",
    ...(readDraft().f || {}),
  }));
  const [pay, setPay] = useState(() => {
    const saved = readDraft().pay;
    return ["card", "stcpay", "cod", "bank"].includes(saved) ? saved : "cod";
  });
  const [draftReady, setDraftReady] = useState(() => hasLocal(DRAFT_KEY));
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState(null);
  const timerRef = useRef(null);
  const draftTouched = useRef(false);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (draftReady) return;
    let alive = true;
    hydrate([DRAFT_KEY])
      .then((saved) => {
        if (!alive || draftTouched.current || !saved[DRAFT_KEY]) return;
        const d = saved[DRAFT_KEY];
        if (d.f) setF((cur) => ({ ...cur, ...d.f }));
        if (["card", "stcpay", "cod", "bank"].includes(d.pay)) setPay(d.pay);
      })
      .catch(() => {})
      .finally(() => { if (alive) setDraftReady(true); });
    return () => { alive = false; };
  }, [draftReady]);

  useEffect(() => {
    if (!draftReady) return;
    const { name, phone, email, city, district, street, notes } = f;
    write(DRAFT_KEY, { f: { name, phone, email, city, district, street, notes }, pay });
  }, [f, pay, draftReady]);

  useEffect(() => {
    if (!user) return;
    setF((s) => ({
      ...s,
      name: s.name || user.name || "",
      phone: s.phone || user.phone || "",
      email: s.email || user.email || "",
      city: user.city || s.city || CITIES[0],
      district: s.district || user.district || "",
      street: s.street || user.street || "",
    }));
  }, [user]);

  const districts = DISTRICTS[f.city] || [];

  const set = (k) => (e) => {
    draftTouched.current = true;
    setF((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onPhone = (e) => {
    draftTouched.current = true;
    const v = digits(e.target.value).slice(0, 10);
    setF((s) => ({ ...s, phone: v }));
    if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
  };

  const onCity = (e) => {
    draftTouched.current = true;
    const city = e.target.value;
    setF((s) => ({ ...s, city, district: "" }));
    setErrors((er) => ({ ...er, district: undefined }));
  };

  const validate = () => {
    const er = {};
    if (f.name.trim().length < 2) er.name = "اكتب اسم المستلم كاملًا";
    if (!/^05\d{8}$/.test(f.phone)) er.phone = "رقم الجوال يبدأ بـ 05 ويكون 10 أرقام";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) er.email = "اكتب بريدًا صحيحًا لاستلام تأكيد الطلب";
    if (!f.district) er.district = "اختر الحي";
    if (f.street.trim().length < 3) er.street = "اكتب الشارع وأقرب معلم";
    return er;
  };

  const submit = (e) => {
    e.preventDefault();
    if (placing) return;
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      const first = Object.keys(er)[0];
      document.getElementById(`co-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => document.getElementById(`co-${first}`)?.focus({ preventScroll: true }), 380);
      return;
    }

    const online = ONLINE.has(pay);
    setPlacing(true);
    timerRef.current = setTimeout(() => {
      const id = `ASL-${String(Date.now()).slice(-6)}`;
      const o = {
        id,
        ts: Date.now(),
        items: cart.map((i) => ({ id: i.id, name: nameOf(i.id), qty: i.qty, price: priceOf(i.id), color: i.color, size: i.size })),
        totals: t,
        addr: { name: f.name.trim(), phone: f.phone, email: f.email.trim(), city: f.city, district: f.district, street: f.street.trim(), notes: f.notes.trim() },
        pay: PAY_LABEL[pay],
        status: "قيد التجهيز",
      };

      if (online) {
        const token = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        write(PENDING_KEY, { token, order: o, payKey: pay, createdAt: Date.now() });
        setPlacing(false);
        navigate("/pay");
        return;
      }

      const saved = { ...o, emailStatus: "sending" };
      remove(PENDING_KEY);
      placeOrder(saved);
      setPlacing(false);
      setPay("cod");
      navigate(`/order/${id}`);
      sendOrderEmail(f.email.trim(), saved)
        .then(() => {
          updateOrder(id, { emailStatus: "sent" });
          ping("أرسلنا تأكيد الطلب إلى بريدك ✓");
        })
        .catch((err) => {
          updateOrder(id, { emailStatus: err.code === "EMAIL_NOT_CONFIGURED" ? "off" : "failed" });
        });
    }, online ? 350 : 650);
  };

  const choosePay = (k) => {
    draftTouched.current = true;
    setPay(k);
  };

  const applyCode = () => {
    const ok = applyCoupon(code);
    setCodeMsg(ok ? { ok: true, t: "تم تطبيق خصم 10% ✓" } : { ok: false, t: `كود غير صالح — جرّب ${COUPON_CODE}` });
  };

  const removeCode = () => {
    applyCoupon("");
    setCode("");
    setCodeMsg(null);
    ping("تم إلغاء كود الخصم");
  };

  const errText = (k) => errors[k] && (
    <p id={`co-${k}-err`} role="alert" className="mt-1 text-[11.5px] font-black text-red-500">{errors[k]}</p>
  );
  const cls = (k) => `${inp} ${errors[k] ? "border-red-400 focus:border-red-400" : "border-line focus:border-green2"}`;

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <div className="text-6xl mb-5">🛒</div>
        <h1 className="text-2xl font-black mb-2">سلتك فاضية</h1>
        <p className="text-muted font-bold text-[13.5px] mb-7">أضف منتجًا واحدًا على الأقل قبل إتمام الطلب.</p>
        <Link to="/shop" className="inline-block bg-green2 text-cream font-black px-8 py-3.5 rounded-2xl">تسوّق الآن ←</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 pb-32 lg:pb-16">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <p className="text-[12px] font-black text-gold mb-1">✦ خطوة أخيرة</p>
          <h1 className="text-3xl font-black">إتمام الطلب</h1>
        </div>
        <Link to="/cart" className="text-[12.5px] font-black text-muted border border-line bg-white rounded-2xl px-4 py-2.5 hover:text-green2 transition-colors">
          تعديل السلة
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <form id="checkout-form" onSubmit={submit} noValidate className="space-y-6">
          {/* express */}
          <section className="bg-white border border-line rounded-3xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-[15px]">الدفع السريع</h2>
              <span className="text-[10.5px] font-black text-muted">تجريبي</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {EXPRESS.map((x) => (
                <button key={x.k} type="button" onClick={() => choosePay(x.k)}
                  aria-pressed={pay === x.k}
                  className={`relative rounded-2xl border-2 px-2 py-3 text-center transition-colors cursor-pointer ${pay === x.k ? "border-green2 bg-sand/60" : "border-line bg-cream/40 hover:border-gold"}`}>
                  <b className="block text-[13px] leading-tight">{x.t}</b>
                  <span className="block text-[9.5px] font-bold text-muted mt-1 leading-tight">{x.note}</span>
                </button>
              ))}
            </div>
            <p className="text-[10.5px] font-bold text-muted mt-2.5">
              دفع إلكتروني آمن عبر ميسر — بيانات البطاقة تُدخل هناك ولا تُحفظ في المتجر.
            </p>
          </section>

          {/* contact */}
          <section className="bg-white border border-line rounded-3xl p-5 md:p-6 scroll-mt-24">
            <h2 className="font-black text-[15px] mb-4">١. بيانات التواصل</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block" htmlFor="co-name">
                <span className="text-[11.5px] font-black text-muted">اسم المستلم</span>
                <input id="co-name" value={f.name} onChange={set("name")} autoComplete="name"
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? "co-name-err" : undefined}
                  className={cls("name")} placeholder="الاسم كما في الهوية" />
                {errText("name")}
              </label>
              <label className="block" htmlFor="co-phone">
                <span className="text-[11.5px] font-black text-muted">رقم الجوال</span>
                <input id="co-phone" value={f.phone} onChange={onPhone} dir="ltr" inputMode="tel" autoComplete="tel-national"
                  aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "co-phone-err" : undefined}
                  className={`${cls("phone")} text-left`} placeholder="05xxxxxxxx" />
                {errText("phone")}
              </label>
            </div>
            {user && (
              <p className="text-[11px] font-bold text-green2 mt-3">✓ مسجّل الدخول باسم {user.name}</p>
            )}
          </section>

          {/* address */}
          <section className="bg-white border border-line rounded-3xl p-5 md:p-6 scroll-mt-24">
            <h2 className="font-black text-[15px] mb-4">٢. عنوان التوصيل</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block" htmlFor="co-city">
                <span className="text-[11.5px] font-black text-muted">المدينة</span>
                <select id="co-city" value={f.city} onChange={onCity} autoComplete="address-level2"
                  className={`${inp} border-line focus:border-green2 cursor-pointer`}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>

              <label className="block" htmlFor="co-district">
                <span className="text-[11.5px] font-black text-muted">الحي</span>
                {f.city === "أخرى" ? (
                  <input id="co-district" value={f.district} onChange={set("district")} autoComplete="address-level3"
                    aria-invalid={!!errors.district} aria-describedby={errors.district ? "co-district-err" : undefined}
                    className={cls("district")} placeholder="اسم الحي" />
                ) : (
                  <select id="co-district" value={f.district} onChange={set("district")} autoComplete="address-level3"
                    aria-invalid={!!errors.district} aria-describedby={errors.district ? "co-district-err" : undefined}
                    className={`${cls("district")} cursor-pointer ${f.district ? "" : "text-muted/70"}`}>
                    <option value="">اختر الحي</option>
                    {districts.map((d) => <option key={d}>{d}</option>)}
                  </select>
                )}
                {errText("district")}
              </label>

              <label className="block sm:col-span-2" htmlFor="co-email">
                <span className="text-[11.5px] font-black text-muted">البريد الإلكتروني</span>
                <input id="co-email" value={f.email} onChange={set("email")} dir="ltr" inputMode="email" autoComplete="email"
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? "co-email-err" : undefined}
                  className={`${cls("email")} text-left`} placeholder="name@example.com" />
                {errText("email")}
                <span className="block mt-1 text-[10.5px] font-bold text-muted">نرسل عليه تأكيد الطلب ورابط تتبع الشحنة.</span>
              </label>

              <label className="block sm:col-span-2" htmlFor="co-street">
                <span className="text-[11.5px] font-black text-muted">الشارع وأقرب معلم</span>
                <input id="co-street" value={f.street} onChange={set("street")} autoComplete="street-address"
                  aria-invalid={!!errors.street} aria-describedby={errors.street ? "co-street-err" : undefined}
                  className={cls("street")} placeholder="مثال: شارع الأمير، مبنى 12، مقابل صيدلية النهدي" />
                {errText("street")}
              </label>

              <label className="block sm:col-span-2" htmlFor="co-notes">
                <span className="text-[11.5px] font-black text-muted">ملاحظات للمندوب (اختياري)</span>
                <input id="co-notes" value={f.notes} onChange={set("notes")} maxLength={200}
                  className={`${inp} border-line focus:border-green2`} placeholder="وقت مناسب للتوصيل، رقم المبنى…" />
              </label>
            </div>
            <p className="text-[11px] font-bold text-muted mt-3">⏱ التوصيل المتوقع إلى {f.city}: <b className="text-green2">{ETA[f.city] || ETA["أخرى"]}</b></p>
          </section>

          {/* payment */}
          <section className="bg-white border border-line rounded-3xl p-5 md:p-6 scroll-mt-24">
            <h2 className="font-black text-[15px] mb-4">٣. طريقة الدفع</h2>
            <fieldset>
              <legend className="sr-only">طريقة الدفع</legend>
              <div className="space-y-2.5">
              {PAYS.map((p) => (
                <div key={p.k}>
                  <label className={`flex items-center gap-3 border-2 rounded-2xl px-4 py-3.5 cursor-pointer transition-colors ${pay === p.k ? "border-green2 bg-cream/50" : "border-line hover:border-gold"}`}>
                    <input type="radio" name="pay" checked={pay === p.k} onChange={() => choosePay(p.k)}
                      className="accent-[#1e5b4f] w-4 h-4 cursor-pointer" />
                    <span className="text-xl">{p.icon}</span>
                    <span className="flex-1">
                      <b className="block text-[13.5px]">{p.t}</b>
                      <span className="text-[11px] font-bold text-muted">{p.d}</span>
                    </span>
                  </label>

                  {(p.k === "card" || p.k === "stcpay") && pay === p.k && (
                    <div className="mt-3 bg-cream/50 border border-line rounded-2xl p-4 text-[11.5px] font-bold leading-6 text-muted">
                      🔒 بعد الضغط على متابعة الدفع، ستنتقل إلى صفحة ميسر الآمنة لإتمام العملية. لا نحتفظ ببيانات البطاقة أو المحفظة.
                    </div>
                  )}

                  {p.k === "bank" && pay === "bank" && (
                    <div className="mt-3 bg-cream/50 border border-line rounded-2xl p-4 text-[12px] font-bold leading-6">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span dir="ltr">SA03 8000 0000 6080 1075 1900</span>
                        <button type="button" onClick={() => {
                          navigator.clipboard?.writeText("SA0380000000608010751900");
                          ping("تم نسخ رقم الحساب ✓");
                        }} className="text-[11px] font-black text-green2 border border-green2/30 rounded-lg px-2.5 py-1">نسخ</button>
                      </div>
                      <p className="text-muted mt-1">حساب وهمي للعرض فقط — ما يصير أي تحويل حقيقي.</p>
                    </div>
                  )}
                </div>
              ))}
              </div>
            </fieldset>
          </section>

        </form>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="bg-white border border-line rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-[15px]">ملخص الطلب</h2>
              <span className="text-[11px] font-black text-muted">{t.items === 1 ? "منتج واحد" : `${t.items} منتجات`}</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
              {cart.map((i) => {
                const p = PRODUCTS.find((x) => x.id === i.id);
                return (
                  <div key={i.key} className="flex items-center gap-3">
                    <img src={p?.img} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <b className="text-[12.5px] block truncate">{p?.name}</b>
                      <span className="text-[11px] font-bold text-muted">{i.qty} × {riyal(p?.price || 0)} ر.س</span>
                    </div>
                    <b className="text-[12px]">{riyal((p?.price || 0) * i.qty)}</b>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-line">
              {coupon ? (
                <div className="flex items-center justify-between bg-goldsoft/50 border border-gold/40 rounded-xl px-3 py-2">
                  <span className="text-[11.5px] font-black text-green2">✓ {COUPON_CODE} — خصم 10%</span>
                  <button type="button" onClick={removeCode} className="text-[11px] font-black text-muted hover:text-red-500">إزالة</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr"
                    className="flex-1 min-w-0 bg-cream border border-line rounded-xl px-3 py-2 text-[13px] font-bold outline-none focus:border-gold"
                    placeholder="كود الخصم" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCode(); } }} />
                  <button type="button" onClick={applyCode} className="bg-sand rounded-xl px-4 font-black text-green2 text-[12px]">تطبيق</button>
                </div>
              )}
              {codeMsg && !coupon && <p className={`text-[11px] font-extrabold mt-1.5 ${codeMsg.ok ? "text-green2" : "text-red-500"}`}>{codeMsg.t}</p>}
            </div>

            <dl className="mt-4 space-y-2 text-[12.5px] font-bold text-muted">
              <div className="flex justify-between"><dt>المجموع</dt><dd>{riyal(t.subtotal)} ر.س</dd></div>
              {t.disc > 0 && <div className="flex justify-between text-green2"><dt>الخصم</dt><dd>−{riyal(t.disc)} ر.س</dd></div>}
              <div className="flex justify-between"><dt>الشحن</dt><dd>{t.ship === 0 ? "مجانًا" : `${riyal(t.ship)} ر.س`}</dd></div>
              <div className="flex justify-between text-[11px]"><dt>الأسعار شاملة ضريبة القيمة المضافة</dt><dd /></div>
            </dl>
            <div className="flex justify-between mt-3 pt-3 border-t border-line font-black text-lg">
              <span>الإجمالي</span><span>{riyal(t.total)} ر.س</span>
            </div>

            {t.left > 0 && (
              <div className="mt-3 text-[11px] font-extrabold text-green2 bg-sand/60 rounded-xl px-3 py-2">
                باقي <b>{riyal(t.left)} ر.س</b> وتوصلك بشحن مجاني
                <div className="h-1.5 bg-line rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-[width]" style={{ width: `${Math.min(100, (t.subtotal / FREE_SHIP) * 100)}%` }} />
                </div>
              </div>
            )}

            <button type="submit" form="checkout-form" disabled={placing}
              className="hidden lg:block w-full mt-5 bg-green2 text-cream font-black py-3.5 rounded-2xl text-[14px] shadow-lg shadow-green2/20 disabled:opacity-60">
              {placing ? (ONLINE.has(pay) ? "جاري تجهيز الدفع…" : "جاري تأكيد الطلب…") : `${ONLINE.has(pay) ? "متابعة الدفع" : "أكّد الطلب"} — ${riyal(t.total)} ر.س`}
            </button>
            <p className="text-center text-[10.5px] font-bold text-muted mt-2.5">🔒 الدفع الإلكتروني عبر ميسر · بيانات التوصيل على جهازك</p>
          </div>

          <div className="bg-white border border-line rounded-3xl p-4 text-[11.5px] font-bold text-muted space-y-2">
            <p>🚚 توصيل 48 ساعة داخل الرياض · 2–4 أيام لبقية المدن</p>
            <p>↩️ استبدال خلال 14 يوم · تغليف هدايا مجاني</p>
            <p>💬 <a href="https://wa.me/966576944605" className="text-green2 hover:underline underline-offset-4">تحتاج مساعدة؟ كلّمنا واتساب</a></p>
          </div>
        </aside>
      </div>

      {/* mobile sticky total */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur border-t border-line px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-3">
        <div className="flex-1 leading-tight">
          <div className="text-[10.5px] font-bold text-muted">{t.items === 1 ? "منتج واحد" : `${t.items} منتجات`} · شامل الضريبة</div>
          <b className="text-green2 text-lg font-black">{riyal(t.total)} <span className="text-[11px] font-bold text-muted">ر.س</span></b>
        </div>
        <button type="submit" form="checkout-form" disabled={placing}
          className="bg-green2 text-cream font-black px-6 py-3 rounded-xl text-[13.5px] shadow-lg shadow-green2/20 disabled:opacity-60">
          {placing ? "جاري التجهيز…" : ONLINE.has(pay) ? "متابعة الدفع" : "أكّد الطلب"}
        </button>
      </div>
    </div>
  );
}
