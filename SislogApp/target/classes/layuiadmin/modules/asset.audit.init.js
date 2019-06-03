layui.define(function (e) {
	const initPageOptions = function () {
		const $ = layui.$;
		const form = layui.form;
		const helper = layui.helper;

		helper.ajax(api.options, {
			cache: false,
			code: 'ACTIVITI_FILTER_PROVINCE_DEPARTMENT_WITH_ID'
		}, function (response) {
			$.each(response.list, function (index, item) {
				helper.addOption({
					expr: 'select[name=department]',
					text: item.name,
					val: item.value,
				});
			});
			form.render('select');
		});
		//渲染
		//form.render();
	};

	const _params = {};

	const api = {
		options: '../../../common/1/option/getOptions.html',
		info: '../../../hai/asset/info/single.html',
		submit: '../../../hai/asset.audit/single.html',
	};

	const _data = [];

	const events = {
		close: function () {
			const helper = layui.helper;

			helper.closeThisTab();
		},
		submit: function (data) {
			const helper = layui.helper;

			helper.ajax(api.submit, {
				params: data
			}, function (response) {
				if (response.result) {
					layer.msg('资产稽核工单已下发，请注意跟踪工单进展。', function () {
						helper.closeThisTab();
					});
				} else {
					layer.msg(response.message);
				}
			});
		}
	};

	const initAssetInfo = function (data) {
		const $ = layui.$;
		const form = layui.form;
		const table = layui.table;
		//工单标题
		$('span.span-title').html(data.address);

		//表格
		table.render({
			elem: '#id-table-asset-service',
			id: 'id-table-asset-service',
			height: 'full-184', //高度填满
			defaultToolbar: [], //工具栏右侧按钮，默认['filter','exports','print']
			even: true,
			//url: api.list, //数据请求URL
			data: _data,
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
							return (res.manage === 1 || res.manage === true) ? '是' : '否';
						}
					}, {
						title: '是否系统自带服务',
						width: 150,
						align: 'center',
						templet: function (res) {
							return (res.self === 1 || res.self === true) ? '是' : '否';
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
							return (res.web === 1 || res.web === true) ? '是' : '否';
						}
					}, {
						title: '域名地址',
						width: 240,
						align: 'center',
						templet: function (res) {
							return (res.web === 1 || res.web === true) ? res.domain : '--'
						}
					}, {
						title: '是否中间件',
						width: 120,
						align: 'center',
						templet: function (res) {
							return (res.container === 1 || res.container === true) ? '是' : '否';
						}
					}, {
						title: '中间件名称',
						width: 240,
						align: 'center',
						templet: function (res) {
							return (res.container === 1 || res.container === true) ? res.cname : '--'
						}
					}, {
						title: '中间件版本',
						width: 120,
						align: 'center',
						templet: function (res) {
							return (res.container === 1 || res.container === true) ? res.cversion : '--'
						}
					}
				]],
			page: false, //开启分页
			//where: getParams(),
		});
	};

	//页面加载初始化
	const initPageRender = function (callback) {
		const $ = layui.$;
		const table = layui.table;
		const laydate = layui.laydate;
		const helper = layui.helper;

		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click',
				format: 'yyyy-MM-dd',
				value: new Date()
			});
		});

		//动态选项类数据初始化，包含select，radio，checkbox
		initPageOptions();

		//资产信息
		helper.ajax(api.info, {
			params: {
				address: _params.address
			}
		}, function (response) {
			if (response.result) {
				const service = response.message.services;

				service.forEach(function (service, index) {
					$.extend(service, {
						token: new Date().getTime() + index * 1000
					})
					_data.push(service);
				});

				const info = response.message;

				initAssetInfo(info);
			} else {
				layer.msg(response.message);
			}
		});

		if ($.isFunction(callback)) {
			callback();
		}
	}

	const initURLParams = function () {
		const layer = layui.layer;
		const helper = layui.helper;
		//参数
		const address = helper.getParamValue('address');

		if (address == null) {
			layer.alert('未获取到必要参数', {}, function (index) {
				helper.closeThisTab();
			});
			return;
		} else {
			_params.address = address;
		}
	}

	const bindControlEvents = function (callback) {
		const $ = layui.$;
		const form = layui.form;
		const helper = layui.helper;

		//功能按钮：流程发布、服务添加、关闭
		$('div.layui-card button.layui-btn:not(".submit")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
		});

		form.on('select(filter-sel-department)', function (e) {
			helper.ajax(api.options, {
				cache: false,
				params: e.value,
				code: 'ACTIVITI_FILTER_ASSIGNEE_WITH_ID_BY_DEPARTMENT_ID'
			}, function (response) {
				$('select[name=assignee]').empty();

				$.each(response.list, function (index, item) {
					helper.addOption({
						expr: 'select[name=assignee]',
						val: item.value,
						text: item.name
					});
				});
				form.render('select');
			});
		});

		helper.setTimeout(function () {
			layui.event.call($('select.department'), 'form', 'select(filter-sel-department)', {
				value: $('select[name=department]').val()
			});
		}, 2000);

		//提交
		form.on('submit(filter-form-asset-audit)', function (e) {
			const params = $.extend(e.field, {
					title: '资产稽核-' + _params.address,
					submit: true,
					address: _params.address,
				});

			events['submit'].call(this, params);

			return false;
		});

		if ($.isFunction(callback)) {
			callback();
		}
	}

	layui.use(['index', 'alimx.table', 'form', 'laydate', 'helper'], function () {

		initURLParams();

		initPageRender(function () {
			bindControlEvents(function () {});
		});
	}),

	e("asset.audit.init", {})
})
