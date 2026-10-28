import { Link, useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { useShop, computeTotals } from "../store";
import { PRODUCTS, FREE_SHIP, riyal } from "../data/products";

const toastRender = () => {
  const { toast } = useShop();
  return toast && (
    <div className="fixed top-4 right-4 bg-green2 text-cream px-6 py-3 rounded-3xl text-[13px] font-black shadow-lg shadow-green2/20 animate-in fade-in-0 duration-500 w-full max-w-xs z-50">
      {toast.msg}
    </div>
  );
}

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
            <button onClick={() => setQty(item.key, 1)} className="text-green2 cursor-pointer">＋</button>
            <b className="text-[13px] min-w-4 text-center">{item.qty}</b>
            <button onClick={() => setQty(item.key, -1)} className="text-green2 cursor-pointer">－</button>
          </div>
          <b className="text-[14.5px]">{riyal(p.price * item.qty)} ر.س</b>
          <button onClick={() => removeItem(item.key)} className="text-[12.5px] font-black text-muted hover:text-red-500 underline underline-offset-4">حدف</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const { cart, coupon, applyCoupon, openCheckout } = useShop();
  const { subtotal, disc, ship, total, left, items } = computeTotals({ cart, priceOf, couponOn: coupon });

  return (
    <div className="mx-auto max-w-5xl px-5 pt-14 pb-10">
      {toastRender()}
      <div className="text-center mb-10">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black">سلة المشتريات</motion.h1>
        <p className="text-muted font-bold text-sm mt-2">{items} منتجات في سلتك</p>
      </div>

      {cart.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white border border-line rounded-3xl">
          <div className="text-6xl mb-4">🛒</div>
          <p className="font-black text-xl mb-2">سلتك فاضية</p>
          <p className="text-muted font-bold text-sm mb-7">تبغى تبدأ من الصف الأول؟ تمام — عندنا كل شي.</p>
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
                💡 باقي <b>{riyal(left)} ر.س</b> ويصل تغليفك مع شحن مجانًا —googly وفر على نفسك
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
            <motion.button whileTap={{ scale: 0.97 }} onClick={openCheckout}
              className="w-full mt-6 bg-gold text-ink font-black py-4 rounded-2xl text-[15px] cursor-pointer">
              إتمام الطلب
            </motion.button>
            <Link to="/shop" className="block text-center mt-4 text-[12.5px] font-black text-cream/75 underline underline-offset-4">أكمّل تسوّقك</Link>
          </motion.aside>
        </div>
      )}
    </div>
  );
}
