'use strict';

let fs = require('fs');
let logger = require('../log');
let TIMEOUT = 60000 * 2;
let USER_AGENT = 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36';
let defaultOpts = {
    user_agent: USER_AGENT,
    timeout: TIMEOUT
}
let fileCount = 0;
let Xray = require('x-ray');
let x = Xray();
let os = require('os');
let util = require('util');

/*
 * Base class to fetch fields, cookies and captcha from detran's site
 *
 * */
class Detran {

    /*
    *  opts - an object with the following definition 
    *  {
    *       scraper: scraper object to extract site informations.
    *       captcha: captcha breaker object
    *       http: http object to do get and post against site
    *       loginUrl: Url of post vehicle data with broken captcha
    *       siteUrl: Url to get the session cookie
    *       captchaUrl: Url of the captcha image
    *       dataUrl: Url which contains vehicle data information (OPTINAL where login page already contains all the information)
    *       errorClass: jQuery selector to error classes. It will be used to extract error messages from login page,
    *       invalidCaptchaMsg: Message that indicates an invalid captcha message, so in this case we will try again,
    *       getLoginData: function(vehicle, captcha) {
    *           it should return the data structure needed to do login (vehicle Placa, chassi, renavam and the captcha)
    *       }
    *  }
    **/
    constructor(opts) {
        this.scraper = opts.scraper;
        this.captcha = opts.captcha;
        this.http = opts.http;
        this.params = opts;
    }

    parseHtml(html, vehicle, callback) {
        logger.info('[%s] scraping site', vehicle.placa);
        this.scraper.scrap(html, function(err, obj) {
            if (err) {
                logger.error('[%s] scraping site', vehicle.placa, err);
                return callback(err);
            }
            logger.info('[%s] scraped successfully, returning object', vehicle.placa, obj);
            callback(null, obj);
        });
    }

    validateLogin(html, callback) {
        let self = this;
        logger.info('Checking login errors');
        x(html, {
            'error': self.params.errorClass
        })(function(err, obj) {
            if (err || (obj && obj.error && obj.error === self.params.invalidCaptchaMsg)) {
                err = err ? err : obj;
                logger.info('login validated with erros', util.inspect(err, { showHidden: true, depth: null }));
                return callback(err);
            }
            if (obj && obj.error) {
                logger.info('vehicle not found on site ', obj);
                return callback(null, {warning: obj.error.trim()});
            }
            logger.info('login successfully');
            callback(null,  null);
        });        
    }

    /*
    *   private function to login in the site
    *
    **/
    login(captcha, opts, vehicle, callback) {
        logger.info('[%s] posting data', vehicle.placa);
        let loginData = this.params.getLoginData(vehicle, captcha);
        let self = this;
        this.http.post(this.params.loginUrl, loginData, opts, function(err, response) {
            if (err) {
                logger.error('[%s] error on login', vehicle.placa);
                return callback(err);
            }
            logger.info('[%s] verifying login errors', vehicle.placa);
            self.validateLogin(response.body, function(err, notFoundObj) {
                if (err) {
                    vehicle.tries--;
                    logger.warn('[%s] invalid captcha, trying again (%d)', vehicle.placa, vehicle.tries);
                    return self.scrap(vehicle, callback);                    
                }
                if (notFoundObj) {
                    return callback(null, notFoundObj);
                }
                if (self.params.dataUrl) {
                    logger.info('getting data from %s', self.params.dataUrl);
                    self.http.get(self.params.dataUrl, opts, function(err, response) {
                        logger.info('parsing data from %s', self.params.dataUrl);
                        self.parseHtml(response.body, vehicle, callback);
                    });
                } else {
                    self.parseHtml(response.body, vehicle, callback);
                }
            });
        });
    }

    createImage(vehicle, opts, callback) {
        let fileName = os.tmpdir() + '/' + vehicle.placa + '-' + (fileCount++) + '.jpeg';
        logger.info('Saving temporary file %s', fileName);
        if (fileCount >= Number.MAX_SAFE_INTEGER)  {
            fileCount = 0;
        }
        let image = fs.createWriteStream(fileName);
        let self = this;
        image.on('close', function () {
            if (vehicle.tries > 0) {
                logger.info('[%s] breaking captcha', vehicle.placa);
                self.captcha.breakImg(fileName, function(err, captchaText) {
                    fs.unlink(fileName);
                    if (err) {
                        logger.error('[%s] error when breaking captcha', vehicle.placa, err);
                        return callback(err);
                    }
                    logger.info('Captcha %s', captchaText);
                    self.login(captchaText, opts, vehicle, callback);
                });
            } else {                
                logger.info('Unable to break captcha, returning file ', {
                    file: fileName
                });
                callback(null, {
                    file: fileName,
                    opts: opts,
                    vehicle: vehicle
                });
            }
        });
        return image;
    }

    scrap(vehicle, callback) {
        logger.info('[%s] trying to scrap - %d', vehicle.placa, vehicle.tries);
        let self = this;

        this.http.get(this.params.siteUrl, defaultOpts, function (error, response) {
            if (error) {
                return callback(error);
            }
            logger.info('cookies: ', response.cookies);
            let opts = {
                cookies: response.cookies,
                user_agent: USER_AGENT,
                timeout: TIMEOUT
            }
            self.http.get(self.params.captchaUrl, opts).pipe(self.createImage(vehicle, opts, callback));
        });

    }
}

module.exports = Detran;