const crypto = require('crypto');

function encrypt(key, initializationVector, data) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    key,
    initializationVector
  );
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(key, initializationVector, encryptedData) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    initializationVector
  );
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
