import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_ROUTES = {
  "order-confirmation": "/api/order-confirmation.js",
  "forgot-password": "/api/forgot-password.js",
  "reset-password": "/api/reset-password.js",
  "moyasar/verify": "/api/moyasar/verify.js",
};

function localApi() {
  return {
    name: "asl-local-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || "").split("?")[0];
        if (!path.startsWith("/api/")) return next();
        const file = API_ROUTES[path.replace("/api/", "").replace(/\/+$/, "")];
        if (!file) return next();
        try {
          const mod = await server.ssrLoadModule(file);
          await mod.default(req, res);
        } catch (err) {
          console.error("[local-api]", err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ error: "خطأ في الخادم المحلي" }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [k, v] of Object.entries(env)) process.env[k] = v;

  return { plugins: [react(), tailwindcss(), localApi()] };
});
