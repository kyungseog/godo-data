'use strict'

const request = require("request");
require("dotenv").config();

const partner_key = process.env.PARTNER_KEY;
const key = process.env.KEY;

module.exports.xmlData = function xmlData(options) {
    return new Promise( (resolve, reject) => {
        request(options, (err, response, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}

module.exports.key = {
    partner_key,
    key
}