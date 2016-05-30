/**
 * Created by  on 2016/4/22.
 */
;(function(angular){
    var datetimepicker = angular.module('datetimepicker',[])
        .factory('timepickerFactory',function() {
            function extendInit(attrs,o){
                var opt = {
                    format        : 'Y-m-d' || attrs.format,
                    minDate       : '' || attrs.minDate,
                    maxDate       : '' || attrs.maxDate,
                    timepicker    : false,
                    timeHeightInTimePicker:11,
                    onShowCallback : function(){

                    }
                };
                angular.extend(opt,o || {});
                return opt;
            }

            function setDate(setDay){
                var date = new Date();
                var time = date.getTime();
                var dayTime = 60 * 1000 * 60 * 24 * Math.abs(setDay);
                var newDate;

                function fliterDate(data){
                    return data.match(/^(.+)T.*$/)[1];
                }

                if(setDay.indexOf('-') > -1){
                    newDate = new Date(time - Math.abs(dayTime));
                }else{
                    newDate = new Date(time + dayTime);
                }

                return {
                    newData : fliterDate(newDate.toISOString()),
                    date    : fliterDate(new Date().toISOString())
                };
            }

            return {
                extendInit : extendInit,
                setDate    : setDate
            };
        }).directive('timepicker',["timepickerFactory","$timeout",function(timepickerFactory,$timeout) {
            return {
                restrict: 'EA',
                scope:{
                    minDate  : '=' ,
                    maxDate  : '=',
                    datetimepickerEndOpt : '='
                },
                link : function(scope, elm, attrs) {
                    $timeout(function(){
                        var datetimepickerEndOpt = scope.datetimepickerEndOpt || {};
                        var opt = timepickerFactory.extendInit(attrs,datetimepickerEndOpt);
                        opt.onShow = function( ct ){
                            this.setOptions({
                                minDate : scope.minDate || false,
                                maxDate : scope.maxDate || false
                            });
                            opt.onShowCallback.apply(this,arguments);
                        };
                        $.datetimepicker.setLocale('zh');
                        elm.datetimepicker(opt);
                    },0);
                }
            }
        }]).directive('timepickerSetData',["timepickerFactory","$timeout",function(timepickerFactory,$timeout) {
            return {
                restrict: 'EA',
                scope : {
                    date : '='
                },
                link : function(scope, elm, attrs) {
                    $timeout(function(){
                        elm.on('click',function(){
                            scope.$apply(function(){
                                var date = timepickerFactory.setDate(attrs.timepickerSetData);
                                if(scope.date){
                                    scope.date[attrs.startDate] = date.newData;
                                    scope.date[attrs.endDate] = date.date;
                                }else{
                                    scope.$parent[attrs.startDate] = date.newData;
                                    scope.$parent[attrs.endDate] = date.date;
                                }

                            });
                        });
                    },0);
                }
            }
        }]);


})(angular);

