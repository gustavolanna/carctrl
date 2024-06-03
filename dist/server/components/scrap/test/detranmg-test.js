'use strict'

let captcha = require('../../captcha');
let sould = require('should');
let DetranMG = require('../detranmg');
let sinon = require('sinon');
let needle = require('needle');
let fs = require('fs');
let stream = require('stream');
let Scraper = require('../detranmg-scraper');
let scraper = new Scraper();

const SITE_URL = 'https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/consulta-a-situacao-do-veiculo';
const CAPTCHA_URL = 'https://www.detran.mg.gov.br/component/servicosmg/servico/-/captcha2/captcha/';
const CAPTCHA_IMAGE = './test/captcha.jpeg';
const JSON_SAMPLE = './test/detranmg.json';
const HTML_SAMPLE = './test/detranmgresult.html';

describe('Testing detranmg fetcher - captcha was broken succesfully', function() {

    beforeEach(function(done){
        global.result = JSON.parse(fs.readFileSync(JSON_SAMPLE));

        global.stubGet = sinon.stub(needle, 'get');
        stubGet.yields(null, {
            cookies: { SECCCAKEPHP: 'pqchtb15059oojvto273tatn95' }
        }); //cookie

        stubGet.onCall(1).returns(fs.createReadStream(CAPTCHA_IMAGE)); //captcha image

        global.stubPost = sinon.stub(needle, 'post');
        stubPost.yields(null, {body: 'test'});

        global.scrapStub = sinon.stub(Scraper.prototype, 'scrap');
        scrapStub.yields(null, global.result);

        global.captchaStub = sinon.stub(captcha, 'breakImg');
        captchaStub.yields(null, "captchaText");

        global.detranmg = new DetranMG();

        done();
    });

    it('it should return a json sample', function(done) {
        global.detranmg.scrap({placa: 'OWV2415', chassi: '9BRB29BT9E2037292', tries: 3}, function(err, obj) {
            obj.should.equal(result);
            done();
        });
    });

    it('it should not forget to delete the temporary file', function(done) {
        global.detranmg.scrap({placa: 'OWV2415', chassi: '9BRB29BT9E2037292', tries: 3}, function(err, obj) {
            fs.existsSync('OWV2415.jpeg').should.be.false;
            done();
        });
    });

    afterEach(function(){
        stubGet.restore();
        stubPost.restore();
        scrapStub.restore();
        captchaStub.restore();
    });

});

describe('Testing detranmg fetcher - captcha was not broken', function() {

    before(function(done){
        global.result = [{
            error: 'test'
        }];

        let opts = {
            cookies: {
                SECCCAKEPHP: 'pqchtb15059oojvto273tatn95'
            }
        }

        global.image = fs.createReadStream(CAPTCHA_IMAGE);

        global.stubGet = sinon.stub(needle, 'get');
        stubGet.withArgs(CAPTCHA_URL, opts).returns(image); //captcha image
        stubGet.withArgs(SITE_URL).yields(null, opts); //cookie

        global.stubPost = sinon.stub(needle, 'post');
        stubPost.yields(null, {body: 'test'});

        global.scrapStub = sinon.stub(Scraper.prototype, 'scrap');
        scrapStub.yields(null, global.result);

        global.captchaStub = sinon.stub(captcha, 'breakImg');
        captchaStub.yields(null, "captchaText");

        done();
    });

    it('it should return a image', function(done) {
        let detranmg = new DetranMG();
        detranmg.scrap({placa: 'OWV2415', chassi: '9BRB29BT9E2037292', tries: 3}, function(err, obj) {
            obj.should.be.an.instanceOf(stream.Writable);
            done();
        });
    });

    after(function(){
        stubGet.restore();
        stubPost.restore();
        scrapStub.restore();
        captchaStub.restore();
    });

});

describe('Testing detranmg fetcher - captcha was broken on the 2th try', function() {

    before(function(done){
        global.resulterr = [{
            error: 'test'
        }];

        global.resultok = JSON.parse(fs.readFileSync(JSON_SAMPLE));

        let opts = {
            cookies: {
                SECCCAKEPHP: 'pqchtb15059oojvto273tatn95'
            }
        }

        let body = {
            body: 'test'
        };

        global.image = fs.createReadStream(CAPTCHA_IMAGE);

        global.stubGet = sinon.stub(needle, 'get');
        stubGet.withArgs(CAPTCHA_URL, opts).returns(image); //captcha image
        stubGet.withArgs(SITE_URL).yields(null, opts); //cookie

        global.stubPost = sinon.stub(needle, 'post');
        stubPost.yields(null, body);

        global.scrapStub = sinon.stub(Scraper.prototype, 'scrap');
        scrapStub.onCall(0).callsArgWith(1, null, resulterr);
        scrapStub.onCall(1).callsArgWith(1, null, resultok);

        global.captchaStub = sinon.stub(captcha, 'breakImg');
        captchaStub.yields(null, "captchaText");

        done();
    });

    it('it should return a json sample on the 2th try', function(done) {
        let detranmg = new DetranMG();
        detranmg.scrap({placa: 'OWV2415', chassi: '9BRB29BT9E2037292', tries: 3}, function(err, obj) {
            obj.should.equal(resultok);
            done();
        });
    });

    after(function(){
        stubGet.restore();
        stubPost.restore();
        scrapStub.restore();
        captchaStub.restore();
    });

});

describe('Testing detranmg scraper', function() {

    it('it should scrap a sample html', function(done) {
        let html = fs.readFileSync(HTML_SAMPLE);
        scraper.scrap(html, function(err, obj) {
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
            obj[0].resumo.should.containEql('Situação Licenciamento')
            done();
        })
    });

})
