
layui.define(function (e) {

	const api = {
		list: '../../openvas/task/list.html',
		new: '../../openvas/task/add.html',
		start: '../../openvas/task/start.html',
		stop: '../../openvas/task/stop.html',
		resume: '../../openvas/task/resume.html',
		delete : '../../openvas/task/delete.html',
		sync: '../../openvas/task/sync.html',
		synchronize: '../../openvas/task/synchronize.html',
		options: '../../common/1/option/getOptions.html',
		segments: '../../blackHawk/subnet/list.html',
		assets: '../../blackHawk/asset/list.html',
		html: '../../openvas/report/html.html'
	};

	const events = {
		'close':function(){
			layer.closeAll();
		},
		'reload': function (params) {
			const table = layui.table;
			//执行重载
			table.reload('id-table-tasks', {
				page: {
					curr: 1 //重新从第 1 页开始
				},
				where: params || {}
			});
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
		},
		task: function (params) {
			const helper = layui.helper;

			helper.ajax(api.new, params, function (response) {
				if (response.result) {
					layer.closeAll();

					layer.msg('已发起任务请求，请及时跟踪任务进度');
					helper.setTimeout(function () {
						events['reload'].call(this);
					}, 3000);
				} else {
					layer.msg(response.message);
				}
			});
		},
		'new': function () {
			const $ = layui.$;
			const form = layui.form;
			const helper = layui.helper;
			const panel = $('div.layui-view-model.div-view-task-add');

			layer.open({
				type: 1,
				title: '新建扫描',
				area: ['600px', '500px'],
				shade: 0.5,
				scrollbar: false,
				resize: false,
				content: panel,
				success: function () {
					form.val('filter-form-task-add', {
						name: '',
						group: '-1',
						hosts: '',
						comment: ''
					});
				},
				end: function () {},
				cancel: function (index) {}
			});
		},
		'sync': function (e) {
			const helper = layui.helper;
			let ids = [];
			if ((e && e.task_id)) {
				ids.push(e.task_id);
			} else {
				ids = helper.getCheckedData('id-table-tasks', 'task_id')
			}
			if (ids.length > 0) {
				layer.confirm('连接安全扫描引擎，同步所选扫描任务？', {
					btn: ['是', '否']
				}, function (_index) {
					const params = {
						params: {
							task_id: ids.join(',')
						}
					}

					helper.ajax(api.sync, params, function (response) {
						if (response.result) {
							layer.msg('已发起任务同步请求');
							helper.setTimeout(function () {
								events['reload'].call(this);
							}, 3000);
						} else {
							layer.msg(response.message);
						}
					});
				});
			} else {
				layer.msg('请至少选择一条记录！');
			}
		},
		'synchronize': function () {
			const helper = layui.helper;
			layer.confirm('连接安全扫描引擎，同步所有扫描任务？', {
				btn: ['是', '否']
			}, function (_index) {
				helper.ajax(api.synchronize, {}, function (response) {
					if (response.result) {
						layer.msg('已发起任务同步请求');
						helper.setTimeout(function () {
							events['reload'].call(this);
						}, 3000);
					} else {
						layer.msg(response.message);
					}
				});
			});
		},
		'delete': function (e) {
			const helper = layui.helper;
			let ids = [];
			if ((e && e.task_id)) {
				ids.push(e.task_id);
			} else {
				ids = helper.getCheckedData('id-table-tasks', 'task_id')
			}
			if (ids.length > 0) {
				layer.confirm('移除所选扫描任务？', {
					btn: ['是', '否']
				}, function (_index) {
					const params = {
						params: {
							task_id: ids.join(',')
						}
					}

					helper.ajax(api.delete, params, function (response) {
						if (response.result) {
							layer.msg('已发起任务移除请求');
							helper.setTimeout(function () {
								events['reload'].call(this);
							}, 3000);
						} else {
							layer.msg(response.message);
						}
					});
				});
			} else {
				layer.msg('请至少选择一条记录！');
			}
		},
		'start': function (e) {
			const helper = layui.helper;
			helper.ajax(api.start, {
				params: {
					task_id: e.task_id,
				}
			}, function (response) {
				if (response.result) {
					layer.msg('已发起任务启动请求');
					helper.setTimeout(function () {
						events['reload'].call(this);
					}, 3000);
				} else {
					layer.msg(response.message);
				}
			});
		},
		'stop': function (e) {
			const helper = layui.helper;
			helper.ajax(api.stop, {
				params: {
					task_id: e.task_id,
				}
			}, function (response) {
				if (response.result) {
					layer.msg('已发起任务停止请求');
					helper.setTimeout(function () {
						events['reload'].call(this);
					}, 3000);
				} else {
					layer.msg(response.message);
				}
			});
		},
		'resume': function (e) {
			const helper = layui.helper;
			helper.ajax(api.resume, {
				params: {
					task_id: e.task_id,
				}
			}, function (response) {
				if (response.result) {
					layer.msg('已发起任务恢复请求');
					helper.setTimeout(function () {
						events['reload'].call(this);
					}, 3000);
				} else {
					layer.msg(response.message);
				}
			});
		},
		'html': function (e) {
			const helper = layui.helper;
			//报告
			helper.ajax(api.html, {
				params: {
					report_id: e.last_report
				}
			}, function (response) {
				if (response.result) {
					if (response.message != null) {
						helper.toFile(response.message, true, '扫描报告_' + e.task_name + '.html');
					} else {
						layer.alert('报告暂未生成，请等待任务结束后尝试状态同步。');
					}
				} else {
					layer.msg(response.message);
				}
			});
		}
	};

	const initPageRender = function (callback) {
		const $ = layui.$;
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

		//表格
		table.render({
			elem: '#id-table-tasks',
			id: 'id-table-tasks',
			height: 'full-93',
			defaultToolbar: [],
			url: api.list, //数据请求URL
			cols: [[{
						type: 'checkbox',
						fixed: 'left',
					}, {
						field: 'task_name',
						title: '任务名称',
						minWidth: 230,
						align: 'left'
					}, {
						field: 'create_time',
						title: '创建时间',
						width: 180,
						align: 'center',
					}, {
						field: 'task_status',
						title: '任务状态',
						width: 120,
						align: 'center',
						templet: function (res) {
							switch (res.task_status) {
							case 1:
								return '新建';
							case 2:
								return '执行中';
							case 3:
								return '执行完毕';
							case 4:
								return '暂停';
							case 5:
								return '请求中';
							case 6:
								return '删除请求中';
							case 7:
								return '停止请求中';
							case 8:
								return '网络错误';
							default:
								return '未知';
							}
						}
					}, {
						field: 'task_progress',
						title: '扫描进度',
						width: 100,
						align: 'center',
						templet: function (res) {
							if (res.task_progress < 0)
								return '100%';
							else
								return res.task_progress + '%';

						}
					}, {
						field: 'reports',
						title: '扫描报告',
						width: 100,
						align: 'center',
						toolbar: '#id-table-tasks-tool-html'
					}, {
						field: 'comment',
						title: '备注',
						width: 280,
						align: 'left'
					}, {
						title: '操作',
						width: 260,
						align: 'center',
						toolbar: '#id-table-tasks-tool-action'
					}
				]],
			page: true, //开启分页
		});

		let config = {
			cache: false,
			code: 'NSSA_ASSET_GROUP_CUSTOM',
			elem: 'div.div-view-task-add select[name=group]'
		};
		//资产组
		events.options(config);

		if ($.isFunction(callback)) {
			callback();
		}
	};

	const bindControlEvents = function (callback) {
		const $ = layui.$;
		const form = layui.form;
		const table = layui.table;
		const helper = layui.helper;
		
		$('div.layui-card button.layui-btn:not(".submit")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
		});

		//查询
		form.on('submit(filter-form-tasks)', function (e) {
			const params = {
				params: e.field
			};

			events['reload'].call(this, params);

			return false;
		});

		//新建任务提交
		form.on('submit(filter-form-task-add)', function (e) {
			const params = {
				params: e.field
			};

			events['task'].call(this, params);

			return false;
		});

		//资产组切换
		form.on('select(filter-sel-group)', function (e) {
			helper.ajax(api.assets, {
				params: {
					group: e.value,
				}
			}, function (response) {
				const elem = $('div.layui-view-model.div-view-task-add');
				
				let hosts = '';
				$.each(response.list, function (index, item) {
					hosts += item.address + '\n';
				});

				elem.find('textarea[name=hosts]').val(hosts);
			});
		});

		//下拉框选择事件
		$("dd.layui-control ul.ul-action li a").click(function () {
			const $ = layui.$;
			const me = $(this);

			events[me.data("event")].call(this);
		});

		//启动、停止、暂停、同步、删除
		table.on('tool(filter-table-tasks)', function (e) {
			events[e.event].call(this, e.data);
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
			dd.find("button.btn-canel").click(function () {
				_hide();
			});
			$("body").click(function (i) {
				!$(i.target).parents(".select").first().is(s) ? _hide() : "";
			});
		});

		if ($.isFunction(callback)) {
			callback();
		}
	}

	layui.use(['alimx.table', 'laydate', 'helper', 'layer', 'form'], function () {
		//页面初始化
		initPageRender(function () {
			bindControlEvents(function () {});
		});

	});

	e("index", {})
});
