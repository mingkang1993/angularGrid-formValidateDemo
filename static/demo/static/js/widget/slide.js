/**
 * Created by kangdaye on 16/5/25.
 */
angular.module('slideImg', []).run(["$templateCache",function($templateCache) {
    $templateCache.put("hipacSlideTemplate.html",'' +
        '<div class="w-100px f-l ta-c">' +
            '<div class="b-1 h-18 cur-p" ng-click="prevNext(\'prev\')"><i class="iconfont cor-9"></i></div>' +
            '<div class="mt-10 of-h h-320px">' +
                '<div class="goods-img-small b-1 of-h h-98px bg-wating-small img-checked cur-p" ng-repeat="slide in imgData track by $index " ng-mouseenter="mouseenterImg($index)">' +
                    '<img ng-src="{{slide}}" class="w-100 d-ib va-m">' +
                '</div>' +
            '</div>' +
            '<div class="b-1 h-18 mt-10 cur-p" ng-click="prevNext(\'next\')"><i class="iconfont cor-3 cor-9"></i></div>' +
        '</div>' +
        '<div class="ml-10 f-l w-378px h-378px b-1 of-h bg-wating-big">' +
        '   <img ng-src="{{showImg}}" class="w-100 d-ib va-m" style="width:380px;">' +
        '</div>'
    );
}]).directive('slideImg',['$compile','$timeout',function ($compile,$timeout) {
    return {
        restrict: 'EA',
        templateUrl: 'hipacSlideTemplate.html',
        scope: {
           imgData : '=slideImg'
        },
        link : function(scope,elm,attrs){
            var watch = scope.$watch('imgData',function(val){
                if(val){
                    scope.mouseenterImg(scope.activeIndex);
                }
            });

            scope.showImg = '';
            scope.activeIndex = 0;

            scope.mouseenterImg = function(index){
                scope.activeIndex = index;
                scope.showImg = scope.imgData[index];
            };

            scope.prevNext = function(type){
                if(type === 'next' && scope.activeIndex < scope.imgData.length){
                    scope.activeIndex++;
                    scope.mouseenterImg(scope.activeIndex);
                    return;
                }
                if(type === 'prev' && scope.activeIndex > 0){
                    scope.activeIndex--;
                    scope.mouseenterImg(scope.activeIndex);
                    return;
                }
                scope.activeIndex = 0;
            };

            scope.$on('$destroy',function(){
                watch();
            })
        }
    };
}]);
