
app.factory("meunDataFactory", ['$rootScope',function($rootScope) {   //
    return [
        {name : 'grid表格',child : [
            {name : 'grid用法',href : $rootScope.prefix + 'gridList.html',activeIndex:1},
            {name : 'gridSelectAll用法',href : $rootScope.prefix + 'gridSelectAllList.html',activeIndex:2},
            {name : 'gridApi',href : $rootScope.prefix + 'gridApi.html',activeIndex:3}
        ]},
        {name : 'form-validate',child : [
            {name : 'form-validate用法',href : $rootScope.prefix + 'formValidate/demo.html',activeIndex:4},
            {name : 'form-validateApi',href : $rootScope.prefix + 'formValidate/api.html',activeIndex:5}
        ]}
    ]
}]);

