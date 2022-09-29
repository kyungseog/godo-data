'use strict'

const { parseString } = require("xml2js");
const util = require("../public/commonUtil.js");
const companyNm = '㈜원앤드원쇼핑'; //no 635
const scmNo = 635
const startDate = '2022-09-22';
const endDate = '2022-09-22';
const goodsNo = 1000008154;

getProduct();

async function getProduct() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&scmNo=${scmNo}&searchDateType=regDt&startDate=2022-09-25&endDate=2022-09-28`
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