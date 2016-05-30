//Main
app.controller('mainController',['$scope','$rootScope', function($scope,$rootScope) {
    $rootScope.loading = false;
    $rootScope.prefix = '/demo/#/';
}]);
