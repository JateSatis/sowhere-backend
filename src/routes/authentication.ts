import { Router } from "express";
import { User } from "../entities/User";
import { generatePasswordHash, validatePassword } from "../jwt-utils/password";
import { issueJWT } from "../jwt-utils/jwt";
import { auth } from "../auth/authMiddleware";

const router = Router();


router.post("/api/register", async (req, res) => {
  const { firstName, lastName, password, email } = req.body;

  //# Проверяем нет ли уже такого пользователя. Если он есть, говорим пользователю, что он может
  //# залогинится по этому email
  const verifyUser = await User.findOneBy({
    email: email,
  });

  if (verifyUser) {
    return res.json({
      message: "User is already registered. Try to login.",
    });
  }

  //# Если новый пользователь, хешируем его пароль и создаем нового клиента в базе данных
  const passwordHash = generatePasswordHash(password);

  const user = User.create({
    passwordHash: passwordHash.hash,
    salt: passwordHash.salt,
    first_name: firstName,
    last_name: lastName,
    email,
  });

  await user.save();

  //# Отправляем пользователю информацию о созданном клиенте, а также JWT токен
  const jwt = issueJWT(user);

  return res.status(200).json({
    success: true,
    user: user,
    token: jwt.token,
    expiresIn: jwt.expires,
  });
});

router.post("/api/login", async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  //# Проверяем существует ли такой пользователь. Если нет, говорим об этом
  const user = await User.findOneBy({
    email: email,
  });

  if (!user) {
    res.status(401).json({
      message: "There is no user with this email and password",
    });
    return;
  }

  //# Если пользователь существуем, проверяем введенных пароль
  const isValid = validatePassword(password, user.passwordHash, user.salt);

  if (!isValid) {
    res.status(401).json({
      message: "Password is wrong",
    });
    return;
  }

  //# Если всё введено верно, отправляем пользователю данные клиента, а также JWT токен
  const jwt = issueJWT(user);

  return res.status(200).json({
    success: true,
    user: user,
    token: jwt.token,
    expiresIn: jwt.expires,
  });
});

//# Данный route использует наш пользовательский middleware под названием auth (его можно посмотреть
//# в src/auth/authMiddleware.ts)
router.get("/api/protected", auth, async (req, res) => {
  //# Если пользователь аутентифицирован, находим с помощью токена его данные в базе данных
  const jwt = req.body.jwt;

  const user_id = jwt.sub;

  const user = await User.findOneBy({
    id: user_id,
  });

  //# Возвращаем полученные данные
  res
    .status(200)
    .json({
      user: user,
    })
    .send();
});

export { router as authenticateRouter };
