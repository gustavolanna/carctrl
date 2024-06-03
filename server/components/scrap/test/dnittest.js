let Xray = require('x-ray');
let x = Xray();

x('http://servicos.dnit.gov.br/multas/Login', {
    'url': '.BDC_CaptchaImageDiv img@src'
})((err, obj) => {
    console.error(err);
    console.log(obj);
    console.log(obj);
    console.log(obj);
    console.log(obj);
})