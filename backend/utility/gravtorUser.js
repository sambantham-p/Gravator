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

function GravatarEmail(email) {
  const emailHash = hashEmail(email);
  const gravatarEmail = `https://www.gravatar.com/${emailHash}.json`;
  return gravatarEmail;
}

module.exports = GravatarEmail;
