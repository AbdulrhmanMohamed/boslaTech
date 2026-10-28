import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useShop, computeTotals } from "../store";
import useDialogBehavior from "../hooks/useDialogBehavior";
import { PRODUCTS, FREE_SHIP, riyal } from "../data/products";

const priceOf = (id) => PRODUCTS.find((p) => p.id === id)?.price || 0;
const pOf = (id) => PRODUCTS.find((p) => p.id === id);

export default function CartDrawer() {
  const { cart, coupon, drawer, closeDrawer, setQty, removeItem, applyCoupon } = useShop();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  useDialogBehavior(drawer, closeDrawer);
  const goCheckout = () => { closeDrawer(); navigate("/checkout"); };
  const { subtotal, disc, ship, total, left, items } = computeTotals({ cart, priceOf, couponOn: coupon });

  const tryCoupon = () => {
    const ok = applyCoupon(code);
    setMsg(ok ? { ok: true, t: "تم تطبيق خصم 10% ✓" } : { ok: false, t: `كود غير صالح — جرّب ASL10` });
  };

  return (
    <AnimatePresence>
      {drawer && (
        <div className="fixed inset-0 z-[70]">
          <motion.div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={closeDrawer}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute top-0 bottom-0 left-0 w-[min(420px,100vw)] bg-cream flex flex-col shadow-2xl"
            role="dialog" aria-modal="true" aria-label="سلة المشتريات" dir="rtl"
          >
            <div className="flex items-center justify-between p-5 border-b border-line">
              <h3 className="font-black text-lg">سلتك <span className="text-muted font-bold text-sm">({items})</span></h3>
              <button onClick={closeDrawer} className="w-9 h-9 grid place-items-center rounded-xl bg-white border border-line">✕</button>
            </div>

            {/* free-shipping progress */}
            {cart.length > 0 && (
              <div className={`px-5 py-3 border-b border-line text-xs font-extrabold ${left > 0 ? "text-muted" : "text-green2"}`}>
                {left > 0
                  ? <>التوصيل مجاني فوق {FREE_SHIP} ر.س — باقي <b className="text-gold">{riyal(left)} ر.س</b>
                      <div className="h-1.5 bg-line rounded-full mt-1.5 overflow-hidden">
                        <motion.div className="h-full bg-gold rounded-full" initial={false}
                          animate={{ width: `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                      </div>
                    </>
                  : <span className="inline-block">🎉 مبروك — التوصيل على حسابنا</span>}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 && (
                <div className="h-full grid place-content-center text-center gap-3 text-muted">
                  <div className="text-5xl">🛒</div>
                  <p className="font-extrabold">سلتك فاضية</p>
                  <Link to="/shop" onClick={closeDrawer} className="text-gold font-black underline underline-offset-4">تسوّق الآن</Link>
                </div>
              )}
              <AnimatePresence initial={false}>
                {cart.map((it) => {
                  const p = pOf(it.id);
                  if (!p) return null;
                  return (
                    <motion.div key={it.key} layout
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -60, height: 0, marginTop: 0 }}
                      className="flex gap-3 bg-white border border-line rounded-2xl p-2.5"
                    >
                      <Link to={`/product/${p.id}`} onClick={closeDrawer} className="shrink-0">
                        <motion.img layoutId={`pimg-${p.id}`} src={p.img} alt={p.name} className="w-[74px] h-[74px] rounded-xl object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-[13.5px] font-black truncate">{p.name}</h4>
                            <small className="text-muted font-bold">
                              {it.size ? `${it.size} ` : ""}{it.color !== undefined && it.color !== null ? it.color : ""}
                            </small>
                          </div>
                          <button className="text-muted hover:text-ink" onClick={() => removeItem(it.key)}>✕</button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2.5 border border-line rounded-full px-2.5 py-0.5">
                            <button onClick={() => setQty(it.key, 1)} disabled={it.qty >= (p.stock ?? 99)}
                              aria-label="زيادة الكمية" className="text-green2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">＋</button>
                            <b className="text-[13px] min-w-4 text-center">{it.qty}</b>
                            <button onClick={() => setQty(it.key, -1)} aria-label="تقليل الكمية" className="text-green2 cursor-pointer">－</button>
                          </div>
                          <b className="text-[13.5px]">{riyal(p.price * it.qty)} ر.س</b>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {cart.length > 0 && (
              <div className="border-t border-line bg-white p-5">
                <div className="flex gap-2">
                  <input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr"
                    className="flex-1 border border-line rounded-xl px-3 text-[13px] font-bold outline-none focus:border-gold"
                    placeholder="كود الخصم (ASL10)" onKeyDown={(e) => e.key === "Enter" && tryCoupon()} />
                  <button onClick={tryCoupon} className="bg-sand rounded-xl px-4 font-black text-green2">تطبيق</button>
                </div>
                {msg && <p className={`text-[12px] font-extrabold mt-1.5 ${msg.ok ? "text-green2" : "text-red-500"}`}>{msg.t}</p>}

                <dl className="mt-3 text-[13px] font-bold text-muted space-y-1.5">
                  <div className="flex justify-between"><dt>المجموع</dt><dd>{riyal(subtotal)} ر.س</dd></div>
                  {disc > 0 && <div className="flex justify-between text-gold"><dt>الخصم (10%)</dt><dd>−{riyal(disc)} ر.س</dd></div>}
                  <div className="flex justify-between"><dt>التوصيل</dt><dd>{ship === 0 ? "مجانًا" : `${riyal(ship)} ر.س`}</dd></div>
                </dl>
                <div className="flex justify-between mt-2 pt-2.5 border-t border-line font-black text-base">
                  <dt>الإجمالي</dt><dd>{riyal(total)} ر.س</dd>
                </div>
                <div className="flex gap-1.5 justify-center my-3" dir="ltr">
                  {["mada", "Apple Pay", "Visa", "Mastercard"].map((c) => (
                    <span key={c} className="border border-line rounded-lg px-2 py-0.5 text-[10.5px] font-extrabold text-muted">{c}</span>
                  ))}
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={goCheckout}
                  className="w-full bg-green2 text-cream font-black py-3.5 rounded-2xl cursor-pointer">
                  إتمام الطلب
                </motion.button>
                <p className="text-center text-[11px] text-muted font-bold mt-2">متجر تجريبي — الدفع غير مفعّل</p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
