var app = angular.module('app', [
    'ui.router',
    'ngSanitize',     //把ng-bind-html之类模版指令拆出来了
    'angularLazyImg',
    // 'china-area-selector',
    'grid',
    'datetimepicker',
    // 'ui.tree',
    'ngTagsInput',
    'slideImg',
    // 'orderGrid',
    'angular-carousel',
    'china-area-selector',
    'angucomplete',
    'ngDialog',
    'hipacPage',
    'cz-mobile'
],['$compileProvider','$locationProvider',function($compileProvider,$locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*((https?|ftp|tel|sms|mailto|file|javascript|chrome-extension):)|#/);
    //$compileProvider.urlSanitizationWhitelist()  //angular1.2以前
}]);
//Main
app.controller('mainController',['$scope','$rootScope', function($scope,$rootScope) {
    $rootScope.loading = false;
    $rootScope.prefix = '/seller/';

}]);

app.directive('compile',['$timeout','$compile',function($timeout,$compile) {
    return {
        restrict: 'EA',
        scope:{
            template : '='
        },
        link : function(scope, elm, attrs) {
            var watch;
            $timeout(function(){
                watch = scope.$watch('template', function (myTemplate) {
                    if (angular.isDefined(myTemplate)) {
                        var elmnt = $compile(myTemplate)(scope);

                        elm.html(''); // dummy "clear"

                        elm.append(elmnt);
                    }
                });

                scope.$on('$destroy', function(){
                    watch();
                });
            },0);
        }
    }
}]).directive('print',['$timeout','$compile',function($timeout,$compile) {   //打印
    return {
        restrict: 'EA',
        scope:{
            printBefore : '='
        },
        link : function(scope, elm, attrs) {
            $timeout(function(){
                var $printTarId = $('#' + attrs.print);
                elm.on('click',function () {
                    if(scope.printBefore != undefined){
                        if(scope.printBefore){
                            $printTarId.jqprint();
                        }
                    }else{
                        $printTarId.jqprint();
                    }
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            },0);
        }
    }
}]).directive('dialogClose',['$timeout',function($timeout) {   //打印
    return {
        restrict: 'EA',
        link : function(scope, elm, attrs) {
            $timeout(function(){
                elm.on('click',function () {
                    scope.closeThisDialog();  //dialog 关闭
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            },0);
        }
    }
}]).directive('back',['$timeout',function($timeout) {   //打印
    return {
        restrict: 'EA',
        link : function(scope, elm, attrs) {
            $timeout(function(){
                elm.on('click',function () {
                    window.history.go(-1);
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            },0);
        }
    }
}]);
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


/**
 * Created by chenmingkang on 16/3/8.
 */
app.factory('authHttpResponseInterceptor',['$q','$location','$rootScope','$timeout','$injector',function($q,$location,$rootScope,$timeout,$injector){
    var responseLoad = false;
    var time;

    function errorFn(message){
        var messageFn = $injector.get('messageFactory');
        messageFn({text : message || '请求出错'});
    }
    function resFn(){
        $timeout.cancel(time);
        responseLoad = true;
        $rootScope.loading = false;
    }
    return {
        request: function (config) {
            var config = config || {};
            config.timeout = 10000;
            config.load = config.load || true;
            responseLoad = false;
            if (config.load){
                $timeout.cancel(time);
                time = $timeout(function(){
                    if(!responseLoad){
                        $rootScope.loading = true;
                    }
                },500);
            }
            return config;
        },
        response: function(response){
            // if(response.config.url.indexOf('json') > -1){
                resFn();
            // }
            if (typeof response.data === 'object' && (response.status != 200 || !response.data.success)) {
                errorFn(response.data.message);
                return $q.reject(response);
            }
            return response || $q.when(response);
        },
        responseError: function(err){
            resFn();
            errorFn('服务器出错请求出错');
            return $q.reject(err);
        }
    }
}]);

/**
 * Created by chenmingkang on 16/3/8.
 *
 *  {
 *       name : 路由的名称,
 *       url: 路由的url,
 *
 *       views 里面的参数
 *            uiView : 页面上uiView的名字,嵌套路由或者新路由需要传入
 *            templateUrl : 模版路径,
 *            controller: 控制器
 *       }
 *    }
 */
;(function(app){
    //.state('brandSele', {
    //    url: '/brandSele',   //品牌街
    //    views: {
    //        'appState': {
    //            templateUrl: 'brandSele.html',
    //            controller: 'brandSele'
    //        }
    //    }/seller/goods/goodsDetailEdit.do?type=add
    //})
    var route = [
        {name : 'order/orderList', url: '/order/orderList',templateUrl:'/view/order/orderList/orderListBase.html', controller: 'orderListBaseCrt'},
        {name : 'order/orderList.type', url: '/list.do?{type:all||bPaid||cAccept||dDelivered||eComplete}',uiView:'orderListType',templateUrl:'/view/order/orderList/orderList.html', controller: 'orderListCrt',pageRp:1},

        {name : 'goods/supplyList', url: '/goods/supplyList.do',templateUrl:'/view/goods/supply/supplyList.html', controller: 'supplySupplyListCrt',pageRp:2},
        {name : 'goods/supplyDetailEdit', url: '/goods/supplyDetailEdit.do?:type&:id',templateUrl:'/view/goods/supply/supplyDetailEdit.html', controller: 'supplyDetailEditCrt',pageRp:3},
        {name : 'goods/supplyDetailInfo', url: '/goods/supplyDetailInfo.do?:id',templateUrl:'/view/goods/supply/supplyDetailInfo.html', controller: 'supplyDetailInfoCrt',pageRp:4},

        {name : 'goods/freightTemplateList', url: '/goods/freightTemplateList.do',templateUrl:'/view/goods/freightTemplate/freightTemplateList.html', controller: 'freightTemplateListCrt',pageRp:5},
        {name : 'goods/freightTemplateEdit', url: '/goods/freightTemplateEdit.do?:{type || id}',templateUrl:'/view/goods/freightTemplate/freightTemplateEdit.html', controller: 'freightTemplateEditCrt',pageRp:6},

        {name : 'goods/sinceList', url: '/goods/sinceList.do',templateUrl:'/view/goods/since/sinceList.html', controller: 'sinceListCrt',pageRp:7},

        // {name : 'goods/goodsSupply', url: '/goods/goodsSupply',templateUrl:'/view/order/orderList/orderList.html', controller: 'orderListCrt'},

        {name : 'demo', url: '/demo',templateUrl:'/view/demo.html', controller: 'demoCtr'}
    ];

    app.config(['$stateProvider','$urlRouterProvider','$httpProvider','lazyImgConfigProvider','ngDialogProvider',function($stateProvider, $urlRouterProvider,$httpProvider,lazyImgConfigProvider,ngDialogProvider) {
        lazyImgConfigProvider.setOptions({
            startClass: 'startImg',
            successClass: 'loadSuccessImg'
        });
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        $httpProvider.defaults.headers.common['Accept-Language'] = 'zh-CN,zh; q=0.08';
        $httpProvider.defaults.headers.common['PAJAX'] = 'true';
       // $httpProvider.defaults.headers.patch['PAJAX'] = 'true';
        // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
        //$httpProvider.defaults.headers.common['DNT'] = '1';

        $httpProvider.defaults.transformRequest = [function(data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            return angular.isObject(data) && String(data) !== '[object File]' ? angular.param(data) : data;
        }];

        route.forEach(function(item){
            var params = {
                name : item.name,
                url: item.url,
                views : {},
                pageRp : item.pageRp  //埋点
                // resolve: {
                //     permission: function () {
                //         // console.log(roles)
                //     }
                // }
            };
            params.views[item.uiView || 'appState'] = {
                templateUrl : item.templateUrl,
                controller  : item.controller
            };
            $stateProvider.state(params);
        });

        $urlRouterProvider.otherwise('order/orderList/list.do?type=all');

    }]);
})(app);


/**
 * Created by chenmingkang on 16/3/8.
 */
app.run(['$rootScope',function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(evt, current, fromParams) {
        // $rootScope.loading = true;
    });

    $rootScope.$on('$stateChangeSuccess', function(evt, current, previous) {
        if(current.pageRp){   //埋点
            $rootScope.pageRp = current.pageRp;
        }
    });

    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){

    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){

    });
}]);

//Main
app.controller('selectAreaAllCtr',["$scope","$rootScope","selectAreaAllService","selectDatas", function($scope,$rootScope,selectAreaAllService,selectDatas) {
    $scope.areaData = [];
    $scope.areaSelectData = {
        areaSelectIndex : 0,
        countySelectIndex : -1,
        areaData : []
    };

    $scope.provinceClick = function(data,index,evt){
        $scope.areaSelectData.areaSelectIndex = index;
        $scope.areaSelectData.areaData = [];
        angular.forEach(data.childList,function(item){
            $scope.areaSelectData.areaData.push(item);
        });
    };

    function getSelectData(data,tarData,selectName){
        for(var i = 0;i <= data.length-1;i++){
            // console.log(data[i])
            var item = {
                id : data[i].id,
                parentId : data[i].parentId,
                // areaName : data[i].areaName,
                childList : []
            };
            if(data[i].provinceAreaDTOList){
                arguments.callee(data[i].provinceAreaDTOList,tarData,selectName);
            }else{
                if(data[i].isSelect){
                    // console.log(data[i])
                    selectName.push(data[i].areaName);
                }
                if(data[i].isSelect || data[i].isChildSelect) {
                    tarData.push(item);
                }
                if(data[i].childList && data[i].isChildSelect && !data[i].isSelect){
                    arguments.callee(data[i].childList,item.childList,selectName);
                }
            }
        }
        return tarData;
    }

    function selectNum(data){
        var selestNum = 0;
        angular.forEach(data,function(item){
            if(item.isSelect){
                selestNum++;
            }
        });
        return selestNum;
    }

    function childSelectToggle(parData,selectTrue){
        if(selectTrue){
            parData.isChildSelect = true;
        }else{
            parData.isChildSelect = false;
        }
    }

    function selectToggle(data,isSelect){
        angular.forEach(data,function(item){
            if(isSelect){
                item.isSelect = true;
                item.selectNum = 0;   //全部选中子区或者县选择的数量清空
            }else{
                item.isSelect = false;
            }
            if(item.childList){
                selectToggle(item.childList,isSelect);
            }
        });
    }

    function parSelectToggle(data,parData,childSelectNum,notSelectToggle){
        var parListData = parData.provinceAreaDTOList || parData.childList;
        var selectNumTotal = selectNum(parListData);
        if(data.isSelect){
            if(selectNumTotal == parListData.length){
                parData.isSelect = true;
                data.selectNum = 0;   //全部选中子区或者县选择的数量清空
            }
        }else{
            parData.isSelect = false;
            data.selectNum = 0;  //全部选中子区或者县选择的数量清空
        }
        if(parListData.length == 1){
            var childSelectNum = selectNum(parListData[0].childList);
            childSelectToggle(parData,childSelectNum)
        }else{
            childSelectToggle(parData,selectNumTotal || childSelectNum);
        }

        if(!notSelectToggle){
            selectToggle(data.childList,data.isSelect);
        }
        parData.selectNum = selectNumTotal;     //吧选中的值赋给父Object里面的一个字段

        return selectNumTotal;
    }

    function submitNext(){
        $scope.closeThisDialog();  //dialog 关闭
    }

    function getProvinceItemScope(parentId){
        return angular.element(document.getElementById('provinceData' + parentId)).scope().provinceItem;
    }

    $scope.provinceSelectAll = function (data,parData) {   //省
        parSelectToggle(data,parData);
        childSelectToggle(data,data.isSelect);
    };

    $scope.areaSelectAll = function(data,parData){  //市点击
        var provinceData = getProvinceItemScope(data.parentId); //获取省scope数据
        parSelectToggle(data,parData);  //判断大陆是否选中
        parSelectToggle(data,provinceData); //判断省是否选中,并且返回选中的个数
    };

    $scope.selectAll = function(data,isSelect){  //华东大区选择
        selectToggle(data,isSelect);
    };

    $scope.countySelect = function(itemData,areaItemData,provinceItemData){  //区选择
        var provinceData = getProvinceItemScope(areaItemData.parentId); //获取省scope数据
        parSelectToggle(itemData,areaItemData); //判断市是否全选,并且返回选中的个数
        parSelectToggle(itemData,provinceData,areaItemData.selectNum);  //判断省是否选中

        parSelectToggle(itemData,provinceItemData,provinceData.selectNum);  //判断大陆是否选中
    };

    $scope.countyToggle = function(index){
        if($scope.areaSelectData.countySelectIndex == index){
            $scope.areaSelectData.countySelectIndex = -1;
            return;
        }
        $scope.areaSelectData.countySelectIndex = index;
    };

    $scope.submit = function(){
        var selectData = [];
        var selectName = [];
        getSelectData($scope.areaData,selectData,selectName);
        if(selectDatas.selectCallback){
            selectDatas.selectCallback(selectName,selectData,submitNext);
            return;
        }
        submitNext();
    };

    selectAreaAllService.area(function(data){
        $scope.areaData = data.data;

        function selectDataFn(data,id,parData){
            for(var i = 0;i < data.length;i++){
                if(data[i].id == id){
                    data[i].isSelect = true;
                    selectToggle(data[i].childList,true);
                }
                if(parData && !parData.isSelect){
                    parSelectToggle(data[i],parData,0,true);   //回填选中数量
                }
                if(data[i].provinceAreaDTOList){
                    arguments.callee(data[i].provinceAreaDTOList,id,data[i]);
                }
                if(data[i].childList && data[i].childList.length){
                    arguments.callee(data[i].childList,id,data[i]);
                }
            }
        }

        ;(function(selectData){
            for(var i = 0;i < selectData.length;i++){
                if(selectData[i].childList && selectData[i].childList.length){
                    arguments.callee(selectData[i].childList);
                }else{
                    selectDataFn($scope.areaData,selectData[i].id)
                }
            }
        })(selectDatas.selectData || []);
    });
}]);

/**
 * Created by 大漠 on 2016/4/21.
 */
app.service('selectAreaAllService', ['$http', function ($http) {
    this.area = function(callback) {   //list 数据
        $http.get('/seller/area/queryAllRegionList.json').success(callback);
    };
}]);
/**
 * Created by kangdaye on 16/5/23.
 */
app.controller('upPassCtr',['$scope','$timeout','upPassService','messageFactory', function($scope,$timeout,upPassService,messageFactory) {
    var isUppassSuc = false;

    $scope.getData = {};

    $scope.submit = function(){
        if(isUppassSuc){
            return;
        }
        upPassService.upPass($scope.getData,function(data){
            $scope.closeThisDialog();  //dialog 关闭
            messageFactory({text : '修改密码成功'});
            isUppassSuc = true;
            $timeout(function(){
                location.href = data.data;
            },2000);
        });
    };
}]);

/**
 * Created by kangdaye on 16/5/23.
 */
app.service('upPassService', ['$http', function ($http) {
    this.upPass = function(postData,callback) {   //列表开售
        $http.post('/seller/user/updatePassword.json ',postData).success(callback);
    };
}]);
app.controller('freightTemplateEditCrt', ['$scope','$rootScope','$stateParams','ngDialog','messageFactory','freightTemplateFactory','freightTemplateService', function($scope,$rootScope,$stateParams,ngDialog,messageFactory,freightTemplateFactory,freightTemplateService){
    var defaultData = {
        templateId : $stateParams.id
    };
    var logisticCarryStr = {
        model1 : {
            pieceworkWay : 1,
            data : []
        },
        model2 : {
            pieceworkWay : 1,
            data : []
        },
        model3 : {
            pieceworkWay : 1,
            data : []
        },
        model4 : {
            pieceworkWay : 1,
            data : []
        }
    };

    $scope.addEditData = {};
    $scope.pricingType = freightTemplateFactory.pricingType;
    $scope.tabData = freightTemplateFactory.editTab;

    $scope.tabToggle = function(id){
        $scope.selectId = id;
        $scope.logisticCarryStrItem = logisticCarryStr['model' + $scope.selectId];
    };
    
    $scope.addLogisticInit = function(item,pieceworkWay){
        item.pieceworkWay = pieceworkWay;
        item.logisticType = $scope.selectId;
    };

    $scope.addRow = function(){
        if($scope.logisticCarryStrItem.data.length < 20){
            $scope.logisticCarryStrItem.data.push({});
            return false;
        }
        messageFactory({text : '最多加20条'});
    };

    $scope.deleteRow = function(index){
        $scope.logisticCarryStrItem.data.splice(index,1);
    };

    $scope.selectAreaDialog = function(item){
        ngDialog.open({
            template: '/view/common/selectAreaAll.html',
            controller: 'selectAreaAllCtr',
            width : 750,
            resolve: {
                selectDatas : function(){
                    return {
                        selectName : item.receiveAreaNames,
                        selectData : item.receiveAreaRelation,
                        selectCallback : function(selectName,selectData,next){
                            item.receiveAreaNames = selectName.join('、');
                            item.receiveAreaRelation = selectData;
                            next();   //next是提供出一个类似co模块断点功能,后期可能校验;
                        }
                    }
                }
            }
        });
    };

    $scope.submit = function(){
        var getData = angular.copy($scope.addEditData);
        getData.logisticCarryFormList = [];
        for (var i in logisticCarryStr){
            angular.forEach(logisticCarryStr[i].data,function (item) {
                item.pieceworkWay = logisticCarryStr['model' + item.logisticType].pieceworkWay;
                getData.logisticCarryFormList.push(item);
            });
        }
        freightTemplateService.addTemplate(getData,function(){
            var text = '';
            if(defaultData.templateId){
                text = '修改成功';
            }else{
                text = '新增成功';
            }
            messageFactory({text : text});
            location.href = $rootScope.prefix + 'goods/freightTemplateList.do';
        });
    };

    if(defaultData.templateId){
        freightTemplateService.getTemplate(defaultData,function(data){
            $scope.addEditData = data.data;
            angular.forEach($scope.addEditData.logisticCarryFormList,function(item){
                logisticCarryStr['model' + item.logisticType].data.push(item);
                logisticCarryStr['model' + item.logisticType].pieceworkWay = item.pieceworkWay;
            });
            $scope.tabToggle(data.data.logisticType.split(',')[0]);
        });
    }else {
        $scope.tabToggle($scope.tabData[0].id);
    }

}]);
app.controller('freightTemplateListCrt', ['$scope','confirmFactory','messageFactory','freightTemplateFactory','freightTemplateService', function($scope,confirmFactory,messageFactory,freightTemplateFactory,freightTemplateService){
    // var gridData = [
    //     {
    //         title1 : '韩国九日儿童海苔 寿司包饭 儿童即食紫菜卷4g',
    //         title2:[
    //             '6包装/¥104.00/1/3',
    //             '8包装/¥104.00/2/1'
    //         ],
    //         title3:'1234',
    //         title4:'2016-04-11到2115-03-20'
    //     }
    // ];
    $scope.getData = {};

    $scope.gridOptions = {
        url       : '/seller/logistic/queryTemplateList.json',
        columnDefs: freightTemplateFactory.listHeader,
        params    : $scope.getData
    };

    $scope.deleteItem = function(id,index){
        confirmFactory({
            title : '确认操作',
            text : '确认操作吗？',
            ok : function(){
                freightTemplateService.listDeleteItem({
                    templateId : id
                },function(){
                    $scope.gridOptions.data.splice(index,1);
                    messageFactory({text : '删除成功！'});
                })
            }
        });
    };

    $scope.search = function(){
        $scope.gridOptions.search();
    }
}]);
app.factory('freightTemplateFactory', function() {
    return{
        pricingType : [
            {value : 1,name : '按重量',key : 'weight'},
            {value : 2,name : '按体积',key : 'volume'},
            {value : 3,name : '按件数',key : 'num'}
        ],
        listHeader : [
            {displayName:'模板名称', field: 'templateName', width:'20%'},
            {displayName:'类型', field: 'logisticTypeName', width:'20%'},
            {displayName:'模板描述', field: 'templateDesc',width:'20%'},
            {displayName:'创建时间', field: 'createTime', width:'20%'},
            {displayName:'操作',width:'20%',cellTemplate: '<div><a class="mr-5" href="{{prefix}}goods/freightTemplateEdit.do?id={{row.id}}">修改</a><a ng-click="evt.entity.deleteItem(row.id,$index)">删除</a></div>'}
        ],
        editTab : [
            {id : 1,name : '快递'},
            {id : 2,name : '物流'},
            {id : 3,name : '物流自提'},
            {id : 4,name : '供应商配送'}
        ]
    }
});

/**
 * Created by 大漠 on 2016/4/21.
 */
app.service('freightTemplateService', ['$http', function ($http) {
    this.addLogisticTemplate = function(postData,callback) {   //列表开售
        $http.post('/seller/logistic/logistictemplate/insert.json',postData).success(callback);
    };

    this.addTemplate = function(postData,callback) {   //新增模版
        $http.post('/seller/logistic/insertOrUpdateTemplate.json',postData).success(callback);
    };

    this.listDeleteItem = function(postData,callback) {   //删除列表数据
        $http.post('/seller/logistic/deleteTemplate.json',postData).success(callback);
    };


    this.getTemplate = function(postData,callback) {   //详情页数据
        $http.post('/seller/logistic/getTemplate.json',postData).success(callback);
    };
}]);
app.controller('sinceAddEditSinceDialog',['$scope','sinceService','getData', function($scope,sinceService,getData) {
    var isEdit = getData.type == 'edit';
    $scope.getData = {};
    $scope.selectAddressData = {
        area : {},
        city : {},
        province : {}
    };

    if(isEdit){
        $scope.selectAddressData = {
            area : {
                id : getData.data.areaId,
                areaName : getData.data.areaName
            },
            city : {
                id : getData.data.cityAreaId,
                areaName : getData.data.cityAreaName
            },
            province : {
                id : getData.data.provinceAreaId,
                areaName : getData.data.provinceAreaName
            }
        };
        angular.extend($scope.getData,getData.data);
    }

    $scope.submit = function(){
        $scope.getData.cityAreaId = $scope.selectAddressData.city.id;
        $scope.getData.areaId = $scope.selectAddressData.area.id;
        $scope.getData.provinceAreaId = $scope.selectAddressData.province.id;
        sinceService.addEdit($scope.getData,function(data){
            $scope.closeThisDialog();  //dialog 关闭
            location.reload();
            // if(isEdit){
            //     getData.data = $scope.getData;
            // }else{
            //     getData.data.push($scope.getData);
            //     getData.data.splice(getData.data.length-1,getData.data.length);
            // }
        });
    };

}]);

app.controller('sinceListCrt',['$scope','ngDialog','messageFactory','sinceCacheFactory','confirmFactory','sinceService', function($scope,ngDialog,messageFactory,sinceCacheFactory,confirmFactory,sinceService) {
    $scope.selectAddressData = {
        area : {},
        city : {},
        province : {}
    };
    $scope.getData = {};

    $scope.gridOptions = {
        url          : '/seller/pickAddress/querySupplyPickAddressList.json',
        columnDefs   : sinceCacheFactory.sinceTableHeader,
        params       : $scope.getData
    };

    $scope.listStateData = sinceCacheFactory.listStateData;

    $scope.haltOpen = function (row) {
        var getData = {
            id : row.id
        };

        if(row.isUse === '0'){
            sinceService.usePickAddress(getData,function(){
                row.isUse = '1';
                messageFactory({text : '启动成功'});
            });
         }else{
            confirmFactory({
                title : '确定停用',
                text : '确定要停用吗?',
                ok : function(){
                    sinceService.unUsePickAddress(getData,function(){
                        row.isUse = '0';
                        messageFactory({text : '停用成功'});
                    });
                }
            });
        }

    };

    $scope.search = function(){
        $scope.getData.cityAreaId = '';
        $scope.getData.areaId = '';
        $scope.getData.provinceAreaId = '';

        if($scope.selectAddressData.city){
            $scope.getData.cityAreaId = $scope.selectAddressData.city.id;
        }
        if($scope.selectAddressData.area){
            $scope.getData.areaId = $scope.selectAddressData.area.id;
        }
        if($scope.selectAddressData.province){
            $scope.getData.provinceAreaId = $scope.selectAddressData.province.id;
        }

        $scope.gridOptions.search();
    };

    $scope.addEditSinceDialog = function (type,data) {
        ngDialog.open({
            template: '/view/goods/since/sinceListDialog.html',
            controller: 'sinceAddEditSinceDialog',
            resolve: {
                getData: function() {
                    return {
                        data : data,
                        type : type
                    }
                }
            }
        });
    };

}]);

app.factory('sinceCacheFactory', function() {
    return{
        sinceTableHeader : [
            {displayName:'地域', width:'16%',cellTemplate:'<div>{{row.provinceAreaName}}-{{row.cityAreaName}}-{{row.areaName}}</div>'},
            {displayName:'地址', field: 'address', width:'15%'},
            {displayName:'物流公司', field: 'company',width:'7%'},
            {displayName:'电话', field: 'receivePhone', width:'14%'},
            {displayName:'创建时间', field: 'createTime', width:'8%'},
            {displayName:'状态', field: 'title6', width:'8%',cellTemplate:'<div>{{row.isUse === "1" ? "正常" : "停用"}}</div>'},
            {displayName:'操作', field: 'title9',width:'9%',cellTemplate:'<div class="operation">' +
                '<a ng-click="evt.entity.haltOpen(row)">{{row.isUse === "0" ? "启动" : "停用"}}</a>' +
                '<a ng-click="evt.entity.addEditSinceDialog(\'edit\',row)">修改</a>' +
            '</div>'
            }
        ],
        listStateData : [
            {id : 1, name : '正常'},
            {id : 0, name : '停用'}
        ]
    }
});

/**
 * Created by 大漠 on 2016/4/21.
 */
app.service('sinceService', ['$http', function ($http) {
    this.addEdit = function(getData,callback) {   //新增修改
        $http.get('/seller/pickAddress/insertOrUpdatePickAddress.json',{params:getData}).success(callback);
    };

    this.unUsePickAddress = function(getData,callback) {   //列表停用
        $http.get('/seller/pickAddress/unUsePickAddress.json',{params:getData}).success(callback);
    };

    this.usePickAddress = function(getData,callback) {   //列表停用
        $http.get('/seller/pickAddress/usePickAddress.json',{params:getData}).success(callback);
    };
}]);
app.controller('supplyDetailEditCrt',['$scope','$rootScope','$stateParams','ngDialog','messageFactory','supplyService', function($scope,$rootScope,$stateParams,ngDialog,messageFactory,supplyService) {
    var defaultData = {
        batchId : $stateParams.id
    };
    var supplyBatchSpecVoList = [];
    var provinceVOList = [];

    $scope.selectListTemplateData = null;
    $scope.type = $stateParams.type;
    $scope.listSticTemplateData = [];

    function getListSticTemplate(){
        supplyService.listSticTemplate(function(data){  //获取模版
            $scope.listSticTemplateData = data.data.logisticTemplateVOList;

            if($scope.type != 'add'){
                $scope.logisticTemplateSelect();
            }
        });
    }

    function offerDialogValidate(){
        var selectNum = 0;

        angular.forEach($scope.detailData.supplyBatchVO.supplyBatchSpecVoList,function(item){
            if(item.specNumSelect){
                selectNum++;
            }
        });
        if(!$scope.selectListTemplateData || !$scope.detailData.supplyBatchVO.itemVO && !selectNum){
            messageFactory({text : '请选择规则跟模版信息'});
            return false;
        }
        return true;
    }

    $scope.offerInfo = function(){
        if(offerDialogValidate()){
            ngDialog.open({
                template: '/view/goods/supply/supplyOfferInfoDialog.html',
                controller: 'supplyOfferInfoDialogCrt',
                resolve: {
                    getData : function() {
                        return {
                            itemId : $scope.detailData.supplyBatchVO.itemVO.id,
                            provinceId : $scope.selectListTemplateData.areaVO.provinceAreaIdList[0],
                            supplyBatchSpecFormList : supplyBatchSpecVoList
                        }
                    },
                    viewData : function () {
                        return {
                            provinceList : provinceVOList,
                            goodsTitle : $scope.detailData.supplyBatchVO.itemVO.itemName,
                            specName : $scope.detailData.supplyBatchVO.itemSpecName
                        }
                    }
                }
            });
        }
    };

    $scope.offerRank = function(){
        if(offerDialogValidate()) {
            ngDialog.open({
                template: '/view/goods/supply/supplyOfferRankDialog.html',
                controller: 'supplyOfferRankDialogCrt',
                resolve: {
                    getData: function () {
                        return {
                            itemId: $scope.detailData.supplyBatchVO.itemVO.id,
                            provinceIdList: $scope.selectListTemplateData.areaVO.provinceAreaIdList,
                            logisticTemplateId: $scope.selectListTemplateData.id,
                            supplyBatchSpecFormList: supplyBatchSpecVoList
                        }
                    },
                    viewData : function () {
                        return {
                            specName : $scope.detailData.supplyBatchVO.itemSpecName,
                            showCountyNames: $scope.selectListTemplateData.showCountyNames
                        }
                    }
                }
            });
        }
    };

    $scope.logisticTemplateSelect = function(){
        $scope.detailData.supplyBatchVO.areaVO = {};
        $scope.detailData.supplyBatchVO.logisticVO = '';
        $scope.detailData.supplyBatchVO.templateName = '';
        $scope.selectListTemplateData = null;

        angular.forEach($scope.listSticTemplateData,function(item){
            if(item.id == $scope.detailData.supplyBatchVO.logisticTemplateId){
                supplyService.queryTemplate({
                    id : item.id
                },function(data){
                    $scope.selectListTemplateData = data.data.logisticTemplateDTO;
                });

                if(!item.areaVO){
                    return;
                }
                supplyService.queryProvince({
                    provinceIdList : item.areaVO.provinceAreaIdList
                },function(data){
                    $scope.selectListTemplateData = item;
                    $scope.detailData.supplyBatchVO.areaVO = item.areaVO;
                    $scope.detailData.supplyBatchVO.logisticVO = item.logisticType;
                    $scope.detailData.supplyBatchVO.templateName = item.templateName;
                    provinceVOList = data.data.provinceVOList;
                });
            }
        });
    };

    $scope.specNumSelect = function(item){  //规格报价选择
        angular.addEditJson({
            data : supplyBatchSpecVoList,
            item : item,
            name : 'id'
        });
    };

    $scope.addSupplyBatch = function(){   //新增保存
        var submitData = angular.extend({},$scope.detailData.supplyBatchVO,{areaVO : {},supplyBatchSpecVoList : supplyBatchSpecVoList});
        submitData.areaVO.supplyAreaRelation = $scope.selectListTemplateData.areaVO.supplyAreaRelation;
        supplyService.addSupplyBatch(submitData,function(){
            location.href = $rootScope.prefix + 'goods/supplyList.do';
        });
    };

    $scope.updateSupplyBatch = function(){  //修改
        var submitData = angular.extend({},$scope.detailData.supplyBatchVO,{areaVO : {},supplyBatchSpecFormList : supplyBatchSpecVoList});
        submitData.areaVO.supplyAreaRelation = $scope.selectListTemplateData.areaVO.supplyAreaRelation;
        // submitData.supplyBatchSpecFormList= submitData.supplyBatchSpecVoList;
        delete submitData.areaVO.countyNames;
        delete submitData.supplyBatchSpecVoList;
        delete submitData.itemVO;
        supplyService.updateSupplyBatch(submitData,function(){
            location.href = $rootScope.prefix + 'goods/supplyList.do';
        });
    };
    
    if($scope.type != 'add'){
        //拷贝-修改
        supplyService.detailData(defaultData,function(data){
            $scope.detailData = data.data;
            angular.forEach($scope.detailData.supplyBatchVO.supplyBatchSpecVoList,function(item){
                item.specNumSelect = true;
                $scope.specNumSelect(item);
            });
            getListSticTemplate();
        });
    }else{
        //新增
        $scope.shopTypeData = [];
        $scope.detailData = {
            supplyBatchVO : {
                itemVO : null
            }
        };

        supplyService.shopTypeData(function(data){  //获取类目
            $scope.shopTypeData = data.data.categoryVOList;
        });

        getListSticTemplate();

        $scope.addGoods = function(goodsItemId,searchStr){
            if($scope.goodsInfo){
                $scope.detailData.supplyBatchVO.itemVO = $scope.goodsInfo.originalObject;
                $scope.detailData.supplyBatchVO.supplyBatchSpecVoList = $scope.goodsInfo.originalObject.standardSpecVOList;
            }else {
                supplyService.queryItemByCategory({
                    categoryId : goodsItemId,
                    itemName : searchStr
                },function(data){
                    if(!data.data.length){
                        messageFactory({text : '该类目下没有该商品'});
                        return;
                    }
                    $scope.detailData.supplyBatchVO.itemVO = data.data.itemVOList[0];
                    $scope.detailData.supplyBatchVO.supplyBatchSpecVoList = data.data.itemVOList[0].standardSpecVOList;
                });
            }
        };
    }

}]);

app.controller('supplyDetailInfoCrt',['$scope','$stateParams','ngDialog','messageFactory','supplyService', function($scope,$stateParams,ngDialog,messageFactory,supplyService) {
    var defaultData = {
        batchId : $stateParams.id
    };

    $scope.detailData = {
        supplyBatchVO : {
            itemVO : {}
        }
    };

    function offerDialogValidate(supplyBatchSpecVoList){
        if(!supplyBatchSpecVoList){
            messageFactory({text : '供货区域为空不能查看排名'});
            return false;
        }
        return true;
    }

    supplyService.detailData(defaultData,function(data){
        $scope.detailData = data.data;

        supplyService.queryProvince({
            provinceIdList : data.data.supplyBatchVO.areaVO.provinceAreaIdList
        },function(provinceData){
            $scope.offerInfo = function(){
                if(!offerDialogValidate(data.data.supplyBatchVO.showCountyNames)){
                    return;
                }
                ngDialog.open({
                    template: '/view/goods/supply/supplyOfferInfoDialog.html',
                    controller: 'supplyOfferInfoDialogCrt',
                    resolve: {
                        getData: function() {
                            return {
                                itemId : data.data.supplyBatchVO.itemVO.id,
                                provinceId : data.data.supplyBatchVO.areaVO.provinceAreaIdList[0],
                                supplyBatchSpecFormList : data.data.supplyBatchVO.supplyBatchSpecVoList
                            }
                        },
                        viewData : function () {
                            return {
                                provinceList : provinceData.data.provinceVOList,
                                goodsTitle : data.data.supplyBatchVO.itemVO.itemName,
                                specName : data.data.supplyBatchVO.itemSpecName
                            }
                        }
                    }
                });
            };

            $scope.offerRank = function(){
                if(!offerDialogValidate(data.data.supplyBatchVO.showCountyNames)){
                    return;
                }
                ngDialog.open({
                    template: '/view/goods/supply/supplyOfferRankDialog.html',
                    controller: 'supplyOfferRankDialogCrt',
                    resolve: {
                        getData: function() {
                            return {
                                itemId : data.data.supplyBatchVO.itemVO.id,
                                logisticTemplateId : data.data.supplyBatchVO.logisticTemplateId,
                                provinceIdList : data.data.supplyBatchVO.areaVO.provinceAreaIdList,
                                supplyBatchSpecFormList : data.data.supplyBatchVO.supplyBatchSpecVoList
                            }
                        },
                        viewData : function () {
                            return {
                                specName : data.data.supplyBatchVO.itemSpecName,
                                showCountyNames: data.data.supplyBatchVO.showCountyNames,
                                showSize: data.data.supplyBatchVO.showSize
                            }
                        }
                    }
                });
            };
        });
    });

    $scope.viewFreightTemplate = function(templateId){
        ngDialog.open({
            template: '/view/goods/supply/viewFreightTemplateDialog.html',
            controller: 'viewFreightTemplateDialogCtr',
            width : 900,
            resolve: {
                getData: function() {
                    return {
                        templateId : templateId
                    }
                }
            }
        });
    };
}]);

app.controller('supplySupplyListCrt',['$scope','$rootScope','ngDialog','confirmFactory','messageFactory','supplyListCacheFactory','supplyService', function($scope,$rootScope,ngDialog,confirmFactory,messageFactory,supplyListCacheFactory,supplyService) {
    $scope.tab = supplyListCacheFactory.listTab;
    $scope.tabSelectId = $scope.tab[0].id;
    $scope.getData = {
        batchStatus : $scope.tab[0].batchStatus,
        isPause : $scope.tab[0].isPause
    };
    $scope.listSticTemplateData = [];

    $scope.gridOptions = {
        url          : '/seller/supplyBatch/querySupplyBatchList.json',
        columnDefs   : supplyListCacheFactory.listTableHeader,
        params       : $scope.getData,
        selectAll    : false
    };

    function goBatchStatusList(batchStatus){
        $scope.getData.batchStatus = batchStatus;
        $scope.gridOptions.search();
    }

    $scope.navTab = function(item){
        $scope.tabSelectId = item.id;
        $scope.getData.batchStatus = item.batchStatus;
        $scope.getData.isPause = item.isPause;
        $scope.gridOptions.refresh();
    };

    $scope.sale = function(id){  //销售
        supplyService.sale({
            batchId : id
        },function(data){
            goBatchStatusList(data.data.batchStatus);
        });
    };

    $scope.halt = function(id){  //停售
        confirmFactory({
            title : '确定操作',
            text : '确定操作吗?',
            ok : function(){
                supplyService.halt({
                    batchId : id
                },function(data){
                    goBatchStatusList(data.data.batchStatus);
                    messageFactory({text : '操作成功！'});
                });
            }
        });
    };

    $scope.delete = function(id,index){  //删除
        var parScope = $scope;
        ngDialog.open({
            template: '/view/goods/supply/supplyDeleteDialog.html',
            width: 300,
            controller: function($scope){
                $scope.getData = {
                    reason : 1,
                    batchId : id
                };
                $scope.submit = function(){
                    supplyService.listDelete($scope.getData,function(data){
                        parScope.gridOptions.data.splice(index,1);
                        parScope = null;
                        $scope.closeThisDialog();  //dialog 关闭
                    });
                };
            }
        });
    };

    $scope.search = function(){
        $scope.gridOptions.search();
    };

    supplyService.listSticTemplate(function(data){
        $scope.listSticTemplateData = data.data.logisticTemplateVOList;
    });
}]);

app.controller('supplyOfferInfoDialogCrt',['$scope','supplyService','getData','viewData', function($scope,supplyService,getData,viewData) {
   $scope.viewData = viewData;
    
   $scope.getData = getData;

   $scope.load = function(){
       supplyService.offerInfo($scope.getData,function(data){
           $scope.infoData = [];
           $scope.infoData = data.data;
       });
   };

    $scope.load();
}]);

app.controller('supplyOfferRankDialogCrt',['$scope','supplyService','getData','viewData', function($scope,supplyService,getData,viewData) {
    $scope.viewData = viewData;
    $scope.offerRankData = [];

    getData.areaIdSize = viewData.showCountyNames.match(/[1-9][0-9]*/g)[0];
    supplyService.offerRank(getData,function(data){
        $scope.offerRankData = data.data;
    });
}]);

app.controller('viewFreightTemplateDialogCtr',['$scope','supplyService','freightTemplateFactory','freightTemplateService','getData', function($scope,supplyService,freightTemplateFactory,freightTemplateService,getData) {
    $scope.tabData = freightTemplateFactory.editTab;
    $scope.viewData = {};
    $scope.selectId = 1;


    $scope.tabToggle = function(id){
        $scope.selectId = id;
    };

    freightTemplateService.getTemplate(getData,function(data){
        $scope.viewData = data.data;
        $scope.tabToggle(data.data.logisticType.split(',')[0]);
    });

}]);

app.factory('supplyListCacheFactory', function() {
    return{
        listTab : [
           {name : '所有',batchStatus : 0,isPause : 0},
           {id : 1,name : '待出售',batchStatus : 1,isPause : 0},
           {id : 2,name : '出售中',batchStatus : 2,isPause : 0},
           {id : 3,name : '停售中',batchStatus : 2,isPause : 1}
        ],
        listTableHeader : [
            {displayName:'商品', field: 'itemName', width:'16%'},
            {displayName:'批次编号', field: 'batchNo', width:'10%'},
            {displayName:'规格/价格/毛重(kg)/体积(m³)', width:'8%',cellTemplate:'<div class="lh-20"><p ng-repeat="item in row.supplyBatchSpecVoList track by $index">{{::item.specNum}}{{::row.itemSpecName}}/¥{{::item.price}}/{{::item.roughWeight}}/{{::item.packBulk}}</p></div>'},
            {displayName:'批次库存', field: 'currentStock',width:'7%'},
            {displayName:'上架有效期', width:'10%',cellTemplate:'<div>{{::row.validTime}}-{{::row.expireTime}}</div>'},
            {displayName:'生产日期', field: 'productionTime', width:'8%'},
            {displayName:'运费模板', field: 'logisticTemplateName', width:'8%'},
            {displayName:'状态', width:'8%',cellTemplate:'<div class="{{row.batchStatus == 2 ? \'halt\' : \'sell\'}}">{{row.batchStatusDesc}}</div>'},
            {displayName:'创建时间', field: 'createTime',width:'15%'},
            {displayName:'操作', field: 'title9',width:'9%',cellTemplate:'<div class="operation">' +
                                                                            '<a ng-click="evt.entity.halt(row.id)" ng-if="row.batchStatus === 2 && !row.isPause">停售</a>' +
                                                                            '<a ng-click="evt.entity.sale(row.id)" ng-if="row.batchStatus === 3 || row.batchStatus === 2 && row.isPause">销售</a>' +
                                                                            '<a ng-click="evt.entity.delete(row.id,$index)" ng-if="row.batchStatus != 4">人工销毁</a>' +
                                                                            '<a href="{{parfix}}goods/supplyDetailInfo.do?id={{row.id}}" target="_blank">查看</a>' +
                                                                            '<a href="{{parfix}}goods/supplyDetailEdit.do?type=copy&id={{row.id}}">复制</a>' +
                                                                            '<a href="{{parfix}}goods/supplyDetailEdit.do?type=edit&id={{row.id}}" ng-if="row.batchStatus != 4">修改</a>' +
                                                                         '</div>'
            }
        ]
    }
});

/**
 * Created by 大漠 on 2016/4/21.
 */
app.service('supplyService', ['$http', function ($http) {
    this.sale = function(postData,callback) {   //列表开售
        $http.post('/seller/supplyBatch/startSupplyBatch.json ',postData).success(callback);
    };

    this.halt = function(postData,callback) {   //列表停售
        $http.post('/seller/supplyBatch/pauseSupplyBatch.json ',postData).success(callback);
    };

    this.listDelete = function(postData,callback) {   //列表删除
        $http.post('/seller/supplyBatch/destroySupplyBatch.json ',postData).success(callback);
    };

    this.listSticTemplate = function(callback) {   //列表查询运费模版
        $http.get('/seller/supplyBatch/queryLogisticTemplate.json').success(callback);
    };

    this.detailData = function(getData,callback) {   //商品详情
        $http.get('/seller/supplyBatch/querySupplyBatchDetail.json ',{params:getData}).success(callback);
    };

    this.shopTypeData = function(callback) {   //商品类型
        $http.get('/seller/supplyBatch/queryFirstCategory.json').success(callback);
    };

    this.offerRank = function(postData,callback) {   //商品详情
        $http.post('/seller/supplyBatch/sortSupplyBatchListByPrice.json',postData).success(callback);
    };

    this.offerInfo = function(postData,callback) {   //查看报价信息
        $http.post('/seller/supplyBatch/querySupplyBatchListByPrice.json',postData).success(callback);
    };

    this.offerInfo = function(postData,callback) {   //查看报价排名
        $http.post('/seller/supplyBatch/querySupplyBatchListByPrice.json',postData).success(callback);
    };

    this.updateSupplyBatch = function(postData,callback) {   //修改详情
        $http.post('/seller/supplyBatch/updateSupplyBatchById.json',postData).success(callback);
    };

    this.addSupplyBatch = function(postData,callback) {   //修改详情
        $http.post('/seller/supplyBatch/saveSupplyBatchById.json',postData).success(callback);
    };

    this.queryItemByCategory = function(postData,callback) {   //获取商品信息
        $http.post('/seller/supplyBatch/queryItemByCategoryId.json',postData).success(callback);
    };

    this.queryProvince = function(postData,callback) {   //queryProvince获取省数据
        $http.post('/seller/supplyBatch/queryProvinceByIds.json',postData).success(callback);
    };

    this.queryTemplate = function(postData,callback) {   //select template
        $http.post('/seller/supplyBatch/queryLogisticTemplateById.json',postData).success(callback);
    };
}]);
/**
 * Created by 大漠 on 2016/4/21.
 */
app.controller('orderDeliverDialogCrt',['$scope','$rootScope','$state','orderCacheFactory','orderListService','rowData', function($scope,$rootScope,$state,orderCacheFactory,orderListService,rowData) {
    $scope.rowItemData = rowData;
    $scope.logisticsName = orderCacheFactory.logisticsName;
    $scope.getData = {
        logisticsType : rowData.logisticsVO.logisticsType,
        logisticsTelephone : rowData.logisticsVO.logisticsTelephone,
        logisticsAddress : rowData.logisticsVO.logisticsAddress
    };

    $scope.submit = function(){
        $scope.getData.orderId = rowData.id;
        $scope.getData.orderNum = rowData.orderNum;
        orderListService.delivery($scope.getData,function(data){
            $state.go('order/orderList.type',{type: 'dDelivered'}); //跳到发货页面
            $scope.closeThisDialog();  //dialog 关闭
        })
    };
}]);

/**
 * Created by 大漠 on 2016/4/21.
 */
app.controller('orderListBaseCrt',['$scope','$rootScope','$state','orderCacheFactory', function($scope,$rootScope,$state,orderCacheFactory) {
    $scope.listNavTabData = orderCacheFactory.listNavTabData;
    $scope.navTabSelectItem = $scope.listNavTabData[$state.params.type];  //选中的navTab数据
    $scope.navTabSelectKey = ''; //选中的key
    $scope.printData = {};
    $scope.getListSearchData = {};

    $scope.navTab = function(key,item){  //nav切换
        $scope.navTabSelectItem = item;
        $scope.navTabSelectKey = key;
        $state.go('order/orderList.type',{type: key});
    };

    $scope.orderSearchList = function(){   //搜索请求
        $scope.$broadcast('orderSearchList');
    };

    $scope.exportOrderClick = function(){
        var exportOrderData = angular.extend({
            osdId : $scope.navTabSelectItem.id
        },$scope.getListSearchData);
        location.href = '/seller/order/exportOrder.json?' + angular.param(exportOrderData);
    };

    $scope.clearDate = function(){
        $scope.getListSearchData.orderStartTimeStr = '';
        $scope.getListSearchData.orderEndTimeStr = '';
    };

    
    //监听子节点数据
    $scope.$on('printData',function(event, printData){   //接受子节点批量导出请求事件
        $scope.printData = printData;
    });

    $scope.$on('listNavTabDataChange',function(event,key){   //接受子节点页面捞取url请求事件
        var key = key || $state.params.type;
        $scope.navTab(key,$scope.listNavTabData[key]); //找出菜单项
    });

}]);
/**
 * Created by 大漠 on 2016/4/21.
 */
app.controller('orderListCrt',['$scope','$rootScope','$state','messageFactory','orderCacheFactory','orderListService','ngDialog', function($scope,$rootScope,$state,messageFactory,orderCacheFactory,orderListService,ngDialog) {
    var bulkExportSelectIds = [];

    $scope.orderGridData = {};  //数据列表

    function initGetListData(){
        bulkExportSelectIds = [];  //清楚批量受理
        $scope.getListData = {
            osdId : $scope.navTabSelectItem.id,
            pageNo : 1,
            pageSize : 10
        };
        angular.extend($scope.getListData,$scope.getListSearchData);
    }

    function getListDataFn(){
        orderListService.list($scope.getListData,function(data){  //获取列表
            $scope.orderGridData = data;
        });
    }


    //事件
    $scope.logisticsTypeInit = function(item){  //初始化判断快递类型是否存在
        if(!item.logisticsTypeName){
            item.logisticsTypeName = '快递';
            item.logisticsType = 1;
        }
    };

    $scope.delivery = function (row) {   //发货点击
        ngDialog.open({
            template: '/view/order/orderList/orderDeliveryDialog.html',
            controller: 'orderDeliverDialogCrt',
            resolve: {
                rowData: function() {
                    return row;
                }
            }
        });
    };

    $scope.allBulkExport = function () {   //批量受理
        var ids = bulkExportSelectIds.toString();
        orderListService.allBulkExport({
            orderIdList : ids
        },function(data){
            messageFactory({text : '批量受理成功'});
            $state.go('order/orderList.type',{type: 'cAccept'}); //跳到受理页面
        })
    };

    $scope.bulkExportSelected = function(row){  //list select 选中
        angular.addEditSelect(bulkExportSelectIds,row.id);   //工具类添加删除
    };

    $scope.print = function(row){  //打印
        $scope.$emit('printData', row);  //传到父节点
    };

    $scope.foo = function(page){   //page分页
        $scope.getListData.pageNo = page;
        getListDataFn();
    };


    //监听事件
    $scope.$emit('listNavTabDataChange',$state.params.type);  //传到父节点

    $scope.$on('orderSearchList',function(event){   //接受父节点请求搜索请求事件
        initGetListData();
        getListDataFn();
    });


    initGetListData();
    getListDataFn();

}]);

/**
 * Created by 大漠 on 2016/4/21.
 */
app.factory('orderCacheFactory',['$rootScope','$sce', function($rootScope,$sce) {
    return {
        orderHeader : function(scope){
            //     return [{displayName:'商品', width:'25%',enableSorting:true,cellTemplate:function(row){
            //         return '<a target="_blank" href="javascript:;" class="order-item">'+
            //                     '<img src="http://staticonline.hipac.cn/item/201603/03011949201887.jpeg@60w" width="60" height="60" class="f-l mr-10">'+
            //                     '<div class="f-l">'+
            //                         '<div class="goods-title">'+ row.itemName +'</div>'+
            //                         '<div class="cor-grey5">2罐装</div>'+
            //                     '</div>'+
            //                 '</a>';
            //     }},
            //     {displayName:'数量', width:'5%',enableSorting:true,cellTemplate:function(row){
            //         return row.itemCount;
            //     }},
            //     {displayName:'金额小计',width:'9%',enableSorting:true,cellTemplate:function(row){
            //         return row.itemCount;
            //     }},
            //     {displayName:'供应商商品编号', width:'11%',enableSorting:true,cellTemplate:function(row){
            //         return row.itemCount;
            //     }},
            //     {displayName:'买家信息', width:'13%',enableSorting:true,cellTemplate:function(row){
            //         return row.itemCount;
            //     }},
            //     {displayName:'物流信息', width:'12%',enableSorting:true,cellTemplate:function(row){
            //         return row.itemCount;
            //     }},
            //     {displayName:'运费',width:'5%',enableSorting:true,cellTemplate:function(row){
            //         return row.itemCount;
            //     }},
            //     {displayName:'总金额',width:'5%',enableSorting:true,cellTemplate:function(row){
            //         return row.itemCount;
            //     }},
            //     {displayName:'状态',width:'5%',enableSorting:true,cellTemplate:function(row){
            //         return row.itemCount;
            //     }},
            //     {displayName:'操作',width:'10%',enableSorting:true,opts:['发货','打印订单'],optEventName:['aa','aa']}
            // ]
        },
        listNavTabData : {
            all : {name : '全部'},
            bPaid : {id : 6,name : '已支付'},
            cAccept : {id : 16,name : '已受理'},
            dDelivered : {id : 10,name : '已发货'},
            eComplete : {id : 2,name : '已完成'}
        },
        logisticsName : ['快递','中通速递','圆通速递','邮政小包','申通速递','国通速递','韵达速递','汇通快运','顺丰速递','天天速递','EMS国际','如风达速递','全峰速运','优速快递','百世快运','盛辉物流','安能物流','运通快递','百世快递']
    }
}]);
/**
 * Created by 大漠 on 2016/4/21.
 */
app.service('orderListService', ['$http', function ($http) {
    this.list = function(getData,callback) {   //list 数据
        $http.get('/seller/order/queryOrderList.json',{params:getData}).success(callback);
    };

    this.allBulkExport = function(postData,callback) {   //批量受理
        $http.post('/seller/order/bulkOrderPayToAcceptByOrderId.json',postData).success(callback);
    };

    this.delivery = function(postData,callback) {   //发货
        $http.post('/seller/order/bulkOrderAcceptToClosedByOrderId.json',postData).success(callback);
    };

    this.orderSearchList = function(postData,callback) {   //条件搜索
        $http.post('/seller/order/queryOrderList.json',postData).success(callback);
    };

    this.exportOrder = function(postData,callback) {   //条件搜索
        $http.post('/seller/order/exportOrder.json',postData).success(callback);
    };

}]);
//Main
app.controller('demoCtr',["$scope","$rootScope","$timeout", function($scope,$rootScope,$timeout) {
    $scope.treeList = [
        {
            "id": 1,
            "title": "node1",
            "items": [
                {
                    "id": 11,
                    "title": "node1.1",
                    "nodes": [
                        {
                            "id": 111,
                            "title": "node1.1.1",
                            "nodes": []
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "node1.2"
                }
            ]
        },
        {
            "id": 2,
            "title": "node2",
            "nodrop": true,
            "items": [
                {
                    "id": 21,
                    "title": "node2.1"
                },
                {
                    "id": 3,
                    "title": "node3",
                    "nodes": [
                        {
                            "id": 31,
                            "title": "node3.1"
                        }
                    ]
                },
                {
                    "id": 22,
                    "title": "node2.2"
                }
            ]
        }
    ];


    $scope.autocomplete = [
        { text: 'just' },
        { text: 'some' },
        { text: 'cool' },
        { text: 'tags' }
    ];

    $scope.loadTags = function(query) {
        // return {text:'a12'}
    };
}]);
