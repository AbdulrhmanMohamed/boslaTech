import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { Link, useLocation } from "react-router";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];
const WA_NUMBER = "+966576944605";

const heroImg = "https://images.pexels.com/photos/36389336/pexels-photo-36389336.jpeg?auto=compress&cs=tinysrgb&w=600";
const oudImg = "https://images.pexels.com/photos/40382309/pexels-photo-40382309.jpeg?auto=compress&cs=tinysrgb&w=600";

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

export default function Contact() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const heroRef = useRef(null);

  // scroll-linked parallax for hero art
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  // Scroll-driven video playback speed: 1.0 (start) to 0.5 (at end of hero) — subtle slowdown
  const heroVideoSpeed = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  // Video poster/image fallback for mute/autoplay issues
  const videoPoster = "https://images.pexels.com/photos/10924522/pexels-photo-10924522.jpeg?auto=compress&cs=tinysrgb&w=1600";

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
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <div className="overflow-clip">
      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} onMouseMove={onMouse}
        className="relative min-h-[100svh] flex items-center justify-center text-center px-5">
        {/* video background with scroll interaction */}
        <video autoPlay mute="true" loop preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ videoPlaybackSpeed: heroVideoSpeed }}
        >
          <img src={videoPoster} alt="اتصال وخدمة work" className="w-full h-full object-cover" />
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
        </div>

        <motion.div style={{ opacity: fadeHero, scale: scaleHero * heroZoom }} className="relative z-10 max-w-3xl">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="inline-flex items-center gap-2 bg-white/80 border border-line rounded-full px-4 py-1.5 text-[12px] font-black text-green2 shadow-sm"
          >
            ✦ خدمة عملاء مميزة
          </motion.span>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.7, ease }}
            className="mt-5 text-muted font-bold text-lg max-w-md mx-auto">
            يمكنك التواصل معنا عبر الهاتف أو الواتساب أو إرسال-message، ونحن نرد خلال وقت سريع.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7, ease }}
            className="mt-9 flex flex-wrap justify-center gap-4">
            <motion.a className="Magnetic bg-green2 text-cream font-black px-10 py-4 rounded-2xl shadow-lg shadow-green2/25" whileHover={{ scale: 1.04 }}
              href={`https://wa.me/${WA_NUMBER.replace("+", "")}`} >
              واتساب
            </motion.a>
            <motion.a className="bg-white/80 border border-ink/70 font-black px-8 py-4 rounded-2xl" strength={0.25} whileHover={{ x: 10 }}
              href="tel:+966576944605">
              هاتف
            </motion.a>
          </motion.div>
        </motion.div>

        {/* floating product art — scroll + mouse parallax */}
        <motion.figure style={{ y: yBottle }} className="absolute right-[5%] top-1/2 -translate-y-1/2 max-md:hidden">
          <motion.div style={{ x: mBottle.x, y: mBottle.y, rotate: rotBottle }}
            className="relative w-52 xl:w-64">
            <motion.img src={heroImg} alt="عنصر زخرفي"
              initial={{ opacity: 0, y: 60, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, delay: 0.5, ease }}
              className="rounded-[2rem] shadow-2xl shadow-green2/30" />
            <motion.figcaption
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="absolute -bottom-4 inset-x-6 bg-white/90 backdrop-blur rounded-xl py-2 text-[12px] font-black text-green2 shadow">
              سريع وموثوق
            </motion.figcaption>
          </motion.div>
        </motion.figure>

        <motion.figure style={{ y: yOud }} className="absolute bottom-[15%] left-[6%] max-lg:hidden">
          <motion.img src={oudImg} alt="بخور العود"
            style={{ x: mOud.x, y: mOud.y }}
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

      <section className="mx-auto max-w-6xl px-5 py-20 bg-cream rounded-[3rem]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}
              className="text-3xl md:text-4xl font-black">لنبدأ رحلتك القادمة.</motion.h2>
            <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-[15px] font-bold text-muted/80 leading-8 mb-8 mt-6">
              اختر الوسيلة الأنسب لك، أو أرسل لنا رسالة وسنرد خلال وقت قصير.
            </motion.p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-1 flex-shrink-0 text-green2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 3 4 1 3.5-1.5 4-1" />
                  <path d="M21 15a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2z" />
                  <path d="M22 7l-5-5l-3 9l5 5l9-8z" />
                </svg>
                <span className="text-muted font-bold">الهاتف: <a href="tel:+966576944605" className="text-green2 hover:text-green2 transition-colors">+966 576 944 605</a></span>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-1 flex-shrink-0 text-green2"
                >
                  <path d="M21 10c0 7-9 13-9 13L2 7a4 4 0 0 0-4 4 4 4 0 0 0 4 4h14a4 4 0 0 0 4-4 4 4 0 0 0-4-4z" />
                  <line x1="12" y1="10" x2="12" y2="22" />
                </svg>
                <span className="text-muted font-bold">العنوان: الملز، الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-1 flex-shrink-0 text-green2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 7l-5-5l-3 9l5 5l9-8z" />
                  <path d="M2 7l5 5l3-9l-5-5z" />
                </svg>
                <span className="text-muted font-bold">البريد الإلكتروني: <a href="mailto:info@bosla.sa" className="text-green2 hover:text-green2 transition-colors">info@bosla.sa</a></span>
              </div>
            </div>
          </div>

          <div className="bg-green text-cream p-8 rounded-3xl relative overflow-hidden">
            <motion.h3 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}
              className="text-2xl font-black mb-6">اتصال سريع</motion.h3>
            <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-[15px] font-bold text-cream/80 leading-8 mb-6">
              املأ النموذج التالي وسنتواصل معك في غضون ساعة.
            </motion.p>
            <form className="space-y-4">
              <div>
                <label className="block text-[12px] font-black mb-2 text-gold">اسمك الكامل</label>
                <input
                  type="text"
                  placeholder="اسمك الكامل"
                  className="w-full px-4 py-3 border border-green/30 rounded-xl bg-cream/10 text-cream placeholder:text-cream/50 outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-black mb-2 text-gold">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="w-full px-4 py-3 border border-green/30 rounded-xl bg-cream/10 text-cream placeholder:text-cream/50 outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-black mb-2 text-gold">الرسالة</label>
                <textarea
                  rows={3}
                  placeholder="رسالَتكم معنا..."
                  className="w-full px-4 py-3 border border-green/30 rounded-xl bg-cream/10 text-cream placeholder:text-cream/50 outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold text-ink font-black px-8 py-3.5 rounded-2xl text-lg hover:bg-gold/90 transition-colors font-bold cursor-pointer"
              >
                إرسال الرسالة
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-[12px] font-black text-cream/70 hover:text-gold transition-colors underline underline-offset-4"
              >
                ← العودة للمتجر
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ BUSINESS DETAILS ══════════ */}
      <section className="mt-24 border-t border-line pt-8">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl text-gold mb-2">🕐</div>
              <div className="text-xl font-black">ساعات العمل</div>
              <p className="text-[13px] text-ink/80">الأحد - الخميس: 9 صـــ 6 م</p>
            </div>
            <div>
              <div className="text-3xl text-gold mb-2">📍</div>
              <div className="text-xl font-black">الموقع</div>
              <p className="text-[13px] text-ink/80">الملز، الرياض، المملكة العربية السعودية</p>
            </div>
            <div>
              <div className="text-3xl text-gold mb-2">⚡</div>
              <div className="text-xl font-black">وقت الاستجابة</div>
              <p className="text-[13px] text-ink/80">نرد خلال 24 ساعة</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}