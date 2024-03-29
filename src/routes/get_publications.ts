import express from "express";
import { Publication } from "../entities/Publication";

const router = express.Router();

router.get("/api/publications", async (req, res) => {
  const { city } = req.body;

  const publications = await Publication.findBy({
    city: city,
  });

  return res.json(publications);
});

export { router as getPublicationsRouter };
