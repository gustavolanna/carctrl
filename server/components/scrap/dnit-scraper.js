'use strict';

let Xray = require('x-ray');
let x = Xray();
let logger = require('../log');
/*

 Class to scrap site https://www.dnit.gov.br 

 for a payload sample see ./test/samples/dnit.json

*/

class DnitScraper {


    trimStr(str) {
        let result = str;
        result = result ? str.trim() : result;
        result = result ? result.replace(/\t/g, '') : result; 
        result = result ? result.replace(/\n/g, ' ') : result;
        result = result ? result.replace(/\s\s/g, ' ') : result;
        return result;
    }

    createArray(obj) {
        const result = []
        let i = 0;
        if (obj.labels) {
            while (i < obj.labels.length) {                
                result.push({
                    'infracao': obj.values[i],
                    'local': obj.values[i + 1],
                    'dataHora': this.trimStr(obj.values[i + 2]),
                    'codigo': this.trimStr(obj.values[i + 3]),
                    'valorPermitido': obj.values[i + 4],
                    'valorConsiderado': obj.values[i + 5],
                    'valorMedio': obj.values[i + 6],
                    'status': obj.values[i + 7],
                    'valor': obj.values[i + 8],
                    'valorPagar': obj.values[i + 9],
                    'faseAtual': obj.values[i + 10],
                    'boleto': this.trimStr(obj.values[i + 11]),
                    'descricao': obj.links[i / 12]
                });
                i += 12;
            }
        }
        return result;
    }
    
    scrap(html, callback) {
        let self = this;
        logger.info('Scraping html');
        x(html, {
            'error': '#div-error ul li span',
            'warning': '.container > label',
            'labels': ['table tr th'],
            'values': ['table tr td'],
            'links': ['table tr td a@data-content']
        })(function(err, obj) {
            if (err || obj.error) {
                if (!err) {
                    err = obj;
                }
                return callback(err);
            }
            callback(null, self.createArray(obj));
        });
    }

}

module.exports = DnitScraper;