/**
 * Created by kangdaye on 16/4/26.
 */
;(function(){
    'use strict';
    angular.module('orderGrid',[])
            .factory('orderGridFactory',['$rootScope','$sce','$timeout',function($rootScope,$sce,$timeout){  //求出等比例的图片信息
            return '<div class="jtable-wrap order-list">' +
                    '<table class="table-item" width="100%">' +
                        '<thead>' +
                            '<tr>' +
                                '<th width="{{tabHeaderItem.width}}" ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index" bindonce>{{tabHeaderItem.displayName}}</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody ng-repeat="tabItem in orderGridOptions.data track by $index" bindonce>' +
                            '<tr>' +
                                '<td class="ta-l" colspan="{{orderGridOptions.columnDefs.length}}">{{tabItem.itemHeader}}</td>' +
                            '</tr>' +
                            '<tr ng-repeat="orderItemLineVoList in tabItem.orderItemLineVoList track by $index" bindonce>'+
                                '<td ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index" rowspan="{{tabItem[tabHeaderItem.field].rowspan}}" ng-if="!$parent.$index || orderItemLineVoList[tabHeaderItem.field]>' +
                                    '<div ng-bind-html="tabHeaderItem.cellTemplate(orderItemLineVoList || tabItem[tabHeaderItem.field].value) || orderItemLineVoList[tabHeaderItem.field] || tabItem[tabHeaderItem.field].value"></div>'+
                                '</td>'+
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +

                    '<div class="mt-10 page f-r clearfix" id="pageWrap">' +
                        '<div id="Pagination">' +
                            '<div class="pagination">' +
                                '<span class="current prev">上一页</span>' +
                                '<span class="current">1</span>' +
                                '<a>2</a><a>3</a><a>4</a><a>5</a><a class="next">下一页</a>' +
                                '<div class="page-info">共42条，共5页</div>' +
                                '<input type="text"value="1"class="jumpipt jumpPage "/><input type="button"value="确定"class="jumpipt jumpBtn"/>' +
                            '</div>' +
                        '</div>' +
                   '</div>' +
            '</div>'
        }]).directive('orderGrid',['$templateCache','$compile','$timeout','orderGridFactory',function($templateCache,$compile,$timeout,orderGridFactory){
        return {
            restrict: 'AE',
            scope: {
                orderGridOptions: '='
            },
            link: function (scope, elm, attrs){
                $timeout(function(){
                    var template = orderGridFactory;
                    elm.html(template);
                    $compile(elm.contents())(scope);
                },0);
            }
        };
    }]);
}());
