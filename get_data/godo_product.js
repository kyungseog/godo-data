'use strict'

const schedule = require('node-schedule');
const { DateTime } = require("luxon");

const util = require("../public/commonUtil.js");

const startDate = DateTime.now().minus({days: 1}).toFormat('yyyy-LL-dd');
const endDate = DateTime.now().toFormat('yyyy-LL-dd');
const pageNo = 1;

getProduct();

async function getProduct() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&searchDateType=regDt&startDate=${startDate}&endDate=${endDate}&page=${pageNo}`
    };

    const xmlRowData = await util.xmlData(options);
    const jsonData = await util.parseXml(xmlRowData);
    const goodsData = jsonData.data.return[0].goods_data;
    for(let i = 0; i < goodsData.length; i++) {
        const r = goodsData[i];
        const productData = [r.goodsNo[0],r.goodsNm[0],r.scmNo[0],r.scmCommissionGrade[0],r.goodsCd[0],r.brandCd[0],
            r.fixedPrice[0],r.goodsPrice[0],r.deliverySno[0],r.allCateCd[0]];
        for(let j = 0; j < r.optionData[0].length; j++) {
            const s = r.optionData[0][j];
            const optionData = [s.sno[0],s.goodsNo[0],s.optionPrice[0],s.optionCode[0],
                s.optionValue1[0],s.optionValue2[0],s.optionValue3[0],s.optionValue4[0]];
        }
    }
}