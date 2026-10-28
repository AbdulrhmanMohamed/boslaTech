import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useShop } from "../store";
import { sendOrderEmail, verifyPayment } from "../lib/api";
import { hydrate, read, remove } from "../lib/storage";

const PENDING_KEY = "asl_pending_order";

const readPending = () => read(PENDING_KEY, null);

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { orders, placeOrder, updateOrder } = useShop();
  const [state, setState] = useState({ kind: "checking" });
  const startedRef = useRef(false);
  const paymentId = params.get("id");

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      if (!paymentId) {
        setState({ kind: "invalid" });
        return;
      }

      const pending = readPending() || (await hydrate([PENDING_KEY]))[PENDING_KEY];

      if (!pending?.order) {
        const existing = orders.find((o) => o.payment?.id === paymentId);
        if (existing) {
          navigate(`/order/${existing.id}`, { replace: true });
          return;
        }
        setState({ kind: "missing" });
        return;
      }

      try {
        const { payment } = await verifyPayment(paymentId);
        const expected = Math.round(Number(pending.order.totals?.total || 0) * 100);
        const metaOrder = payment.metadata?.order_id;
        const metaToken = payment.metadata?.order_token;

        if (payment.status !== "paid") {
          setState({ kind: "failed", payment });
          return;
        }
        if (payment.currency !== "SAR" || Number(payment.amount) !== expected) {
          setState({ kind: "mismatch", payment });
          return;
        }
        if (metaOrder && String(metaOrder) !== String(pending.order.id)) {
          setState({ kind: "mismatch", payment });
          return;
        }
        if (metaToken && String(metaToken) !== String(pending.token)) {
          setState({ kind: "mismatch", payment });
          return;
        }

        const src = payment.source || {};
        const last4 = src.type === "stcpay"
          ? String(src.mobile || "").slice(-4)
          : String(src.number || "").slice(-4);
        const label = src.type === "stcpay" ? "STC Pay — ميسر" : "بطاقة — ميسر";

        const order = {
          ...pending.order,
          pay: label,
          status: "قيد التجهيز",
          emailStatus: "sending",
          payment: {
            provider: "moyasar",
            id: payment.id,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            method: src.type || null,
            company: src.company || null,
            last4,
            message: src.message || null,
          },
        };

        remove(PENDING_KEY);
        placeOrder(order);
        setState({ kind: "done", id: order.id });

        sendOrderEmail(order.addr.email, order)
          .then(() => {
            updateOrder(order.id, { emailStatus: "sent" });
          })
          .catch((err) => {
            updateOrder(order.id, { emailStatus: err.code === "EMAIL_NOT_CONFIGURED" ? "off" : "failed" });
          });

        navigate(`/order/${order.id}`, { replace: true });
      } catch (err) {
        setState({
          kind: "verify_failed",
          code: err.code,
          message: err.message,
        });
      }
    })();
  }, [paymentId, orders, navigate, placeOrder, updateOrder]);

  if (state.kind === "checking") {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <div className="w-12 h-12 mx-auto mb-5 rounded-full border-4 border-line border-t-green2 animate-spin" />
        <h1 className="text-xl font-black mb-2">جاري التحقق من الدفع…</h1>
        <p className="text-muted font-bold text-[12.5px]">لا تغلق الصفحة، يأخذ الأمر ثوانٍ قليلة.</p>
      </div>
    );
  }

  if (state.kind === "failed") {
    return (
      <div className="mx-auto max-w-md px-5 py-28 text-center">
        <div className="text-6xl mb-5">⚠️</div>
        <h1 className="text-2xl font-black mb-2">ما تم إتمام الدفع</h1>
        <p className="text-muted font-bold text-[13px] leading-6 mb-2">
          {state.payment?.source?.message || "رفض البنك أو بوابة الدفع العملية."}
        </p>
        <p className="text-muted font-bold text-[12px] mb-7">طلبك محفوظ — تقدر تحاول مرة ثانية.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/pay" className="bg-green2 text-cream font-black px-6 py-3 rounded-2xl">حاول مرة أخرى</Link>
          <Link to="/checkout" className="border-2 border-line bg-white font-black px-6 py-3 rounded-2xl">تعديل الطلب</Link>
        </div>
      </div>
    );
  }

  if (state.kind === "mismatch") {
    return (
      <div className="mx-auto max-w-md px-5 py-28 text-center">
        <div className="text-6xl mb-5">🔎</div>
        <h1 className="text-2xl font-black mb-2">تم الدفع — لكن ما طابق الطلب</h1>
        <p className="text-muted font-bold text-[13px] leading-6 mb-7">
          تواصل معنا قبل إعادة المحاولة حتى لا يتكرر الخصم. رقم العملية: <b dir="ltr" className="text-green2">{state.payment?.id}</b>
        </p>
        <a href="https://wa.me/966576944605" className="inline-block bg-green2 text-cream font-black px-6 py-3 rounded-2xl">كلّمنا واتساب</a>
      </div>
    );
  }

  if (state.kind === "verify_failed") {
    return (
      <div className="mx-auto max-w-md px-5 py-28 text-center">
        <div className="text-6xl mb-5">📡</div>
        <h1 className="text-2xl font-black mb-2">تعذّر التحقق من الدفع</h1>
        <p className="text-muted font-bold text-[13px] leading-6 mb-7">
          {state.code === "PAYMENT_NOT_CONFIGURED"
            ? "بوابة الدفع غير مفعّلة في هذه النسخة."
            : "قد يكون الدفع تم بالفعل. لا تكرره قبل التواصل معنا."}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to={`/payment/return?id=${paymentId}`} className="bg-green2 text-cream font-black px-6 py-3 rounded-2xl">أعد التحقق</Link>
          <a href="https://wa.me/966576944605" className="border-2 border-line bg-white font-black px-6 py-3 rounded-2xl">واتساب</a>
        </div>
      </div>
    );
  }

  if (state.kind === "missing") {
    return (
      <div className="mx-auto max-w-md px-5 py-28 text-center">
        <div className="text-6xl mb-5">🔎</div>
        <h1 className="text-2xl font-black mb-2">ما لقينا بيانات العملية</h1>
        <p className="text-muted font-bold text-[13px] leading-6 mb-7">إذا تم الخصم، أرسل لنا رقم العملية: <b dir="ltr" className="text-green2">{paymentId}</b></p>
        <a href="https://wa.me/966576944605" className="inline-block bg-green2 text-cream font-black px-6 py-3 rounded-2xl">تواصل معنا</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-28 text-center">
      <div className="text-6xl mb-5">💳</div>
      <h1 className="text-2xl font-black mb-2">رابط دفع غير صالح</h1>
      <p className="text-muted font-bold text-[13px] leading-6 mb-7">ارجع للطلب وحاول مرة ثانية.</p>
      <Link to="/checkout" className="inline-block bg-green2 text-cream font-black px-6 py-3 rounded-2xl">رجوع للطلب</Link>
    </div>
  );
}
