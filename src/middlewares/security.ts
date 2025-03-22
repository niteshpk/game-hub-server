import helmet from "helmet";
import { Application } from "express";

// Basic Helmet configuration
const basicHelmet = helmet();

// Security middleware setup
export const setupSecurity = (app: Application): void => {
  // Use basic Helmet configuration
  app.use(basicHelmet);
};
