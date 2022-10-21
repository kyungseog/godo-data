'use strict'

const schedule = require('node-schedule');
const { DateTime } = require("luxon");

const util = require("../public/commonUtil.js");

const startDate = DateTime.now().minus({days: 1}).toFormat('yyyy-LL-dd');
const endDate = DateTime.now().toFormat('yyyy-LL-dd');

const getProductRule = new schedule.RecurrenceRule();
getProductRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
getProductRule.hour = 4;
getProductRule.minute = 40;
schedule.scheduleJob("getProductData", getProductRule, function(){
    getCount();
});

async function getCount() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&searchDateType=modDt&startDate=${startDate}&endDate=${endDate}`
    };

    const xmlRowData = await util.xmlData(options);
    const jsonData = await util.parseXml(xmlRowData);
    const pageCount = Number(jsonData.data.header[0].max_page[0]);
    console.log("total page count : ", pageCount);
    for(let i = 0; i < pageCount; i++) {
        let data = await getProduct(i + 1);
        console.log(i + 1,"/",pageCount,data);
    };
}

async function getProduct(pageNo) {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&searchDateType=modDt&startDate=${startDate}&endDate=${endDate}&page=${pageNo}`
    };

    const xmlRowData = await util.xmlData(options);
    const jsonData = await util.parseXml(xmlRowData);
    const goodsData = jsonData.data.return[0].goods_data;
    console.log("update product count: ", goodsData.length);
    for(let i = 0; i < goodsData.length; i++) {
        const r = goodsData[i];
        const productData = [r.goodsNo[0],r.goodsNm[0],r.scmNo[0],r.scmCommissionGrade[0],r.goodsCd[0],r.brandCd[0],
            Number(r.fixedPrice[0]),Number(r.goodsPrice[0]),r.deliverySno[0],r.allCateCd[0],r.goodsDisplayFl[0],
            r.goodsDisplayMobileFl[0],r.goodsSellFl[0],r.goodsSellMobileFl[0],
            r.listImageData == undefined ? null : r.listImageData[0]._,r.regDt[0],r.modDt[0] == '' ? null : r.modDt[0]];
        const insertProductSql = `INSERT INTO gododb.api_products (goods_no, goods_name, scm_no, scm_commission_grade, 
                goods_code, brand_code, fixed_price, goods_price, delivery_sno, all_category_code,
                goods_display_flag, goods_display_mobile_flag, goods_sell_flag, goods_sell_mobile_flag, list_image_data,
                registration_date, modification_date) VALUES (?)
            ON DUPLICATE KEY UPDATE goods_name=values(goods_name), scm_no=values(scm_no), 
                scm_commission_grade=values(scm_commission_grade), goods_code=values(goods_code), brand_code=values(brand_code),
                fixed_price=values(fixed_price), goods_price=values(goods_price), delivery_sno=values(delivery_sno),
                all_category_code=values(all_category_code),goods_display_flag=values(goods_display_flag),
                goods_display_mobile_flag=values(goods_display_mobile_flag),goods_sell_flag=values(goods_sell_flag),
                goods_sell_mobile_flag=values(goods_sell_mobile_flag),list_image_data=values(list_image_data),
                registration_date=values(registration_date),modification_date=values(modification_date)`;
        util.param.db.query(insertProductSql, [productData]);
        if(r.optionData) {
            console.log("update option count: ", r.optionData.length);
            for(let j = 0; j < r.optionData.length; j++) {
                const s = r.optionData[j];
                const optionData = [s.sno[0],s.goodsNo[0],s.optionPrice[0],s.optionCode[0],
                    s.optionValue1[0],s.optionValue2[0],s.optionValue3[0],s.optionValue4[0],
                    s.optionImage ?? s.optionImage[0],s.optionViewFl[0],s.optionSellFl[0],s.optionDeliveryFl[0],
                    s.regDt[0],s.modDt[0] == '' ? null : s.modDt[0]];
                const insertoptionSql = `INSERT INTO gododb.api_options (sno, goods_no, option_price, option_code, 
                    option_value1, option_value2, option_value3, option_value4, option_image, option_view_flag,
                    option_sell_flag, option_delivery_flag, registration_date, modification_date) VALUES (?)
                ON DUPLICATE KEY UPDATE goods_no=values(goods_no), option_price=values(option_price), 
                    option_code=values(option_code), option_value1=values(option_value1), option_value2=values(option_value2),
                    option_value3=values(option_value3), option_value4=values(option_value4), option_image=values(option_image),
                    option_view_flag=values(option_view_flag), option_sell_flag=values(option_sell_flag), 
                    option_delivery_flag=values(option_delivery_flag),registration_date=values(registration_date),
                    modification_date=values(modification_date)`;
                util.param.db.query(insertoptionSql, [optionData]);
            }
        }
        await util.delayTime(2000);
    }
    return 'page update complete';
}