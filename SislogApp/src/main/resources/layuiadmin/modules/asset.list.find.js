layui.define(function (e) {
	const api = {
		syncs: '../../../blackHawk/task/sync.html',
		newAssets: '../../../blackHawk/asset/list.html',
		syncsall: '../../../blackHawk/tasks/sync.html',
		sync: '../../../blackHawk/task/sync.html',
		del: '../../../blackHawk/task/delete.html',
		update: '../../../blackHawk/task/update.html',
		editinfo: '../../blackHawk/task/update.html',
		addinfo: '../../../blackHawk/task/add.html',
		list: '../../../blackHawk/task/list.html',
		taskGroup: '../../../common/1/option/getOptions.html'
	}
	const params = function () {
		let that = {};
		const $ = layui.$;
		const form = $('.layui-card.layui-form.div-scanning-list');
		let create = form.find('input[name=createTime]').val() == ""?"":Math.round(new Date(form.find('input[name=createTime]').val()).getTime()/1000);
		that.map = {
			'params["name"]': form.find('input[name=taskName]').val(), //任务名称,
			'params["status"]': form.find('select[name=scanningState]').val().length == 0 ? "-1" : form.find('select[name=scanningState]').val(), // 扫描状态,
			'params["create"]': create //form.find('input[name=createTime]').val(), // 创建时间
		};
		that.tableid = "id-table-finance-assetslist";
		return that;
	}
	const events = {
		search: function () {
			const table = layui.table;
			//执行重载
			table.reload(params().tableid, {
				page: {
					curr: 1 //重新从第 1 页开始
				},
				where: params().map
			});
		},
		//清查弹出框，编辑弹出框
		createCheck: function (obj) {
			const $ = layui.$;
			const helper = layui.helper;
			const panel = $('div.layui-view-model.view-addtask');
			const assetsitem = panel.find('.layui-card');
			const form = layui.form;
			const table = layui.table;

			let assetsType = "";
			if (obj.assets) {
				assetsType = api.editinfo;
			} else {
				assetsType = api.addinfo;
			}

			assetsitem.find("input[name=startTime]").val("");
			assetsitem.find("input[name=taskName]").val("");
			assetsitem.find("textarea[name=taskhosts]").val("");
			assetsitem.find("textarea[name=taskdesc]").val("");
			assetsitem.find("select[name=taskGroup]").val("-1");
			form.render("select");

			layer.open({
				type: 1,
				title: obj.title,
				area: ['600px', '600px'],
				shade: 0.5,
				btn: ['确定', '取消'],
				yes: function (_index) {
					helper.ajax(assetsType, {
						'params["once_time"]': assetsitem.find("input[name=startTime]").val(),
						'params["name"]': assetsitem.find("input[name=taskName]").val(),
						'params["hosts"]': assetsitem.find("textarea[name=taskhosts]").val(),
						'params["dsc"]': assetsitem.find("textarea[name=taskdesc]").val(),
					}, function (response) {
						setTimeout(function () {
							table.reload(params().tableid, {
								page: {
									curr: 1 //重新从第 1 页开始
								},
								where: params().map
							});
							layer.close(_index);
						}, 2000);
					})

				}, btn2: function (_index) {
					layer.close(_index)
				},
				btnAlign: 'c',
				scrollbar: false,
				resize: false,
				content: panel,
				success: function () {
					if (obj.assets) {
						assetsitem.find("input[name=taskName]").val(obj.assets.name);
						assetsitem.find("textarea[name=taskdesc]").val(obj.assets.dsc);
						assetsitem.find("textarea[name=taskhosts]").val(obj.assets.hosts);
						assetsitem.find("input[name=startTime]").val(helper.unix2Date(obj.assets.start_time, true).format('yyyy-M-dd hh:mm:ss'))
					}
				},
				end: function () {
				},
				cancel: function (index) {
				}
			});
		},
		//批量同步
		batchSync: function (obj) {
			const table = layui.table;
			layer.confirm('批量同步所选清查任务？', {
				btn: ['是', '否']
			}, function (_index, layero) {
				obj.helper.ajax(api.syncs, {
					'params["id"]': obj.id
				}, function (response) {
					setTimeout(function () {
						table.reload(params().tableid, {
							page: {
								curr: 1 //重新从第 1 页开始
							},
							where: params().map
						});
						layer.close(_index);
					}, 2000);

				});
			}, function (_index) {
				layer.close(_index);
			});
		},
		//全量同步
		fullSync: function (obj) {
			const table = layui.table;
			layer.confirm('同步所有清查任务？', {
				btn: ['是', '否']
			}, function (_index, layero) {
				obj.helper.ajax(api.syncsall, {
					'params["id"]': obj.id
				}, function (response) {
					setTimeout(function () {
						table.reload(params().tableid, {
							page: {
								curr: 1 //重新从第 1 页开始
							},
							where: params().map
						});
						layer.close(_index);
					}, 2000);
				});
			}, function (_index) {
				layer.close(_index);
			});
		},
		//批量删除
		batchDel: function (obj) {
			const table = layui.table;
			layer.confirm('批量删除所选清查任务？', {
				btn: ['是', '否']
			}, function (_index, layero) {
				obj.helper.ajax(api.del, {
					'params["id"]': obj.id
				}, function (response) {
					setTimeout(function () {
						table.reload(params().tableid, {
							page: {
								curr: 1 //重新从第 1 页开始
							},
							where: params().map
						});
						layer.close(_index);
					}, 2000);
				});
			}, function (_index) {
				layer.close(_index);
			});
		},
		//表格删除事件
		tableDel: function (obj) {
			const table = layui.table;
			layer.confirm('删除所选扫描任务？', {
				btn: ['是', '否']
			}, function (_index, layero) {
				obj.helper.ajax(api.del, {
					'params["id"]': obj.data.id
				}, function (response) {
					setTimeout(function () {
						table.reload(params().tableid, {
							page: {
								curr: 1 //重新从第 1 页开始
							},
							where: params().map
						});
						layer.close(_index);
					}, 2000);
				});
			}, function (index) {
				layer.close(_index);
			});
		},
		//表格同步
		tableSync: function (obj) {
			const table = layui.table;
			obj.helper.ajax(api.sync, {
				'params["id"]': obj.data.id
			}, function (response) {
				setTimeout(function () {
					table.reload(params().tableid, {
						page: {
							curr: 1 //重新从第 1 页开始
						},
						where: params().map
					});
					layer.close(layer.index);
				}, 2000);
			});
		}
	};

	const bindControlEvents = function (callback) {
		const $ = layui.$;
		const table = layui.table;
		const helper = layui.helper;
		const form = layui.form;
		
		//资产组
		helper.ajax(api.taskGroup, {
			cache: false,
			code: 'NSSA_ASSET_GROUP_CUSTOM'
		}, function (response) {
			$.each(response.list, function (index, item) {
				let obj = {};
				obj.expr = "select[name='taskGroup']";
				obj.text = item.name;
				obj.val = item.value;
				helper.addOption(obj);
			});
			form.render('select');
		});

		//表格
		table.render({
			elem: '#' + params().tableid,
			height: 'full-145', //高度填满
			defaultToolbar: [], //工具栏右侧按钮，默认['filter','exports','print']
			url: api.list, //数据请求URL
			data: [],
			cols: [[{
				type: 'checkbox',
				fixed: 'left',
			}, {
				field: 'name',
				title: '任务名称',
                minWidth: 220,
                width:'28%',
				align: 'left',
				templet: function (res) {
					if (res.name) {
						return res.name
					} else {
						return "--";
					}
				}
			},{
				field: 'create_time',
                title: '创建时间',
                width: 160,
				align: 'center',
				templet: function (res) {
					if (res.create_time) {
						return helper.unix2Date(res.create_time, true).format('yyyy-M-dd hh:mm:ss');
					} else {
						return "--";
					}
				}
			}, {
				field: 'scan_time',
                title: '扫描时间',
                width: 180,
				minWidth: 140,
				align: 'center',
				templet: function (res) {
					if (res.scan_time == undefined || res.scan_time === '')
						return '';
					return helper.unix2Date(res.scan_time, true).format('yyyy-M-dd hh:mm:ss');
				}
			}, {
				field: 'scan_status',
				title: '扫描状态',
                minWidth: 100,
                width: 120,
				align: 'center',
				templet: function (res) {
					if (res.scan_status == undefined || res.scan_status === '' || res.scan_status === 0)
						return '未开始';
					if (res.scan_status === 1)
						return '扫描中';
					if (res.scan_status === 2)
						return '扫描完毕';
				}
			}, {
				title: '描述',
                field: 'dsc',
                minWidth:200,
				width: 240,
				align: 'left',
			}, {
				title: '操作',
				width: 200,
				align: 'center',
				toolbar: '#reimburseManager'
			}
			]],
			page: true, //开启分页
			where: params().map,
			done: function () {
				//$("[data-field='id']").css('display', 'none');//隐藏列
			}
		});

		if ($.isFunction(callback)) {
			callback();
		}
	};

	const initPageRender = function (requestRender) {
		const laydate = layui.laydate;
		const table = layui.table;
		const form = layui.form;
		const $ = layui.$;
		const helper = layui.helper;
		let cache = []; //选中的数据

		form.on('select(taskGroup)', function (data) {
			helper.ajax(api.newAssets, {
				'params["group"]': data.value
			}, function (response) {
				var val = '';
				$.each(response.list, function (index, item) {
					val += item.ip + '\n';
				});
				$('textarea[name=taskhosts]').val(val);
			});
		})

		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click'
			});
		});

		//下拉框选择事件
		form.on('select(business)', function (data) {
			const $ = layui.$;
			switch (data.value) {
				case '1':
					let paneladdgroup = $('div.layui-view-model.view-addtask');
					let obj = {};
					obj.panel = paneladdgroup;
					obj.title = "新建清查";
					obj.assets = undefined;
					events['createCheck'].call(this, obj); //新建清查
					break;
				case '2':
					let batchSync = {};
					batchSync.helper = helper;
					batchSync.id = cache.join(',');
					events['batchSync'].call(this, batchSync); // 批量同步
					break;
				case '3':
					let fullSync = {};
					fullSync.helper = helper;
					fullSync.id = cache.join(',');
					events['fullSync'].call(this, fullSync); // 全量同步
					break;
				case '4':
					let batchDel = {};
					batchDel.helper = helper;
					batchDel.id = cache.join(',');
					events['batchDel'].call(this, batchDel); // 批量删除
					break;
				default:
					break;
			}
		});

		table.on('tool(' + params().tableid + ')', function (obj) {
			let data = obj.data;
			let eventname = obj.event;
			if (eventname == 'edit') {

				let createCheck = {};
				createCheck.data = data;
				createCheck.title = "编辑";
				createCheck.assets = obj.data;
				events["createCheck"].call(this, createCheck);
			} else if (eventname == 'sync') {

				let tableSync = {};
				tableSync.data = data;
				tableSync.helper = helper;
				events["tableSync"].call(this, tableSync);
			} else if (eventname == "del") {

				let tableDel = {};
				tableDel.data = data;
				tableDel.helper = helper;
				events["tableDel"].call(this, tableDel);
			}
		});

		//下拉框选择事件
		$("dd.layui-control ul li a").click(function () {
			const $ = layui.$;
			let dataval = $(this).data("value");
			
			if (cache.length == 0) {
				layer.msg('选项不能为空');
				return;
			}
			switch (dataval) {
				case 1:
					let paneladdgroup = $('div.layui-view-model.view-addtask');
					let obj = {};
					obj.panel = paneladdgroup;
					obj.title = "新建清查";
					obj.assets = undefined;
					events['createCheck'].call(this, obj); //新建清查
					break;
				case 2:
					let batchSync = {};
					batchSync.helper = helper;
					batchSync.id = cache.join(',');
					events['batchSync'].call(this, batchSync); // 批量同步
					break;
				case 3:
					let fullSync = {};
					fullSync.helper = helper;
					fullSync.id = cache.join(',');
					events['fullSync'].call(this, fullSync); // 全量同步
					break;
				case 4:
					let batchDel = {};
					batchDel.helper = helper;
					batchDel.id = cache.join(',');
					events['batchDel'].call(this, batchDel); // 批量删除
					break;
				default:
					break;
			}
		});

		/**
			* 判断已经选择的元素是否存在数组中
			* @param {元素的id值} id
		*/
		var isidscheck = function (id) {
			for (var i = 0; i < cache.length; i++) {
				if (cache[i].id == id) {
					cache.splice(i, 1);
				}
			}
		}
		//全选
		table.on('checkbox(' + params().tableid + ')', function (obj) {
			
			console.log("param() = "+JSON.stringify(obj.data));
			if (obj.type == 'all') {
				//全不选
				if (obj.checked == false) {
					cache = [];
				}
				// 全选
				if (obj.checked) {
					let reimburseArr = layui.table.checkStatus(params().tableid).data;
					reimburseArr.forEach(item => {
						cache.push(item.id);
					});
				}
			}

			if (obj.type == 'one') {
				if (obj.checked == false) {
					isidscheck(obj.data.id)
				}
				if (obj.checked) {
					cache.push(obj.data.id);
				}
			}
		});
		//查询
		$('.layui-btn.btn-search').click(function () {
			events['search'].call(this);
		});

		$(".select").each(function () {
			var s = $(this);
			var z = parseInt(s.css("z-index"));
			var dt = $(this).children("dt");
			var dd = $(this).children("dd");
			var _show = function () { dd.slideDown(200); dt.addClass("cur"); s.css("z-index", z + 1); };   //展开效果
			var _hide = function () { dd.slideUp(200); dt.removeClass("cur"); s.css("z-index", z); };    //关闭效果
			dt.click(function () { dd.is(":hidden") ? _show() : _hide(); });
			dd.find("a").click(function () { _hide(); });     //选择效果（如需要传值，可自定义参数，在此处返回对应的“value”值 ）
			$("body").click(function (i) { !$(i.target).parents(".select").first().is(s) ? _hide() : ""; });
		});
		if ($.isFunction(requestRender)) {
			requestRender();
		}
	};

	layui.use(['alimx.table', 'element', 'laydate', 'helper', 'layer', 'form'], function () {
		
		//页面初始化
		initPageRender(function () {
			bindControlEvents(function(){});
		});
	});
	e("asset.list.find", {})
});
