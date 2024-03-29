import * as crypto from "crypto";
import * as fs from "fs";

/**
 * Generates an RSA keypair and saves the private and public keys as PEM files.
 * The keypair is generated synchronously using a modulus length of 4096 bits.
 * Both the private and public keys are saved in the PEM format, with the private
 * key being PKCS#1 encoded and the public key being PKCS#1 encoded.
 * The generated keys are saved in the current directory with the filenames
 * 'private_key.pem' for the private key and 'public_key.pem' for the public key.
 */
//# Создает пару приватный-публичный ключ
const generateKeypair = () => {
  const keypair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(__dirname + "/private_key.pem", keypair.privateKey);
  fs.writeFileSync(__dirname + "/public_key.pem", keypair.publicKey);
};

generateKeypair();
