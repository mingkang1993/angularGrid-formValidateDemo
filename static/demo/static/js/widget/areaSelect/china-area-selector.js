angular.module('china-area-selector', ['__chinaAreaSelectorTemplates__'])
    .service('chinaAreaSelectService', ['$http', function ($http) {
        this.getChinaAreaSelectData = function(postData,callback){
            $http({
                method:'POST',
                cache: true,
                url: '/seller/area/getChildrenArea.json',
                dataType: 'json',
                data  : postData
            }).success(callback)
        };
    }])
    .directive('chinaAreaSelectorWithWrapper', ['$cacheFactory','chinaAreaSelectService', function ($cacheFactory,chinaAreaSelectService) {
        return {
            restrict: 'AE',
            templateUrl: 'china-area-selector-with-wrapper.html',
            // replace: true,
            // transclude: true,
            scope: {
                region: '='
            },
            link: function (scope, element) {
                var getItemData = function (arr, id) {
                    for (var i=0;i< arr.length;i++){
                        if (id == arr[i].id){
                            return arr[i];
                        }
                    }
                    return {};
                };

                scope.provinces = [];
                scope.citys = [];
                scope.areas = [];

                scope.provinceChange = function(id,callback){
                    scope.citys = [];
                    scope.areas = [];
                    if(id) {
                        chinaAreaSelectService.getChinaAreaSelectData({
                            parentId: id
                        }, function (data) {
                            scope.citys = data.data;
                            if (callback) {
                                callback(data.data)
                            }
                        });
                    }
                };

                scope.cityChange = function(id,callback){
                    scope.areas = [];
                    if(id){
                        chinaAreaSelectService.getChinaAreaSelectData({
                            parentId : id
                        },function(data){
                            scope.areas = data.data;
                            if(callback){
                                callback(data.data)
                            }
                        });
                    }
                };

                chinaAreaSelectService.getChinaAreaSelectData({},function(data){
                    scope.provinces = data.data;
                    if(scope.region.province.id){
                        scope.region.province = getItemData(scope.provinces,scope.region.province.id);
                    }
                });

                if(scope.region.province.id && scope.region.city.id){
                    scope.provinceChange(scope.region.province.id,function (data) {
                        scope.region.city = getItemData(data,scope.region.city.id);
                    });
                }

                if(scope.region.city.id && scope.region.area.id){
                    scope.cityChange(scope.region.city.id,function (data) {
                        scope.region.area = getItemData(data,scope.region.area.id);
                    });
                }
            }
        };
    }]);


