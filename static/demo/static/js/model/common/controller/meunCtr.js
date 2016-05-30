//Main
app.controller('meunCtr',['$scope','meunDataFactory', function($scope,meunDataFactory) {
    $scope.meunData = meunDataFactory;
}]);
