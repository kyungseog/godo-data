const request = require("request");
const { parseString } = require("xml2js");
require("dotenv").config();

const partner_key = process.env.PARTNER_KEY;
const key = process.env.KEY;
const startDate = '2022-09-20 23:00:00';
const endDate = '2022-09-20 23:05:00';

getDate();

async function getDate() {
    const options = { method: 'POST',
        url: `https://openhub.godo.co.kr/godomall5/order/Order_Search.php?partner_key=${partner_key}&key=${key}&dateType=order&startDate=${startDate}&endDate=${endDate}`
    };

    const xmlRowData = await xmlData(options);
    parseString(xmlRowData, function(err, result) {
        const jsonData = result.data.return[0].order_data;
        const orderGoodsData = jsonData.map( r => r.orderGoodsData);
        console.log(orderGoodsData[0].length);
    })
}

function xmlData(options) {
    return new Promise( (resolve, reject) => {
        request(options, (err, response, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}