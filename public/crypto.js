import crypto from "crypto";

// // Use a key of 32 bytes (256 bits) for AES-256

// // 16 bytes for AES
// const encrypt = (data, userKey) => {
//   const key = crypto.scryptSync(userKey, "salt", 32); // Deriving a secure key
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
//   let encrypted = cipher.update(data, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return { iv: iv.toString("hex"), encryptedData: encrypted }; // Return IV and encrypted data
// };

// const decrypt = (iv, encryptedData, userKey) => {
//   const key = crypto.scryptSync(userKey, "salt", 32);
//   console.log(key);
//   const decipher = crypto.createDecipheriv(
//     "aes-256-cbc",
//     key,
//     Buffer.from(iv, "hex")
//   );
//   let decrypted = decipher.update(encryptedData, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// };

// export default decrypt;

// const data =
//   ;

//   const iv="fda99eb2414864b564c9429a63d8dc90";
//   const decryptedData = decrypt(iv, data, "shivam");
//   // console.log("Decrypted data:", decryptedData);
//   const blob = base64ToBlob(decryptedData, "application/octet-stream");
//   const url = URL.createObjectURL(blob);
//   console.log("File retrieved:", blob);


//   function base64ToBlob(base64Data, contentType) {
//     const byteCharacters = atob(base64Data); // Decode base64 string
//     const byteNumbers = new Array(byteCharacters.length)
//       .fill()
//       .map((_, i) => byteCharacters.charCodeAt(i));
//     const byteArray = new Uint8Array(byteNumbers);

//     return new Blob([byteArray], { type: contentType }); // Create a Blob from the byte array
//   }
  




// Secret key for encryption (must be the same for encryption and decryption)
const secretKey = 'my-secret-key-123';

// Encrypt Function
function encrypt(text) {
  const ciphertext = crypto.AES.encrypt(text, secretKey).toString();
  return ciphertext;
}

// Decrypt Function
function decrypt(ciphertext) {
  const bytes = crypto.AES.decrypt(ciphertext, secretKey);
  const originalText = bytes.toString(crypto.enc.Utf8);
  return originalText;
}

// Example Usage
const text = "Hello, Node.js!";
const encryptedText = encrypt(text);
console.log("Encrypted:", encryptedText);

const decryptedText = decrypt(encryptedText);
console.log("Decrypted:", decryptedText);
