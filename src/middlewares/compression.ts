import compression, { CompressionOptions } from "compression";
import { Application, Request, Response } from "express";

// Compression filter function
const shouldCompress = (req: Request, res: Response): boolean => {
  // Don't compress responses with this request header
  if (req.headers["x-no-compression"]) {
    return false;
  }

  // Use compression filter function
  return compression.filter(req, res);
};

// Compression options
const compressionOptions: CompressionOptions = {
  // Only compress responses above 1KB
  threshold: 1024,
  // Compression level (1-9, higher = better compression but slower)
  level: 6,
  // Filter function to determine what to compress
  filter: shouldCompress,
};

// Create compression middleware
const compressionMiddleware = compression(compressionOptions);

// Compression middleware setup
export const setupCompression = (app: Application): void => {
  app.use(compressionMiddleware);
};
