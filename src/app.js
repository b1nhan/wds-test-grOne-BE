import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./routes/test.route.js";
import router from "./routes/routes.js";

const app = new Hono();

// Setup CORS
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, mobile apps, server-to-server)
    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, origin); // allow only the requesting origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Logger to debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// test
app.route("/api/test", authRoutes);

app.use("/api", router);

app.get("/", (c) => c.text("hi"));

export default app;

