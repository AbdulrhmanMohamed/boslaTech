import { Link } from "react-router";
import { motion } from "motion/react";
import { useShop } from "../store";
import { riyal } from "../data/products";

const STATUSES = ["قيد التجهيز", "تم الشحن", "تم التوصيل"];

export default function Account() {
  const { user, openAuth, orders, updateUser, logout } = useShop();

  // If user is not logged in, show login prompt and return early
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-6xl mb-5">🔐</motion.div>
        <h1 className="text-2xl font-black mb-2">حسابك ينتظرك</h1>
        <p className="text-muted font-bold text-[13.5px] mb-7 leading-7">سجّل أولًا — حساب تجريبي بأي رقم سعودي (05xxxxxxxx) وكلمة سر، بدقائق تلقى طلباتك وملفك الشخصي.</p>
        <motion.button whileTap={{ scale: 0.96 }} onClick={openAuth} className="bg-green2 text-cream font-black px-8 py-3.5 rounded-2xl cursor-pointer shadow-lg shadow-green2/20">فتح التسجيل</motion.button>
      </div>
    );
  }

  const patch = ["name", "phone", "email", "city", "district", "street"];

  return (
    <div className="mx-auto max-w-4xl px-5 pt-10 pb-24">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="text-[12px] font-black text-gold mb-1">✦ حسابي</p>
          <h1 className="text-2xl md:text-3xl font-black">يا هلا {user.name} 👋</h1>
        </div>
        <button onClick={logout} className="text-[12.5px] font-black text-muted hover:text-red-500 border border-line bg-white rounded-2xl px-5 py-2.5 cursor-pointer transition-colors">
          تسجيل خروج
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* profile */}
        <section className="bg-white border border-line rounded-3xl p-6">
          <h2 className="font-black text-[15px] mb-4">بيانات التوصيل</h2>
          <div className="space-y-3">
            <label className="block"><span className="text-[11.5px] font-black text-muted">الاسم</span>
              <input defaultValue={user.name} id="up-name" className="mt-1 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13.5px] font-bold outline-none focus:border-green2" /></label>
            <label className="block"><span className="text-[11.5px] font-black text-muted">الجوال</span>
              <input defaultValue={user.phone} id="up-phone" dir="ltr" className="mt-1 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13.5px] font-bold text-left outline-none focus:border-green2" /></label>
            <label className="block"><span className="text-[11.5px] font-black text-muted">البريد الإلكتروني</span>
              <input defaultValue={user.email} id="up-email" dir="ltr" type="email" className="mt-1 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13.5px] font-bold text-left outline-none focus:border-green2" placeholder="name@example.com" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-[11.5px] font-black text-muted">المدينة</span>
                <input defaultValue={user.city} id="up-city" className="mt-1 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13.5px] font-bold outline-none focus:border-green2" /></label>
              <label className="block"><span className="text-[11.5px] font-black text-muted">الحي</span>
                <input defaultValue={user.district} id="up-district" className="mt-1 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13.5px] font-bold outline-none focus:border-green2" /></label>
            </div>
            <label className="block"><span className="text-[11.5px] font-black text-muted">الشارع</span>
              <input defaultValue={user.street} id="up-street" className="mt-1 w-full bg-cream border border-line rounded-2xl px-4 py-3 text-[13.5px] font-bold outline-none focus:border-green2" /></label>
          </div>
          <button
            onClick={() => updateUser(patch.reduce((a, k) => ({ ...a, [k]: document.getElementById(`up-${k}`).value.trim() }), {}))}
            className="mt-4 w-full bg-green2 text-cream font-black py-3 rounded-2xl cursor-pointer text-[13px]">
            حفظ التعديلات
          </button>
        </section>

        {/* orders */}
        <section className="bg-white border border-line rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-[15px]">طلباتك</h2>
            <span className="text-[11px] font-black text-muted">{orders.length} طلب</span>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-muted font-bold text-[13px] mb-4">ما فيه طلبات بعد — عطورنا تنتظرك في المتجر.</p>
              <Link to="/shop" className="inline-block text-gold font-black text-[12.5px] underline underline-offset-4">تسوّق الآن ←</Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-104 overflow-y-auto no-scrollbar">
              {orders.map((o, i) => (
                <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border border-line rounded-2xl p-4 bg-cream/70">
                  <div className="flex items-center justify-between mb-2">
                    <b dir="ltr" className="text-[12.5px] font-black">{o.id}</b>
                    <span className="text-[10.5px] font-black px-2.5 py-1 rounded-full bg-goldsoft text-ink">
                      {STATUSES[Math.min(orders.length - 1 - i, STATUSES.length - 1)]}
                    </span>
                  </div>
                  <p className="text-[12px] font-bold text-muted leading-5 mb-2">
                    {o.items.map((it) => `${it.name} ×${it.qty}`).join(" · ")}
                  </p>
                  <div className="flex justify-between text-[12.5px] font-black">
                    <span className="text-muted">{new Date(o.ts).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { day: "numeric", month: "long" })}</span>
                    <b className="text-green2">{riyal(o.totals.total)} ر.س</b>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}