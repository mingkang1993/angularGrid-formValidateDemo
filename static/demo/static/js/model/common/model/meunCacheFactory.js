
app.factory("meunDataFactory", ['$rootScope',function($rootScope) {   //
    return [
        {name : 'grid表格',child : [
            {name : 'grid用法',href : $rootScope.prefix + 'gridList.html',activeIndex:1},
            {name : 'gridSelect-all用法',href : $rootScope.prefix + 'gridSelectAllList.html',activeIndex:2},
            {name : 'grid-api',href : $rootScope.prefix + 'gridApi.html',activeIndex:3}
        ]},
        {name : 'form-validate',child : [
            {name : 'form-validate用法',href : $rootScope.prefix + 'formValidate/demo.html',activeIndex:4},
            {name : 'form-validate-api',href : $rootScope.prefix + 'formValidate/api.html',activeIndex:5}
        ]},
        {name : 'datetimepicker',child : [
            {name : 'demo',href : $rootScope.prefix + 'datetimepicker/demo.html',activeIndex:6}
        ]}
    ]
}]);

