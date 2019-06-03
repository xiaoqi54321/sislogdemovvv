layui.define(function (e) {
	const api = {
		assignee: '../../hai/assignee/info.html',
		detail: './views/asset/detail.jsp',
		add: './views/asset/add/init.jsp',
		update: './views/asset/update/init.jsp',
		repair: './views/asset/repair/init.jsp',
		audit: './views/asset/audit/init.jsp',
		list: '../../blackHawk/asset/list.html', //表格api
		sync: '../../blackHawk/assets/sync.html', //资产同步
		group: '../../blackHawk/asset/group/add.html', //添加到组api加入
		addgroupsub: '../../blackHawk/asset/group/to.html', // 添加到组api 确定提交
		blackhawk: '../../blackHawk/scan.html', // 资产清查
		openvas: '../../openvas/scan.html', //安全扫描
		offline: '../../blackHawk/asset/delete.html', //移除资产
		options: '../../common/1/option/getOptions.html'
	}

	const events = {
		detail: function (e) {
			const helper = layui.helper;

			helper.openTabsPage('资产详情 - ' + e.address, api.detail + '?address=' + e.address);
		},
		add: function (e) {
			const helper = layui.helper;

			helper.openTabsPage('资产新增', api.add);
		},
		update: function (e) {
			const helper = layui.helper;

			helper.openTabsPage('资产变更 - ' + e.address, api.update + '?address=' + e.address);
		},
		repair: function (e) {
			const helper = layui.helper;

			helper.openTabsPage('资产漏洞修复 - ' + e.address, api.repair + '?address=' + e.address);
		},
		audit: function (e) {
			const helper = layui.helper;

			helper.openTabsPage('资产稽核 - ' + e.address, api.audit + '?address=' + e.address);
		},
		reload: function (params) {
			const table = layui.table;
			//执行重载
			table.reload('id-table-assets', {
				page: {
					curr: 1 //重新从第 1 页开始
				},
				where: params || {}
			});
		},
		//资产同步
		sync: function () {
			const helper = layui.helper;
			layer.confirm('连接资产清查引擎，进行资产同步？', {
				btn: ['是', '否']
			}, function (_index) {
				helper.ajax(api.sync, {}, function (response) {
					if (response.result) {
						layer.close(_index);
						helper.setTimeout(function () {
							events['reload'].call(this); //TODO
						}, 3000);
					} else {
						layer.msg(response.message);
					}
				});
			});
		},
		//添加到组
		group: function (obj) {
			const $ = layui.$;
			const panel = $('div.layui-view-model.view-addgroup');
			layer.open({
				type: 1,
				title: '添加到组',
				area: ['400px', '250px'],
				shade: 0.5,
				scrollbar: false,
				resize: false,
				content: panel,
				success: function () {
					let config = {
						cache: false,
						code: 'NSSA_ASSET_GROUP_SELECT',
						selected: 'option_asset_group'
					}
					events.options(config);
				},
				end: function () {},
				cancel: function () {}
			});
		},
		//资产清查
		blackhawk: function () {
			const helper = layui.helper;
			const ids = helper.getCheckedData('id-table-assets', 'address');
			if (ids.length > 0) {
				layer.confirm('对所选资产发起清查？', {
					btn: ['是', '否']
				}, function (_index) {
					const params = {
						params: {
							name: '[' + new Date().getTime() + '] - 批量资产清查',
							ids: ids.join(',')
						}
					}

					helper.ajax(api.blackhawk, params, function (response) {
						if (response.result) {
							layer.msg('已发起任务请求，可前往资产发现页面查看任务进度。');
						} else {
							layer.msg(response.message);
						}
					});
				});
			} else {
				layer.msg('请至少选择一条记录！');
			}
		},
		//安全扫描
		openvas: function () {
			const helper = layui.helper;
			const ids = helper.getCheckedData('id-table-assets', 'address');
			if (ids.length > 0) {
				layer.confirm('对所选资产发起安全扫描？', {
					btn: ['是', '否']
				}, function (_index, layero) {
					const params = {
						params: {
							name: '[' + new Date().getTime() + '] - 批量资产扫描',
							ids: ids.join(',')
						}
					}

					helper.ajax(api.openvas, params, function (response) {
						if (response.result) {
							layer.msg('已发起任务请求，可前往安全扫描页面查看任务进度。');
						} else {
							layer.msg(response.message);
						}
					});
				});
			} else {
				layer.msg('请至少选择一条记录！');
			}
		},
		//资产退服 //TODO
		offline: function () {
			const helper = layui.helper;
			const ids = helper.getCheckedData('id-table-assets', 'address');
			if (ids.length > 0) {
				layer.confirm('下线所选资产？', {
					btn: ['是', '否']
				}, function (_index, layero) {
					const params = {
						params: {
							id: ids.join(',')
						}
					}

					helper.ajax(api.offline, params, function (response) {
						if (response.result) {
							layer.msg('已发起任务请求，可前往安全扫描页面查看任务进度。');
						} else {
							layer.msg(response.message);
						}
					});
				});
			} else {
				layer.msg('请至少选择一条记录！');
			}
		},
		options: function (e) {
			const $ = layui.$;
			const helper = layui.helper;
			const form = layui.form;
			helper.ajax(api.options, {
				cache: false,
				code: e.code
			}, function (response) {
				$.each(response.list, function (index, item) {
					let conf = {};
					conf.expr = e.elem;
					conf.text = item.name;
					conf.val = item.value;
					helper.addOption(conf);
				});
				form.render('select');
			});
		}
	};

	const _params = {};

	const initURLParams = function () {
		const helper = layui.helper;

		const audit = helper.getParamValue('audit');
		const repair = helper.getParamValue('repair');

		_params.audit = audit != null && (audit === 'true' || audit == 1);
		_params.repair = repair != null && (repair === 'true' || repair == 1);
	}

	const initPageRender = function (callback) {
		const $ = layui.$;
		const form = layui.form;
		const table = layui.table;
		const laydate = layui.laydate;

		const helper = layui.helper;

		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click'
			});
		});

		form.val('filter-form-assets', _params);

		$("button.layui-addtaskadd").click(function () {
			let taskgroupname = $("input[name=taskgroupname]").val();
			if (taskgroupname != "") {
				helper.ajax(api.addgroupapi, {
					'params["name"]': taskgroupname
				}, function (response) {
					layer.alert(JSON.stringify(response.message.message));
					//layer.alert("加入成功");
					return false;
				}, function (err) {
					layer.alert(JSON.stringify(err));
					return false;
				});
			} else {
				layer.alert("请输入组名");
			}
			return false;
		});

		$(".select").each(function () {
			var s = $(this);
			var z = parseInt(s.css("z-index"));
			var dt = $(this).children("dt");
			var dd = $(this).children("dd");
			var _show = function () {
				dd.slideDown(200);
				dt.addClass("cur");
				s.css("z-index", z + 1);
			}; //展开效果
			var _hide = function () {
				dd.slideUp(200);
				dt.removeClass("cur");
				s.css("z-index", z);
			}; //关闭效果
			dt.click(function () {
				dd.is(":hidden") ? _show() : _hide();
			});
			dd.find("a").click(function () {
				_hide();
			}); //选择效果（如需要传值，可自定义参数，在此处返回对应的“value”值 ）
			dd.find("button.btn-cancel").click(function () {
				_hide();
			});
			$("body").click(function (i) {
				!$(i.target).parents(".select").first().is(s) ? _hide() : "";
			});
		})

		table.render({
			elem: '#id-table-assets',
			id: 'id-table-assets',
			height: 'full-93',
			toolbar: true,
			defaultToolbar: ['filter'],
			url: api.list,
			cols: [[{
						type: 'checkbox',
						fixed: 'left',
					}, {
						field: 'address',
						title: '资产IP',
						width: 140,
						align: 'left',
					}, {
						field: 'name',
						title: '资产名称',
						minWidth: 160,
						align: 'left',
					}, {
						field: 'product',
						title: '资产类型',
						width: 120,
						align: 'center',
						hide: true,
						templet: function (res) {
							return res.product || '--';
						}
					}, {
						field: 'os',
						title: '操作系统',
						width: 140,
						align: 'center',
						hide: true,
						templet: function (res) {
							return res.os || '--';
						}
					}, {
						field: 'group',
						title: '归属组',
						width: 120,
						align: 'left',
						hide: true,
						templet: function (res) {
							return res.group || '--';
						}
					}, {
						field: 'department',
						title: '归属部门',
						width: 180,
						align: 'left',
						templet: function (res) {
							return res.department || '--';
						}
					}, {
						field: 'responsible',
						title: '责任人',
						width: 100,
						align: 'center',
						templet: function (res) {
							return res.responsible || '--';
						}
					}, {
						field: 'report_date',
						title: '上报时间',
						width: 120,
						align: 'center',
						templet: function (res) {
							return res.report_date || '--';
						}
					}, {
						title: '状态',
						width: 100,
						align: 'center',
						templet: function (res) {
							switch (res.status) {
							case 1:
								return '库存';
							case 2:
								return '新建';
							case 3:
								return '变更中';
							case 4:
								return '待稽核';
							case 5:
								return '稽核中';
							case 7:
								return '处置中';
							}
							return '--';
						}
					}, {
						field: 'cnt_service',
						title: '服务数',
						width: 100,
						align: 'center',
					}, {
						field: 'cnt_loophole',
						title: '风险数',
						width: 100,
						align: 'center',
					}, {
						title: '操作',
						width: 160,
						align: 'center',
						toolbar: '#id-table-assets-tool'
					}
				]],
			page: true,
			where: {
				params: _params
			}
		});

		//权限区分，加载完毕后再绑定事件。
		helper.ajax(api.assignee, {}, function (response) {
			let admin = false;
			if (response.result) {
				admin = response.message.admin;
			}
			if (admin) {
				$('dd.layui-control ul.ul-action li button[data-event=add]').addClass('layui-btn-disabled');
			}

			if ($.isFunction(callback)) {
				callback();
			}
		});
	};

	const bindControlEvents = function (callback) {
		const $ = layui.$;
		const form = layui.form;
		const table = layui.table;
		const helper = layui.helper;

		//查询
		form.on('submit(filter-form-assets)', function (e) {
			const params = {
				params: $.extend(e.field, {
					audit: $('input.layui-checkbox.input-checkbox-audit')[0].checked,
					repair: $('input.layui-checkbox.input-checkbox-repair')[0].checked
				}),
			};
			events['reload'].call(this, params);

			return false;
		});

		//下拉框选择事件
		$('dd.layui-control ul.ul-action li button:not(".layui-btn-disabled")').click(function () {
			const $ = layui.$;
			const me = $(this);

			events[me.data("event")].call(this);
		});

		//详情、变更
		table.on('tool(filter-table-assets)', function (e) {
			events[e.event].call(this, e.data);
		});

		//新建组提交
		form.on('submit(addtaskgroup)', function (data) {
			if (data.field.taskgroupname == "") {
				layer.alert('新建组不能为空');
			} else {
				helper.ajax(api.addgroupsub, {
					'params["id"]': data.field.option_asset_group,
					'params["group"]': data.field.taskgroupname
				}, function (response) {
					layer.alert(JSON.stringify(response.message.message));
				})
			}

			return false;
		});

		//部门
		let objDepartMent = {
			code: 'ACTIVITI_FILTER_DEPARTMENT_NONE_ID',
			elem: 'dl.select select[name=department]'
		};
		events["options"].call(this, objDepartMent);

		if ($.isFunction(callback)) {
			callback();
		}
	};

	layui.use(['alimx.table', 'laydate', 'helper', 'layer', 'form'], function () {

		initURLParams();
		//页面初始化
		initPageRender(function () {
			bindControlEvents(function () {})
		});

	});

	e("asset.list", {})
});
