'use strict'

const request = require("request");
const { App } = require("@slack/bolt");
const { parseString } = require("xml2js");
const path = require('path');
const dotenv = require("dotenv");
dotenv.config({path: path.join(__dirname, '/.env')});

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

module.exports.parseXml = function parseXml(xml) {
    return new Promise( (resolve, reject) => {
        parseString(xml, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}

module.exports.param = {
    main_url,
    main_key
}