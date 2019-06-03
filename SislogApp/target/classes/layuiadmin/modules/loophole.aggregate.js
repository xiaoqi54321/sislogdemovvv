layui.define(function (e) {
	const params = {};

	const api = {
		ignore: '',//点击列表忽略提交的api
		workOrder: '',//工单信息api
		workOrderInfo: '',//工单详情
	};

	function getInstance() {
		const $ = layui.$;
		const table = layui.table;
		let me = {};

		let buildServiceTableId = function (_asset) {
			return 'table-asset-service-' + _asset.token;
		}
		let addAssetServiceTable = function (_asset) {
			let _info = _asset.info;
			let _services = _asset.services;
			let _table = `<table class="layui-hide" id="id-${ buildServiceTableId(_asset) }" lay-filter="filter-${buildServiceTableId(_asset)}"></table>`;
			return _table;
		};
		let renderServiceTable = function (_options) {
			table.render({
				id: _options.id,
				elem: _options.elem,
				data: _options.data, //data,
				height: 'full-730', //高度填满
				defaultToolbar: [], //工具栏右侧按钮，默认['filter','exports','print']
				even: true,
				title: '资产服务列表', //标题，导出、打印时会依据该配置生成文件名
				cols: [[{
							type: 'numbers',
							fixed: 'left'
						}, {
							field: 'protocol',
							title: '协议',
							width: 100,
							align: 'center',
						}, {
							field: 'port',
							title: '端口',
							width: 80,
							align: 'center',
						}, {
							title: '是否后台管理端口',
							width: 150,
							align: 'center',
							templet: function (res) {
								return res.manage === 1 ? '是' : '否';
							}
						}, {
							title: '是否系统自带服务',
							width: 150,
							align: 'center',
							templet: function (res) {
								return res.self === 1 ? '是' : '否';
							}
						}, {
							field: 'name',
							title: '软件名称',
							minWidth: 140,
							align: 'center',
						}, {
							field: 'version',
							title: '软件版本',
							width: 100,
							align: 'center',
						}, {
							title: '是否Web服务',
							width: 120,
							align: 'center',
							templet: function (res) {
								return res.web === 1 ? '是' : '否';
							}
						}, {
							title: '域名地址',
							width: 240,
							align: 'center',
							templet: function (res) {
								return res.web === 1 ? res.domain : '--'
							}
						}
					]],
				page: false, //开启分页
			});
		};

		let addAsset = function (_asset, _expand) {
			let _result =
				`<div class="layui-colla-item">
					<h2 class="layui-colla-title" style="display: flex;flex-direction: row;">
						<div style="width:100%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
							<span>${ _asset.title}</span>
						</div>
					</h2>
					<div class="layui-colla-content ` + (_expand ? `layui-show` : ``) + `">
						${ addAssetServiceTable(_asset) }
					</div>
				</div>`;
			return _result;
		};

		me.addAssets = function (_elem, _assets) {
			_assets.forEach(function (_asset, _index) {
				let _item = addAsset($.extend(_asset, {
							title: _asset.info.name +"【"+ (_index + 1) + '】 - ' + _asset.info.address
						}), _index === 0);
				$(_elem).append(_item);

				renderServiceTable({
					elem: '#id-' + buildServiceTableId(_asset),
					id: 'id-' + buildServiceTableId(_asset),
					data: _asset.services,
				});
			});
		}
		return me;
	}
	const events = {
		//提交
		submit: function () {
			const $ = layui.$;
			const helper = layui.helper;
			let panel = $("div.div-order-detail");
			let info = {};
			info.department = panel.find("input[name=department]").val();//所属部门
			info.liablePerson = panel.find("input[name=liablePerson]").val();//责任人
			info.liablePersonContact = panel.find("input[name=liablePersonContact]").val();//责任人联系方式
			info.workOrderTime = panel.find("input[name=workOrderTime]").val();//整改工单时间
			info.workOrderDsc = panel.find("textarea[name=workOrderDsc]").val();//描述
			layer.msg(JSON.stringify(info));
			let map = {
				"params['department']":info.department,
				"params['liablePerson']":info.liablePerson,
				"params['liablePersonContact']":info.liablePersonContact,
				"params['workOrderTime']":info.workOrderTime,
				"params['workOrderDsc']":info.workOrderDsc,
			}
			// helper.ajax(api.workOrderInfo,map,function(){
			// 	layer.alert("成功");
			// },function(){
			// 	layer.alert("失败");
			// });
		},
	};
	

	const initPageRender = function (requestRender) {
		const $ = layui.$;
		const element = layui.element;
		const form = layui.form;
		const laydate = layui.laydate;

		let info = {
			adminName:'管理员',
			adminContact:'管理员联系方式',
			time: "2019-01-01 00:00:00",
			des: `资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产
		新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增`
		};
		form.on('checkbox(che)', function(data){
			const helper = layui.helper;
			//阻止事件冒泡
			layui.stope(window.event);
			console.log(data.value); //复选框value值，也可以通过data.elem.value得到
			let map = {
				"params['id']":data.value
			}
			helper.ajax(api.ignore, map ,function(response){
				layer.alert(response);
			},function(response){
				layer.alert(response);
			});
		}); 

		let instance = getInstance();

		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click'
			});
		});

		const assets = [{
				token: new Date().getTime(),
				info: {
					name: '未命名标题1',
					address:'10.12.12.12'
				},
				services: [{
						timestamp: new Date().getTime(),
						protocol: 'http',
						port: '80',
						manage: 0,
						self: 0,
						name: 'tomcat',
						version: '7.0.29',
						web: 1,
						domain: 'http://10.254.222.10/nssa',
						container: 1,
						cname: 'apache tomcat',
						cversion: '7.0.29',
					}
				]
			}, {
				token: new Date().getTime() + 1000,
				info: {
					name: '未命名标题1',
					address:'10.12.12.12'
				},
				services: [{
						timestamp: new Date().getTime(),
						protocol: 'http',
						port: '80',
						manage: 0,
						self: 0,
						name: 'tomcat',
						version: '7.0.29',
						web: 1,
						domain: 'http://10.254.222.10/nssa',
						container: 1,
						cname: 'apache tomcat',
						cversion: '7.0.29',
					}
				]
			}
		];

		instance.addAssets('div.div-assets', assets);
		form.render();
		element.render('div.div-assets');
		requestRender();
	};

	const initURLParams = function () {
		const helper = layui.helper;
		//参数
		const instanceId = helper.getParamValue('instanceId');
		const definitionId = helper.getParamValue('definitionId');
		const businessId = helper.getParamValue('businessId');

		if ((instanceId && definitionId && businessId) == null) {
			layer.alert('未获取到必要参数', {}, function (index) {
				helper.closeThisTab();
			});
			return;
		} else {
			params.instanceId = instanceId;
			params.businessId = businessId;
			params.definitionId = definitionId;
		}
	}

	const bindControlEvents = function (callback) {
		const $ = layui.$;

		//下发工单
		$('button.layui-btn.btn-submit').click(function () {
			events['submit'].call(this);
		});
		if ($.isFunction(callback)) {
			callback();
		}
	}

	layui.use(['alimx.table', 'element', 'laydate', 'helper', 'layer', 'form'], function () {
		//页面参数
		initURLParams();
		//页面初始化
		initPageRender(function () {
			bindControlEvents(function () {
				
			});
		});
	});
	e("loophole.aggregateworkorder", {})
});
