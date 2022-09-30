'use strict'

const { parseString } = require("xml2js");
const { DateTime } = require("luxon");
const excel = require('exceljs');
const fs = require('fs');

const util = require("../public/commonUtil.js");

// const scmNo = 1;
// const startDate = '2022-08-12';
// const endDate = DateTime.now().toFormat('yyyy-LL-dd');
// const addParam = `scmNo=${scmNo}&searchDateType=regDt&startDate=${startDate}&endDate=${endDate}`;

const goodsNo=1000008769;
const addParam = `goodsNo=${goodsNo}`;

getProduct();

async function getProduct() {
    const wb = new excel.Workbook();
    await wb.xlsx.readFile('./template/noti_template.xlsx');

    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&${addParam}`
    };

    const xmlRowData = await util.xmlData(options);
    const getGoodsData = parseString(xmlRowData, function(err, result) {
    //   const totalRow = result.data.header[0].total;
        const jsonData = result.data.return[0].goods_data;
        const goodsData = jsonData.map( 
            r => [r.goodsNo[0],r.goodsNm[0],r.goodsDisplayFl[0],r.goodsSellFl[0],r.goodsCd[0], r.goodsReserveOrderMessage[0]] 
        );
        return goodsData;
    })
    console.log(getGoodsData);

    // if(getGoodsData){
    //     const ws = wb.getWorksheet('data');

    //     ws.columns = [
    //     {key: 'goodsNo', width: 15}, {key: 'goodsNm', width: 30}, 
    //     {key: 'goodsDisplayMobileFl', width: 10}, {key: 'goodsSellMobileFl', width: 10},
    //     {key: 'goodsCd', width: 15}, {key: 'goodsReserveOrderMessage', width: 20}
    //     ];
    
    //     ws.insertRows(2, getGoodsData);
    // }

    // await wb.xlsx.writeFile(`./files/noti_${DateTime.now().toFormat('yyyyMMdd')}.xlsx`);

    // const initialComment = `<@U01514WLEJV> <@US6E9DY66> *예약 배송일이 내일인 아이템입니다.* 어드민에서 일정을 확인해주세요\n`
    // const fileName = "noti_" + DateTime.now().toFormat('yyyyMMdd') + ".xlsx";
    // notiSlack(initialComment, fileName);
}

//무무즈코리아 채널 번호 GQUJ3SB8S 
async function notiSlack(initialComment, fileName) {
    try {
      const result = await util.slackApp.client.files.upload({
        channels: 'GQUJ3SB8S',
        initial_comment: initialComment,
        file: fs.createReadStream(__dirname + '/files/' + fileName)
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  }