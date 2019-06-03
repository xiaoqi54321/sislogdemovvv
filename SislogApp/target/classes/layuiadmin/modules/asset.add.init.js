layui.define(function (e) {
	const initPageOptions = function () {
		const $ = layui.$;
		const form = layui.form;
		const helper = layui.helper;

		helper.ajax(api.options, {
			cache: false,
			code: 'ACTIVITI_FILTER_PROVINCE_DEPARTMENT_NONE_ID'
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

	const api = {
		options: '../../../common/1/option/getOptions.html',
		submit: '../../../hai/asset.add/single.html',
		import: '../../../hai/asset.add/multi.html',
	};

	const _data = [];

	const events = {
		//重加载表格
		reload: function (e) {
			const $ = layui.$;
			const table = layui.table;
			table.reload('id-table-asset-service', {
				height: 'full-700', //解决页面缩放后高度不自适应的问题
				data: _data,
			});

			if ($.isFunction(e && e.callback)) {
				e.callback();
			}
		},
		//Service记录添加
		serviceAdd: function () {
			events['model'].call(this);
		},
		//Service记录编辑
		serviceEdit: function (data) {
			const items = _data.filter(item => item.port == data.port);

			if (items.length > 0) {
				events['model'].call(this, data);
			}
			console.log(_data);
		},
		//Service记录移除
		serviceRemove: function (data) {
			const items = _data.filter(item => item.port == data.port);

			if (items.length > 0) {
				_data.splice(_data.indexOf(items[0]), 1);
				console.log(_data);

				events['reload'].call(this);
			}
		},
		model: function (data) {
			const $ = layui.$;
			const form = layui.form;
			const panel = $('div.layui-view-model.view-service-add-edit');
			layer.open({
				type: 1,
				title: "资产新增/维护",
				area: ['800px', '540px'],
				shade: 0.5,
				scrollbar: false,
				resize: false,
				content: panel,
				success: function (options, index) {
					//弹窗编号
					panel.attr('layer-id', index);
					//add/edit
					panel.data('token', data && data.token);

					if (data != undefined) {
						form.val('filter-form-service-add-edit', data);
					}
				},
				end: function () {
					panel.removeData('token');
					form.val('filter-form-service-add-edit', {
						protocol: '',
						port: '',
						manage: 0,
						self: 0,
						name: '',
						version: '',
						web: 0,
						domain: '',
						container: 0,
						cname: '',
						cversion: '',
					});
				},
			});
		},
		template: function () {
			console.log('template');
		},
		import: function () {
			const $ = layui.$;
			const helper = layui.helper;

			const elem = $('button.layui-btn.btn-upload-file.upload');
			const code = $('button.layui-btn.btn-upload-file.upload').data('serial');

			const params = {
				params: {
					title: '资产批量新增-' + new Date().getTime(),
					code: elem.data('code'),
					serial: elem.data('serial'),
					path: elem.data('path'),
					submit: true,
				}
			};

			helper.ajax('../../../hai/asset.add/multi.html', params, function (response) {
				if (response.result) {
					layer.confirm('资产新增工单提交成功，请注意跟踪工单进度，是否继续添加？', {
						btn: ['是', '否']
					}, function () {
						helper.reload();
					}, function () {
						helper.closeThisTab();
					});
				} else {
					layer.msg(response.message);
				}
			});

		},
		submit: function (data) {
			const helper = layui.helper;

			helper.ajax(api.submit, {
				params: data
			}, function (response) {
				if (response.result) {
					layer.confirm('资产新增工单提交成功，请注意跟踪工单进度，是否继续添加？', {
						btn: ['是', '否']
					}, function () {
						helper.reload();
					}, function () {
						helper.closeThisTab();
					});
				} else {
					layer.msg(response.message);
				}
			});
		}
	};

	//页面加载初始化
	const initPageRender = function (callback) {
		const $ = layui.$;
		const table = layui.table;
		const laydate = layui.laydate;

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

		//表格
		table.render({
			elem: '#id-table-asset-service',
			id: 'id-table-asset-service',
			height: 'full-700', //高度填满
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
					}, {
						fixed: 'right',
						title: '操作',
						align: 'center',
						width: 120,
						toolbar: '#id-table-asset-service-tools', //直接关联HTML块
					}
				]],
			page: false, //开启分页
		});

		if ($.isFunction(callback)) {
			callback();
		}
	}

	const bindControlEvents = function (callback) {
		const $ = layui.$;
		const form = layui.form;
		const table = layui.table;
		const helper = layui.helper;

		//功能按钮：流程发布、模板下载、多条导入、服务添加
		$('div.layui-card button.layui-btn:not(".submit,.upload")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
		});

		//文件上传事件注册
		helper.uploadRender({
			elem: 'button.layui-btn.btn-upload-file',
			accept: 'file',
			exts: 'csv',
			url: '../../../common/1/file/upload.html',
			data: {
				'params[path]': '/res/assets'
			}
		});

		//是否web服务
		form.on('switch(filter-switch-web)', function (e) {
			const me = $(this);
			const checked = me.get(0).checked;
			const panel = $('div.layui-view-model.view-service-add-edit');
			const elem = panel.find('input[name=domain]');
			//状态变更
			if (checked) {
				elem.attr('lay-verify', 'required').removeAttr("disabled");
			} else {
				elem.val('').prop("disabled", "disabled").removeAttr("lay-verify");
			}

			return false;
		});
		//是否中间件
		form.on('switch(filter-switch-container)', function (e) {
			const me = $(this);
			const checked = me.get(0).checked;
			const panel = $('div.layui-view-model.view-service-add-edit');
			const cname = panel.find('input[name=cname]');
			const cversion = panel.find('input[name=cversion]');
			//状态变更
			if (checked) {
				cname.attr('lay-verify', 'required').removeAttr("disabled");
				cversion.attr('lay-verify', 'required').removeAttr("disabled");
			} else {
				cname.val('').prop("disabled", "disabled").removeAttr("lay-verify");
				cversion.val('').prop("disabled", "disabled").removeAttr("lay-verify");
			}

			return false;
		});
		//服务添加、修改
		form.on('submit(filter-form-service-add-edit)', function (data) {
			const panel = $('div.layui-view-model.view-service-add-edit');

			const token = panel.data('token');

			const edit = token > 0;

			const field = data.field;

			const items = _data.filter(item => ((edit && (item.token != token) && (item.port === field.port)) || (!edit && item.port === field.port)));

			if (items.length > 0) {
				layer.msg('端口【' + field.port + '】上已绑定资产，请确认。');
				return false;
			}

			field.token = new Date().getTime();
			field.manage = field.manage === 'on' ? 1 : 0;
			field.self = field.self === 'on' ? 1 : 0;
			field.web = field.web === 'on' ? 1 : 0;
			field.container = field.container === 'on' ? 1 : 0;

			if (field.web === 0) {
				field.domain = '';
			}
			if (field.container === 0) {
				field.cname = '';
				field.cversion = '';
			}

			if (edit) {
				const item = _data.filter(item => (item.token === token))[0];
				const index = _data.indexOf(item);

				$.extend(item, field, true);

				_data.splice(index, 1, item);
			} else {
				//加入列表
				_data.push(field);
			}
			//重加载表格
			events['reload'].call(this, {
				callback: function () {
					const panel = $('div.layui-view-model.view-service-add-edit');

					layer.close(panel.attr('layer-id'));
				}
			});

			return false;
		});
		//服务编辑、移除
		table.on('tool(filter-table-asset-service)', function (e) {
			events[e.event].call(this, e.data);
		});
		//单条提交
		form.on('submit(filter-form-asset-add-single)', function (e) {
			if (_data.length == 0) {
				layer.msg('请添加服务、端口数据后再提交')
				return false;
			}
			const params = $.extend(e.field, {
					title: '资产新增 - ' + e.field.address,
					submit: true,
					services: JSON.stringify(_data),
				});

			events['submit'].call(this, params);

			return false;
		});

		if ($.isFunction(callback)) {
			callback();
		}
	}

	layui.use(['index', 'alimx.table', 'upload', 'form', 'laydate', 'helper'], function () {
		initPageRender(function () {
			bindControlEvents(function () {});
		});
	}),

	e("asset.add.init", {})
})
