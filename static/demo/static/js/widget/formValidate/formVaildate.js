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

    }).factory('validateUtil', function() {   //工具类

        function validateObj(validateType) {
            var objVlidate = {};
            try{   //如果json
                objVlidate = JSON.parse(validateType);
            }
            catch (e){
                if(validateType.indexOf(',') > -1){     //是字浮串数组
                    angular.forEach(validateType.split(','),function(item){
                        objVlidate[item] = true;   //注入校验规则
                    });
                }else{
                    objVlidate[validateType] = true;   //注入校验规则
                }
            }
            return objVlidate;
        }

        function validateItem(newVal,ngModelCtrl,validateObj,elm){   //负责校验每个单独元素规则
            var isFindError = false;

            for(var rulesName in validateObj){
                var test = rule[rulesName](newVal,elm);
                ngModelCtrl.$setValidity(rulesName, true);   //默认为空不校验,让他默认显示空提示
                if(newVal && validateObj[rulesName]){
                    if(!isFindError && !test){   //如果他已经显示了错误信息 默认不校验,接下去全成功
                        ngModelCtrl.$setValidity(rulesName, test);
                        isFindError = true;
                    }
                }
            }
        }

        function findError(formCrt,formName){   //负责校验每个单独元素规则
            for(var i = 0;i < formCrt.formValidateElmRule.length;i++){
                var item = formCrt.formValidateElmRule[i];
                var isValidTrue = formCrt[formName][item.elmName].$valid;
                if(!isValidTrue){
                    var errorNameObj = formCrt[formName][item.elmName].$error;
                    for(var n in errorNameObj){
                        if(item.rule[n]){
                            return item.rule[n];
                        }
                    }
                    return;
                }
            }
        }

        return {
            validateObj : validateObj,
            validateItem : validateItem,
            findError : findError
        }

    }).factory('validateFactory',['$compile','formValidateConfig','validateUtil',function($compile,formValidateConfig,validateUtil) {
        var opt = formValidateConfig.getOptions();

        function provide(scope,elm,attrs,controllers){
            var watchValidateType,
                watchNgModel,
                ngModelCtrl = controllers[0],
                validateObjs = {},
                elmName = attrs.name;

            var formCtrl = controllers[1];
            var formName = formCtrl.form.attr("name");

            function validate(){
                // 转换前端传过来的校验规则
                if(opt.errorMessage === 'tip'){     //表示使用消息提示那种错误消息
                    formCtrl.formCrt.formValidateElmRule.push({
                        elmName : elmName,
                        rule : scope.validate
                    });
                }else{
                    for(var n in scope.validate){
                        ngModelCtrl.$setValidity(n, false);
                        elm.after($compile('<div class="error '+ opt.errorClass +'" ng-show="'+ formName +'.'+ elmName +'.$error.'+ n +' && '+ formName +'.formVaild">'+ scope.validate[n] +'</div>')(formCtrl.formCrt))
                    }
                }
            }
            
            function matchRule(){   //负责匹配校验规则
                if(attrs.validateType){
                    validateObjs = validateUtil.validateObj(attrs.validateType);

                    if(!attrs.validateType){
                        return;
                    }

                    watchValidateType = scope.$watch('validateType', function (newVal) {
                        validateObjs = validateUtil.validateObj(newVal);
                        validateUtil.validateItem(ngModelCtrl.$viewValue,ngModelCtrl,validateObjs,elm)
                    });

                    watchNgModel = scope.$parent.$watch(attrs.ngModel, function (newVal) {
                        validateUtil.validateItem(newVal,ngModelCtrl,validateObjs,elm);
                    });

                    if(attrs.equalTo){   //绑定两端
                        equalTo({equalTo : true});  //注入两端的监听
                    }

                    scope.$on('$destroy',function(){
                        watchValidateType();
                        watchNgModel();
                    });
                }
            }

            function equalTo(valiDataType){  //如密码,确定密码,两端绑定
                var tarElm = angular.element(document.getElementById(attrs.equalTo));
                tarElm.on('keyup', function () {
                    scope.$apply(function(){
                        validateUtil.validateItem(ngModelCtrl.$viewValue,ngModelCtrl,valiDataType,elm)
                    })
                });

                scope.$on('$destroy',function(){
                    tarElm.off();
                });
            }

            return{
                build : function(){
                    validate();
                    matchRule();
                }
            };
        }

        function validateFns(scope,elm,attrs,controllers){
            var provideFn = provide(scope,elm,attrs,controllers);
            return {
                run : provideFn.build
            }
        }

        return validateFns;
    }]).directive('formSubmit',['messageFactory','validateUtil',function(messageFactory,validateUtil) {
        return {
            restrict : 'EA',
            require: ['^?formValidate'],
            scope : {
                formSubmit : '&'
            },
            link: function (scope, elm, attrs,formController) {
                var form = formController[0].form;
                var formCrt = formController[0].formCrt;
                var formName = form.attr("name");

                elm.on('click',function(){
                    scope.$apply(function(){
                        if(formCrt[formName].$valid){
                            formCrt[formName].formVaild = false;
                            scope.formSubmit();
                        }else{
                            var errorText =  validateUtil.findError(formCrt,formName);
                            messageFactory({text : errorText});
                            formCrt[formName].formVaild = true;
                        }
                    });
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            }
        }
    }]).directive('formValidate', function() {
        return {
            restrict: 'EA',
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
                validateFactory(scope,elm,attrs,controllers).run();
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



