'use strict'

const request = require("request");
require("dotenv").config();

const partner_key = process.env.PARTNER_KEY;
const key = process.env.KEY;

const main_url = 'https://openhub.godo.co.kr/godomall5';
const main_key = `partner_key=${partner_key}&key=${key}`;

module.exports.xmlData = function xmlData(options) {
    return new Promise( (resolve, reject) => {
        request(options, (err, response, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}

module.exports.param = {
    main_url,
    main_key
}