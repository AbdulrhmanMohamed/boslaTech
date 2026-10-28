import { useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { useShop } from "../store";
import { PRODUCTS, riyal } from "../data/products";
import { sendOrderEmail } from "../lib/api";

const ETA = {
  الرياض: "24–48 ساعة",
  جدة: "2–3 أيام عمل",
  الدمام: "2–3 أيام عمل",
  الخبر: "2–3 أيام عمل",
  "مكة المكرمة": "2–4 أيام عمل",
  "المدينة المنورة": "2–4 أيام عمل",
  أخرى: "3–5 أيام عمل",
};

const priceOf = (id) => PRODUCTS.find((p) => p.id === id)?.price || 0;

export default function OrderConfirmation() {
  const { id } = useParams();
  const { orders, user, openAuth, updateOrder } = useShop();
  const order = orders.find((o) => o.id === id);
  const [mail, setMail] = useState(null);
  const mailStatus = mail || order?.emailStatus;

  const resend = async () => {
    setMail("sending");
    try {
      await sendOrderEmail(order.addr.email, order);
      updateOrder(order.id, { emailStatus: "sent" });
      setMail("sent");
    } catch (err) {
      const status = err.code === "EMAIL_NOT_CONFIGURED" ? "off" : "failed";
      updateOrder(order.id, { emailStatus: status });
      setMail(status);
    }
  };

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <div className="text-6xl mb-5">🔎</div>
        <h1 className="text-2xl font-black mb-2">ما لقينا هذا الطلب</h1>
        <p className="text-muted font-bold text-[13.5px] mb-7">تأكد من رقم الطلب أو ارجع لسلة مشترياتك.</p>
        <Link to="/shop" className="inline-block bg-green2 text-cream font-black px-8 py-3.5 rounded-2xl">تسوّق الآن ←</Link>
      </div>
    );
  }

  const steps = ["قيد التجهيز", "تم الشحن", "تم التوصيل"];

  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-24">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green2 text-cream grid place-items-center text-4xl shadow-xl shadow-green2/25">✓</div>
        <h1 className="text-3xl md:text-4xl font-black">تم استلام طلبك</h1>
        <p className="text-muted font-bold mt-2">رقم الطلب <b dir="ltr" className="text-green2">{order.id}</b></p>
      </motion.div>

      <div className="mt-10 bg-white border border-line rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <h2 className="font-black text-lg">تفاصيل الطلب</h2>
          <span className="text-[12px] font-black px-3 py-1.5 rounded-full bg-goldsoft text-ink">{order.status}</span>
        </div>

        <div className="space-y-3 mb-6">
          {order.items.map((i) => (
            <div key={`${i.id}-${i.size}-${i.color}`} className="flex items-center gap-3">
              <img src={PRODUCTS.find((p) => p.id === i.id)?.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <b className="text-[13px] block truncate">{i.name}</b>
                <span className="text-[11.5px] font-bold text-muted">{[i.size, i.color].filter(Boolean).join(" · ")}</span>
              </div>
              <span className="text-[12px] font-black text-muted">×{i.qty}</span>
              <b className="text-[13px] text-green2">{riyal((i.price ?? priceOf(i.id)) * i.qty)} ر.س</b>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-[12.5px] font-bold">
          <div className="bg-cream rounded-2xl p-4">
            <span className="text-muted block mb-1">التوصيل إلى</span>
            <b>{order.addr.name} · {order.addr.phone}</b>
            <p className="text-muted mt-1">{order.addr.city} — {order.addr.district}، {order.addr.street}</p>
            {order.addr.email && <p className="text-muted mt-1" dir="ltr">{order.addr.email}</p>}
            {order.addr.notes && <p className="text-muted mt-1">📝 {order.addr.notes}</p>}
            <p className="text-green2 mt-2">⏱ متوقع خلال {ETA[order.addr.city] || ETA["أخرى"]}</p>
          </div>
          <div className="bg-cream rounded-2xl p-4">
            <span className="text-muted block mb-1">الدفع</span>
            <b>{order.pay}</b>
            {order.payment?.status === "paid" && (
              <span className="inline-block ms-2 text-[10px] font-black text-green2 bg-white border border-green2/25 rounded-full px-2 py-0.5">مدفوع ✓</span>
            )}
            {order.payment?.last4 && <p className="text-muted mt-1" dir="ltr">•••• {order.payment.last4}</p>}
            <div className="flex justify-between mt-2 pt-2 border-t border-line">
              <span className="text-muted">الإجمالي</span>
              <b className="text-green2 text-base">{riyal(order.totals.total)} ر.س</b>
            </div>
          </div>
        </div>

        {order.payment?.status === "paid" && (
          <div className="mt-4 bg-white border border-green2/25 rounded-2xl p-4 text-[12px] font-bold leading-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-green2">💳 تم الدفع إلكترونيًا عبر ميسر</span>
              <span className="text-[10.5px] text-muted">رقم العملية <b dir="ltr" className="text-ink">{order.payment.id}</b></span>
            </div>
            <p className="text-muted mt-1">المبلغ المدفوع {riyal(order.payment.amount / 100)} ر.س{order.payment.company ? ` · ${order.payment.company}` : ""}</p>
          </div>
        )}

        {order.pay === "تحويل بنكي" && (
          <div className="mt-4 bg-white border border-gold/40 rounded-2xl p-4 text-[12.5px] font-bold leading-6">
            🏦 حوّل على: <b dir="ltr">SA03 8000 0000 6080 1075 1900</b>
            <br />حساب وهمي للعرض فقط — ما يصير أي تحويل حقيقي.
          </div>
        )}

        {order.addr.email && (
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap bg-cream/70 border border-line rounded-2xl px-4 py-3">
            <p className="text-[11.5px] font-bold text-muted leading-5">
              {mailStatus === "sending" && <>📮 جاري إرسال تأكيد الطلب إلى <b dir="ltr" className="text-ink">{order.addr.email}</b>…</>}
              {mailStatus === "sent" && <>📧 أرسلنا تأكيد الطلب إلى <b dir="ltr" className="text-ink">{order.addr.email}</b></>}
              {mailStatus === "off" && <>📧 تم حفظ طلبك — خدمة البريد غير مفعّلة في هذه النسخة.</>}
              {mailStatus === "failed" && <>📧 تعذّر إرسال التأكيد إلى <b dir="ltr" className="text-ink">{order.addr.email}</b>.</>}
              {!mailStatus && <>📧 أرسل نسخة من الطلب إلى <b dir="ltr" className="text-ink">{order.addr.email}</b>.</>}
            </p>
            {mailStatus !== "sending" && (
              <button onClick={resend} className="text-[11px] font-black text-green2 border border-green2/30 rounded-lg px-2.5 py-1.5">
                {mailStatus === "sent" ? "إعادة الإرسال" : "حاول الإرسال"}
              </button>
            )}
          </div>
        )}

        <div className="mt-7 flex items-center gap-2" dir="rtl">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i === 0 ? "bg-gold" : "bg-line"}`} />
              <span className={`block mt-2 text-[10.5px] font-black ${i === 0 ? "text-ink" : "text-muted"}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {user ? (
          <Link to="/account" className="flex-1 min-w-40 text-center bg-green2 text-cream font-black py-3.5 rounded-2xl">تتبع الطلب في حسابي</Link>
        ) : (
          <button onClick={openAuth} className="flex-1 min-w-40 bg-green2 text-cream font-black py-3.5 rounded-2xl">أنشئ حسابًا وتابع طلبك</button>
        )}
        <Link to="/shop" className="flex-1 min-w-40 text-center border-2 border-line bg-white font-black py-3.5 rounded-2xl">كمّل تسوّق</Link>
      </div>

      <p className="text-center text-[11.5px] font-bold text-muted mt-6">
        متجر تجريبي — المدفوعات في وضع الاختبار ولا تُخصم مبالغ حقيقية. للاستفسار: <a href="https://wa.me/966576944605" className="text-green2 underline underline-offset-4">واتساب</a>
      </p>
    </div>
  );
}
