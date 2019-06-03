layui.define(function (e) {
	const events = {
		search: function () {
			const table = layui.table;
			//执行重载
			table.reload(params().tableid, {
				page: {
					curr: 1 //重新从第 1 页开始
				},
				where: params().map()
			});
		}
	};

	const params = function () {
		let that = {};
		const $ = layui.$;
		const form = $('.layui-card.layui-form.div-scanning-list');
		that.api = {
			list: '../../../intellegence/grid/list.html'
		}
		that.map = function () {
			let par = {
				params: {
					start: form.find('input[name=startTime]').val(), //开始时间
					end: form.find('input[name=endTime]').val(), // 结束时间
				}
			}
			return par;
		};
		that.tableid = "id-table-finance-assetslist";
		return that;
	}

	const initPageRender = function (requestRender) {
		const laydate = layui.laydate;
		const $ = layui.$;
		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click'
			});
		});
		//查询
		$('.layui-btn.btn-search').click(function () {
			events['search'].call(this);
		});
		requestRender();
	};

	layui.use(['alimx.table', 'element', 'laydate', 'helper', 'layer', 'form', 'echarts'], function () {
		const $ = layui.$;
		const table = layui.table;
		//页面初始化
		initPageRender(function () {
			//表格
			table.render({
				elem: '#' + params().tableid,
				height: 'full-395', //高度填满
				defaultToolbar: [], //工具栏右侧按钮，默认['filter','exports','print']
				url: '../../database/intellegence/grid/list.html', //数据请求URL
				cols: [[{
							field: 'ttime',
							title: '情报时间',
							width: 180
						}, {
							field: 'code',
							title: '分类',
							width: 100,
							align: 'center',
							templet: function (res) {
								switch (res.code) {
								case 1:
									return 'FQDN';
								case 2:
									return 'IPV4';
								case 3:
									return 'IPV6';
								case 4:
									return 'MD5';
								case 5:
									return 'URL';
								case 6:
									return 'EMAIL';
								}
							}
						}, {
							field: 'intellegence',
							title: '情报分类',
							width: 120,
							align: 'center',
						}, {
							field: 'target',
							title: '情报内容',
							minWidth: 300,
							align: 'left',
						}, {
							field: 'source',
							title: '情报来源',
							width: 220,
							align: 'center',
						}
					]],
				page: true, //开启分页
				where: params().map,
			});

			//威胁分类，暂无数据隐藏
			$(".threatTypeShow").hide();

			//威胁情报获取，暂无数据隐藏
			$(".threatAcquisitionShow").hide();

			let threatType = echarts.init(document.getElementById("threatType"));
			let threatAcquisition = echarts.init(document.getElementById("threatAcquisition"));
			let threatTypeoption = {
				//backgroundColor: '#2c343c',
				tooltip: {
					trigger: 'axis'
				},
				title: {
					text: '威胁分类',
					left: 'left',
					top: 20,
				},
				tooltip: {
					trigger: 'item',
					formatter: "{b} {d}%",
					textStyle: {
						fontSize: 12
					}
				},
				series: [{

						type: 'pie',
						radius: ['25%', '75%'],
						center: ['50%', '50%'],

						roseType: 'radius',
						label: {
							normal: {
								show: true,
								textStyle: {
									fontSize: '12',
								},
								position: 'outer'
							}
						},
						labelLine: {
							normal: {
								show: true,
								length: 2,
								length: 2,
								smooth: 0 //0-1标识平滑程度
							}
						},
						/*  itemStyle: {
						normal: {
						color: '#c23531',
						shadowBlur: 200,
						shadowColor: 'rgba(0, 128,1, 0.5)'
						}
						}, */

						animationType: 'scale',
						animationEasing: 'elasticOut',
						animationDelay: function (idx) {
							return Math.random() * 200;
						}
					}
				]
			};

			let threatAcquisitionoption = {
				title: {
					text: '威胁情报获取',
					left: 'left',
					top: 20,
				},
				tooltip: {
					trigger: 'axis',
					formatter: function (param) {
						var tooltip = param[0].name;
						param.forEach(function (item, index) {
							tooltip += '</br>' + item.seriesName + ' ' + item.value + '条';
						});
						return tooltip;
					},
					axisPointer: {
						lineStyle: {
							color: '#57617B'
						}
					}
				},
				xAxis: [{
						type: 'category',
						boundaryGap: false,
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#000'
							}
						},
						axisLabel: {
							show: true,
							//margin: 0,
							textStyle: {
								color: 'Black',
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: 'rgba(43, 237, 230, 0.2)',
							}
						},
						data: []
					}
				],
				yAxis: [{
						type: 'value',
						//name: '条数',
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#000'
							}
						},
						axisLabel: {
							show: true,
							//margin: 0,
							textStyle: {
								color: 'Black',
							}
						},
						splitLine: {
							show: false,
							lineStyle: {
								color: '#000'
							}
						}
					}
				],
				series: [{
						name: '情报数',
						type: 'line',
						smooth: true,
						symbol: 'circle',
						symbolSize: 5,
						showSymbol: false,
						lineStyle: {
							normal: {
								width: 1
							}
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: 'rgba(43, 237, 230, 0.2)'
										}
									], false),
								shadowColor: 'rgba(0, 0, 0, 0.1)',
								shadowBlur: 10
							}
						},
						itemStyle: {
							normal: {
								color: 'rgb(255,188,2)',
								borderColor: 'rgba(255,188,2,0.27)',
								borderWidth: 12

							}
						},
						data: []
					}
				]
			};
			threatType.setOption(threatTypeoption);

			$.ajax({
				type: "get",
				url: "../../database/intellegence/echart/pie.html",
				dataType: 'json',
				data: {
					limit: 15
				},
				async: true,
				success: function (response) {
					var item,
					items = [];
					for (var i = 0; i < response.list.length; i++) {
						item = response.list[i];
						items.push({
							name: item.intellegence,
							value: item.attempt
						});
					}

					if (response.list.length <= 0) {
						$("#threatType").hide();
						$("#threatTypeShow").show();
					} else {
						threatType.setOption({
							series: [{
									data: items
								}
							]
						});
					}
				}
			});

			threatAcquisition.setOption(threatAcquisitionoption);

			$.ajax({
				type: "get",
				url: "../../database/intellegence/echart/line.html",
				dataType: 'json',
				data: {
					limit: 10
				},
				async: true,
				success: function (response) {
					var item,
					category = [],
					items = [];
					for (var i = 0; i < response.list.length; i++) {
						item = response.list[i];
						category.push(item.day_id);
						items.push(item.attempt);
					}
					if (response.list.length <= 0) {
						$("#threatAcquisition").hide();
						$("#threatAcquisitionShow").show();
					} else {
						threatAcquisition.setOption({
							xAxis: [{
									data: category
								}
							],
							series: [{
									data: items
								}
							]
						});
					}

				}
			});
		});
	});
	e("database.intelligence", {})
});
