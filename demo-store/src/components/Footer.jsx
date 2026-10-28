import { Link } from "react-router";
import { BOSLA_SITE, COUPON_CODE, FREE_SHIP } from "../data/products";
import { motion } from "motion/react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-green text-cream/85 mt-24">
      <div className="mx-auto max-w-6xl px-5 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid place-items-center"><Logo size={80} /></div>
          <p className="text-[12.5px] font-bold opacity-70 max-w-sm mx-auto mt-3 leading-7">
            عطور وبخور وهدايا فاخرة — المنتقاة بعناية، متجر تجريبي لأغراض العرض لا تتم فيه عمليات دفع حقيقية.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 text-sm font-extrabold">
            <Link to="/shop" className="hover:text-gold transition-colors">المتجر</Link>
            <Link to="/about" className="hover:text-gold transition-colors">من نحن</Link>
            <Link to="/contact" className="hover:text-gold transition-colors">اتصل بنا</Link>
            <a href="https://wa.me/966576944605" target="_blank" rel="noopener" className="hover:text-gold transition-colors">تواصل معنا</a>
          </div>
          <div className="mt-10 pt-6 border-t border-cream/15">
            <p className="text-[13.5px] font-bold">
              برمجة وتطوير{" "}
              <a href={`https://${BOSLA_SITE}`} target="_blank" rel="noopener" className="text-gold font-black hover:text-goldsoft">
                بوصلة تك · BOSLA TECH
              </a>
            </p>
            <p className="text-[11px] opacity-50 mt-1 font-bold">شحن مجاني فوق {FREE_SHIP} ر.س • كوبون {COUPON_CODE}</p>
            <p className="text-[11px] opacity-50 mt-2">
              📞 +966 576 944 605 · 📍 الملز، الرياض · ✉️ info@bosla.sa
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
