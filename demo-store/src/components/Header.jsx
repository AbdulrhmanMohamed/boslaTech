import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion, AnimatePresence, useSpring, useMotionValueEvent } from "motion/react";
import { useScroll } from "motion/react";
import { useShop } from "../store";
import { CATEGORIES } from "../data/products";
import Logo from "./Logo";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/shop", label: "المتجر" },
  { to: "/wishlist", label: "المفضلة" },
];

export default function Header() {
  const { cart, openDrawer, user, openAuth } = useShop();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [acc, setAcc] = useState(false);
  const { scrollY } = useScroll();
  const badgeSpring = useSpring(0, { stiffness: 500, damping: 18 });
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 30));

  const items = cart.reduce((s, i) => s + i.qty, 0);
  badgeSpring.set(items);

  return (
    <>
      <div className="bg-green text-cream text-[12.5px] font-bold text-center py-2 px-4">
        شحن مجاني للطلبات فوق 200 ر.س • كوبون <span dir="ltr" className="text-gold tracking-widest font-black">ASL10</span> يخصم 10%
      </div>
      <div className="bg-green2 text-cream text-[11px] font-bold text-center py-1 px-2">
        📞 <a href="tel:+966576944605" className="text-gold hover:text-goldsoft transition-colors">+966 576 944 605</a> | 📍 الملز، الرياض
      </div>
      <motion.header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${solid ? "glass border-line" : "bg-transparent border-transparent"}`}
      >
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link to="/" className="leading-none" aria-label="أصل ASL — الرئيسية">
            <Logo size={90} />
          </Link>

          <nav className="hidden md:flex gap-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `relative text-sm font-extrabold transition-colors ${isActive ? "text-green2" : "text-muted hover:text-green2"}`}
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && <motion.span layoutId="nav-pill" className="absolute -bottom-1.5 inset-x-0 h-[3px] rounded-full bg-gold" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={openDrawer}
              className="relative w-11 h-11 grid place-items-center rounded-2xl bg-white border border-line hover:border-green2 transition-colors cursor-none"
              data-cursor
              whileTap={{ scale: 0.9 }}
              aria-label="السلة"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <AnimatePresence>
                {items > 0 && (
                  <motion.b
                    key={items}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 15 }}
                    className="absolute -top-1.5 -left-1.5 bg-gold text-white text-[11px] font-black min-w-5 h-5 px-1 rounded-full grid place-items-center"
                  >
                    {items}
                  </motion.b>
                )}
              </AnimatePresence>
            </motion.button>

            {/* account */}
            <div className="relative hidden md:block">
              <motion.button
                onClick={() => (user ? setAcc((v) => !v) : openAuth())}
                className="w-11 h-11 grid place-items-center rounded-2xl bg-white border border-line hover:border-green2 transition-colors cursor-none"
                data-cursor whileTap={{ scale: 0.9 }} aria-label="حسابي"
              >
                {user
                  ? <span className="w-7 h-7 rounded-full bg-green2 text-cream text-[12px] font-black grid place-items-center">{user.name.trim()[0]}</span>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>}
              </motion.button>
              <AnimatePresence>
                {user && acc && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-13 left-0 w-56 bg-white border border-line rounded-2xl p-3 shadow-xl shadow-ink/10"
                    onMouseLeave={() => setAcc(false)}
                  >
                    <div className="px-2 pb-2 mb-2 border-b border-line">
                      <b className="text-[13px] block">{user.name}</b>
                      <span dir="ltr" className="text-[11px] font-bold text-muted">{user.phone}</span>
                    </div>
                    <Link to="/account" onClick={() => setAcc(false)} className="flex gap-2.5 text-[12.5px] font-black text-ink rounded-xl px-2.5 py-2.5 hover:bg-sand transition-colors">👤 حسابي وطلباتي</Link>
                    <button onClick={() => setAcc(false)} className="w-full text-right flex gap-2.5 text-[12.5px] font-black text-muted rounded-xl px-2.5 py-2.5 hover:bg-sand hover:text-ink transition-colors cursor-pointer">↩ الإغلاق السريع</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="md:hidden w-11 h-11 grid place-items-center rounded-2xl bg-white border border-line" onClick={() => setMenu(true)} aria-label="القائمة">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div className="fixed inset-0 z-[80] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setMenu(false)} />
            <motion.nav
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 bottom-0 right-0 w-72 bg-cream p-7 flex flex-col gap-2"
            >
              <button className="self-start text-xl mb-4" onClick={() => setMenu(false)}>✕</button>
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setMenu(false)}
                  className={({ isActive }) => `text-lg font-black py-3 border-b border-line ${isActive ? "text-green2" : "text-ink"}`}>
                  {l.label}
                </NavLink>
              ))}
              {user
                ? <NavLink to="/account" onClick={() => setMenu(false)} className="text-lg font-black py-3 border-b border-line text-green2">👤 حسابي ({user.name})</NavLink>
                : <button onClick={() => { setMenu(false); openAuth(); }} className="text-lg font-black py-3 border-b border-line text-ink cursor-pointer">👤 تسجيل / دخول</button>}
              <div className="mt-auto text-xs text-muted font-bold" dir="ltr">mada · Apple Pay · Visa</div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
