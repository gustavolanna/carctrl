let scraper = require('../../scrap');
let dnitScraper = require('../dnit-scraper');
let fs = require('fs');
let captchaBreaker = require('../../captcha');


let vhs = [{
	placa: 'GXO8039',
	chassi: '9BD17141412053494',
	renavam: '00752942689',
	estado: 'MG',
	tries: 3
}, {
	placa: 'PWK9996',
	chassi: '9321JD5J7FD028545',
	renavam: '01057945975',
	estado: 'MG',
	tries: 3	
}, {
	placa: 'HNU2386',
	chassi: '93XJRKB8TACA23284',
	renavam: '00214203468',
	estado: 'MG',
	tries: 3
}]

scraper.scrap(vhs[0], (err, obj) => {
	console.log(err);
	console.log(obj);
});

// captchaBreaker.breakImg('/Users/glanna/captcha.bmp', function(err, captchaText) {
// 	console.log(captchaText);
// });

// dnitScraper = new dnitScraper();

// let Xray = require('x-ray');
// let x = Xray();
// let html = fs.readFileSync('./samples/DNIT Cidadão-error.html').toString();

// x(html, {
//     'error': '.errorMessage li span',
//     'warning': '.container > label',
//     'labels': ['table tr th'],
//     'values': ['table tr td'],
//     'links': ['table tr td a@data-content']
// })(function(err, obj) {
//    // console.log(err);
//    //obj.resumo[0] = 'Número Autuação'
//    console.log(obj);
// });
