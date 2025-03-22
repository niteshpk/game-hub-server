import express, { Router, Request, Response, RequestHandler } from "express";

const router: Router = express.Router();

export default function setupGenresRoutes(): Router {
  const BASE_URL = "/api/v1/health";

  // Get All Genres (with Redis caching)
  const getAllGenres: RequestHandler = async (_req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
  };

  router.get(`${BASE_URL}`, getAllGenres);

  return router;
}
