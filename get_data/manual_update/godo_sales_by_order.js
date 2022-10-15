'use strict'

const util = require("../../public/commonUtil.js");

const orderNo = '2209302356440893';

getOrderData();

async function getOrderData() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/order/Order_Search.php?${util.param.main_key}&orderNo=${orderNo}`
    };

    const xmlRowData = await util.xmlData(options);
    const jsonData = await util.parseXml(xmlRowData);
    const orderData = jsonData.data.return[0].order_data;
    console.log(orderData[0].orderGoodsData[0].goodsDiscountInfo);
}