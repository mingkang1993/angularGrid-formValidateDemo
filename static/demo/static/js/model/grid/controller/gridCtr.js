//Main
app.controller('gridCtr',['$scope','$rootScope','gridCacheFactory', function($scope,$rootScope,gridCacheFactory) {
    $scope.gridOptions = {
        method       : 'GET',
        url          : '/grid',
        columnDefs   : gridCacheFactory,
        params       : {}
    };
    
    $scope.delete = function(row,index){
        var selectIndex = parseInt(index) + 1;
        console.log(row);
        alert('您删除的是第' + selectIndex + '条');
        $scope.gridOptions.data.splice(index,1);
    };

    $scope.search = function(){
        $scope.gridOptions.search(function(){
            alert('搜索成功');
        },{a:1});
    }
}]);
