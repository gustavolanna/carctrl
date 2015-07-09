"use strict";

let needle = require('needle');
let captcha = require('../captcha');
let Scraper = require('./detranmg-scraper');
let fs = require('fs');
let scraper = new Scraper();
let debug = require('debug')('detran');
let util = require('util');

const POST_URL = 'https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/consulta-a-situacao-do-veiculo/-/exibe_dados_veiculo/';
const SITE_URL = 'https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/consulta-a-situacao-do-veiculo';
const CAPTCHA_URL = 'https://www.detran.mg.gov.br/component/servicosmg/servico/-/captcha2/captcha/';

/*
 * Class to fetch fields, cookies and captcha from site https://www.detran.mg.gov.br
 *
 * */
class DestranMG {

    postData(captcha, opts, vehicle, callback) {
        debug('[' + vehicle.placa + '] posting data');

        let postData = {
            'data[ConsultarSituacaoVeiculo][placa]': vehicle.placa,
            'data[ConsultarSituacaoVeiculo][chassi]': vehicle.chassi,
            'data[ConsultarSituacaoVeiculo][captcha]': captcha
        };

        let self = this;

        needle.post(POST_URL, postData, opts, function(err, response) {
            if (err) {
                debug('[' + vehicle.placa + '] error when posting data');
                return callback(err);
            }
            debug('[' + vehicle.placa + '] scraping site');
            scraper.scrap(response.body, function(err, obj) {
                if (err) {
                    debug('[' + vehicle.placa + '] error when scraping: ' + util.inspect(err, { showHidden: true, depth: null }));
                    callback(err);
                }
                if (obj.length && obj[0].error) {
                    vehicle.tries--;
                    debug('[' + vehicle.placa + '] invalid captcha, trying again (' + vehicle.tries + ')');
                    return self.scrap(vehicle, callback);
                }
                debug('[' + vehicle.placa + '] no error returning object');
                callback(null, obj);
            });
        });
    }

    scrap(vehicle, callback) {
        debug('[' + vehicle.placa + '] trying ' + vehicle.tries);
        let self = this;

        needle.get(SITE_URL, function (error, response) {
            debug('[' + vehicle.placa + '] getting cookie ');
            if (error) {
                return callback(error);
            }

            let opts = {
                cookies: response.cookies
            };
            let fileName = vehicle.placa  + '.jpeg';
            let image = fs.createWriteStream(fileName);

            image.on('close', function () {
                if (vehicle.tries > 0) {
                    debug('[' + vehicle.placa + '] breaking captcha ');
                    captcha.breakImg(fileName, function(err, captchaText) {
                        fs.unlink(vehicle.placa + '.jpeg');
                        if (err) {
                            debug('[' + vehicle.placa + '] error when breaking captcha');
                            return callback(err);
                        }
                        self.postData(captchaText, opts, vehicle, callback);
                    })
                } else {
                    callback(null, image);
                }
            });

            needle.get(CAPTCHA_URL, opts).pipe(image);
        });

    }
}

module.exports = DestranMG;
