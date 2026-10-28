import { Link } from "react-router";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useShop } from "../store";
import { riyal, catName } from "../data/products";

export default function ProductCard({ p, i = 0 }) {
  const { addToCart, toggleWish, wish } = useShop();
  const active = wish.includes(p.id);
  const isWished = active;

  // tilt
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const rotX = useTransform(rx, [-1, 1], [7, -7]);
  const rotY = useTransform(ry, [-1, 1], [-7, 7]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rx.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3), ease: [0.2, 0.8, 0.3, 1] }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      onMouseMove={onMove} onMouseLeave={reset}
      className="soft-card hover-glow lift group relative overflow-hidden"
      data-cursor
    >
      <Link to={`/product/${p.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-white">
          <motion.img layoutId={`pimg-${p.id}`} src={p.img} alt={p.name} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]" />
          {/* shine sweep */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,.35) 50%, transparent 60%)", backgroundSize: "220% 100%", animation: "shimmer 2.4s linear infinite" }} />
          {off > 0 && <span className="absolute top-3 right-3 bg-gold text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow">خصم {off}%</span>}
          {p.stock <= 8 && <span className="absolute top-3 left-3 bg-ink/85 text-cream text-[10.5px] font-black px-2.5 py-1 rounded-full">بقي {p.stock} فقط</span>}
        </div>
      </Link>

      <button
        onClick={() => toggleWish(p)}
        aria-label="المفضلة"
        className={`absolute top-12 left-3 w-9 h-9 grid place-items-center rounded-xl bg-white/90 shadow transition ${isWished ? "text-red-500" : "text-muted hover:text-red-400"}`}
      >
        <motion.span key={String(isWished)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
          {isWished ? "♥" : "♡"}
        </motion.span>
      </button>

      <div className="p-4">
        <div className="flex items-center justify-between text-[11px] font-extrabold text-gold mb-1">
          <span>{catName(p.cat)}</span>
          <span className="text-ink">★ {p.rating}</span>
        </div>
        <Link to={`/product/${p.id}`} className="text-[15px] font-black leading-6 hover:text-green2 transition-colors">{p.name}</Link>
        <p className="text-muted text-[12px] font-bold mt-0.5 truncate">{p.brief}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <b className="text-green2 text-lg">{riyal(p.price)}</b>
          <span className="text-[12px] font-bold text-muted">ر.س</span>
          {p.old && <s className="text-[12.5px] text-muted/70">{riyal(p.old)}</s>}
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => addToCart(p, { color: p.colors ? 0 : undefined, size: p.sizes ? p.sizes[0] : undefined })}
          className="mt-3 w-full bg-green2 text-cream font-black text-[13.5px] py-2.5 rounded-xl hover:bg-green transition-colors cursor-pointer"
        >
          أضف للسلة
        </motion.button>
      </div>
    </motion.article>
  );
}
