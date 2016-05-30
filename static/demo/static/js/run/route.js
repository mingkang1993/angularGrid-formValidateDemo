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
        {name : 'gridList', url: '/gridList.html',templateUrl:'/demo/view/grid/gridList.html', controller: 'gridCtr',pageRp:1},
        {name : 'gridSelectAllList', url: '/gridSelectAllList.html',templateUrl:'/demo/view/grid/gridList.html', controller: 'gridSelectAllCtr',pageRp:2},
        {name : 'gridApi', url: '/gridApi.html',templateUrl:'/demo/view/grid/gridApi.html', controller: '',pageRp:3},

        {name : 'formValidate/demo', url: '/formValidate/demo.html',templateUrl:'/demo/view/formValidate/formValidateDemo.html', controller: 'formValidateDemoCtr',pageRp:4},
        {name : 'formValidate/api', url: '/formValidate/api.html',templateUrl:'/demo/view/formValidate/formValidateApi.html', controller: '',pageRp:5}
    ];

    app.config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$httpProvider) {
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

        $urlRouterProvider.otherwise('gridList.html');

    }]);
})(app);

