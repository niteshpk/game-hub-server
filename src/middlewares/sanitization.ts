import { Request, Response, NextFunction, Application } from "express";
import sanitizeHtml, { IOptions } from "sanitize-html";

// Sanitization options
const sanitizeOptions: IOptions = {
  allowedTags: [], // No HTML tags allowed
  allowedAttributes: {}, // No HTML attributes allowed
  disallowedTagsMode: "recursiveEscape" as const, // Escape any HTML content
};

// Function to deeply sanitize an object
const deepSanitize = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepSanitize(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = deepSanitize((obj as Record<string, unknown>)[key]);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }
  if (typeof obj === "string") {
    return sanitizeHtml(obj, sanitizeOptions) as unknown as T;
  }
  return obj;
};

// Sanitization middleware for request body
const bodySanitizer = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    req.body = deepSanitize(req.body);
  }
  next();
};

// Sanitization middleware for query parameters
const querySanitizer = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.query) {
    req.query = deepSanitize(req.query);
  }
  next();
};

// Sanitization middleware for URL parameters
const paramsSanitizer = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.params) {
    req.params = deepSanitize(req.params);
  }
  next();
};

// Response sanitization middleware
const responseSanitizer = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Store the original res.json function
  const originalJson = res.json;

  // Override the res.json function
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  res.json = function (data: unknown) {
    // Sanitize the response data
    const sanitizedData = deepSanitize(data);
    // Call the original json function with sanitized data
    return originalJson.call(this, sanitizedData);
  };

  next();
};

// Setup all sanitization middleware
export const setupSanitization = (app: Application): void => {
  // Sanitize request body
  app.use(bodySanitizer);

  // Sanitize query parameters
  app.use(querySanitizer);

  // Sanitize URL parameters
  app.use(paramsSanitizer);

  // Sanitize response data
  app.use(responseSanitizer);
};
