layui.define(function (e) {

	//初始化所有的资产数量
	const initTargetsInfo = function (e) {
		const $ = layui.$;
		const helper = layui.helper;

		helper.ajax(api.targets, {}, function (response) {
			if (response.result) {

				const elem = $('div.div-targets');
				const targets = response.message;

				elem.find('h3.cnt').html(targets.asset.cnt);
				elem.find('h3.add').html(targets.credential.add);
				elem.find('h3.update').html(targets.credential.update);
				elem.find('h3.repair').html(targets.credential.repair);

				if (targets.admin) {
					$('div.div-targets-todo').show();
					$('div.div-targets-echarts').removeClass('layui-col-md7').addClass('layui-col-md6');

					elem.find('h3.audit').html(targets.todo.audit);
					elem.find('h3.risk').html(targets.todo.risk);
				}

				const credentials = {
					category: helper.getLastDays(0, 10),
					add: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					update: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					audit: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					repair: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				};

				credentials.category.forEach(function (category,index) {
					targets.trend.forEach(function (trend) {
						if (trend.ttime === category) {
							credentials.add.splice(index,1,trend.add);
							credentials.update.splice(index,1,trend.update);
							credentials.audit.splice(index,1,trend.audit);
							credentials.repair.splice(index,1,trend.repair);
							return false;
						}
					});
				});

				const echarts = layui.echarts;

				const echart = echarts.init($('div.div-echarts-credential')[0]);

				const options = {
					backgroundColor: '#404a59',
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							lineStyle: {
								color: '#57617B'
							}
						}
					},
					legend: {
						icon: 'rect',
						itemWidth: 14,
						itemHeight: 5,
						itemGap: 13,
						data: ['资产新增', '资产变更', '资产稽核', '漏洞处置'],
						top: '15px',
						left: '15px',
						textStyle: {
							fontSize: 12,
							color: '#F1F1F3'
						}
					},
					grid: {
						left: '30px',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
							type: 'category',
							boundaryGap: false,
							axisLabel: {
								color: '#fff'
							},
							axisLine: {
								lineStyle: {
									color: '#8b8e92'
								}
							},
							splitLine: {
								show: true,
								lineStyle: {
									color: '#606266'
								}
							},
							data: credentials.category.reverse()
						}
					],
					yAxis: [{
							type: 'value',
							name: '',
							axisTick: {
								show: false
							},
							axisLine: {
								lineStyle: {
									color: '#8b8e92'
								}
							},
							axisLabel: {
								margin: 10,
								textStyle: {
									fontSize: 12
								}
							},
							splitLine: {
								show: false

							}
						}
					],
					series: [{
							name: '资产新增',
							type: 'line',
							smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: true,
							lineStyle: {
								normal: {
									width: 1
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
												offset: 0,
												color: 'rgba(219, 50, 51, 0.3)'
											}, {
												offset: 0.8,
												color: 'rgba(219, 50, 51, 0)'
											}
										], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
									shadowBlur: 10
								}
							},
							itemStyle: {
								normal: {

									color: 'rgb(219,50,51)',
									borderColor: 'rgba(219,50,51,0.2)',
									borderWidth: 12
								}
							},
							data: credentials.add.reverse()
						}, {
							name: '资产变更',
							type: 'line',
							smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: true,
							lineStyle: {
								normal: {
									width: 1
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
												offset: 0,
												color: 'rgba(0, 136, 212, 0.3)'
											}, {
												offset: 0.8,
												color: 'rgba(0, 136, 212, 0)'
											}
										], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
									shadowBlur: 10
								}
							},
							itemStyle: {
								normal: {
									color: 'rgb(0,136,212)',
									borderColor: 'rgba(0,136,212,0.2)',
									borderWidth: 12

								}
							},
							data: credentials.update.reverse()
						}, {
							name: '资产稽核',
							type: 'line',
							smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: true,
							lineStyle: {
								normal: {
									width: 1
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
												offset: 0,
												color: 'rgba(0, 166, 90, 0.3)'
											}, {
												offset: 0.8,
												color: 'rgba(0, 166, 90, 0)'
											}
										], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
									shadowBlur: 10
								}
							},
							itemStyle: {
								normal: {
									color: '#00A65A',
									borderColor: 'rgba(0, 166, 90,0.2)',
									borderWidth: 12

								}
							},
							data: credentials.audit.reverse()
						}, {
							name: '漏洞处置',
							type: 'line',
							smooth: true,
							symbol: 'circle',
							symbolSize: 5,
							showSymbol: true,
							lineStyle: {
								normal: {
									width: 1
								}
							},
							areaStyle: {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
												offset: 0,
												color: 'rgba(243, 156, 18, 0.3)'
											}, {
												offset: 0.8,
												color: 'rgba(243, 156, 18, 0)'
											}
										], false),
									shadowColor: 'rgba(0, 0, 0, 0.1)',
									shadowBlur: 10
								}
							},
							itemStyle: {
								normal: {
									color: 'rgb(243, 156, 18)',
									borderColor: 'rgba(243, 156, 18,0.2)',
									borderWidth: 12

								}
							},
							data: credentials.repair.reverse()
						}
					]
				};

				echart.setOption(options);
			} else {
				layer.msg(response.message);
			}
		});
	};

	const api = {
		list: '../../common/1/activiti/credential/list.html',
		targets: '../../hai/targets.html',
	};

	const events = {
		search: function () {
			const $ = layui.$;
			const table = layui.table;

			const me = $(this);
			const historic = me.data('historic');

			//执行重载
			table.reload(historic ? 'id-table-credential-done' : 'id-table-credential-undo', {
				page: {
					curr: 1 //重新从第 1 页开始
				},
				where: getCredentialParams(historic)
			});
		},
		view: function (e) {
			const helper = layui.helper;
			const title = e.title;
			const url = './views/' + e.definitionKey.replace('.', '/') + '/view.jsp?businessId=' + e.id + '&instanceId=' + e.instanceId + '&definitionId=' + e.definitionId;

			helper.openTabsPage(title, url);
		},
		handle: function (e) {
			const helper = layui.helper;
			const title = e.taskName + ' - ' + e.instanceId;
			const url = './views/' + e.definitionKey.replace('.', '/') + '/' + e.taskKey + '.jsp?businessId=' + e.id + '&instanceId=' + e.instanceId + '&definitionId=' + e.definitionId;

			helper.openTabsPage(title, url);
		},
		audit: function (e) {
			const helper = layui.helper;
			const title = '资产列表';
			const url = './views/asset/list.jsp?audit=1';

			helper.openTabsPage(title, url);
		},
		repair: function (e) {
			const helper = layui.helper;
			const title = '资产列表';
			const url = './views/asset/list.jsp?repair=1';

			helper.openTabsPage(title, url);
		}
	};

	const getCredentialTableOptions = function (historic) {
		return {
			elem: '#id-table-credential-' + (historic ? 'done' : 'undo'),
			id: 'id-table-credential-' + (historic ? 'done' : 'undo'),
			height: 'full-455', //高度填满
			url: api.list,
			cols: [[{
						type: 'numbers',
						fixed: 'left'
					}, {
						field: 'definitionName',
						title: '事务名称',
						width: 160,
						templet: function (res) {
							return `<button type="button" class="layui-btn layui-btn-xs btn-activiti-instance" data-instance="${res.instanceId}">${res.definitionName}</button>`;
						}
					}, {
						field: 'name',
						title: '发起人',
						width: 100,
						align: 'center',
					}, {
						field: 'department',
						title: '部门/单位',
						width: 140,
						align: 'left',
					}, {
						field: 'title',
						title: '主题',
						minWidth: 280,
					}, {
						field: 'ttime_create',
						title: '提交时间',
						width: 160,
						align: 'center',
					}, {
						title: '流程是否已完结',
						width: 160,
						align: 'center',
						templet: function (res) {
							return res.finished === true ? '是' : '否';
						}
					}, {
						field: 'endTime',
						title: '流程完结时间',
						width: 160,
						align: 'center',
						templet: function (res) {
							if (res.endTime == undefined) {
								return '--';
							}
							return res.endTime;
						}
					}, {
						field: 'taskName',
						title: '待办节点',
						width: 240,
						align: 'center',
						templet: function (res) {
							if (res.taskName === '') {
								return '--';
							}
							return res.taskName;
						}
					}, {
						fixed: 'right',
						title: '操作',
						align: 'center',
						width: 140,
						toolbar: '#id-table-credential-tools-' + (historic ? 'done' : 'undo'), //直接关联HTML块
					}
				]],
			page: true, //开启分页
			where: getCredentialParams(historic),
		};
	};

	const initCredentialTable = function () {
		const table = layui.table;

		//待完成
		table.render(getCredentialTableOptions(false));

		//已完成
		table.render(getCredentialTableOptions(true));
	};

	const getCredentialParams = function (historic) {
		return {
			params: {
				historic: historic,
			}
		};
	};

	const initPageRender = function (callback) {
		const $ = layui.$;

		initTargetsInfo();

		initCredentialTable();

		if ($.isFunction(callback)) {
			callback();
		}
	};

	const bindControlEvents = function () {
		const table = layui.table;
		const $ = layui.$;

		//工具栏
		$('div.div-credential-toolbar button.layui-btn:not(".submit")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
		});

		//操作栏
		table.on('tool(filter-table-credential)', function (obj) {
			events[obj.event].call(this, obj.data);
		});

		//跳转
		$('div.div-targets-todo div.redirect').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
		});
	}

	layui.use(['alimx.table', 'laydate', 'helper', 'layer', 'form', 'echarts'], function () {
		//页面初始化
		initPageRender(function () {
			bindControlEvents(function () {
				//TODO
			})
		});
	});

	e("index", {})
});
