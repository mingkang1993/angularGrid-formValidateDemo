//Main
app.controller('gridSelectAllCtr',['$scope','$rootScope','gridCacheFactory', function($scope,$rootScope,gridCacheFactory) {
    $scope.gridOptions = {
        method       : 'GET',
        url          : '/grid',
        columnDefs   : gridCacheFactory,
        selectAll    : true,
        params       : {}
    };
    
    $scope.getSelectAll = function(){
        console.log($scope.gridOptions.selectData);
    };
}]);
