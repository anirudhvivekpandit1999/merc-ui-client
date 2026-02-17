import CryptoJS from 'crypto-js';
import axios from 'axios';

const url = '';

const SECRET_KEY = CryptoJS.enc.Utf8.parse("qwertyuiopasdfghjklzxcvbnm123456");
const IV = CryptoJS.enc.Utf8.parse("1234567890123456");

function encryptData(data) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY,
    {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  // Convert Base64 output to Hex
  const ciphertextWords = CryptoJS.enc.Base64.parse(encrypted.toString());
  const hexCipherText = CryptoJS.enc.Hex.stringify(ciphertextWords);
  return hexCipherText;
}

function decryptData(encryptedHexData) {
  try {
    if (!encryptedHexData || encryptedHexData.length < 16) {
      console.warn("⚠️ Encrypted data is missing or too short:", encryptedHexData);
      return null;
    }

    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(encryptedHexData),
      },
      SECRET_KEY,
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(decryptedStr);
    } catch (jsonErr) {
      console.error("❌ JSON parse failed. Decrypted string:", decryptedStr);
      throw jsonErr;
    }

  } catch (error) {
    console.error("❌ Decryption error:", error.message);
    console.log("Raw encrypted input:", encryptedHexData);
    return null;
  }
}

async function postEncrypted(endpoint, data) {
  try {
    const encryptedPayload = encryptData(data);

    const response = await axios.post(endpoint, {
      encryptedData: encryptedPayload,
    });

    const encryptedResponse = response.data.data

    const decryptedResponse = decryptData(encryptedResponse);

    const resultRow = (
      decryptedResponse &&
      Array.isArray(decryptedResponse) &&
      decryptedResponse.length > 0 &&
      typeof decryptedResponse[0] === "object"
    )
      ? decryptedResponse[0]
      : decryptedResponse;

    return resultRow || {};
  } catch (error) {
    console.error("🚨 Secure POST Error:", error.message);
    throw error;
  } 
}


async function postEncrypted2(endpoint, data) {
  try {
    const encryptedPayload = encryptData(data);

    const response = await axios.post(endpoint, {
      encryptedData: encryptedPayload,
    });

    const encryptedResponse = response.data.data

    const decryptedResponse = decryptData(encryptedResponse);

    const resultRow  = decryptedResponse;

    return resultRow || {};
  } catch (error) {
    console.error("🚨 Secure POST Error:", error.message);
    throw error;
  } 
}


export {
  url,
  encryptData,
  decryptData,
  postEncrypted,
  postEncrypted2
};
