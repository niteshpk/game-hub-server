import { Request, Response, NextFunction, Application } from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { logError } from "../config/logger.js";

// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    logError(new Error("Rate limit exceeded"), {
      ip: req.ip,
      path: req.path,
      method: req.method,
      type: "RATE_LIMIT",
    });
    res.status(429).json({
      error: "Too Many Requests",
      message: "Please try again later.",
    });
  },
});

// Slow down configuration
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests before starting to slow down
  delayMs: (hits: number) => hits * 100, // Add 100ms of delay for each request after delayAfter
  maxDelayMs: 5000, // Maximum delay of 5 seconds
  skip: (req: Request) => req.path.startsWith("/health"), // Skip health check endpoints
});

// Response time monitoring middleware
export const responseTimeMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = process.hrtime();

  // Log response time when response is finished
  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

    // Log slow requests (over 1 second)
    if (duration > 1000) {
      logError(new Error("Slow request detected"), {
        path: req.path,
        method: req.method,
        duration: `${duration.toFixed(2)}ms`,
        type: "SLOW_REQUEST",
      });
    }
  });

  next();
};

// Performance monitoring setup
export const setupPerformanceMonitoring = (app: Application): void => {
  // Apply rate limiting to all routes
  app.use(rateLimiter);

  // Apply speed limiting to all routes
  app.use(speedLimiter);

  // Monitor response times
  app.use(responseTimeMonitor);
};
