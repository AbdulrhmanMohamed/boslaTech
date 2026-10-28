import { Link, useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { useShop, computeTotals } from "../store";
import { PRODUCTS, FREE_SHIP, riyal } from "../data/products";

const priceOf = (id) => PRODUCTS.find((p) => p.id === id)?.price || 0;

function Row({ item }) {
  const { setQty, removeItem } = useShop();
  const p = PRODUCTS.find((x) => x.id === item.id);
  if (!p) return null;
  return (
    <motion.div layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80, height: 0 }}
      className="flex gap-5 items-center bg-white border border-line rounded-3xl p-4">
      <Link to={`/product/${p.id}`} className="shrink-0">
        <motion.img layoutId={`pimg-${p.id}`} src={p.img} alt={p.name} className="w-24 h-24 rounded-2xl object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/product/${p.id}`} className="font-black hover:text-green2">{p.name}</Link>
        <div className="text-[12px] font-bold text-muted">
          {item.color ? `اللون ${item.color} ` : ""}{item.size || ""}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-3.5 border border-line rounded-full px-3">
            <button onClick={() => setQty(item.key, 1)} disabled={item.qty >= (p.stock ?? 99)}
              aria-label="زيادة الكمية" className="text-green2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">＋</button>
            <b className="text-[13px] min-w-4 text-center">{item.qty}</b>
            <button onClick={() => setQty(item.key, -1)} aria-label="تقليل الكمية" className="text-green2 cursor-pointer">－</button>
          </div>
          <b className="text-[14.5px]">{riyal(p.price * item.qty)} ر.س</b>
          <button onClick={() => removeItem(item.key)} className="text-[12.5px] font-black text-muted hover:text-red-500 underline underline-offset-4">حذف</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const { cart, coupon } = useShop();
  const navigate = useNavigate();
  const { subtotal, disc, ship, total, left, items } = computeTotals({ cart, priceOf, couponOn: coupon });

  return (
    <div className="mx-auto max-w-5xl px-5 pt-14 pb-28 lg:pb-10">
      <div className="text-center mb-10">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black">سلة المشتريات</motion.h1>
        <p className="text-muted font-bold text-sm mt-2">{items === 1 ? "منتج واحد" : `${items} منتجات`} في سلتك</p>
      </div>

      {cart.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white border border-line rounded-3xl">
          <div className="text-6xl mb-4">🛒</div>
          <p className="font-black text-xl mb-2">سلتك فاضية</p>
          <p className="text-muted font-bold text-sm mb-7">ما فيه مشكلة — اختر عطرك المفضل وابدأ من هنا.</p>
          <Link to="/shop" className="inline-block bg-green2 text-cream font-black px-9 py-3.5 rounded-2xl">تسوّق الآن ←</Link>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {cart.map((it) => <Row key={it.key} item={it} />)}
            </AnimatePresence>
            {left > 0 && (
              <div className="bg-sand/60 border border-gold/30 rounded-2xl p-4 text-[13px] font-extrabold text-green2 text-center">
                💡 باقي <b>{riyal(left)} ر.س</b> ويوصلك طلبك بشحن مجاني
                <div className="h-1.5 bg-line rounded-full mt-2.5 overflow-hidden max-w-sm mx-auto">
                  <motion.div className="h-full bg-gold rounded-full" initial={false} animate={{ width: `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%` }} />
                </div>
              </div>
            )}
          </div>

          <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-green2 text-cream rounded-3xl p-7 shadow-xl shadow-green2/20 sticky top-24">
            <h3 className="font-black text-lg mb-5">ملخص الطلب</h3>
            <dl className="space-y-3 text-[13.5px] font-bold text-cream/85">
              <div className="flex justify-between"><dt>المجموع</dt><dd>{riyal(subtotal)} ر.س</dd></div>
              {disc > 0 && <div className="flex justify-between text-goldsoft"><dt>{`الخصم (${coupon ? "ASL10 · 10%" : ""})`}</dt><dd>−{riyal(disc)} ر.س</dd></div>}
              <div className="flex justify-between"><dt>التوصيل</dt><dd>{ship === 0 ? "مجانًا 🎉" : `${riyal(ship)} ر.س`}</dd></div>
            </dl>
            <div className="flex justify-between mt-5 pt-4 border-t border-cream/15 font-black text-lg">
              <span>الإجمالي</span><span>{riyal(total)} ر.س</span>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-gold text-ink font-black py-4 rounded-2xl text-[15px] cursor-pointer">
              إتمام الطلب
            </motion.button>
            <Link to="/shop" className="block text-center mt-4 text-[12.5px] font-black text-cream/75 underline underline-offset-4">أكمّل تسوّقك</Link>
          </motion.aside>
        </div>
      )}

      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur border-t border-line px-4 py-3 flex items-center gap-3">
          <div className="flex-1 leading-tight">
            <div className="text-[11px] font-bold text-muted">{items === 1 ? "منتج واحد" : `${items} منتجات`}</div>
            <b className="text-green2 text-lg font-black">{riyal(total)} <span className="text-[11px] font-bold text-muted">ر.س</span></b>
          </div>
          <button onClick={() => navigate("/checkout")}
            className="bg-green2 text-cream font-black px-6 py-3 rounded-xl text-[13.5px] shadow-lg shadow-green2/20">
            إتمام الطلب
          </button>
        </div>
      )}
    </div>
  );
}
