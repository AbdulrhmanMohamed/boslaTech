import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { Link } from "react-router";
import Magnetic from "../components/Magnetic";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

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

export default function About() {
  const reduce = useReducedMotion();
  
  return (
    <div className="bg-cream min-h-screen pb-24">
      {/* ══════════ EDITORIAL HEADER ══════════ */}
      <section className="pt-32 pb-20 px-5 border-b border-line">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold font-black text-[12px] tracking-[0.2em] uppercase mb-4 block">
              Established 2026 — Riyadh
            </span>
            <h1 className="text-[clamp(40px,7vw,64px)] font-black leading-[1.1] mb-8">
              نصنع للأثر <span className="shimmer italic">ذكرى</span>،<br /> وللفخامة عنواناً.
            </h1>
            <div className="w-16 h-1 bg-gold mx-auto mb-8 rounded-full" />
            <p className="text-muted font-bold text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              "أصل" ليست مجرد علامة تجارية، بل هي رحلة بحث عن الجمال في أدق تفاصيل العطور والبخور السعودي المعاصر.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ OUR STORY (NARRATIVE) ══════════ */}
      <section className="py-24 px-5">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video lg:aspect-auto lg:h-[600px]"
              >
                <img 
                  src="https://images.pexels.com/photos/10924522/pexels-photo-10924522.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  className="absolute inset-0 w-full h-full object-cover" 
                  alt="Our Craft"
                />
              </motion.div>
            </div>
            <div className="lg:col-span-5 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-black mb-6">بداية القصة</h2>
                <div className="space-y-6 text-muted font-bold leading-8 text-[15px]">
                  <p>
                    من أحياء الرياض العريقة، انطلقت فكرة "أصل" لسد الفجوة بين التقاليد الشرقية الأصيلة وتطلعات الجيل الجديد نحو الفخامة العصرية.
                  </p>
                  <p>
                    بدأنا بمجموعة صغيرة من العطور والعود المختار بعناية، واليوم نفخر بكوننا وجهة رائدة لكل من يبحث عن التميز في الهدايا الشخصية والمناسبات الكبرى.
                  </p>
                  <p>
                    كل منتج في متجرنا يمر برحلة طويلة من الاختبار والتدقيق، لضمان أن ما يصل إليكم هو "أصل" الفخامة فعلاً.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ MISSION & VISION (STRUCTURED BLOCKS) ══════════ */}
      <section className="py-20 px-5 bg-sand/30">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] border border-line shadow-sm"
            >
              <div className="w-12 h-12 bg-green2 text-gold rounded-2xl grid place-items-center mb-6 font-black text-xl">
                ★
              </div>
              <h3 className="text-2xl font-black mb-4">رؤيتنا</h3>
              <p className="text-muted font-bold leading-7 text-[14px]">
                أن نكون الخيار الأول في المملكة العربية السعودية للعطور والبخور الفاخر، مجمعين بين الأصالة والابتكار في كل تفاصيل تجربة العميل.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-line shadow-sm"
            >
              <div className="w-12 h-12 bg-gold text-white rounded-2xl grid place-items-center mb-6 font-black text-xl">
                ✦
              </div>
              <h3 className="text-2xl font-black mb-4">رسالتنا</h3>
              <p className="text-muted font-bold leading-7 text-[14px]">
                تقديم منتجات استثنائية تعزز ثقافة الطيب العربي وتجعل من كل هدية ذكرى لا تُنسى، مع التزامنا المطلق بالجودة والشفافية.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ CORE PILLARS (GRID) ══════════ */}
      <section className="py-24 px-5 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black">لماذا نختلف؟</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "جودة معتمدة",
              desc: "نتعامل مباشرة مع الموردين والوكلاء لضمان أصالة المكونات بنسبة 100%.",
              icon: "🛡️"
            },
            {
              title: "تغليف استثنائي",
              desc: "نؤمن أن الهدية تبدأ من ملمس العلبة، لذا نهتم بكل تفاصيل التغليف اليدوي.",
              icon: "🎁"
            },
            {
              title: "فخر الصناعة",
              desc: "نساهم في دعم الاقتصاد المحلي ونهدف لرفع معايير الصناعة في منطقتنا.",
              icon: "🇸🇦"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-4"
            >
              <div className="text-4xl mb-6">{item.icon}</div>
              <h4 className="text-xl font-black">{item.title}</h4>
              <p className="text-muted font-bold text-[14px] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="mx-auto max-w-4xl px-5 mt-12 text-center">
        <div className="bg-green p-12 md:p-20 rounded-[3rem] text-cream relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] -mr-32 -mt-32" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-8">هل تريد معرفة المزيد؟</h2>
            <p className="text-cream/70 font-bold mb-10 max-w-md mx-auto">
              فريقنا متاح دائماً للإجابة على استفساراتكم ومساعدتكم في اختيار هديتكم القادمة.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic>
                <Link to="/contact" className="bg-gold text-ink font-black px-10 py-4 rounded-2xl inline-block shadow-lg shadow-gold/20 hover:scale-105 transition-transform">
                  تواصل معنا الآن
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/shop" className="bg-white/10 border border-white/20 text-cream font-black px-10 py-4 rounded-2xl inline-block backdrop-blur-sm hover:bg-white/20 transition-colors">
                  تصفح المتجر
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
