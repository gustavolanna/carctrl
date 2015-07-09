"use strict"

let tesseract = require('node-tesseract');

module.exports.breakImg = function(fileName, callback) {
    let options = {
        l: 'eng',
        psm: 6
    };
    tesseract.process(fileName, options, function (err, captcha) {
        if (err) {
            callback(err);
        } else {
            callback(null, captcha ? captcha.trim() : captcha);
        }
    });
}