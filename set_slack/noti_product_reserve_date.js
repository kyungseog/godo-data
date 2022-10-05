'use strict'

const schedule = require('node-schedule');
const { DateTime } = require("luxon");
const excel = require('exceljs');
const fs = require('fs');

const util = require("../public/commonUtil.js");

const endDate = DateTime.now().toFormat('yyyy-LL-dd');
const addParam = `scmNo=1&searchDateType=regDt&startDate=2022-08-12&endDate=${endDate}`;

const getProductRule = new schedule.RecurrenceRule();
getProductRule.dayOfWeek = [1,2,3,4,5];
getProductRule.hour = 4;
getProductRule.minute = 20;
schedule.scheduleJob("getExcel", getProductRule, function(){
  getExcel();
});

const notiRule = new schedule.RecurrenceRule();
notiRule.dayOfWeek = [1,2,3,4,5];
notiRule.hour = 9;
notiRule.minute = 0;
schedule.scheduleJob("noti", notiRule, function(){
  notiSlack();
});

async function getExcel() {
  const wb = new excel.Workbook();
  await wb.xlsx.readFile('./template/noti_template.xlsx');

  const options = { method: 'POST',
    url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&${addParam}`
  };

  const xmlRowData = await util.xmlData(options);
  const jsonData = await util.parseXml(xmlRowData);
  let pageCount = Number(jsonData.data.header[0].max_page[0]);
  let goodsData = [];
  for( let i = 0; i < pageCount; i++) {
    let data = await getProduct(i + 1);
    if(data.length == 0) {
      continue;
    }
    goodsData.push(...data);
  }

  if(goodsData.length != 0) {
    const ws = wb.getWorksheet('data');
    ws.columns = [
      {key: 'goodsNo', width: 15}, {key: 'goodsNm', width: 30}, 
      {key: 'goodsDisplayMobileFl', width: 10}, {key: 'goodsSellMobileFl', width: 10},
      {key: 'goodsCd', width: 15}, {key: 'goodsReserveOrderMessage', width: 20}
    ];
    ws.insertRows(2, goodsData);
    await wb.xlsx.writeFile(`./files/noti_${DateTime.now().toFormat('yyyyLLdd')}.xlsx`);
  }
}

async function getProduct(pageNo) {
  const options = { method: 'POST',
      url: `${util.param.main_url}/goods/Goods_Search.php?${util.param.main_key}&${addParam}&page=${pageNo}`
  };

  const xmlRowData = await util.xmlData(options);
  const jsonData = await util.parseXml(xmlRowData);
  const goodsData = jsonData.data.return[0].goods_data;
  const selectedGoodsData = goodsData.filter( function(el) {
    const data = el.goodsReserveOrderMessage[0];
    let targetDate = '';
    if(data != "") {
      data.replace(/ /g,"");
      const monthIndex = data.indexOf("월");
      const dayIndex = data.indexOf("일");
      const monthData = Number(data.substring(0,monthIndex));
      const dayData = Number(data.substring(monthIndex + 1,dayIndex));
      targetDate = DateTime.fromObject({month:monthData, day:dayData}).toFormat('LLdd');
    }
    return data != "" && targetDate == DateTime.now().plus({days: 1}).toFormat('LLdd');
  });
  if(selectedGoodsData.length == 0) {
    return;
  }
  const goodsDataArray = selectedGoodsData.map( 
    r => [r.goodsNo[0],r.goodsNm[0],r.goodsDisplayFl[0],r.goodsSellFl[0],r.goodsCd[0], r.goodsReserveOrderMessage[0]]
  );
  return goodsDataArray;
}

//무무즈코리아 채널 번호 GQUJ3SB8S 
async function notiSlack() {
  if(fs.existsSync(__dirname + '/files/noti_' + DateTime.now().toFormat('yyyyLLdd') + ".xlsx")) {
    try {
      const result = await util.slackApp.client.files.upload({
        channels: 'GQUJ3SB8S',
        initial_comment: `<@U01514WLEJV> <@US6E9DY66> *예약 배송일이 내일인 아이템입니다.* 어드민에서 일정을 확인해주세요\n`,
        file: fs.createReadStream(__dirname + '/files/noti_' + DateTime.now().toFormat('yyyyLLdd') + ".xlsx")
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  }
}