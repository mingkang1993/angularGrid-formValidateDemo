/**
 * Created by 大漠 on 16/5/10.
 */
;(function(){
    'use strict';
		angular.module('grid',[]).provider('gridConfig', function() {
			this.options = {
				method              : 'POST',
				url                 : '',
				loadSuccessCallback : function(){},
				pageSuccessCallback : function(){},
				search 				: function(){},
				refresh				: function(){},
				// paginationPageSizes : [10, 25, 50],
				paginationPageSize  : 10,
				paginationCurrentPage : 1,
				total  				: 1,
				params              : {},
				data                : [],
				selectData 			: [],
				selectAll           : false,  //是否显实全选
				showPage            : true  //是否显示分页
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
		}).run(["$templateCache",function($templateCache) {
				$templateCache.put("gridTemplate.html",
					'<div class="jtable-wrap order-list">' +
						'<table class="table-item"width="100%">' +
							'<thead>' +
								'<tr>' +
									'<th ng-if="orderGridOptions.data.length && orderGridOptions.selectAll"><input type="checkbox" ng-model="$parent.gridSelectAll" ng-change="selectAll()"></th>' +
									'<th width="{{tabHeaderItem.width}}" ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index" bindonce>{{tabHeaderItem.displayName}}</th>' +
								'</tr>' +
							'</thead>' +
							'<tbody grid-row="tabItem" row-index="$index" ng-repeat="tabItem in orderGridOptions.data track by tabItem.id" bindonce>' +
								'<tr>' +
									'<td ng-if="orderGridOptions.selectAll"><input type="checkbox" ng-model="tabItem.gridSelectItem" ng-change="selectItem(tabItem)"></td>' +
									'<td ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index" bindonce  grid-cell="{{$index}}">{{tabItem[tabHeaderItem.field]}}</td>' +
								'</tr>' +
							'</tbody>' +
						'</table>' +
						'<div class="paging" ng-if="orderGridOptions.showPage" hipac-page ' +
				   				'page="orderGridOptions.paginationCurrentPage" ' +
				   				'page-size="orderGridOptions.paginationPageSize" ' +
				   				'total="orderGridOptions.total" ' +
				   				'paging-action="foo(page,pageSize, total)">' +
						'</div>'+
					'</div>');
	    }]).factory('girdFactory',['$http','$rootScope','$timeout','gridConfig',function($http,$rootScope,$timeout,gridConfig){
			var opt = {};
			var time;

			function init(o,callback){
				var conf = gridConfig.getOptions();
				angular.extend(conf,o);   //转换默认
				opt = angular.extend(o,conf);    //默认转换成传过来的配置￼

				getData(function(data){ //请求数据
					opt.loadSuccessCallback(data);
					if(callback){
						callback(opt);
					}
				});
			}

			function getData(callback,getData){
				$timeout.cancel(time);
				time = $timeout(function(){
					if(opt.url){   //如果默认有数据，callback回调
						var getDataOpt = {
							method     :  opt.method,
							url        :  opt.url,
							dataType   :  'json'
						};

						var getParams = {
							pageNo : opt.paginationCurrentPage,
							pageSize : opt.paginationPageSize
						};

						angular.extend(getParams,getData || {},opt.params);

						if(opt.method.toUpperCase() == 'POST'){  //判断是post还是get
							getDataOpt.data = getParams;
						}else{
							getDataOpt.params = getParams;
						}

						$http(getDataOpt).success(function(datas){    //请求数据
							opt.data = datas.data;
							opt.total = datas.totalCount;
							if(callback){
								callback(datas);
							}
						}).error(function(){

						});
					}
				},0);
			}

			return {
				init        :  init,
				getData     : getData
			};
		}]).controller('gridCtrl',['$scope','girdFactory',function($scope,girdFactory){
			this.gridScope = $scope;  //提供方法出去被调用

			$scope.foo = function(){
				girdFactory.getData($scope.orderGridOptions.pageSuccessCallback)
			};

			$scope.orderGridOptions.refresh = $scope.orderGridOptions.search = function(){
				$scope.orderGridOptions.paginationCurrentPage = 1;
				girdFactory.getData.apply(this,arguments);
			};

			$scope.selectItem = function(row){
				var selectNum = 0;
				angular.addEditJson({
					data : $scope.orderGridOptions.selectData,
					item : row,
					name : 'id',
					forSelectCallback : function(row){
						selectNum++;
						if(selectNum == $scope.orderGridOptions.data.length){
							$scope.gridSelectAll = true;
						}else{
							$scope.gridSelectAll = false;
						}
					}
				});
			};

			$scope.selectAll = function(){
				angular.addEditJson({
					data : $scope.orderGridOptions.selectData,
					item : $scope.orderGridOptions.data,
					name : 'id',
					selectAll : $scope.gridSelectAll,
					selectCallback : function(row){
						row.gridSelectItem = true;
					},
					removeCallback : function (row) {
						row.gridSelectItem = false;
					}
				});
			};
		}]).directive('grid',['$compile','girdFactory',function($compile,girdFactory){
	        return {
	            restrict: 'AE',
				templateUrl: 'gridTemplate.html',
	            scope: {
	                orderGridOptions: '=grid'
	            },
	            controller: 'gridCtrl',
				link: function(scope, elm, attrs) {
					girdFactory.init(scope.orderGridOptions);
				}
	        };
	    }]).directive('gridRow',['$compile','$timeout',function($compile,$timeout){
	        return {
	            restrict: 'AE',
	            require: '^grid',
	            scope: {
	                row: '=gridRow',
					$index: '=rowIndex'
	            },
	            controller: ['$scope', function ($scope) {
	                this.gridRow = $scope;
	            }],
	            link: function($scope, $elm, $attrs,gridCtr) {
	            	$scope.evt = {
	                	entity : gridCtr.gridScope.$parent
					};
		  		}
	        };
	    }]).directive('gridCell',['$compile','$timeout',function($compile,$timeout){
	        return {
	            restrict: 'AE',
	            require: ['^grid','^gridRow'],
	            scope: {
	                gridCellIndex : '@gridCell'
	            },
	            compile: function() {
			      return {
					  	pre: function(scope, elm, $attrs, controllers) {
							var itemColumnDefs = controllers[0].gridScope.orderGridOptions.columnDefs[scope.gridCellIndex];
							var rowCrt = controllers[1].gridRow;
				        	var cell = itemColumnDefs.cellTemplate;

							function compile(html,commpileScope){
								if(html){
									$compile(html)(commpileScope, function(cloned, scope){
										elm.html('').append(cloned);
									});
								}else{
									elm.html('<div></div>');
								}
							}

							if(itemColumnDefs.filter) {   //过滤器存在,优先过滤器
								var template = itemColumnDefs.filter(rowCrt.row);
								compile(template, rowCrt);
								return;
							}

							if (cell) {   //自定义拼接模版,优先,最后在去匹配
								compile(cell,rowCrt);
							}
				        }
			      }
		  }
	        };
	    }])
}());
