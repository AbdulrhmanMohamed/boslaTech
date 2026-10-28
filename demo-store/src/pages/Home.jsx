import { useRef } from "react";
import { Link } from "react-router";
import {
  motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion,
} from "motion/react";
import Magnetic from "../components/Magnetic";
import ProductCard from "../components/ProductCard";
import { PRODUCTS, CATEGORIES, WA_NUMBER } from "../data/products";

const ease = [0.22, 1, 0.36, 1];
  const heroImg = (w) =>
    `https://images.pexels.com/photos/36389336/pexels-photo-36389336.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
  const oudImg =
    "https://images.pexels.com/photos/40382309/pexels-photo-40382309.jpeg?auto=compress&cs=tinysrgb&w=600";

/* ── line reveal title ── */
function Lines({ lines, cls = "" }) {
  return (
    <h1 className={cls}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-1">
          <motion.span
            className="block"
            initial={{ y: "115%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const heroRef = useRef(null);

  // scroll-linked parallax for hero art
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  // Scroll-driven video playback speed: 1.0 (start) to 0.5 (at end of hero) — subtle slowdown
  const heroVideoSpeed = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  // Video poster/image fallback for mute/autoplay issues
  const videoPoster = "https://images.pexels.com/photos/10924522/pexels-photo-10924522.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const videoSourceMP4 = "https://videos.pexels.com/video-files/8447560/8447560-hd_720_1366_25fps.mp4";
  const yBottle = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 180]);
  const rotBottle = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 14]);
  const yOud = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const fadeHero = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92]);
  // Scroll-driven zoom factor: 1.0 (top) → 1.0 (bottom), multiplied with scaleHero
  const heroZoom = useTransform(scrollYProgress, [0, 1], [1, 1]);

  // mouse parallax for hero art
  const mx = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  const mBottle = { x: useTransform(mx, [-1, 1], [26, -26]), y: useTransform(my, [-1, 1], [18, -18]) };
  const mOud = { x: useTransform(mx, [-1, 1], [-18, 18]), y: useTransform(my, [-1, 1], [-12, 12]) };

  const onMouse = (e) => {
    const r = heroRef.current.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    mx.set(nx);
    my.set(ny);
    // spotlight
    const pctX = ((e.clientX - r.left) / r.width) * 100;
    const pctY = ((e.clientY - r.top) / r.height) * 100;
    heroRef.current.style.setProperty("--mx", `${pctX}%`);
    heroRef.current.style.setProperty("--my", `${pctY}%`);
  };

  const best = PRODUCTS.filter((p) => p.old).slice(0, 4);
  const gem = PRODUCTS[4];

  return (
    <div className="overflow-clip">
      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} onMouseMove={onMouse}
        className="relative min-h-[100svh] flex items-center justify-center text-center px-5">
        {/* video background with scroll interaction */}
        <video autoPlay mute loop preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ videoPlaybackSpeed: heroVideoSpeed }}
        >
          <source src={videoSourceMP4} type="video/mp4" />
          <img src={videoPoster} alt="عطور فاخرة - أوركيدز واود" className="w-full h-full object-cover" />
        </video>
        {/* ambient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 38%, rgba(30,91,79,.16), rgba(201,162,75,.10) 45%, transparent 75%)" }} />
          <motion.div aria-hidden
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[12%] left-[18%] w-56 h-56 rounded-full blur-3xl bg-goldsoft/70" />
          <motion.div aria-hidden
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[8%] right-[12%] w-72 h-72 rounded-full blur-3xl bg-green2/15" />
          {/* mouse-following spotlight */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
              style={{ background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(201,162,75,.25), transparent 40%)" }} />
          </div>
        </div>

        <motion.div style={{ opacity: fadeHero, scale: scaleHero * heroZoom }} className="relative z-10 max-w-3xl">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="inline-flex items-center gap-2 bg-white/80 border border-line rounded-full px-4 py-1.5 text-[12px] font-black text-green2 shadow-sm"
          >
            ✦ الأصالة في كل قطرة · مصدر معتمد
          </motion.span>

          <Lines cls="mt-6 text-[clamp(38px,8vw,76px)] leading-[1.15] font-black tracking-tight"
            lines={["عطور شرقية،", <span key="s" className="shimmer">ذكريات تبقى</span>, "في متجر واحد"]} />

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.7, ease }}
            className="mt-6 text-muted font-bold text-lg md:text-xl max-w-md mx-auto leading-8">
            عطور شرقية غنية، وبخور العود الفاخر، وهدايا مُصنّعة بعناية — منتقاة بعناية من أرقى المصادر.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7, ease }}
            className="mt-9 flex flex-wrap justify-center gap-4">
            <Magnetic className="bg-green2 text-cream font-black px-10 py-4 rounded-2xl shadow-lg shadow-green2/25 glow-button">
              <Link to="/shop" className="text-[15px]">تسوّق المجموعة ←</Link>
            </Magnetic>
            <Magnetic className="bg-white/80 border border-ink/70 font-black px-8 py-4 rounded-2xl glow-button" strength={0.25}>
              <a href={`https://wa.me/${WA_NUMBER}`} className="text-[15px]">تواصل معنا</a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* floating product art — scroll + mouse parallax */}
        <motion.figure style={{ y: yBottle }} className="absolute right-[5%] top-1/2 -translate-y-1/2 max-md:hidden" >
          <motion.div style={{ x: mBottle.x, y: mBottle.y, rotate: rotBottle }}
            className="relative w-52 xl:w-64">
            <motion.img src={heroImg(600)} alt="عطر العنبر"
              initial={{ opacity: 0, y: 60, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, delay: 0.5, ease }}
              className="rounded-[2rem] shadow-2xl shadow-green2/30" />
            <motion.figcaption
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="absolute -bottom-4 inset-x-6 bg-white/90 backdrop-blur rounded-xl py-2 text-[12px] font-black text-green2 shadow">
              العنبر الفاخر · 249 ر.س
            </motion.figcaption>
          </motion.div>
        </motion.figure>

        <motion.figure style={{ y: yOud }} className="absolute bottom-[15%] left-[6%] max-lg:hidden">
          <motion.img src={oudImg} alt="بخور العود" style={{ x: mOud.x, y: mOud.y }}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(14px)" }}
            animate={{ opacity: 0.95, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.65, ease }}
            className="w-40 xl:w-48 rounded-[1.7rem] shadow-xl rotate-6" />
        </motion.figure>

        {/* scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="absolute bottom-7 inset-x-0 mx-auto w-fit text-muted text-[11px] font-black tracking-widest">
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center gap-1">
            اسحب
            <span className="block w-[1px] h-8 bg-gradient-to-b from-gold to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ MARQUEE / BANNER ══════════ */}
      <div className="border-y border-line bg-white py-4 overflow-x-auto no-scrollbar snap-x snap-mandatory" aria-hidden>
        <div className="flex gap-10 px-10 min-w-max">
          {["شحن مجاني فوق 200 ر.س", "كوبون ASL10 يخصم 10%", "أصالة 100% — وكلاء معتمدون", "توصيل 48 ساعة لكل المملكة", "استبدال خلال 14 يوم", "تغليف هدايا مجاني"].map((t) => (
            <span key={t} className="flex items-center gap-3 snap-center text-[13px] font-black text-green2/80 whitespace-nowrap">
              {t} <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>

        {/* ══════════ COLLECTIONS ══════════ */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="flex items-end justify-between mb-9">
          <div>
            <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="text-gold font-black text-[13px] mb-2">
              مجموعاتنا
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08, ease }} className="text-3xl md:text-4xl font-black">
              ثلاث عبق، ثلاث روائح، ثلاث ذكريات
            </motion.h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {CATEGORIES.filter((c) => c.id !== "all").map((c, i) => {
            const p = PRODUCTS.find((x) => x.cat === c.id);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: i * 0.12, ease }}>
                <Link to={`/shop?cat=${c.id}`} className="group block relative rounded-3xl overflow-hidden aspect-[4/5]" data-cursor>
                  <img src={p?.img} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-cream">
                    <div>
                      <div className="text-xl font-black">{c.icon} {c.name}</div>
                      <div className="text-[12px] font-bold opacity-75">{PRODUCTS.filter((x) => x.cat === c.id).length} منتجات</div>
                    </div>
                    <motion.span className="w-10 h-10 grid place-items-center rounded-full bg-gold text-ink font-black transition-transform duration-500 group-hover:rotate-[-45deg]">←</motion.span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════ BEST SELLERS ══════════ */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="text-center mb-10">
          <p className="text-gold font-black text-[13px] mb-2">الأكثر رواجاً هذا الشهر</p>
          <h2 className="text-3xl md:text-4xl font-black">الأفضل لك دائماً</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {best.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
        </div>
        <div className="text-center mt-10">
          <Magnetic className="bg-ink text-cream font-black px-9 py-3.5 rounded-2xl text-[14px]" strength={0.3} glow-button>
            <Link to="/shop">شوف المجموعة كاملة ←</Link>
          </Magnetic>
        </div>
      </section>

      {/* ══════════ STORY / PARALLAX GEM ══════════ */}
      <section className="mx-auto max-w-6xl px-5 pt-28">
        <div className="relative rounded-[2.5rem] bg-green text-cream overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-10 md:p-16">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-gold font-black text-[13px] mb-3">لماذا أصل؟</motion.p>
              <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="text-3xl md:text-4xl font-black leading-snug mb-5">
                نختار بغرابة، ونبيع ببخل الدمج
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease }} className="text-[15px] font-bold text-cream/80 leading-8 mb-8">
                من عين على العطور لصلها في المكان، مع باكّات رآل للبوكيه — أصلة رابح بالريف.
                اجمع المطلب مع لفائف البخور المشميلة علب هدية للبراءة الباكرة، والنتيجة؟
              </motion.p>
              <motion.ul className="space-y-3 text-[13.5px] font-extrabold">
                {["أصل من وكلاء معتمدين 100%", "تغليف هدايا مجاني بأي طلب", "استبدال خلال 14 يوم بدون أسئلة", "دفع آمن: مدى · Apple Pay · Visa"].map((t, i) => (
                  <motion.li key={t} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className="flex gap-3 items-center">
                    <span className="w-5 h-5 grid place-items-center rounded-full bg-gold text-ink text-[11px] font-black shrink-0">✓</span>{t}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            <motion.div className="p-10 md:p-14 max-md:hidden" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
              <Link to={`/product/${gem.id}`}>
                <motion.img whileHover={{ scale: 1.04, rotate: -2 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}
                  src={gem.img} alt={gem.name} className="rounded-3xl shadow-2xl" data-cursor />
              </Link>
              <div className="text-center mt-4 font-black text-gold">{gem.name} — {gem.price} ر.س</div>
            </motion.div>
          </div>
        </div>
      </section>

{/* ══════════ TESTIMONIALS ══════════ */}
      <section className="pt-16 overflow-hidden">
        <h2 className="text-center text-2xl font-black mb-6 px-2">وش يقولون علينا؟</h2>
        <div className="flex gap-3 px-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
          {[
            { t: "أفضل عطر طلبته أونلاين بالسعودية، وصل بتغليف فخم خلال يومين.", n: "نورة. م", c: "الرياض" },
            { t: "البخور ريحته سكت الدار كامل، قريبة من اللي نشريه من المستورد.", n: "أبو فيصل", c: "جدة" },
            { t: "صينية الهدايا كانت سكّة عرس بنتي، الجميع سأل من وين.", n: "أم عبدالله", c: "الدمام" },
            { t: "دعم سريع واستبدال بلا وجع راس، تسلمون عليه.", n: "سارة", c: "الخبر" },
          ].map((q, i) => (
            <motion.blockquote key={i} 
              whileHover={{ y: -5 }} 
              className="snap-center bg-white border border-line rounded-3xl p-5 shadow-sm flex-1">
              <div className="text-gold mb-2 font-black">★★★★★</div>
              <p className="text-[13px] font-bold leading-snug text-ink/90 min-h-20">{q.t}</p>
              <footer className="mt-2 text-[11px] font-black text-muted">{q.n} · {q.c}</footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="mx-auto max-w-4xl px-5 pt-28 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">جاهز تشمّ الفرق؟</h2>
          <p className="text-muted font-bold mt-4 max-w-md mx-auto">اطلب اليوم وتوصيلك يكون عندك خلال 48 ساعة — والدفع كما تشاء.</p>
          <Magnetic className="mt-9 inline-block bg-green2 text-cream font-black px-12 py-4.5 rounded-2xl text-lg shadow-lg shadow-green2/25 glow-button">
            <Link to="/shop">ابدأ التسوق ←</Link>
          </Magnetic>
        </motion.div>
      </section>
    </div>
  );
}
