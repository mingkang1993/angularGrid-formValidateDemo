/**
 * Created by kangdaye on 16/5/26.
 */
var router = require('koa-router')();
var path = require('path');
var fs = require('fs');

router.get('/grid',function *(next){
    var that = this;
    var reqData = yield new Promise (function(resolve){
        fs.readFile(path.join(__dirname,'./gridModel.json'),'utf-8',function(err, data){
            var reqData = [];
            var data = JSON.parse(data);
            var total = data.length;
            var lenth = parseInt((that.query.pageNo - 1) * that.query.pageSize);

            for(var i = lenth;i < lenth + parseInt(that.query.pageSize);i++){
                reqData.push(data[i]);
            }
            resolve({
                totalCount : total,
                data : reqData
            });
        });
    }).then(function(reqData){
        return reqData;
    });
    this.body = reqData;
});
module.exports=router.routes();