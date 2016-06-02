/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(angular){
    'use strict';

    var rule = {};

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

        this.provideRule = function(validateMethod){  //注入规则
            for(var validateName in validateMethod){
                rule[validateName] = validateMethod[validateName];
            }
        };

    }).factory('validateFactory',['$compile','formValidateConfig',function($compile,formValidateConfig) {
        var opt = formValidateConfig.getOptions();
        function provide(scope,elm,attrs,controllers){
            var watchFn;
            var ngModelCtrl = controllers[0];
            var formCtrl = controllers[1];
            var formName = formCtrl.form.attr("name");
            var elmName = attrs.name;

            function validate(){
                /*转换前端传过来的校验规则*/
                if(opt.errorMessage === 'tip'){     //表示使用消息提示那种错误消息
                    formCtrl.formCrt.formValidateElmRule.push({
                        elmName : elmName,
                        rule : scope.validate
                    });
                }else{
                    for(var n in scope.validate){
                        ngModelCtrl.$setValidity(n, false);
                        elm.after($compile('<div class="error" ng-show="'+ formName +'.'+ elmName +'.$error.'+ n +' && '+ formName +'.formVaild">{{formName.formName.$error}}'+ scope.validate[n] +'</div>')(formCtrl.formCrt))
                    }
                }
            }

            function matchRule(rules){   //负责匹配校验规则
                var valiDataType = attrs.validateType;/*校验数据类型*/

                if(!valiDataType){
                    return;
                }

                try{   //如果json
                    var validateObj = JSON.parse(valiDataType);

                    for(var rulesName in validateObj){
                        if(validateObj[rulesName]){
                            injectRule(rulesName,rules[rulesName]);   //注入校验规则
                        }
                    }
                }
                catch (e){
                    if(valiDataType.indexOf(',') > -1){     //是字浮串数组
                        angular.forEach(valiDataType.split(','),function(item){
                            injectRule(item,rules[item]);   //注入校验规则
                        });
                    }else{
                        injectRule(valiDataType,rules[valiDataType]);   //注入校验规则
                    }
                }

                if(attrs.equalTo){   //绑定两端
                    injectRule('equalTo',rules['equalTo']);   //注入校验规则
                    equalTo('equalTo',rules['equalTo']);  //注入两端的监听
                }
            }

            function validateItem(validateName,newVal,callback){   //负责校验每个单独元素规则
                if(newVal && callback){
                    var test = callback(newVal,elm);
                    ngModelCtrl.$setValidity(validateName, test);
                    if(opt.errorMessage != 'tip'){     //表示使用使用展现错误形式那种,其他错误默认都是false;
                        for(var n in ngModelCtrl.$error){
                            if(n != validateName){
                                ngModelCtrl.$setValidity(validateName, true);
                            }
                        }
                    }
                }else{
                    ngModelCtrl.$setValidity(validateName, true);   //默认为空不校验,让他默认显示空提示
                }
            }

            function injectRule(validateName,callback){   //监听校验
                watchFn = scope.$parent.$watch(attrs.ngModel, function (newVal) {
                    validateItem(validateName, newVal, callback);
                });

                scope.$on('$destroy',function(){
                    watchFn();
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
        }

        function validateFns(scope,attrs,controllers){
            return {
                run : function(elm){
                    var provideFn = provide(scope,elm,attrs,controllers);
                    provideFn.build(rule);
                }
            }
        }

        return validateFns;
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
                                        messageFactory({text : item.rule[n]});
                                        return;
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
}(angular));

//var repeat = angular.element(document.getElementById(elm.attr("repeat")));
//repeat.on('keyup', function () {
//    repeatVal = this.value;
//    repeatFn();
//});
//scope.$watch(attrs.ngModel, function(newVal,lat){
//    tarVal = newVal || '';
//    repeatFn();
//});



