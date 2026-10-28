import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { useShop } from "../store";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wish } = useShop();
  const list = PRODUCTS.filter((p) => wish.includes(p.id));

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-10">
      <div className="text-center mb-12">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold font-black text-[13px] mb-2">♥ المفضلة</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-4xl font-black">
          {list.length ? "اللي جمعت قلبك علينا" : "المفضلة تنتظرك"}
        </motion.h1>
      </div>

      {list.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 bg-white border border-line rounded-3xl">
          <motion.div className="text-6xl mb-4" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>🤍</motion.div>
          <p className="font-black text-xl mb-2">بدأ المفضلة فاضية</p>
          <p className="text-muted font-bold text-sm mb-8">اضغط القلب ♡ على أي منتج وينلقي هنا</p>
          <Link to="/shop" className="inline-block bg-green2 text-cream font-black px-9 py-3.5 rounded-2xl">اكتشف المجموعة ←</Link>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
