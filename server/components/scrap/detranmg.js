'use strict'

let needle = require('needle');
let Detran = require('./detran');
let captchaBreaker = require('../captcha');
let DetranMG = require('./detranmg-scraper');
let INVALID_CAPTCHA = "Os caracteres da imagem não foram preenchidos corretamente. Por favor, preencha os dados novamente.";
let LOGIN_URL = 'https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/consulta-a-situacao-do-veiculo/-/exibe_dados_veiculo/';
let SITE_URL = 'https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/consulta-a-situacao-do-veiculo';
let CAPTCHA_URL = 'https://www.detran.mg.gov.br/component/servicosmg/servico/-/captcha2/captcha/';
let ERROR_CLASS = '.error-message, #flashMessage, .uma_coluna';

module.exports = new Detran({
	scraper: new DetranMG(),
	captcha: captchaBreaker,
	http: needle,
	loginUrl: LOGIN_URL,
	siteUrl: SITE_URL,
	captchaUrl: CAPTCHA_URL,
    errorClass: ERROR_CLASS,
    invalidCaptchaMsg: INVALID_CAPTCHA,
	getLoginData: function(vehicle, captcha) {
		return {
            'data[ConsultarSituacaoVeiculo][placa]': vehicle.placa,
            'data[ConsultarSituacaoVeiculo][chassi]': vehicle.chassi,
            'data[ConsultarSituacaoVeiculo][captcha]': captcha
        };
	}
});