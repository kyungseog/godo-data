'use strict'

const { parseString } = require("xml2js");
const util = require("./commonUtil");

const startDate = '2022-09-21 11:00:00';
const endDate = '2022-09-21 11:10:00';
const scmCode = 'S0000DIT';
const orderStatusType ={
    o1: '입금대기',
    p1: '결제완료',
    g1: '상품준비중',
    d1: '배송중',
    d2: '배송완료',
    s1: '구매확정',
    c1: '자동취소',
    f1: '결제시도',
    f2: '고객결제중단',
    f3: '결제실패'
}

getOrderData();

async function getOrderData() {
    const options = { method: 'POST',
        url: `https://openhub.godo.co.kr/godomall5/order/Order_Search.php?partner_key=${util.key.partner_key}&key=${util.key.key}&dateType=order&startDate=${startDate}&endDate=${endDate}`
    };

    const xmlRowData = await util.xmlData(options);
    let orderData = [];
    parseString(xmlRowData, function(err, result) {
        const jsonData = result.data.return[0].order_data;
        const orderGoodsData = jsonData.map( r => r.orderGoodsData );
        
        for( let i = 0; i < orderGoodsData.length; i++) {
            for (let j = 0; j < orderGoodsData[i].length; j++) {
                const r = orderGoodsData[i][j];
                if(r.scmCode[0] == scmCode) {
                    const data = [r.orderNo[0],r.orderStatus[0],r.scmNo[0],r.goodsNo[0],
                        r.listImageData[0],r.goodsNm[0],Number(r.goodsCnt[0]),Number(r.goodsPrice[0])];
                    orderData.push(data);
                }
            }
        }
        
    });
    const liveSCMSales = orderData.filter( r => r[2] == '493' );
}