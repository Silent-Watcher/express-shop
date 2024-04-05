const Recaptcha = require('express-recaptcha').RecaptchaV2;
const { RECAPTCHA_SECRET_KEY, RECAPTCHA_SITE_KEY } = process.env;

const options = { hl: 'fa', callback: 'recaptchaCallback' };
const recaptcha = new Recaptcha(RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY, options);

module.exports = recaptcha;
