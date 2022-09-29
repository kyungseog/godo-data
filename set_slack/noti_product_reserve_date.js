'use strict'

const { parseString } = require("xml2js");
const { DateTime } = require("luxon");
const util = require("../public/commonUtil.js");

const scmNo = 1;
const startDate = '2022-08-12';
const endDate = DateTime.now().toFormat('yyyy-LL-dd');
const addParam = `scmNo=${scmNo}&searchDateType=regDt&startDate=${startDate}&endDate=${endDate}`;

getProduct();

async function getProduct() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&${addParam}`
    };

    const xmlRowData = await util.xmlData(options);
    parseString(xmlRowData, function(err, result) {
    //   const totalRow = result.data.header[0].total;
        const jsonData = result.data.return[0].goods_data;
        const goodsData = jsonData.map( 
            r => [r.goodsNo[0],r.goodsNm[0],
                r.goodsDisplayMobileFl[0],r.goodsSellMobileFl[0],
                r.goodsCd[0], r.goodsReserveOrderMessage[0]] );
        console.log(goodsData);
    })
}