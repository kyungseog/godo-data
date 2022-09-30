'use strict'

const request = require("request");
const { App } = require("@slack/bolt")
require("dotenv").config();

const main_url = 'https://openhub.godo.co.kr/godomall5';
const main_key = `partner_key=${process.env.PARTNER_KEY}&key=${process.env.KEY}`;

module.exports.slackApp = new App({
    token: process.env.TOKEN,
    signingSecret: process.env.SIGNINGSECRET 
  });
  

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