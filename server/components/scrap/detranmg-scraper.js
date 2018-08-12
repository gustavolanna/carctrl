'use strict';

let Xray = require('x-ray');
let x = Xray();
let async = require('async');
let logger = require('../log');
let needle = require('needle');

/*
 * Class to scrap site https://www.detran.mg.gov.br
 *
 * Look at test/detranmg.json to see a result sample
 *
 * */
class Scraper {

    getPages(obj) {
        logger.info('Scrap done, paginating result');
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

    scrapPenalties(opts) {
        let self = this;
        return function(obj, callback) {
            let pages = self.getPages(obj.info);
            async.eachSeries(pages, function(item, cb) {
                needle.get('https://www.detran.mg.gov.br' + item.link, opts, function(err, response){
                    x(response.body, {
                        'tipo': 'h3',
                        'infracao': ['.primeira_coluna label, .segunda_coluna p']
                    })
                    (function(err, detail) {
                        if (err) {
                            return cb(err);
                        }
                        obj.detalhes.push(detail);
                        cb();
                    });
                });
            }, function(err) {
                if (err) {
                    logger.error('Error when paginating', err);
                    callback(err);
                }
                logger.debug('Pagination done successfully');
                callback(null, obj);
            });
        }
    }

    scrapRestrictions(opts) {
        return function(obj, callback) {
            if (obj.info.restricoes) {
                needle.get('https://www.detran.mg.gov.br' + obj.info.restricoes, opts, function(err, response) {
                    x(response.body, {
                        'restricoes': ['.retorno-formulario > p'],
                    })
                    (function(err, data) {
                        if (err) {
                            return callback(err);
                        }
                        obj.info.restricoes = data.restricoes;
                        callback(null, obj)
                    })
                });
            } else {
                callback(null, obj);
            }
        }
    }

    scrapMainSite(html) {
        return function(callback) {            
            x(html, {
                'error': '.error-message',
                'situacao': '.retorno-formulario > span:nth-child(2)',
                'resumo': ['.primeira_coluna label, .segunda_coluna'],
                'infracoes': ['.abrir-fechar-table h3, .abrir-fechar-table table tbody tr td'],
                'restricoes': '.mais-opcoes p a[href^="/veiculos/situacao-do-veiculo/consulta-a-situacao-do-veiculo/-/consulta_impedimentos_veiculo"]@href',
                'detalhes': ['td a@href']
            })(function(err, obj) {
                logger.info('Scraping main site done ', obj);
                if (err || obj.error) {
                    if (!err) {
                        err = obj;
                    }
                    logger.error('scrap done with errors ', err);
                    return callback(err);
                }
                logger.debug('Scrap done successfully');
                for (let i = 0; i < obj.infracoes.length; i++) {
                    obj.infracoes[i] = obj.infracoes[i].trim();
                }
                obj.situacao = obj.situacao || '';
                if (obj.resumo) {
                    obj.resumo = obj.resumo.map(e => e.trim());
                }
                callback(null, {
                    info: obj,
                    detalhes: []
                });
            });
        }
    }

    scrap(html, callback, opts) {
        async.waterfall([
            this.scrapMainSite(html),
            this.scrapPenalties(opts),
            this.scrapRestrictions(opts)
        ], function(err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    }

}

module.exports = Scraper;