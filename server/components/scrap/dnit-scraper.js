'use strict';

let Xray = require('x-ray');
let x = Xray();
let logger = require('../log');

/*
 * Class to scrap site https://www.dnit.gov.br
 *
 * */
class DnitScraper {

    trimObj(obj) {
        logger.debug('scrap done, trimming object ', obj)
        if (obj && obj.resumo) {
            for (let i = 0; i < obj.resumo.length; i++) {
                obj.resumo[i] = obj.resumo[i].trim();
            }
        } 
    }
    
    scrap(html, callback) {
        let self = this;
        logger.info('Scraping html');
        x(html, {
            'error': '#div-error ul li span',
            'resumo': ['table tr th label, table tr td']
        })(function(err, obj) {
            self.trimObj(obj);
            if (err || obj.error) {
                if (!err) {
                    err = obj;
                }
                logger.error('scrap done with errors', err);
                return callback(err);
            }
            logger.info('scraped successfully ', obj);
            callback(null, obj);
        });
    }

}

module.exports = DnitScraper;