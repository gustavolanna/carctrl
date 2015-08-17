'use strict'

let needle = require('needle');
let Detran = require('./detran');
let captchaBreaker = require('../captcha');
let Dnit = require('./dnit-scraper');
let INVALID_CAPTCHA = 'Código de verificação inválido! Tente novamente!';
let LOGIN_URL = 'http://infracoes.dnit.gov.br/dnitcidadao/login.action';
let SITE_URL = 'http://infracoes.dnit.gov.br/dnitcidadao/login';
let CAPTCHA_URL = 'http://infracoes.dnit.gov.br/dnitcidadao/Captcha.jpg';
let DATA_URL = 'http://infracoes.dnit.gov.br/dnitcidadao/consultainfracoes';
let ERROR_CLASS = '#div-error ul li span';

module.exports = new Detran({
    scraper: new Dnit(),
    captcha: captchaBreaker,
    http: needle,
    loginUrl: LOGIN_URL,
    siteUrl: SITE_URL,
    captchaUrl: CAPTCHA_URL,
    dataUrl: DATA_URL,
    errorClass: ERROR_CLASS,
    invalidCaptchaMsg: INVALID_CAPTCHA,
    getLoginData: function(vehicle, captcha) {
        return {
            'envio': true,
            'placa': vehicle.placa,
            'renavam': vehicle.renavam,
            'captcha': captcha
        };
    }
});