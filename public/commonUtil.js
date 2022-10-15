'use strict'

const request = require("request");
const { App } = require("@slack/bolt");
const { parseString } = require("xml2js");
const mysql = require('mysql2');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config({path: path.join(__dirname, '/.env')});
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 1500
  });


const main_url = 'https://openhub.godo.co.kr/godomall5';
const main_key = `partner_key=${process.env.PARTNER_KEY}&key=${process.env.KEY}`;

module.exports.slackApp = new App({
    token: process.env.TOKEN,
    signingSecret: process.env.SIGNINGSECRET 
  });

module.exports.delayTime = ms => new Promise(res => setTimeout(res,ms));

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

module.exports.sqlData = function sqlData(query, data) {
    return new Promise((resolve, reject) => {
      db.query(query, data, (err, result) => {
          return err ? reject(err) : resolve(result);
      });
    });
  }

module.exports.param = {
    main_url,
    main_key,
    db
}