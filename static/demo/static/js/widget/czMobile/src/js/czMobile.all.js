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

/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';

    angular.module('cz-cookie',[]).factory('cookieFactory',function(){
        return {
            setCookie : function(cname, cvalue, exdays,domain) {//设置cookie
                var d = new Date();
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                var expires = "expires="+d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; path=/;domain="+ domain +";" + expires;
            },
            getCookie : function(cname) {//获取cookie
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
                }
                return "";
            },
            clearCookie : function(name,domain) {//清除cookie
                this.setCookie(name, '', -1,domain);
            }

        };
    });
}());

/**
 * Created by chenmingkang on 16/3/1.
 */

;(function() {
    'use strict';
    angular.module('cz-mobile', [
        'cz-form-validate',      //表单校验
        'cz-message',            //消息提示
        'cz-confirm',            //确定,取消弹出框
        'cz-cookie',             //cookie
        'cz-util'            //节点流
    ]);

    angular.module('cz-util', [
        'cz-throttle'            //节点流
    ]);
}());
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

/**
 * Created by chenmingkang on 16/3/8.
 */
var browser = function(){
    return {
        v : (function(){
            var u = navigator.userAgent, app = navigator.appVersion, p = navigator.platform,ua = u.toLowerCase();
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1, //android终端
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信
                webApp: u.indexOf('Safari') == -1, //是否web应用程序，没有头部与底部
                UCB: u.match(/UCBrowser/i) == "UCBrowser",
                QQB: u.match(/MQQBrowser/i) == "MQQBrowser",  //安卓QQ客户端包括QQ浏览器
                QQ: u.match(/QQ/i) == "QQ",  //iosQQ客户端内盒
                androidQQ: u.match(/YYB_D/i) == "YYB_D",  //安卓QQ客户端内盒
                win: p.indexOf('Win') > -1,//判断是否是WIN操作系统
                mac: p.indexOf('Mac') > -1,//判断是否是Mac操作系统
                weibo:ua.match(/weibo/i) == "weibo",
                zhefengle:ua.match(/zhefengle/i) == 'zhefengle', //判断是否是自己app
                ios9: /(iPhone|iPad|iPod).* OS 9_\d/.test(u) && !/Version\/9\./.test(u)
            };
        })()
    };
}();
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-throttle',[]).factory("throttleFactory",['$rootScope','$timeout', function($rootScope,$timeout) {   //节点流，滚动事件之类多次会导致性功能低下；
        return function(fn, threshhold, scope){
            threshhold || (threshhold = 250);
            var last,
                deferTimer;
            return function () {
                var context = scope || this;

                var now = +new Date,
                    args = arguments;
                if (last && now < last + threshhold) {
                    // hold on to it
                    $timeout.cancel(deferTimer);
                    deferTimer = $timeout(function () {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        };
    }]);
}());
/**
 * Created by chenmingkang on 16/1/15.
 */
