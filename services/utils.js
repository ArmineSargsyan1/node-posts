import cryptoJS from 'crypto-js';

export const encrypt = (text, key) => cryptoJS.AES.encrypt(text, key).toString();

export const decrypt = (ciphertext, key) => {
  const bytes = cryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(cryptoJS.enc.Utf8);
}

export default {
  encrypt,
  decrypt,
}
