'use strict'

const { parseString } = require("xml2js");
const util = require("./commonUtil.js");
const companyNm = '(주) 신세계인터내셔날/자주'

getSCMData();

async function getSCMData() {
    const options = { method: 'POST',
        url: `${util.param.main_url}/common/Code_Search.php?${util.param.main_key}&code_type=scm`
    };

    const xmlRowData = await util.xmlData(options);
    parseString(xmlRowData, function(err, result) {
        const jsonData = result.data.return[0].code_data;
        const codeData = jsonData.map( r => [r.scmNo[0],r.companyNm[0]] );
        const companyNo = codeData.filter ( r => r[1] == companyNm );
        console.log(companyNo[0][0]);
    })
}