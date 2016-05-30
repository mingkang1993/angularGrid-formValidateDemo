var app = angular.module('app', [
    'ui.router',
    'ngSanitize',     //把ng-bind-html之类模版指令拆出来了
    'grid',
    'datetimepicker',
    'ngDialog',
    'hipacPage',
    'cz-mobile'
],['$compileProvider','$locationProvider',function($compileProvider,$locationProvider){
    // $locationProvider.html5Mode(true).hashPrefix('!');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*((https?|ftp|tel|sms|mailto|file|javascript|chrome-extension):)|#/);
    //$compileProvider.urlSanitizationWhitelist()  //angular1.2以前
}]);