"use strict";

let Xray = require('x-ray');
let x = Xray();
let async = require('async');
let debug = require('debug')('detranmg-scraper');
/*
 * Class to scrap site https://www.detran.mg.gov.br
 *
 * Look at test/detranmg.json to see a result sample
 *
 * */
class Scraper {

    getPaginationObj(obj) {
        let result = [];
        let link = 0;
        let i = 0, inc = 2;
        while (i < obj.infracoes.length) {
            if (obj.infracoes[i] === 'Autuação') {
                i ++;
            }
            if (obj.infracoes[i] === 'Multa') {
                i++;
                inc = 3;
            }
            result.push({
                limit: obj.infracoes[i + 1],
                link: obj.detalhes[link++]
            });
            i += inc;
        }
        return result;
    }

    scrap(html, callback) {
        let result = [];
        let self = this;
        debug('Scraping html');
        x(html, {
            'error': '.error-message',
            'situacao': '.retorno-formulario > span:nth-child(2)',
            'resumo': ['.primeira_coluna label, .segunda_coluna p'],
            'infracoes': ['.abrir-fechar-table h3, .abrir-fechar-table table tbody tr td'],
            'detalhes': ['td a@href']
        })(function(err, obj) {
            debug('Scraping done');
            if (err) {
                debug('scrap done with errors ' + util.inspect(err, { showHidden: true, depth: null }));
                return callback(err);
            }
            result.push(obj);
            for (let i = 0; i < obj.infracoes.length; i++) {
                obj.infracoes[i] = obj.infracoes[i].trim();
            }
            if (obj.detalhes.length === 0) {
                callback(null, result);
            } else {
                //console.log('scraping details');
                var pages = self.getPaginationObj(obj);
                async.each(pages, function(item, cb) {
                    x('https://www.detran.mg.gov.br' + item.link, {
                        'tipo': 'h3',
                        'infracao': ['.primeira_coluna label, .segunda_coluna p']
                    })
                    .paginate('.acoes p a@href')
                    .limit(item.limit)
                    (function(err, detail) {
                        //console.log('scraping details ok');
                        if (err) {
                            return callback(err);
                        }
                        result.push(detail);
                        cb();
                    })
                }, function() {
                    //console.log('async done');
                    callback(null, result);
                });
            }
        });
    }

}

module.exports = Scraper;