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