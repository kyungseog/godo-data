'use strict'

const util = require("../../public/commonUtil.js");

const startDate = '2022-08-26';
const endDate = startDate;
const orderChannel = ["shop","naverpay"];

setOrderChannel();

async function setOrderChannel() {
    const orderStatus = await util.sqlData('SELECT order_status_code FROM gododb.order_status');
    for (let i = 0; i < orderChannel.length; i++) {
        for (let j = 0; j < orderStatus.length; j++) {
            const d = await getOrderData(orderChannel[i], orderStatus[j].order_status_code);
            console.log(d);
        }
        console.log (startDate, " / ", orderChannel[i], " update complete");
    }
}

async function getOrderData(channel, status) {
    const options = { method: 'POST',
        url: `${util.param.main_url}/order/Order_Search.php?${util.param.main_key}&dateType=order&startDate=${startDate}&endDate=${endDate}&orderChannel=${channel}&orderStatus=${status}`
    };

    const xmlRowData = await util.xmlData(options);
    const jsonData = await util.parseXml(xmlRowData);
    if(jsonData.data.header == undefined) {
        await util.delayTime(5000);
        getOrderData(channel, status);
    } else {
        if(jsonData.data.header[0].code == '000') {
            const orderData = jsonData.data.return[0].order_data;
            if(orderData) {
                for(let i = 0; i < orderData.length; i++) {
                    console.log("update order count: ", i+1, "/", orderData.length);
                    console.log("update order goods count: ", orderData[i].orderGoodsData.length);
                    const updateArray = orderData[i].orderGoodsData.map( function(s) {
                        let basicData = [ s.sno[0],orderData[i].orderChannelFl[0],s.orderNo[0],s.orderStatus[0],s.orderDeliverySno[0],s.invoiceNo[0],s.scmNo[0],s.goodsNo[0],s.goodsCd[0],
                            s.listImageData[0],s.goodsNm[0],s.goodsCnt[0],s.goodsPrice[0],s.divisionUseMileage[0],s.divisionCouponOrderDcPrice[0],
                            s.divisionUseDeposit[0],s.divisionCouponOrderMileage[0],s.optionPrice[0],s.fixedPrice[0],s.goodsDcPrice[0],s.memberDcPrice[0],
                            s.memberOverlapDcPrice[0],s.couponGoodsDcPrice[0],s.optionSno[0],orderData[i].orderDate[0],s.paymentDt[0],s.invoiceDt[0],s.deliveryDt[0],
                            s.deliveryCompleteDt[0],s.finishDt[0],s.memId == undefined ? null : s.memId[0],
                            s.firstSaleFl == undefined ? null : s.firstSaleFl[0] ];
                        if(s.claimData) {
                            return basicData.concat([ s.claimData[0].handleMode[0],s.claimData[0].handleCompleteFl[0],s.claimData[0].handleReason[0],
                                s.claimData[0].handleDt[0]=='' ? null : s.claimData[0].handleDt[0] ]);
                        } else {
                            return basicData.concat([null,null,null,null]);
                        }
                    } );
                    const insertOrderSql = `
                        INSERT INTO gododb.api_orders 
                            (sno, order_channel_flag, order_no, order_status, order_delivery_sno, 
                            invoice_no, scm_no, goods_no, goods_code, 
                            list_image_data, goods_name, goods_count, 
                            goods_price, division_use_mileage, 
                            division_coupon_order_discount_price, division_use_deposit,
                            division_coupon_order_mileage, option_price, fixed_price, 
                            goods_discount_price, member_discount_price, member_overlap_discount_price, 
                            coupon_goods_discount_price, option_sno, order_date, payment_date, 
                            invoice_date, delivery_date, delivery_complete_date, 
                            finish_date, member_id, first_sale_flag, handle_mode, handle_complete_flag, 
                            handle_reason, handle_date)
                        VALUES ?
                        ON DUPLICATE KEY UPDATE 
                            order_channel_flag=values(order_channel_flag), order_no=values(order_no), order_status=values(order_status), order_delivery_sno=values(order_delivery_sno), 
                            invoice_no=values(invoice_no), scm_no=values(scm_no), goods_no=values(goods_no), goods_code=values(goods_code),
                            list_image_data=values(list_image_data), goods_name=values(goods_name), goods_count=values(goods_count),
                            goods_price=values(goods_price), division_use_mileage=values(division_use_mileage),
                            division_coupon_order_discount_price=values(division_coupon_order_discount_price), division_use_deposit=values(division_use_deposit),
                            division_coupon_order_mileage=values(division_coupon_order_mileage), option_price=values(option_price), fixed_price=values(fixed_price), 
                            goods_discount_price=values(goods_discount_price),member_discount_price=values(member_discount_price), member_overlap_discount_price=values(member_overlap_discount_price),
                            coupon_goods_discount_price=values(coupon_goods_discount_price), option_sno=values(option_sno),order_date=values(order_date),payment_date=values(payment_date), 
                            invoice_date=values(invoice_date), delivery_date=values(delivery_date), delivery_complete_date=values(delivery_complete_date), 
                            finish_date=values(finish_date), member_id=values(member_id), first_sale_flag=values(first_sale_flag), handle_mode=values(handle_mode), handle_complete_flag=values(handle_complete_flag), 
                            handle_reason=values(handle_reason), handle_date=values(handle_date)`;
                    util.param.db.query(insertOrderSql, [updateArray]);
                    await util.delayTime(2000);
                }
                return channel + "/" + status + " update complete";
            }
        } else {
            return channel + "/" + status + " Error";
        }
        return channel + "/" + status + " No Data";
    }
}