import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./routes/test.route.js";
import router from "./routes/routes.js";

const app = new Hono();

// Setup CORS
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow requests with no origin (e.g., curl, mobile apps, server-to-server)
      if (!origin) return "*";
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return null; // Block other origins
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Logger middleware
app.use("*", async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.path}`);
  await next();
});

// test
app.route("/api/test", authRoutes);

// API v1 - use route() instead of use() for proper mounting
app.route("/api/v1", router);

app.get("/", (c) => c.text("hi"));

export default app;

