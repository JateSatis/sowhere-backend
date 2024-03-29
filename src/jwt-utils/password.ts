import * as crypto from "crypto";

//# Хеширует пароль для сохранения этого хеша в базе данных
/**
 * Turns password into hash using random salt, then returns both hash and salt
 * @param password string representation of a password
 * @returns hashed value of the password and salt
 */
const generatePasswordHash = (password: string) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: passwordHash,
  };
};

//# Проверяет правильность введенного пароля по хешу в базе данных
/**
 * Gets the input password, hashes it and compares it to saved hash from the database
 * @param password string representation of a password
 * @param hash hash of password saved in database
 * @param salt random salt that was used to get the hash
 * @returns boolean value that corresponds to is the password valid
 */
const validatePassword = (password: string, hash: string, salt: string) => {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return verifyHash === hash;
};

export { generatePasswordHash, validatePassword };
