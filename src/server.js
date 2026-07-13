import "dotenv/config";
import express       from "express";
import cors          from "cors";
import cookieParser  from "cookie-parser";
import helmet        from "helmet";

import connectDB        from "./config/db.js";
import authRoutes       from "./modules/auth/auth.routes.js";
import contentRoutes    from "./modules/content/content.routes.js";
import settingsRoutes   from "./modules/settings/settings.routes.js";
import uploadRoutes     from "./modules/upload/upload.routes.js";
import contactRoutes    from "./modules/contact/contact.routes.js";
import errorMiddleware  from "./middlewares/error.middleware.js";

// ─── Connect database ─────────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL     || "http://localhost:3000",
  process.env.DASHBOARD_URL  || "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: true, limit: "6mb" }));
app.use(cookieParser());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, data: { status: "ok", env: process.env.NODE_ENV } });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/content",  contentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload",   uploadRoutes);
app.use("/api/contact",  contactRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Global error handler (must be last) ──────────────────────────────────────
app.use(errorMiddleware);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} — ${process.env.NODE_ENV || "development"}`);
});

export default app;
