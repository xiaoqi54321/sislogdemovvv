layui.define(function (e) {
	const initPageOptions = function () {
		const $ = layui.$;
		const form = layui.form;
		const helper = layui.helper;

		helper.ajax(api.options, {
			cache: false,
			code: 'ACTIVITI_DEPARTMENT_FILTER'
		}, function (response) {
			$.each(response.list, function (index, item) {
				helper.addOption({
					expr: 'div.div-form-asset-add select[name=department]',
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
		options: '../../common/1/option/getOptions.html',
		info:'../../hai/asset/info/single.html',
		submit: '../../hai/asset.add/edit.html',
	};

	const _data = [];

	const events = {
		close:function(){
			const helper = layui.helper;
			
			helper.closeThisTab();
		},
		//重加载Service表格数据
		reload: function (e) {
			const $ = layui.$;
			const table = layui.table;
			table.reload('id-table-asset-service', {
				height: 'full-478', //解决页面缩放后高度不自适应的问题
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
		},
		//Service记录移除
		serviceRemove: function (data) {
			const items = _data.filter(item => item.port == data.port);

			if (items.length > 0) {
				_data.splice(_data.indexOf(items[0]), 1);

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
					/*form.val('filter-form-service-add-edit', {
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
					});*/
				},
			});
		},
		submit: function (data) {
			const helper = layui.helper;

			helper.ajax(api.submit, {
				params: data
			}, function (response) {
				if (response.result) {
					layer.msg('资产维护完成', function(){
						helper.closeThisTab();
					});
				} else {
					layer.msg(response.message);
				}
			});
		}
	};
	
	const initAssetInfo = function(data){
		const $ = layui.$;
		const form = layui.form;
		const table = layui.table;
		
			//工单标题
			$('span.span-title').html(data.address);
			//工单信息
		form.val('filter-form-asset-edit', data);

		//表格
		table.render({
			elem: '#id-table-asset-service',
			id: 'id-table-asset-service',
			height: 'full-478', //高度填满
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
				value: '2017-09-10'
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
			if(response.result){
				const service = response.message.services;
				
				service.forEach(function(service,index){
					$.extend(service,{token : new Date().getTime()+index*1000})
					_data.push(service);
				});
				
				const info = response.message;
				
				initAssetInfo(info);
			}else{
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
		const table = layui.table;
		const helper = layui.helper;

		//功能按钮：服务添加、提交、关闭
		$('div.layui-card button.layui-btn:not(".submit,.upload")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
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

		//提交
		form.on('submit(filter-form-asset-edit)', function (e) {
			const params = $.extend(e.field, {
					services: JSON.stringify(_data),
				});
				
			events['submit'].call(this,params);
			
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

	e("asset.edit", {})
})
