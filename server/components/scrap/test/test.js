let scraper = require('../../scrap');
let dnitScraper = require('../dnit-scraper');
let fs = require('fs');
let captchaBreaker = require('../../captcha');


let vhs = [{
	placa: 'GXO8039',
	chassi: '9BD17141412053494',
	renavam: '00752942689',
	estado: 'dnit',
	tries: 3
}, {
	placa: 'PWK9996',
	chassi: '9321JD5J7FD028545',
	renavam: '01057945975',
	estado: 'dnit',
	tries: 3	
}]

scraper.scrap(vhs[0], (err, obj) => {
	console.log(err);
	console.log(obj);
});

// captchaBreaker.breakImg('/Users/glanna/captcha.bmp', function(err, captchaText) {
// 	console.log(captchaText);
// });

// let Xray = require('x-ray');
// let x = Xray();

// dnitScraper = new dnitScraper();

// let html = fs.readFileSync('./samples/DNIT Cidadão.html').toString();
// dnitScraper.scrap(html, (err, obj) => {
// 	console.log(JSON.stringify(obj));
// });

// x(html, {
//     'error': '#div-error ul li span',
//     'warning': '.container > label',
//     'labels': ['table tr th'],
//     'values': ['table tr td'],
//     'links': ['table tr td a@data-content']
// })(function(err, obj) {
//    // console.log(err);
//    //obj.resumo[0] = 'Número Autuação'
//    console.log(obj);
// });
