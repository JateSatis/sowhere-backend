import express from "express";
import { User } from "../entities/User";
import { Publication } from "../entities/Publication";
import { auth } from "../auth/authMiddleware";

const router = express.Router();

router.post("/api/create_publication", auth, async (req, res) => {
  const jwt = req.body.jwt;

  const userId = jwt.sub;

  const { title, contents, city } = req.body;

  const user = await User.findOneBy({
    id: parseInt(userId),
  });

  if (!user) {
    return res.json({
      message: "User not found",
    });
  }

  const publication = Publication.create({
    title: title,
    contents: contents,
    city: city,
    user: user,
  });

  await publication.save();

  await user.save();

  return res.json(publication);
});

export { router as createPublicatonRouter };
