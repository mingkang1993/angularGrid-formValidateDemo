//Main
app.controller('datetimepickerDemoCtr',['$scope','$rootScope','gridCacheFactory', function($scope,$rootScope,gridCacheFactory) {
    $scope.datetimepickerOpt = {
        timepicker:true,
        format:'d.m.Y'
    };
}]);
