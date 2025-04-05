const crypto = require('crypto');

function hashEmail(email) {
  const emailTrim = email.trim();
  const emailLowerCase = emailTrim.toLowerCase();
  const emailHash = crypto
    .createHash('sha256')
    .update(emailLowerCase)
    .digest('hex');
  return emailHash;
}

function GravatorEmail(email) {
  const emailHash = hashEmail(email);
  const gravatorEmail = `https://www.gravatar.com/${emailHash}.json`;
  return gravatorEmail;
}

module.exports = GravatorEmail;