;(function(angular){
    angular.inArray = function( elem, arr, i ) {
        var len;
        var deletedIds = [];
        var indexOf = deletedIds.indexOf;
        if ( arr ) {
            if ( indexOf ) {
                return indexOf.call( arr, elem, i );
            }
            len = arr.length;
            i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
            for ( var i = 0; i < len; i++ ) {
                if ( i in arr && arr[ i ] === elem ) {
                    return i;
                }
            }
        }

        return -1;
    };

    angular.param = function(obj) {
        if ( ! angular.isObject( obj) ) {
            return( ( obj== null ) ? "" : obj.toString() );
        }
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {

            value = obj[name];
            if(value instanceof Array) {
                for(i in value) {

                    subValue = value[i];
                    fullSubName = name + '[]';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += arguments.callee(innerObj) + '&';
                }

            } else if(value instanceof Object) {
                for(subName in value) {

                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += arguments.callee(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };


    angular.isObjectValueEqual = function(a, b) {
        // Of course, we can do it use for in
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    };

    return angular;

})(angular || {});
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
// angular.validateAddMethod
//
    angular.module('cz-form-validate',[]).provider('formValidateConfig', function() {
        this.options = {
            errorClass      : '',
            errorMessage    : 'tip'
        };
        this.$get = function() {
            var options = this.options;
            return {
                getOptions: function() {
                    return angular.extend({},options);
                }
            };
        };

        this.setOptions = function(options) {
            angular.extend(this.options, options);
        };
    }).factory('validateFactory',['$compile','formValidateConfig',function($compile,formValidateConfig) {
        var rule = {};
        var formValidateElmRule = [];
        var opt = formValidateConfig.getOptions();
        function provide(scope,elm,attrs,controllers){
            var ngModelCtrl = controllers[0];
            function validate(){
                var formCtrl = controllers[1];
                var formName = formCtrl.form.attr("name");
                var elmName = attrs.name;
                /*转换前端传过来的校验规则*/

                if(opt.errorMessage === 'tip'){     //表示使用消息提示那种错误消息
                    formCtrl.formCrt.formValidateElmRule.push({
                        elmName : elmName,
                        rule : scope.validate
                    });
                }else{
                    for(var n in scope.validate){
                        ngModelCtrl.$setValidity(item, false);
                        elm.after($compile('<div class="error" ng-show="'+ formName +'.'+ elmName +'.$error.'+ n +' && '+ formName +'.formVaild">'+ scope.validate[n] +'</div>')(scope))
                    }

                    // var ruleRpe = rule.replace(/:/g,",");
                    // var ruleArray = ruleRpe.substr(1,rule.length-2).split(",");
                    // angular.forEach(ruleArray,function(item,index){
                    //     if(index % 2 == 0){
                    //         ngModelCtrl.$setValidity(item, false);
                    //         elm.after($compile('<div class="error" ng-show="'+ formName +'.'+ elmName +'.$error.'+ item +' && '+ formName +'.formVaild">'+ ruleArray[index + 1] +'</div>')(scope))
                    //     }
                    // });
                }
            }

            function matchRule(rules){   //负责匹配校验规则
                var valiDataType = attrs.validateType;/*校验数据类型*/

                for(var rulesName in rules){
                    if(rulesName === valiDataType){
                        injectRule(rulesName,rules[rulesName]);   //注入校验规则
                    }
                }

                if(attrs.equalTo){   //绑定两端
                    injectRule('equalTo',rules['equalTo']);   //注入校验规则
                    equalTo('equalTo',rules['equalTo']);  //注入两端的监听
                }
            }

            function validateItem(validateName,newVal,callback){   //负责校验每个单独元素规则
                var ngModelCtrl = controllers[0];
                var test = callback(newVal,elm);
                if(newVal){
                    ngModelCtrl.$setValidity(validateName, test);
                }else{
                    ngModelCtrl.$setValidity(validateName, true);   //默认为空不校验,让他默认显示空提示
                }
            }

            function injectRule(validateName,callback){   //注入校验规则
               scope.$parent.$watch(attrs.ngModel, function(newVal){
                    validateItem(validateName,newVal,callback);
                });
            }

            function equalTo(validateName,callback){  //如密码,确定密码,两端绑定
                var tarElm = angular.element(document.getElementById(attrs.equalTo));
                tarElm.on('keyup', function () {
                    scope.$apply(function(){
                        validateItem(validateName,elm.val(),callback)
                    })
                });

                scope.$on('$destroy',function(){
                    tarElm.off();
                });
            }

            return{
                build : function(rule){
                    validate();
                    matchRule(rule);
                }
            };
        }//validateName,callback

        function validateFns(scope,attrs,controllers){
            return {
                addRule : function(validateMethod){
                    for(var validateName in validateMethod){
                        rule[validateName] = validateMethod[validateName];
                    }
                },
                run : function(elm){
                    var provideFn = provide(scope,elm,attrs,controllers);
                    provideFn.build(rule);
                }
            }
        };

        return validateFns;
    }]).run(['validateFactory',function(validateFactory){
        validateFactory().addRule(angular.validateAddMethod);
    }]).directive('formSubmit',['messageFactory',function(messageFactory) {
        return {
            restrict : 'EA',
            require: ['^?formValidate'],
            scope : {
                formSubmit : '&'
            },
            controller: ['$element',"$attrs", function($element,$attrs) {
                this.formSubmit = $element;
            }],
            link: function (scope, elm, attrs,formController) {
                var form = formController[0].form;
                var formCrt = formController[0].formCrt;
                var formName = form.attr("name");

                elm.on('click',function(){
                    console.log(formCrt[formName].$valid)
                    if(formCrt[formName].$valid){
                        formCrt[formName].formVaild = false;
                        scope.formSubmit();
                    }else{
                        for(var i = 0;i < formCrt.formValidateElmRule.length;i++){
                            var item = formCrt.formValidateElmRule[i];
                            var isValidTrue = formCrt[formName][item.elmName].$valid;
                            if(!isValidTrue){
                                var errorNameObj = formCrt[formName][item.elmName].$error;
                                for(var n in errorNameObj){
                                    if(item.rule[n]){
                                        messageFactory({text : item.rule[n]})
                                    }
                                }
                                return;
                            }
                        }
                        formCrt[formName].formVaild = true;
                    }
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            }
        }
    }]).directive('formValidate', function() {
        return {
            restrict: 'EA',
            require: ['^?formSubmit'],
            scope : true,
            controller: ['$scope','$element', "$attrs", function ($scope,$element, $attrs) {
                $scope.formValidateElmRule = [];
                this.formCrt = $scope;
                this.form = $element;
            }],
            link : function(scope, elm, attrs) {
                elm.attr('novalidate',true);
            }
        }
    }).directive('validate', ['$compile','$timeout','validateFactory',function($compile,$timeout,validateFactory) {
        return {
            restrict : 'EA',
            scope : {
                validateType : '@',
                validate : '='
            },
            require: ['ngModel','^?formValidate'],
            link : function(scope, elm, attrs,controllers) {
                 validateFactory(scope,attrs,controllers).run(elm);
            }
        }
    }])
}());

//var repeat = angular.element(document.getElementById(elm.attr("repeat")));
//repeat.on('keyup', function () {
//    repeatVal = this.value;
//    repeatFn();
//});
//scope.$watch(attrs.ngModel, function(newVal,lat){
//    tarVal = newVal || '';
//    repeatFn();
//});




/**
 * Created by chenmingkang on 16/3/11.
 *
 * 这里是校验公众的数据类型
 */

;(function(angular){
    angular.validateAddMethod = {
        phone : function(newVal){  //验证手机
            var res = new RegExp(/^1[3578][0-9]{9}$/);
            return newVal && res.test(newVal);
        },
        number : function(newVal){ //验证是否数字
            var res = new RegExp(/^[0-9]*$/);
            return newVal && res.test(newVal);
        },
        price : function(newVal){
            var res = new RegExp(/^\d+(\.\d+)?$/);
            return newVal && res.test(newVal);
        },
        priceUnZero : function(newVal){
            var res = new RegExp(/^\d+(\.\d+)?$/);
            return newVal && res.test(newVal) && newVal > 0;
        },
        equalTo : function(newVal,$elm){ //两端绑定
            var tarElm = function(){
                var id = $elm.attr('equal-to');
                return document.getElementById(id);
            }();
            return tarElm.value == newVal;
        },
        notChinese : function(newVal){
            var res = new RegExp(/[\u4e00-\u9fa5]+/);
            return newVal && !res.test(newVal);
        }
    };
})(angular);


//rule.phone = function(){
//    var res = new RegExp(/^1[3578][0-9]{9}$/);
//    scope.$watch(attrs.ngModel, function(newVal,lat){
//        if(!!newVal && newVal.length){
//            if(res.test(newVal)){
//                ngModelCtrl.$setValidity('phone', true);
//            }else{
//                ngModelCtrl.$setValidity('phone', false);
//            }
//        }else{
//            ngModelCtrl.$setValidity('phone', true);
//        }
//    });
//};
//rule.number = function(){
//    var res = new RegExp(/^[0-9]*$/);
//    scope.$watch(attrs.ngModel, function(newVal,lat){
//        if(!!newVal && newVal.length){
//            if(res.test(newVal)){
//                ngModelCtrl.$setValidity('number', true);
//            }else{
//                ngModelCtrl.$setValidity('number', false);
//            }
//        }else{
//            ngModelCtrl.$setValidity('number', true);
//        }
//    })
//},
//    rule.repeat = function(){
//        var repeat = angular.element(document.getElementById(elm.attr("repeat")));
//        var repeatVal = '';
//        var tarVal = '';
//        function repeatFn(){
//            if(tarVal.length > 0){
//                if(repeatVal == tarVal){
//                    ngModelCtrl.$setValidity('repeatMessage', true);
//                }else{
//                    ngModelCtrl.$setValidity('repeatMessage', false);
//                }
//            }else{
//                ngModelCtrl.$setValidity('repeatMessage', true);
//            }
//        };
//
//        repeat.on('keyup', function () {
//            repeatVal = this.value;
//            repeatFn();
//        });
//        scope.$watch(attrs.ngModel, function(newVal,lat){
//            tarVal = newVal || '';
//            repeatFn();
//        });
//    }