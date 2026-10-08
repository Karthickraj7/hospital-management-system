import CryptoJS from "crypto-js";

const SECRET_KEY = "Vesoftometic_123"; // Use env var in production

// 🔐 Encrypt any string or object
export const encrypt = (data) => {
  const stringData = typeof data === "string" ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
};

export const decrypt = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== "string") return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    // If it's JSON, return object; otherwise return raw string
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (err) {
    console.error("Decryption failed:", err.message);
    return null;
  }
};

