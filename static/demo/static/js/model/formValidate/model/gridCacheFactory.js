/**
 * Created by kangdaye on 16/5/27.
 */
app.factory('gridCacheFactory',function() {
    return [
        {displayName:'名字',field:'name'},
        {displayName:'性别',cellTemplate:'<div>{{row.sex ? "男" : "女"}}</div>'},
        {displayName:'年龄', field: 'age'},
        {displayName:'爱好', field: 'subject'},
        {displayName:'操作',cellTemplate:'<div class="operation">' +
            '<a ng-click="evt.entity.delete(row,$index)">删除</a>' +
        '</div>'
        }
    ]
});
