import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
import setupRedisRoutes from "./routes/redisRoutes.js";
import setupGamesRoutes from "./routes/gamesRoutes.js";
import setupGenresRoutes from "./routes/genresRoutes.js";
import setupPlatformsRoutes from "./routes/platformsRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import cors from "cors";

dotenv.config(); // Load environment variables

const DEFAULT_PORT = 5000;

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

app.use(cors()); // Enable CORS for all origins

// Create Redis Client
const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Redis Event Listeners
client.on("connect", () => console.log("✅ Connected to Redis Cloud"));
client.on("error", (err) => console.error("❌ Redis Error:", err));

// Connect to Redis
(async () => {
  console.log("Connecting to the Redis server...");
  await client.connect();
})();

// Routes
app.get("/", (req, res) => {
  res.send("Something is working!");
});

// Use Redis API routes
app.use(setupRedisRoutes(client));

// Use Games API routes
app.use(setupGamesRoutes(client));

// Use Genres API routes
app.use(setupGenresRoutes(client));

// Use Genres API routes
app.use(setupPlatformsRoutes(client));

// Health check route
app.use("/api/v1", healthRoutes);

// Start Server
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
