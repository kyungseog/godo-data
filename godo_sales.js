'use strict'

const request = require("request");
const { parseString } = require("xml2js");
require("dotenv").config();

const partner_key = process.env.PARTNER_KEY;
const key = process.env.KEY;
const startDate = '2022-09-21 11:00:00';
const endDate = '2022-09-21 11:10:00';
const scmCode = 'S0000DIT';

getDate();

async function getDate() {
    const options = { method: 'POST',
        url: `https://openhub.godo.co.kr/godomall5/order/Order_Search.php?partner_key=${partner_key}&key=${key}&dateType=order&startDate=${startDate}&endDate=${endDate}`
    };

    const xmlRowData = await xmlData(options);
    parseString(xmlRowData, function(err, result) {
        const jsonData = result.data.return[0].order_data;
        const orderGoodsData = jsonData.map( r => r.orderGoodsData );
        let orderData = [];
        for( let i = 0; i < orderGoodsData.length; i++) {
            for (let j = 0; j < orderGoodsData[i].length; j++) {
                const r = orderGoodsData[i][j];
                if(r.scmCode[0] == scmCode) {
                    const data = [r.orderNo[0],r.orderStatus[0],r.scmCode[0],r.goodsNo[0],
                        r.listImageData[0],r.goodsNm[0],Number(r.goodsCnt[0]),Number(r.goodsPrice[0])];
                    orderData.push(data);
                }
            }
        }
        console.log(orderData);
    })
}

function xmlData(options) {
    return new Promise( (resolve, reject) => {
        request(options, (err, response, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}
