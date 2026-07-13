// Global error handler — must be last middleware in server.js
const errorMiddleware = (err, req, res, next) => {
  const status  = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";
  console.error(`[error] ${req.method} ${req.originalUrl} → ${status}: ${message}`);
  res.status(status).json({ success: false, message });
};

export default errorMiddleware;
