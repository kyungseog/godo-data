'use strict'

const fs = require("fs");
const util = require("../public/commonUtil.js");
const cateCd = {
    kids : "064",
    baby : "006",
    junior : "065"
}

getCategoryData();

async function getCategoryData() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/goods/Category_Search.php?${util.param.main_key}&cateCd=${cateCd.kids}`
    };

    const xmlRowData = await util.xmlData(options);
    const jsonData = await util.parseXml(xmlRowData);
    const categoryData = jsonData.data.return[0].category_data;
    console.log(categoryData);
}