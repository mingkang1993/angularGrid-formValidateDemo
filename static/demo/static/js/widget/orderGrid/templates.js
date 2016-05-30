angular.module("__orderListTemplates__", []).run(["$templateCache","$sce",
    function($templateCache,$sce) {
        $templateCache.put("orderListTemplate.html", '' +
            '<div class="jtable-wrap order-list">' +
                '<table class="table-item"width="100%">' +
                    '<thead>' +
                        '<tr>' +
                            '<th width="{{tabHeaderItem.width}}" ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index">{{tabHeaderItem.displayName}}</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody ng-repeat="tabItem in orderGridOptions.data track by $index">' +
                        '<tr>' +
                            '<td class="ta-l" colspan="{{orderGridOptions.columnDefs.length}}">{{tabItem.itemHeader}}</td>' +
                        '</tr>' +
                        '<tr ng-repeat="tabItemGoods in tabItem.tabItemGoods track by $index">' +
                            '<td ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index" rowspan="{{tabItem[tabHeaderItem.field].rowspan}}" ng-if="!$parent.$index || tabItemGoods[tabHeaderItem.field]" >'+ $sce.trustAsHtml() +'</td>'+
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
            '<div class="mt-10 page f-r clearfix"id="pageWrap"><div id="Pagination"><div class="pagination"><span class="current prev">上一页</span><span class="current">1</span><a>2</a><a>3</a><a>4</a><a>5</a><a class="next">下一页</a><div class="page-info">共42条，共5页</div><input type="text"value="1"class="jumpipt jumpPage "/><input type="button"value="确定"class="jumpipt jumpBtn"/></div></div></div></div>');
    }]);