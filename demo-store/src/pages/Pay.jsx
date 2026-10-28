import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { riyal } from "../data/products";
import { hydrate, read, write } from "../lib/storage";

const PENDING_KEY = "asl_pending_order";
const JS_URL = "https://cdn.moyasar.com/mpf/1.16.0/moyasar.js";
const CSS_URL = "https://cdn.moyasar.com/mpf/1.16.0/moyasar.css";

const readPending = () => read(PENDING_KEY, null);

const METHOD = { card: "creditcard", stcpay: "stcpay" };

function loadMoyasar() {
  if (window.Moyasar) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (!document.querySelector("link[data-moyasar]")) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = CSS_URL;
      css.dataset.moyasar = "1";
      document.head.appendChild(css);
    }
    let script = document.querySelector("script[data-moyasar]");
    if (!script) {
      script = document.createElement("script");
      script.src = JS_URL;
      script.async = true;
      script.dataset.moyasar = "1";
      document.head.appendChild(script);
    }
    if (window.Moyasar) return resolve();
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("MOYASAR_LOAD_FAILED")), { once: true });
  });
}

export default function Pay() {
  const [pending, setPending] = useState(readPending);
  const [restored, setRestored] = useState(() => !!readPending());
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("loading");
  const boxRef = useRef(null);
  const startedRef = useRef(false);

  const publicKey = import.meta.env.VITE_MOYASAR_PUBLIC_KEY || "";
  const method = pending ? METHOD[pending.payKey] : null;
  const amount = pending ? Math.round(Number(pending.order?.totals?.total || 0) * 100) : 0;

  useEffect(() => {
    if (pending || restored) return;
    let alive = true;
    hydrate([PENDING_KEY])
      .then((saved) => {
        if (!alive) return;
        if (saved[PENDING_KEY]) setPending(saved[PENDING_KEY]);
      })
      .catch(() => {})
      .finally(() => { if (alive) setRestored(true); });
    return () => { alive = false; };
  }, [pending, restored]);

  useEffect(() => {
    if (!pending || !method || amount < 100) return;
    if (!publicKey || !publicKey.startsWith("pk_")) {
      setError("PAYMENT_NOT_CONFIGURED");
      setStatus("error");
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        await loadMoyasar();
        if (!boxRef.current?.isConnected) return;
        boxRef.current.innerHTML = "";
        window.Moyasar.init({
          element: boxRef.current,
          amount,
          currency: "SAR",
          description: `طلب أصل ${pending.order.id}`,
          publishable_api_key: publicKey,
          callback_url: `${window.location.origin}/payment/return`,
          methods: [method],
          supported_networks: method === "creditcard" ? ["mada", "visa", "mastercard"] : undefined,
          language: "ar",
          fixed_width: false,
          metadata: {
            order_id: pending.order.id,
            order_token: pending.token,
          },
          on_completed: async (payment) => {
            try {
              const latest = readPending();
              if (latest?.token === pending.token) {
                write(PENDING_KEY, { ...latest, paymentId: payment?.id || null });
              }
            } catch {}
            setStatus("redirecting");
          },
          on_failure: (message) => {
            setError(typeof message === "string" ? message : "PAYMENT_FAILED");
            setStatus("error");
          },
        });
        setStatus("ready");
      } catch {
        setError("PAYMENT_LOAD_FAILED");
        setStatus("error");
      }
    })();
  }, [pending, method, amount, publicKey]);

  if (!pending?.order && !restored) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <div className="w-12 h-12 mx-auto mb-5 rounded-full border-4 border-line border-t-green2 animate-spin" />
        <h1 className="text-xl font-black mb-2">جاري تجهيز الدفع…</h1>
      </div>
    );
  }

  if (!pending?.order) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <div className="text-6xl mb-5">💳</div>
        <h1 className="text-2xl font-black mb-2">ما فيه عملية دفع جاهزة</h1>
        <p className="text-muted font-bold text-[13.5px] mb-7">ارجع للسلة وأكمل بيانات الطلب أولًا.</p>
        <Link to="/checkout" className="inline-block bg-green2 text-cream font-black px-8 py-3.5 rounded-2xl">رجوع لإتمام الطلب ←</Link>
      </div>
    );
  }

  const o = pending.order;
  const isTest = publicKey.startsWith("pk_test_");

  if (amount < 100) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <h1 className="text-2xl font-black mb-2">مبلغ الطلب غير صالح</h1>
        <p className="text-muted font-bold text-[13.5px] mb-7">الحد الأدنى للدفع الإلكتروني هو 1 ريال.</p>
        <Link to="/checkout" className="inline-block bg-green2 text-cream font-black px-8 py-3.5 rounded-2xl">رجوع للطلب ←</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-24">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <p className="text-[12px] font-black text-gold mb-1">✦ دفع آمن</p>
          <h1 className="text-3xl font-black">إتمام الدفع</h1>
          <p className="text-[12.5px] font-bold text-muted mt-1">
            الطلب <b dir="ltr" className="text-green2">{o.id}</b> · {o.items.length === 1 ? "منتج واحد" : `${o.items.length} منتجات`}
          </p>
        </div>
        <Link to="/checkout" className="text-[12.5px] font-black text-muted border border-line bg-white rounded-2xl px-4 py-2.5 hover:text-green2 transition-colors">
          تعديل الطلب
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <section className="bg-white border border-line rounded-3xl p-5 md:p-7">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div>
              <h2 className="font-black text-[16px]">الدفع عبر ميسر</h2>
              <p className="text-[11.5px] font-bold text-muted mt-0.5">
                {method === "stcpay" ? "STC Pay" : "مدى · Visa · Mastercard"}
              </p>
            </div>
            <span className="text-[10.5px] font-black text-green2 bg-sand/70 border border-green2/15 rounded-full px-3 py-1.5">
              🔒 اتصال مشفّر
            </span>
          </div>

          {status === "error" && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-700">
              {error === "PAYMENT_NOT_CONFIGURED"
                ? "بوابة الدفع غير مفعّلة في هذه النسخة."
                : error === "PAYMENT_LOAD_FAILED"
                  ? "تعذّر تحميل نموذج الدفع. تحقق من اتصالك وحاول تحديث الصفحة."
                  : error || "تعذّر إتمام الدفع. حاول مرة أخرى."}
            </div>
          )}

          {status === "loading" && (
            <div className="min-h-44 grid place-items-center text-[12.5px] font-black text-muted">
              جاري تجهيز بوابة الدفع…
            </div>
          )}

          {status === "redirecting" && (
            <div className="mb-4 rounded-2xl border border-green2/20 bg-sand/50 px-4 py-3 text-[12px] font-bold text-green2">
              تم إنشاء العملية — جاري تأكيد الدفع…
            </div>
          )}

          <div ref={boxRef} className="mysr-form min-h-44" />

          {isTest && status !== "redirecting" && (
            <div className="mt-4 rounded-2xl border border-gold/40 bg-goldsoft/30 px-4 py-3 text-[11px] font-bold leading-6 text-muted">
              {method === "creditcard" ? (
                <>
                  <b className="text-ink">وضع تجريبي:</b> استخدم بطاقة <b dir="ltr" className="text-ink">4111 1111 1111 1111</b>، تاريخ مستقبلي، وCVC <b dir="ltr" className="text-ink">123</b>. لا تُخصم مبالغ حقيقية.
                  <br />إذا ظهرت صفحة محاكاة 3D Secure، اختر <b dir="ltr" className="text-ink">(Y)</b> ثم اضغط <b dir="ltr" className="text-ink">Submit</b>.
                </>
              ) : (
                <><b className="text-ink">وضع تجريبي:</b> استخدم رقم جوال سعودي واتبع خطوات التحقق في نافذة STC Pay. لا تُخصم مبالغ حقيقية.</>
              )}
            </div>
          )}

          <p className="text-[10.5px] font-bold text-muted mt-4 leading-5">
            بيانات البطاقة أو المحفظة تُدخل مباشرة في نموذج ميسر ولا تمر عبر متجر أصل.
          </p>
        </section>

        <aside className="lg:sticky lg:top-24 bg-white border border-line rounded-3xl p-5">
          <h2 className="font-black text-[15px] mb-4">ملخص الدفع</h2>
          <div className="space-y-2.5">
            {o.items.map((i) => (
              <div key={`${i.id}-${i.size}-${i.color}`} className="flex items-start justify-between gap-3 text-[12px] font-bold">
                <span className="min-w-0">
                  <b className="block truncate">{i.name}</b>
                  <span className="text-[10.5px] text-muted">{[i.size, i.color].filter(Boolean).join(" · ")} · ×{i.qty}</span>
                </span>
                <b className="shrink-0">{riyal(i.price * i.qty)}</b>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-line space-y-2 text-[12px] font-bold text-muted">
            <div className="flex justify-between"><span>المجموع</span><span>{riyal(o.totals.subtotal)} ر.س</span></div>
            {o.totals.disc > 0 && <div className="flex justify-between text-green2"><span>الخصم</span><span>−{riyal(o.totals.disc)} ر.س</span></div>}
            <div className="flex justify-between"><span>الشحن</span><span>{o.totals.ship ? `${riyal(o.totals.ship)} ر.س` : "مجانًا"}</span></div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-line font-black text-lg">
            <span>الإجمالي</span>
            <span className="text-green2">{riyal(o.totals.total)} <span className="text-[11px] text-muted">ر.س</span></span>
          </div>
          <div className="mt-4 bg-cream rounded-2xl p-3 text-[11px] font-bold leading-5 text-muted">
            <b className="block text-ink mb-1">التوصيل إلى</b>
            {o.addr.name} · {o.addr.phone}
            <br />{o.addr.city} — {o.addr.district}، {o.addr.street}
          </div>
        </aside>
      </div>
    </div>
  );
}
