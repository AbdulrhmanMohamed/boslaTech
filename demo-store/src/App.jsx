import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ShopProvider } from "./store";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Pay from "./pages/Pay";
import PaymentCallback from "./pages/PaymentCallback";
import OrderConfirmation from "./pages/OrderConfirmation";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AuthModal from "./components/AuthModal";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return <motion.div style={{ scaleX }} className="fixed top-0 inset-x-0 h-[3px] bg-gold z-[120] origin-[calc(50%_-_0.5px)_0px] rtl:origin-[100%_0]" />;
}

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (matchMedia("(hover: none)").matches) return;
    const state = { x: 0, y: 0, rx: 0, ry: 0 };
    const move = (e) => (state.x = e.clientX, state.y = e.clientY);
    const hoverSel = "a, button, [data-cursor], input, .cursor-target, .Magnetic";
    const over = (e) => { if (e.target.closest?.(hoverSel)) ring.current?.classList.add("grow") };
    const out = (e) => { if (e.target.closest?.(hoverSel)) ring.current?.classList.remove("grow") };
    let raf;
    const loop = () => {
      state.rx += (state.x - state.rx) * 0.16;
      state.ry += (state.y - state.ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${state.x - 4}px, ${state.y - 4}px)`;
      if (ring.current) ring.current.style.transform = `translate(${state.rx - 19}px, ${state.ry - 19}px)`;
      raf = requestAnimationFrame(loop);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    loop();
    return () => { cancelAnimationFrame(raf); document.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); };
  }, []);
  return (<><div ref={dot} className="cursor-dot" /><div ref={ring} className="cursor-ring" /></>);
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/payment/return" element={<PaymentCallback />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

function Shell() {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <ScrollToTop />
      {!isDashboard && <Progress />}
      <Cursor />
      {!isDashboard && (
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[130] focus:bg-green2 focus:text-cream focus:px-4 focus:py-2 focus:rounded-xl focus:font-black focus:text-sm">
          تجاوز إلى المحتوى
        </a>
      )}
      {!isDashboard && <Header />}
      {isDashboard ? (
        <AnimatedRoutes />
      ) : (
        <main id="main">
          <AnimatedRoutes />
        </main>
      )}
      {!isDashboard && <Footer />}
      {!isDashboard && <CartDrawer />}
      <AuthModal />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <Shell />
      </ShopProvider>
    </BrowserRouter>
  );
}
