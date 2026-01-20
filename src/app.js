import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



import authRoutes from "./routes/auth.routes.js";
import receptionRoutes from "./routes/reception.routes.js";
import adminBatchRoutes from "./routes/admin/batch.routes.js";
import adminInstallmentRoutes from "./routes/admin/installment.routes.js";
import adminReferenceRoutes from "./routes/admin/reference.routes.js";
import adminUserRoutes from "./routes/admin/user.routes.js";
import adminExamRoutes from "./routes/admin/exam.routes.js";
import adminReportRoutes from "./routes/admin/report.routes.js";
import adminAttendanceQrRoutes from "./routes/admin/attendanceQr.routes.js";
import studentRoutes from "./routes/students.route.js";
import admindashboardRoute from "./routes/admin/dashboard.routes.js"
import dtproutes from "./routes/DTP/dtp.routes.js"
import attendanceRoutes from "./routes/attendance/attendance.routes.js";




// import other routes later

const app = express();
app.use(cookieParser());

/**
 * CORS POLICY
 * - Allow only your frontend origins
 * - Allow Authorization header (JWT)
 * - Disallow credentials unless you really need cookies
*/
const allowedOrigins = [
  "http://localhost:5173",          // local Vite
  "http://localhost:5174",          // local Vite
  "http://localhost:5175",          // local Vite
  "http://localhost:5176",          // local Vite
  "http://localhost:5177",          // local Vite
  "https://your-frontend.vercel.app",
  "https://your-frontend.netlify.app",
  "https://milton-called-operating-subcommittee.trycloudflare.com",
  "http://10.201.250.122:5173",
  "https://cartridge-pontiac-internship-kenny.trycloudflare.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman / mobile apps
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/**
 * Global Middlewares
*/
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Health Check (Render expects this)
*/
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/**
 * Routes
*/
app.use("/api/auth", authRoutes);
app.use("/api/reception", receptionRoutes);
app.use("/api/admin/batches", adminBatchRoutes);
app.use("/api/admin/installments", adminInstallmentRoutes);
app.use("/api/admin", adminReferenceRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/admin", adminExamRoutes);
app.use("/api/admin", adminReportRoutes);
app.use("/api/admin", adminAttendanceQrRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", admindashboardRoute);
app.use("/api/dtp", dtproutes);
app.use("/api/clerk/attendance", attendanceRoutes);

/**
 * Global Error Handler
 * (Do NOT leak stack traces in prod)
 */
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
