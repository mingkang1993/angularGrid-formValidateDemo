/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-message',[]).factory('messageFactory',['$rootScope','$timeout','$compile', function($rootScope,$timeout,$compile) {
        var time = time || undefined;
        var scope = $rootScope.$new();

        return function(o){
            $timeout(function(){
                var option = {
                    time : 3000,
                    text:''
                };
                angular.extend(option,o);
                var elm = (function(){
                    return document.getElementById('messageTop');
                }());
                scope.messageText = option.text;

                if(!elm){
                    // angular.element(document.body).append(html);
                    var html = '<div class="message-top" id="messageTop" ng-show="messageText">' +
                        '<div class="message-main-lay">'+
                        '<div class="message-main">'+
                        '<div class="message-text">{{messageText}}</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                    angular.element(document.body).append($compile(html)(scope))
                }

                $timeout.cancel(time);
                time = $timeout(function(){
                    elm = null;
                    scope.messageText = '';
                },option.time);
            },0)
        }
    }]);
}());
