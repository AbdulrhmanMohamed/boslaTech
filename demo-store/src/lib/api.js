async function post(path, body, timeout = 9000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = new Error(data.error || "تعذّر إرسال الطلب");
      err.code = data.code;
      err.status = r.status;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export const sendOrderEmail = (email, order) => post("/api/order-confirmation", { email, order });
export const requestPasswordReset = (email) => post("/api/forgot-password", { email });
export const resetPassword = (token, password) => post("/api/reset-password", { token, password });

export const verifyPayment = (paymentId) => post("/api/moyasar/verify", { id: paymentId }, 15000);
