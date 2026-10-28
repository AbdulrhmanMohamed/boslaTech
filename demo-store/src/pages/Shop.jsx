import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { PRODUCTS, CATEGORIES, catName, riyal, FREE_SHIP } from "../data/products";

const norm = (s) => s
  .toLowerCase()
  .replace(/[\u064B-\u0652\u0670]/g, "")
  .replace(/[أإآ]/g, "ا")
  .replace(/ة/g, "ه")
  .replace(/ى/g, "ي")
  .replace(/\s+/g, " ")
  .trim();
const sorts = [
  { id: "featured", label: "المميزة" },
  { id: "cheap", label: "الأرخص أول" },
  { id: "pricey", label: "الأغلى أول" },
  { id: "rate", label: "الأعلى تقييمًا" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "all";
  const [sort, setSort] = useState("featured");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let l = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
    if (q.trim()) {
      const needle = norm(q);
      l = l.filter((p) => norm(`${p.name} ${p.brief} ${catName(p.cat)}`).includes(needle));
    }
    if (sort === "cheap") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "pricey") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rate") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [cat, sort, q]);

  const setCat = (id) => setParams(id === "all" ? {} : { cat: id });

  return (
    <div className="mx-auto max-w-6xl px-5 pt-16 pb-10">
      <LayoutGroup>
        {/* header */}
        <div className="text-center mb-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold font-black text-[13px] mb-2">المتجر</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-black">كل المجموعة في مكان واحد</motion.h1>
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.2 }} className="mx-auto mt-3 w-14 h-[3px] rounded bg-gold" />
        </div>

        {/* filters bar */}
        <div className="sticky top-16 z-30 glass border border-line rounded-2xl p-2.5 mb-8 flex flex-wrap gap-2 items-center justify-center">
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`relative px-4 py-2 rounded-xl text-[13px] font-black transition-colors cursor-pointer ${cat === c.id ? "text-cream" : "text-muted hover:text-green2"}`}>
              {cat === c.id && (
                <motion.span layoutId="chip" className="absolute inset-0 bg-green2 rounded-xl" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative">{c.icon} {c.name}</span>
            </button>
          ))}
          <div className="h-6 w-px bg-line mx-1 max-sm:hidden" />
          <div className="relative">
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="ابحث في المتجر" placeholder="ابحث عن منتج…"
              className="bg-white border border-line rounded-xl pl-8 pr-3.5 py-2 text-[13px] font-bold outline-none focus:border-gold w-44" />
            {q && (
              <button onClick={() => setQ("")} aria-label="مسح البحث"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 grid place-items-center rounded-full bg-sand text-muted text-[11px] font-black hover:text-ink">
                ✕
              </button>
            )}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-line rounded-xl px-3 py-2 text-[13px] font-bold outline-none cursor-pointer focus:border-gold">
            {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        <p className="text-center text-[12.5px] font-extrabold text-muted mb-6">
          {list.length} {list.length === 1 ? "منتج" : "منتجات"} {q && <>في بحث «{q}»</>}
        </p>

        {/* grid */}
        {list.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-black text-xl mb-1">ما لقينا شي</p>
            <p className="text-muted font-bold text-sm">جرّب كلمة ثانية أو فلتر مختلف</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </LayoutGroup>

      {/* micro banner */}
      <div className="mt-16 bg-white border border-line rounded-3xl p-8 text-center">
        <p className="font-black text-xl">كوبون <span dir="ltr" className="text-gold">ASL10</span> يخصم 10% على أول طلب</p>
        <p className="text-muted font-bold text-[13px] mt-1.5">وكل طلب فوق {riyal(FREE_SHIP)} ر.س يوصلك بشحن مجاني</p>
      </div>
    </div>
  );
}
