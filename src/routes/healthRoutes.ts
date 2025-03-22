import express, { Router } from "express";

const router: Router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default router;
