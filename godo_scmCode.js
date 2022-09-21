'use strict'

const { parseString } = require("xml2js");
const util = require("./commonUtil.js");

getSCMData();

async function getSCMData() {
    const options = { method: 'POST',
        url: `https://openhub.godo.co.kr/godomall5/common/Code_Search.php?partner_key=${util.key.partner_key}&key=${util.key.key}&code_type=scm`
    };

    const xmlRowData = await util.xmlData(options);
    parseString(xmlRowData, function(err, result) {
        const jsonData = result.data.return[0].code_data;
        const codeData = jsonData.map( r => [r.scmNo[0],r.companyNm[0]] );
        console.log(codeData);
    })
}