import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { COUPON_CODE, COUPON_RATE, FREE_SHIP, SHIP_COST, PRODUCTS } from "./data/products";
import { hydrate, read, write } from "./lib/storage";

const ShopCtx = createContext(null);
const KEYS = ["asl_cart", "asl_wish", "asl_coupon", "asl_user", "asl_orders", "asl_reviews"];

const mergeCart = (a = [], b = []) => {
  const map = new Map(a.map((i) => [i.key, i]));
  for (const i of b) map.set(i.key, i);
  return [...map.values()];
};

const mergeOrders = (a = [], b = []) => {
  const map = new Map();
  for (const o of [...a, ...b]) map.set(o.id, o);
  return [...map.values()].sort((x, y) => (y.ts || 0) - (x.ts || 0));
};

const mergeReviews = (a = {}, b = {}) => {
  const out = { ...a };
  for (const key of Object.keys(b)) {
    const seen = new Set((out[key] || []).map((r) => r.ts));
    out[key] = [...(b[key] || []).filter((r) => !seen.has(r.ts)), ...(out[key] || [])];
  }
  return out;
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => read("asl_cart", []));
  const [wish, setWish] = useState(() => read("asl_wish", []));
  const [coupon, setCoupon] = useState(() => read("asl_coupon", false));
  const [user, setUser] = useState(() => read("asl_user", null));
  const [orders, setOrders] = useState(() => read("asl_orders", []));
  const [reviews, setReviews] = useState(() => read("asl_reviews", {}));
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const tidRef = useRef(0);

  useEffect(() => {
    let alive = true;
    hydrate(KEYS)
      .then((saved) => {
        if (!alive) return;
        if ("asl_cart" in saved) setCart((cur) => mergeCart(saved.asl_cart, cur));
        if ("asl_wish" in saved) setWish((cur) => [...new Set([...(saved.asl_wish || []), ...cur])]);
        if ("asl_coupon" in saved) setCoupon((cur) => cur || saved.asl_coupon);
        if ("asl_user" in saved) setUser((cur) => cur || saved.asl_user);
        if ("asl_orders" in saved) setOrders((cur) => mergeOrders(saved.asl_orders, cur));
        if ("asl_reviews" in saved) setReviews((cur) => mergeReviews(saved.asl_reviews, cur));
      })
      .catch(() => {})
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  useEffect(() => { if (ready) write("asl_cart", cart); }, [cart, ready]);
  useEffect(() => { if (ready) write("asl_wish", wish); }, [wish, ready]);
  useEffect(() => { if (ready) write("asl_coupon", coupon); }, [coupon, ready]);
  useEffect(() => { if (ready) write("asl_user", user); }, [user, ready]);
  useEffect(() => { if (ready) write("asl_orders", orders); }, [orders, ready]);
  useEffect(() => { if (ready) write("asl_reviews", reviews); }, [reviews, ready]);

  const ping = useCallback((msg) => {
    const id = ++tidRef.current;
    setToast({ id, msg });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2400);
  }, []);

  const signup = useCallback(({ name, phone, email }) => {
    setUser({ name: name.trim(), phone: phone.trim(), email: (email || "").trim(), city: "", district: "", street: "" });
    setAuthOpen(false);
    ping(`أهلًا ${name.trim()}! حسابك جاهز ✓`);
    return true;
  }, [ping]);

  const login = useCallback(({ name, phone, email, pass }) => {
    const nm = (name || "").trim();
    setUser((u) => ({
      name: nm || u?.name || "عميل أصل",
      phone: (phone || u?.phone || "").trim(),
      email: (email || u?.email || "").trim(),
      city: u?.city || "", district: u?.district || "", street: u?.street || "",
    }));
    setAuthOpen(false);
    ping("تم تسجيل الدخول ✓");
    return true;
  }, [ping]);

  const logout = useCallback(() => {
    setUser(null);
    ping("تم تسجيل الخروج — نراك قريبًا");
  }, [ping]);

  const updateUser = useCallback((patch) => {
    setUser((u) => ({ ...u, ...patch }));
    ping("تم تحديث بياناتك ✓");
  }, [ping]);

  const addUserReview = useCallback((pid, rv) => {
    setReviews((m) => ({ ...m, [pid]: [{ ...rv, ts: Date.now() }, ...(m[pid] || [])] }));
  }, [ping]);

  const updateOrder = useCallback((id, patch) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);

  const placeOrder = useCallback((order) => {
    setOrders((o) => [order, ...o]);
    setCart([]);
    setCoupon(false);
    return order;
  }, []);

  const addToCart = useCallback((p, opts = {}) => {
    const key = `${p.id}|${opts.color !== undefined ? opts.color : ""}|${opts.size !== undefined ? opts.size : ""}`;
    const step = Math.max(1, opts.qty || 1);
    const max = p.stock ?? 99;
    setCart((c) => {
      const i = c.findIndex((x) => x.key === key);
      if (i > -1) {
        const n = [...c];
        n[i] = { ...n[i], qty: Math.min(max, n[i].qty + step) };
        return n;
      }
      return [...c, { key, id: p.id, qty: Math.min(max, step), color: opts.color, size: opts.size }];
    });
    ping(`«${p.name}» انضاف للسلة ✓`);
  }, [ping]);

  const toggleWish = useCallback((p) => {
    setWish((w) => {
      const has = w.includes(p.id);
      ping(has ? `«${p.name}» خرج من المفضلة` : `«${p.name}» انضاف للمفضلة ♥`);
      return has ? w.filter((i) => i !== p.id) : [...w, p.id];
    });
  }, [ping]);

  const setQty = useCallback((key, d) => {
    const id = Number(key.split("|")[0]);
    const max = PRODUCTS.find((p) => p.id === id)?.stock ?? 99;
    setCart((c) => c
      .map((i) => (i.key === key ? { ...i, qty: Math.min(max, i.qty + d) } : i))
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
        cart, wish, coupon, drawer, toast, user, orders, reviews, authOpen,
        openDrawer: () => setDrawer(true), closeDrawer: () => setDrawer(false),
        openAuth: () => setAuthOpen(true), closeAuth: () => setAuthOpen(false),
        signup, login, logout, updateUser, addUserReview, placeOrder, updateOrder,
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
