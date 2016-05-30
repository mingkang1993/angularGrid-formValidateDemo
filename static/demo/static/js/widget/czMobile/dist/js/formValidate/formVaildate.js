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



