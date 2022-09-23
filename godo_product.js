'use strict'

const { parseString } = require("xml2js");
const util = require("./commonUtil.js");
const companyNm = '㈜원앤드원쇼핑'; //no 635
const startDate = '2022-09-22';
const endDate = '2022-09-22';

getProduct();

async function getProduct() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&startDate=${startDate}&endDate=${endDate}`
    };

    const xmlRowData = await util.xmlData(options);
    parseString(xmlRowData, function(err, result) {
      const totalRow = result.data.header[0].total;
        // const jsonData = result.data.return[0].code_data;
        // const codeData = jsonData.map( r => [r.scmNo[0],r.companyNm[0]] );
        console.log(totalRow);
    })
}