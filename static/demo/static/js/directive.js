app.directive('compile',['$timeout','$compile',function($timeout,$compile) {
    return {
        restrict: 'EA',
        scope:{
            template : '='
        },
        link : function(scope, elm, attrs) {
            var watch;
            $timeout(function(){
                watch = scope.$watch('template', function (myTemplate) {
                    if (angular.isDefined(myTemplate)) {
                        var elmnt = $compile(myTemplate)(scope);

                        elm.html(''); // dummy "clear"

                        elm.append(elmnt);
                    }
                });

                scope.$on('$destroy', function(){
                    watch();
                });
            },0);
        }
    }
}]).directive('print',['$timeout','$compile',function($timeout,$compile) {   //打印
    return {
        restrict: 'EA',
        scope:{
            printBefore : '='
        },
        link : function(scope, elm, attrs) {
            $timeout(function(){
                var $printTarId = $('#' + attrs.print);
                elm.on('click',function () {
                    if(scope.printBefore != undefined){
                        if(scope.printBefore){
                            $printTarId.jqprint();
                        }
                    }else{
                        $printTarId.jqprint();
                    }
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            },0);
        }
    }
}]).directive('dialogClose',['$timeout',function($timeout) {   //打印
    return {
        restrict: 'EA',
        link : function(scope, elm, attrs) {
            $timeout(function(){
                elm.on('click',function () {
                    scope.closeThisDialog();  //dialog 关闭
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            },0);
        }
    }
}]).directive('back',['$timeout',function($timeout) {   //打印
    return {
        restrict: 'EA',
        link : function(scope, elm, attrs) {
            $timeout(function(){
                elm.on('click',function () {
                    window.history.go(-1);
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            },0);
        }
    }
}]);