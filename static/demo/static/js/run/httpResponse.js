/**
 * Created by chenmingkang on 16/3/8.
 */
app.factory('authHttpResponseInterceptor',['$q','$location','$rootScope',function($q,$location,$rootScope){
    return {
        request: function (config) {
            var config = config || {};

            return config;
        },
        response: function(response){
            // if (typeof response.data === 'object' && (response.status != 200 || !response.data.success)) {
            //     errorFn(response.data.message);
            //     return $q.reject(response);
            // }
            return response || $q.when(response);
        },
        responseError: function(err){
            return $q.reject(err);
        }
    }
}]);
