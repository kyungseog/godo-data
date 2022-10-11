'use strict'

const util = require("../public/commonUtil.js");
const companyNm = '㈜원앤드원쇼핑'; //no 635
const scmNo = 635
const startDate = '2022-09-22';
const endDate = '2022-09-22';
const goodsNo = 1000008154;

getProduct();

async function getProduct() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&cateCd=064`
    };

    const xmlRowData = await util.xmlData(options);
    const jsonData = await util.parseXml(xmlRowData);
    const goodsData = jsonData.data.return[0].goods_data;
    console.log(goodsData);
}