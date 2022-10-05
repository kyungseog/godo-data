const fs = require('fs');
const { DateTime } = require("luxon");

notiSlack();

async function notiSlack() {
  let res = fs.existsSync(__dirname + '/files/noti_' + "20221003" + ".xlsx");
  console.log(res)
}