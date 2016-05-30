/**
 * Created by chenmingkang on 16/3/1.
 *
 * textTitle    title头部文本
 * text      文本
 * closeText  关闭文本
 * goText  确定文本
 */
;(function(){
    'use strict';
    angular.module('cz-confirm',[]).factory('confirmFactory',['$rootScope','$compile','$timeout',function($rootScope,$compile,$timeout){  //求出等比例的图片信息
        var getElmBg = function(){
            var getBg = getElm.length ? getElm[0] : document;
            return angular.element(getBg.getElementsByClassName('confirm-bg'));
        };

        var getElm = function(){
            return document.getElementsByClassName('confirm-lay');
        }();
        var $body = function(){
            return angular.element(document.getElementsByTagName('body'));
        }();

        var scope = $rootScope.$new();
        var $win = angular.element(window);
        var $elmBg;

        scope.confirm = {
            textTitle:'',
            text:'',
            closeText:'取消',
            goText:'确定',
            option:{
                go:function(){},
                close:function(){}
            }
        };

        var closeConfirm = function(){                      //清理
            $elmBg.off();
            $win.off('mousewheel');
            if(getElm[0]){
                angular.element(getElm[0]).remove();
            }
        };

        var setCss = function(){
            var getMain = getElm[0].getElementsByClassName('confirm-main')[0];
            getMain.style.marginTop = - (getMain.clientHeight / 2) + 'px';
            getMain = null;
        };

        function init(myData){
            angular.extend(scope.confirm,myData);
            var template = '<div class="confirm-lay confirm-lay-show">' +
                '<div class="confirm">' +
                '<div class="confirm-bg" id="confirm-bg" ng-click="confirmBgClose()"></div>' +
                '<div class="confirm-main">' +
                '<div class="confirm-text">'+
                '<div class="confirm-text-title" ng-bind-html="confirm.textTitle"></div>' +
                '<div class="confirm-text" ng-bind-html="confirm.text"></div>'+
                '</div>' +
                '<div class="confirm-btn">' +
                '<a href="javascript:;" ng-click="confirmClose()" class="confirm-btn-cancel">{{confirm.closeText}}</a>' +
                '<a href="javascript:;" ng-click="confirmGo()">{{confirm.goText}}</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $body.append($compile(template)(scope));
            $elmBg = getElmBg();
            $win.on('mousewheel',function(evt){
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            });
            $elmBg.bind('touchmove', function(evt) {
                evt.preventDefault();
            });
            $timeout(function(){
                setCss();
            },0);
        }

        scope.confirmGo = function(){
            closeConfirm();
            if(!!scope.confirm.option.go){
                scope.confirm.option.go();
            }
        };
        scope.confirmBgClose = function(){
            closeConfirm();
        };
        scope.confirmClose = function(){
            closeConfirm();
            if(!!scope.confirm.option.close){
                scope.confirm.option.close();
            }
        };

        scope.$on('$destroy', function(){
            closeConfirm();
            getElm = $elmBg = null;
        });

        return function(myData){
            init(myData);
        }
    }]);
}());
