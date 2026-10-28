import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useShop } from "../store";
import { PRODUCTS, CATEGORIES, GALLERY_MAP, riyal, catName, FREE_SHIP } from "../data/products";
import ProductCard from "../components/ProductCard";

const gallery2 = (p) => {
  const g = GALLERY_MAP[p.cat] || [];
  return [p.img, ...g.filter((u) => u !== p.img).slice(0, 2)];
};

export default function Product() {
  const { id } = useParams();
  const p = PRODUCTS.find((x) => x.id === Number(id));
  const { addToCart, toggleWish, wish } = useShop();

  const [gal, setGal] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");

  useEffect(() => {
    setGal(0); setColor(0); setQty(1); setTab("desc");
    setSize(p?.sizes ? null : undefined);
  }, [id]);

  useEffect(() => { if (p?.sizes) setColor(0); }, [id]);

  // image drag/swipe
  const imgs = useMemo(() => (p ? gallery2(p) : []), [p]);
  const dragX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const xDrag = useTransform(dragX, (v) => `translateX(${v}px)`);

  const onDragEnd = () => {
    if (dragX.get() > 70) setGal((g) => (g + imgs.length - 1) % imgs.length);
    if (dragX.get() < -70) setGal((g) => (g + 1) % imgs.length);
    dragX.set(0);
  };

  if (!p) return (
    <div className="py-40 text-center">
      <p className="font-black text-2xl mb-3">المنتج غير موجود</p>
      <Link to="/shop" className="text-gold font-black underline underline-offset-4">رجع للمتجر</Link>
    </div>
  );

  const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  const wished = wish.includes(p.id);
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  const add = () => {
    addToCart(p, { color: p.colors ? p.colors[color] : undefined, size: size || (p.sizes ? p.sizes[0] : undefined) });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 overflow-clip">
      {/* breadcrumbs */}
      <div className="text-[12.5px] font-bold text-muted mb-8 flex gap-2 items-center">
        <Link to="/" className="hover:text-green2">الرئيسية</Link> /
        <Link to="/shop" className="hover:text-green2">المتجر</Link> /
        <Link to={`/shop?cat=${p.cat}`} className="hover:text-green2">{catName(p.cat)}</Link> /
        <span className="text-ink font-black">{p.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* gallery */}
        <div>
          <motion.div
            drag="x" dragConstraints={{ left: 0, right: 0 }} style={{ x: xDrag }} onDragEnd={onDragEnd}
            onDragStart={() => dragX.set(0)}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-line cursor-grab active:cursor-grabbing touch-pan-y select-none"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img key={gal} src={imgs[gal]} alt={p.name}
                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable="false" />
            </AnimatePresence>
            {off > 0 && <span className="absolute top-4 right-4 bg-gold text-white text-xs font-black px-3 py-1.5 rounded-full shadow">خصم {off}%</span>}
          </motion.div>

          <div className="flex gap-3 mt-4">
            {imgs.map((u, i) => (
              <button key={i} onClick={() => setGal(i)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors cursor-pointer ${gal === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={u} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
            <div className="self-center text-muted text-[11px] font-bold mr-auto max-sm:hidden">اسحب الصور ←</div>
          </div>
        </div>

        {/* info */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center justify-between text-[12px] font-black text-gold mb-2">
            <span>✦ {catName(p.cat)}</span>
            <span className="text-ink">★ {p.rating} ({p.reviews} تقييم)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black leading-snug">{p.name}</h1>
          <p className="text-muted font-bold mt-2">{p.brief}</p>

          <div className="flex items-baseline gap-3 mt-5">
            <b className="text-green2 text-3xl font-black">{riyal(p.price)}</b>
            <span className="font-bold text-muted">ر.س</span>
            {p.old && <s className="text-muted">{riyal(p.old)}</s>}
          </div>

          {p.colors && (
            <>
              <div className="font-black text-[13px] mt-7 mb-2">اللون: <span className="text-muted font-bold">اختر اللي يشبه مزاجك</span></div>
              <div className="flex gap-2.5">
                {p.colors.map((c, i) => (
                  <motion.button key={c} whileTap={{ scale: 0.85 }}
                    onClick={() => setColor(i)}
                    className={`w-9 h-9 rounded-full cursor-pointer shadow-inner transition-all ${color === i ? "ring-2 ring-green2 ring-offset-2 ring-offset-cream scale-110" : "opacity-80 hover:opacity-100"}`}
                    style={{ background: c }} aria-label={`لون ${i + 1}`} />
                ))}
              </div>
            </>
          )}

          {p.sizes && (
            <>
              <div className="font-black text-[13px] mt-7 mb-2">الحجم</div>
              <div className="flex gap-2.5">
                {p.sizes.map((s, i) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-xl text-[13px] font-black border-2 cursor-pointer transition-colors ${(size === undefined ? i === 0 : size === s) ? "bg-green2 text-cream border-green2" : "border-line bg-white text-muted hover:border-green2"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* qty + add + wish */}
          <div className="flex gap-3 mt-8">
            <div className="flex items-center gap-4 border border-line bg-white rounded-2xl px-4">
              <button onClick={() => setQty((v) => Math.max(1, v + 1))} className="text-green2 text-lg cursor-pointer">＋</button>
              <b className="min-w-6 text-center">{qty}</b>
              <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="text-green2 text-lg cursor-pointer">－</button>
            </div>
            <motion.button whileTap={{ scale: 0.96 }} onClick={add}
              className="flex-1 bg-green2 text-cream font-black py-3.5 rounded-2xl hover:bg-green transition-colors cursor-pointer text-[15px] shadow-lg shadow-green2/20 glow-button">
              أضف للسلة — {riyal(p.price * qty)} ر.س
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleWish(p)}
              className={`w-14 grid place-items-center rounded-2xl border border-line bg-white text-2xl cursor-pointer hover-glow ${wished ? "text-red-500" : "text-muted hover:text-red-400"}`}>
              {wished ? "♥" : "♡"}
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-[12px] font-extrabold text-muted">
            <span>🚚 توصيل 48 ساعة — مجانًا فوق {FREE_SHIP} ر.س</span>
            <span>↩️ استبدال 14 يوم</span>
            <span>🔒 دفع مدى · Apple Pay</span>
          </div>

          {/* tabs */}
          <div className="mt-10 border border-line rounded-3xl bg-white overflow-hidden">
            <div className="flex border-b border-line">
              {[["desc", "الوصف"], ["details", "التفاصيل"], ["reviews", `التقييمات (${p.reviews})`]].map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`relative flex-1 py-3.5 text-[13px] font-black cursor-pointer transition-colors ${tab === k ? "text-green2" : "text-muted hover:text-ink"}`}>
                  {tab === k && <motion.span layoutId="ptab" className="absolute bottom-0 inset-x-6 h-[3px] bg-gold rounded-full" />}
                  {l}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="p-6">
                {tab === "desc" && <p className="text-[14px] font-bold leading-8 text-ink/85">{p.desc}</p>}
                {tab === "details" && (
                  <ul className="space-y-2.5 text-[13.5px] font-bold text-ink/85">
                    {p.details.map((d) => <li key={d} className="flex gap-2.5"><span className="text-gold">✓</span>{d}</li>)}
                  </ul>
                )}
                {tab === "reviews" && <Reviews name={p.name} rating={p.rating} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* related */}
      <section className="pt-24">
        <div className="flex items-end justify-between mb-7">
          <h2 className="text-2xl font-black">قد يعجبك هذي كذلك</h2>
          <Link to={`/shop?cat=${p.cat}`} className="text-[13px] font-black text-gold underline underline-offset-4">شوف الكل ←</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {related.map((r, i) => <ProductCard key={r.id} p={r} i={i} />)}
        </div>
      </section>
    </div>
  );
}

function Reviews({ name, rating }) {
  const { reviews, addUserReview, user, ping } = useShop();
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [nick, setNick] = useState("");
  const mine = reviews[name] || [];

  const samples = [
    { n: "عبدالرحمن", t: "صار عندي ثقة من أول طلب — الجودة مثل اللي بالوصف needless بالظبط.", r: 5 },
    { n: "أمل", t: "التغليف فخم، يناسب الهدية مباشرة بدون تعب. الشكل خرافي.", r: 5 },
    { n: "خالد", t: "الرائحة ثابتة وتكفي طويلاً. لأول تجربة أونلاين، ما قصرو.", r: 4 },
  ];
  const bars = [72, 40, 12, 4, 6].reverse();
  return (
    <div>
      {/* add a review */}
      <div className="border border-line rounded-2xl bg-sand/50 p-4 mb-5">
        <b className="text-[13px] block mb-3">قيّم هذ المنتج ✦</b>
        <div className="flex gap-1 mb-3" dir="ltr">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setStars(s)} aria-label={`${s} نجوم`}
              className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${s <= stars ? "text-gold" : "text-line"}`}>★</button>
          ))}
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="وش أقنعتك في العطر؟ الثبات، الفوحان، التغليف…"
          className="w-full bg-white border border-line rounded-2xl px-4 py-3 text-[13px] font-bold outline-none focus:border-green2 resize-none" />
        <div className="flex gap-2 mt-2 flex-wrap">
          <input value={nick} onChange={(e) => setNick(e.target.value)} placeholder={user ? `بيظهر باسمك: ${user.name}` : "اسمك (اختياري)"}
            className="flex-1 min-w-40 bg-white border border-line rounded-2xl px-4 py-2.5 text-[12.5px] font-bold outline-none focus:border-green2" />
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => {
            if (text.trim().length < 3) return ping("اكتب شوية كلام على الأقل في تقييمك");
            addUserReview(name, { n: nick.trim() || user?.name || "زائر", r: stars, t: text.trim() });
            setText(""); setNick(""); ping("تقييمك انضاف — شكرًا يا وحش ✓");
          }}
            className="bg-green2 text-cream font-black px-6 py-2.5 rounded-2xl text-[12.5px] cursor-pointer">
            نشر التقييم
          </motion.button>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-5 flex-wrap">
        <div className="text-center">
          <div className="text-4xl font-black text-green2">{rating}</div>
          <div className="text-gold text-[13px] font-black">★★★★★</div>
        </div>
        <div className="flex-1 min-w-52 space-y-1.5">
          {bars.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-black text-muted">
              <span>{5 - i}★</span>
              <div className="flex-1 h-2 bg-line rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08 }} className="h-full bg-gold rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {mine.length > 0 && (
          <div className="flex items-center gap-2 text-[11px] font-black text-green2"><span>✦</span> تقييماتك و تقييمات الزوار</div>
        )}
        {mine.map((s, i) => (
          <div key={`u${i}`} className="border border-gold/40 rounded-2xl p-4 bg-goldsoft/60">
            <div className="flex justify-between items-center mb-1">
              <b className="text-[13px]">{s.n}</b>
              <span className="text-gold text-[12px] font-black">{"★".repeat(s.r)}{"☆".repeat(5 - s.r)}</span>
            </div>
            <p className="text-[13px] font-bold text-ink/80">{s.t}</p>
            <span className="text-[10px] font-bold text-muted">من الحين</span>
          </div>
        ))}
        {samples.map((s) => (
          <div key={s.n} className="border border-line rounded-2xl p-4 bg-cream/60">
            <div className="flex justify-between items-center mb-1">
              <b className="text-[13px]">{s.n}</b>
              <span className="text-gold text-[12px] font-black">{"★".repeat(s.r)}{"☆".repeat(5 - s.r)}</span>
            </div>
            <p className="text-[13px] font-bold text-ink/80">{s.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
