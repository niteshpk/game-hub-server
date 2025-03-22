import express from "express";
import RAWGApiClient from "../services/rawgApiClient.js";

const router = express.Router();

export default function setupGamesRoutes() {
  const gamesClient = new RAWGApiClient("/games");

  const BASE_URL = "/api/v1/games";

  // Get All Games
  router.get(`${BASE_URL}`, async (req, res) => {
    try {
      const games = await gamesClient.getAll({ params: req.query });

      res.json(games);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching games", details: error.message });
    }
  });

  // Get a Single Game by ID
  router.get(`${BASE_URL}/:id`, async (req, res) => {
    try {
      const { id } = req.params;

      const game = await gamesClient.get(id);

      res.json(game);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching game details", details: error.message });
    }
  });

  return router;
}
