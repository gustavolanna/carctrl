'use strict';

let should = require('should');
let assert = require('assert');
let scrap = require('../index');
let stream = require('stream');

describe('Testing detranmg', function() {

    it('it should return a complete object', function(done) {
        this.timeout(30000);

        scrap('MG', {placa: 'OWV2415', chassi: '9BRB29BT9E2037292', tries: 10}, function(err, obj) {
            should.equal(null, err);
            if (obj) {
                obj.should.not.be.instanceOf(stream.Stream);
                obj[0].should.have.property('situacao');
                obj[0].should.have.property('resumo');
                obj[0].resumo.should.containEql('Placa:');
                obj[0].resumo.should.containEql('Placa:');
                obj[0].resumo.should.containEql('Placa Anterior:');
                obj[0].resumo.should.containEql('Município:');
                obj[0].resumo.should.containEql('Município Anterior:');
                obj[0].resumo.should.containEql('Marca:');
                obj[0].resumo.should.containEql('Ano de Fabricação:');
                obj[0].resumo.should.containEql('Ano do Modelo:');
                obj[0].resumo.should.containEql('IPVA Pago:');
                obj[0].resumo.should.containEql('Parcela:');
                obj[0].resumo.should.containEql('Seguro Pago:');
                obj[0].resumo.should.containEql('Parcela:');
                obj[0].resumo.should.containEql('Seguro Anterior Pago:');
                obj[0].resumo.should.containEql('Taxa Licenciamento Paga:');
                obj[0].resumo.should.containEql('Data Licenciamento:');
                obj[0].resumo.should.containEql('Situação Licenciamento');
                if (obj.length > 1) {
                    obj[1][0].infracao.should.containEql('Placa:');
                    obj[1][0].infracao.should.containEql('Situação:');
                    obj[1][0].infracao.should.containEql('Marca/Cor:');
                    obj[1][0].infracao.should.containEql('Código:');
                    obj[1][0].infracao.should.containEql('Data:');
                    obj[1][0].infracao.should.containEql('Hora:');
                    obj[1][0].infracao.should.containEql('Descrição:');
                    obj[1][0].infracao.should.containEql('Local:');
                    obj[1][0].infracao.should.containEql('Município:');
                    obj[1][0].infracao.should.containEql('Incluída em:');
                    obj[1][0].infracao.should.containEql('Número AIT:');
                    obj[1][0].infracao.should.containEql('Número Processamento:');
                }
            }
            done();
        });
    });

});