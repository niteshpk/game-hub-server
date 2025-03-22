import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Function to get current date in YYYY-MM-DD format
const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Create a custom format for the logs
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: "error",
  format: logFormat,
  transports: [
    // Write error logs to daily files
    new winston.transports.File({
      filename: path.join(logsDir, `error-${getCurrentDate()}.log`),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 30, // Keep 30 days of logs
    }),
    // Also log errors to console in development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Error logging interface
interface ErrorContext {
  [key: string]: unknown;
}

// Create a function to log errors programmatically
export const logError = (error: Error, context: ErrorContext = {}): void => {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context,
  });
};

export { logger };
