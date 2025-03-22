import cors from "cors";
import express, { Application } from "express";

// CORS middleware configuration
export const corsMiddleware = cors();

// Body parser middleware configuration
export const bodyParserMiddleware = express.json();

// Common middleware setup
export const setupCommonMiddleware = (app: Application): void => {
  app.use(corsMiddleware);
  app.use(bodyParserMiddleware);
};
