// app.filter("dateDay", function() {
//     return function(date){
//         var currentDates = new Date().getTime() - new Date(date).getTime(),
//             currentDay = parseInt(currentDates / (60000*60) -1) //减去1小时
//         if(currentDay >= 24*3){
//             var datas = new Date(date);
//             currentDay = datas.getFullYear() + '-' + (datas.getMonth()+1) + '-' + datas.getDate();
//         }else if(currentDay >= 24){
//             currentDay = parseInt(currentDay / 24) + "天前";
//         }else if(currentDay == 0 ){
//             var currentD = parseInt(currentDates / 60000);
//             if(currentD >= 60){
//                 currentDay = "1小时前"
//             }else{
//                 currentDay = currentD + "分钟前"
//             }
//         }else{
//             currentDay = currentDay + "小时前"
//         }
//
//         return currentDay
//     };
// }).filter("cut", function() {
//     var i = 0;
//     var text = '';
//     var returns = true;
//     return function(date,findIndex){
//         angular.forEach(date,function(item,index){
//             if(returns){
//                 if(item === ';'){
//                     if(i === findIndex){
//                         returns = false;
//                     }else{
//                         i++;
//                     }
//                     return;
//                 }
//                 if(i >= findIndex){
//                     text += item;
//                 }
//             }
//         });
//         return text;
//     };
// }).filter("encodeUrl", function() {
//     return function(data){
//         return encodeURIComponent(data)
//     };
// }).filter("toFixed", function() {
//     return function(data){
//         if(!!data){
//             return data.toFixed(2);
//         }else{
//             return data;
//         }
//     };
// })
//
app.filter('unit', function () {
    return function (text) {
        var text = text ? '¥' + text / 100 : '暂无';
        return text;
    };
});

