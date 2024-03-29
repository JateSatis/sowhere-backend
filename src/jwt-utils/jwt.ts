import * as jsonwebtoken from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

import { User } from "../entities/User";

const pathToPrivateKey = path.join(__dirname, "/private_key.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivateKey);

//# Создает JWT токен на основе приватного ключа и полученного клиента
/**
 * Creates and signs a JWT token using user id
 * @param user User object that should contain "id" property
 * @returns signed token
 */
const issueJWT = (user: User) => {
  const id = user.id;

  const expiresIn = "1d";

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

export { issueJWT };
