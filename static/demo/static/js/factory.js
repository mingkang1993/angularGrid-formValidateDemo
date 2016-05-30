// app.factory("baseHttp",['$rootScope','$http','$timeout','messageFactory', function($rootScope,$http,$timeout,messageFactory) {   //第三方介入
//     function baseHttp(o,callback,errorCallback) {
//         var response = false;
//         var time = $timeout(function(){
//             if(!response){
//                 $rootScope.loading = true;
//             }
//         },500);
//         var opt = {
//             method:'GET',
//             url: '',
//             cache: false,
//             dataType: 'json',
//             successClearLoad : true,
//             params: {}
//         };
//         angular.extend(opt,o);
//
//         function responseCallback(){
//             response = true;
//             $timeout.cancel(time);
//         }
//         $http(opt).success(function(data, status) {
//             if(opt.successClearLoad){
//                 $rootScope.loading = false;
//             }
//
//             if(data.message){
//                 messageFactory({text : data.message});
//             }
//             responseCallback();
//             callback.apply(this,arguments);
//         }).error(function (data,status) {
//             $rootScope.loading = false;
//             messageFactory({text : data.message});
//             responseCallback();
//             if(errorCallback){
//                 errorCallback.apply(this,arguments);
//             }
//         });
//     }
//
//
//
//     //                                                                                                                             //     var response = false;
//     // var response = false;
//     //
//     // function responseCallback(){
//     //     // response = true;
//     //     // $timeout.cancel(time);
//     // }
//     //
//     // function BaseHttp() {
//     //     var opt = {
//     //         method:'GET',
//     //         url: '',
//     //         cache: false,
//     //         dataType: 'json',
//     //         successClearLoad : true,
//     //         params: {}
//     //     };
//     //     return function (o,successCallback,errorCallback) {
//     //         angular.extend(opt,o);
//     //
//     //         $http(opt).success(function(data, status) {
//     //
//     //         }).error(function (data,status) {
//     //
//     //         });
//     //     }
//     // }
//     //
//     // BaseHttp.prototype.get = function(url,opt,success){
//     //     $http.get(url, opt).success(function(){
//     //
//     //     });
//     // };
//     //
//     // BaseHttp.prototype.post = function(url,opt,success){
//     //     $http.get(url, opt).success(function(){
//     //
//     //     });
//     // };
//
//     return baseHttp;
// }]);

app.factory("confirmFactory",['$rootScope','$http','ngDialog', function($rootScope,$http,ngDialog) {   //
    function templateFn(opt){
        var main = '<h2 class="ngdialog-title">'+ opt.title +'</h2><div class="ngdialog-main">'+ opt.text + '</div>';
        if(opt.showBtn){
            main +='\<div class="ngdialog-buttons pb-10 pr-10">\
                            <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
                            <button type="button" class="ngdialog-button btn" ng-click="closeThisDialog(1)">确定</button>\
                      </div>';
        }
        return main;
    }


    return function(o){
        var opt = {
            title : '确定取消',
            text : '确定要取消吗?',
            width :400,
            plain: true,
            showBtn : true,
            ok : function(){

            }
            
        };
        angular.extend(opt,o);

        opt.template = templateFn(opt);
        opt.preCloseCallback = function(type){
            if(type === 1){
                opt.ok.apply(this,arguments);
            }
        };
        
        ngDialog.openConfirm(opt);
    };
}]);