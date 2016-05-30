angular.module('hipacPage', ['paging']).directive('hipacPage',['$compile','$timeout',function ($compile,$timeout) {
    return {
        restrict: 'EA',
        scope: {
            page: '=',
            pageSize: '=',
            total: '=',
            dots: '@',
            ulClass: '@',
            activeClass: '@',
            disabledClass: '@',
            adjacent: '@',
            pagingAction: '&',
            pgHref: '@',
            textFirst: '@',
            textLast: '@',
            textNext: '@',
            textPrev: '@',
            textFirstClass: '@',
            textLastClass: '@',
            textNextClass: '@',
            textPrevClass: '@',
            textTitlePage: '@',
            textTitleFirst: '@',
            textTitleLast: '@',
            textTitleNext: '@',
            textTitlePrev: '@'
        },
        link : function(scope,elm,attrs){
            scope.page = parseInt(scope.page) || 1;
            scope.adjacent = parseInt(scope.adjacent) || 2;
            scope.total = parseInt(scope.total) || 0;   //总page
            scope.pgHref = scope.pgHref || '';
            scope.dots = scope.dots || '...';

            scope.ulClass = scope.ulClass || 'pagination';
            scope.activeClass = scope.activeClass || 'active';
            scope.disabledClass = scope.disabledClass || 'disabled';

            scope.textFirst = scope.textFirst || '<<';
            scope.textLast = scope.textLast || '>>';
            scope.textNext = scope.textNext || '下一页';
            scope.textPrev = scope.textPrev || '上一页';

            scope.textFirstClass = scope.textFirstClass || '';
            scope.textLastClass= scope.textLastClass || '';
            scope.textNextClass = scope.textNextClass || '';
            scope.textPrevClass = scope.textPrevClass || '';

            scope.textTitlePage = scope.textTitlePage || 'Page {page}';
            scope.textTitleFirst = scope.textTitleFirst || 'First Page';
            scope.textTitleLast = scope.textTitleLast || 'Last Page';
            scope.textTitleNext = scope.textTitleNext || 'Next Page';
            scope.textTitlePrev = scope.textTitlePrev || 'Previous Page';

            scope.hideIfEmpty = attrs.hideIfEmpty;
            scope.showPrevNext = attrs.showPrevNext || true;
            scope.showFirstLast = attrs.hideIfEmpty;
            scope.scrollTop = attrs.hideIfEmpty;


            $timeout(function(){
                var elmnt = $compile('<div paging ' +
                    'page="page" ' +
                    'show-prev-next="true" ' +
                    'page-size="pageSize"' +
                    'text-next="{{textNext}}"' +
                    'text-prev="{{textPrev}}"' +
                    'total="total" ' +
                    'paging-action="pagingAction({page:page,pageSize:pageSize, total:total})"' +
                    '></div>')(scope);
                elm.append(elmnt);
            },0);
        }
    };
}]);
