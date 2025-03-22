declare global {
  namespace Express {
    interface Request {
      // Add custom properties to Request
      startTime?: [number, number]; // for request timing
    }

    interface Response {
      // Add custom properties to Response
      // Example: customField?: string;
    }
  }
}
