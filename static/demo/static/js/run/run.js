/**
 * Created by chenmingkang on 16/3/8.
 */
app.run(['$rootScope',function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(evt, current, fromParams) {
        // $rootScope.loading = true;
    });

    $rootScope.$on('$stateChangeSuccess', function(evt, current, previous) {
        if(current.pageRp){   //埋点
            $rootScope.pageRp = current.pageRp;
        }
    });

    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){

    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){

    });
}]);
