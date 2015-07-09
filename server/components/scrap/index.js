"use strict";

let Detranmg = require('./detranmg');
let scraper = new Detranmg();

function scrap(state, vehicle, callback) {
    if (state === 'MG') {
        scraper.scrap(vehicle, callback);
    }
}

module.exports = scrap;