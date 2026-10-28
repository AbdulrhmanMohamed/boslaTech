import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { COUPON_CODE, COUPON_RATE, FREE_SHIP, SHIP_COST } from "./data/products";

const ShopCtx = createContext(null);
const load = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d }
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load("asl_cart", []));
  const [wish, setWish] = useState(() => load("asl_wish", []));
  const [coupon, setCoupon] = useState(() => load("asl_coupon", false));
  const [user, setUser] = useState(() => load("asl_user", null));
  const [orders, setOrders] = useState(() => load("asl_orders", []));
  const [reviews, setReviews] = useState(() => load("asl_reviews", {}));
  const [drawer, setDrawer] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const tidRef = useRef(0);

  useEffect(() => { localStorage.setItem("asl_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("asl_wish", JSON.stringify(wish)); }, [wish]);
  useEffect(() => { localStorage.setItem("asl_coupon", JSON.stringify(coupon)); }, [coupon]);
  useEffect(() => { localStorage.setItem("asl_user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("asl_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("asl_reviews", JSON.stringify(reviews)); }, [reviews]);

  const ping = useCallback((msg) => {
    const id = ++tidRef.current;
    setToast({ id, msg });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2400);
  }, []);

  const signup = useCallback(({ name, phone }) => {
    setUser({ name: name.trim(), phone: phone.trim(), city: "", district: "", street: "" });
    setAuthOpen(false);
    ping(`أهلًا ${name.trim()}! حسابك جاهز ✓`);
    return true;
  }, [ping]);

  const login = useCallback(({ name, phone }) => {
    const nm = (name || "").trim();
    setUser((u) => ({
      name: nm || u?.name || "عميل أصل",
      phone: (phone || u?.phone || "").trim(),
      city: u?.city || "", district: u?.district || "", street: u?.street || "",
    }));
    setAuthOpen(false);
    ping("تم تسجيل الدخول ✓");
    return true;
  }, [ping]);const logout = useCallback(() => {
    setUser(null);
    // Clear cart and wishlist from state + localStorage so new session starts fresh
    setCart([]);
    setWish([]);
    localStorage.removeItem("asl_cart");
    localStorage.removeItem("asl_wish");
    ping("تسجلت الخروج —نراك قريب");
  }, [ping]);

  const updateUser = useCallback((patch) => {
    setUser((u) => ({ ...u, ...patch }));
    ping("تم تحديث بياناتك ✓");
  }, [ping]);

  const addUserReview = useCallback((pid, rv) => {
    setReviews((m) => ({ ...m, [pid]: [{ ...rv, ts: Date.now() }, ...(m[pid] || [])] }));
  }, [ping]);

  const placeOrder = useCallback((order) => {
    setOrders((o) => [order, ...o]);
    setCart([]);
    setCoupon(false);
    return order;
  }, []);

  const addToCart = useCallback((p, opts = {}) => {
    if (!user) { ping(`تسجيل الدخول أولاً لإضافة للسلة`); return; }
    const key = `${p.id}|${opts.color !== undefined ? opts.color : ""}|${opts.size !== undefined ? opts.size : ""}`;
    setCart((c) => {
      const i = c.findIndex((x) => x.key === key);
      if (i > -1) { const n = [...c]; n[i] = { ...n[i], qty: n[i].qty + 1 }; return n }
      return [...c, { key, id: p.id, qty: 1, color: opts.color, size: opts.size }];
    });
    ping(`«${p.name}» انضاف للسلة ✓`);
  }, [ping, user]);

  const toggleWish = useCallback((p) => {
    if (!user) { ping(`تسجيل الدخول أولاً للمفضلة`); return; }
    setWish((w) => {
      const has = w.includes(p.id);
      ping(has ? `«${p.name}» خرجت من المفضلة` : `«${p.name}» دخلت المفضلة ♥`);
      return has ? w.filter((i) => i !== p.id) : [...w, p.id];
    });
  }, [ping, user]);

  const setQty = useCallback((key, d) => {
    setCart((c) => c
      .map((i) => (i.key === key ? { ...i, qty: i.qty + d } : i))
      .filter((i) => i.qty > 0));
  }, []);

  const removeItem = useCallback((key) => setCart((c) => c.filter((i) => i.key !== key)), []);

  const applyCoupon = useCallback((code) => {
    const ok = (code || "").trim().toUpperCase() === COUPON_CODE;
    setCoupon(ok);
    return ok;
  }, []);

  return (
    <ShopCtx.Provider
      value={{
        cart, wish, coupon, drawer, checkout, toast, user, orders, reviews, authOpen,
        openDrawer: () => setDrawer(true), closeDrawer: () => setDrawer(false),
        openCheckout: () => setCheckout(true), closeCheckout: () => setCheckout(false),
        openAuth: () => setAuthOpen(true), closeAuth: () => setAuthOpen(false),
        signup, login, logout, updateUser, addUserReview, placeOrder,
        addToCart, toggleWish, setQty, removeItem, applyCoupon, ping,
      }}
    >
      {children}
    </ShopCtx.Provider>
  );
}

export const useShop = () => useContext(ShopCtx);

export function computeTotals({ cart, priceOf, couponOn }) {
  const subtotal = cart.reduce((s, i) => s + priceOf(i.id) * i.qty, 0);
  const items = cart.reduce((s, i) => s + i.qty, 0);
  const disc = couponOn ? Math.round(subtotal * COUPON_RATE) : 0;
  const ship = subtotal === 0 || subtotal >= FREE_SHIP ? 0 : SHIP_COST;
  return { subtotal, items, disc, ship, total: subtotal - disc + ship, left: Math.max(0, FREE_SHIP - subtotal) };
}
