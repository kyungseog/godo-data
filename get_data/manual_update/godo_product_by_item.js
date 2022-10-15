'use strict'

const { DateTime } = require("luxon");

const util = require("../../public/commonUtil.js");

const goodsNo = '1000006216';

getProduct();

async function getProduct() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&goodsNo=${goodsNo}`
    };

    const xmlRowData = await util.xmlData(options);
    const jsonData = await util.parseXml(xmlRowData);
    const goodsData = jsonData.data.return[0].goods_data;
    console.log(goodsData[0]);
}