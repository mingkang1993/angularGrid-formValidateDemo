//Main
app.controller('formValidateDemoCtr',['$scope','$rootScope', function($scope,$rootScope) {
    $scope.getData = {};
    
    $scope.checkFn = function(){
        $scope.getData.reason = $scope.getData.reason ? $scope.getData.reason : '';
    };

    $scope.submit = function(){
        alert('提交成功');
    }
}]);
