
var _RootNodeName = 'CMDI';

$(document).ready(function (e) {
	// 态势信息：总资产数,总风险数
	initSituationInfo();
	// 风险
	initSituationExploits(12);
	// 告警
	initSituationAlarms(12);
	// 问题资产
	initSituationPerilous(30);
	//云视图
	initQuneeCloud(50);
	//资产分类
	initAssetProductEChart();
	//风险分类
	initAlertExploitEChart();
	//折线图
	initElsaEChart($('div.main-bottom div.chart-line-flow')[0], 20);
	
	$('div.view_model[ref=detail] div.pop-close').click(function(){
		layer.close($('div.view_model[ref=detail]').attr('layer-id'));
	});

	$('span.link-to-assets').click(function(e){
		const filter = $(this).data('filter');
		self.location.href='./asset.jsp?filter='+filter;
	});
	
	
	
		
			$('.abc').click(function(e) {
		       var panel = $('div.ov-model[ref=import]');

				layer.open({
					type: 1,
					title: false,
					closeBtn: false,
					shadeClose: false,
					area: ['100%', '100%'],
					shade: 0.5,
					scrollbar: false,
					resize: false,
					content: panel,
					success: function (options, index) {
						$(".main-box,.header").css("filter", "blur(10px)");
						//弹窗编号
						panel.attr('layer-id', index);
						//弹窗样式
						layer.style(index, {
							"background": 'transparent',
							"opacity": 1,
						});
					},
					end:function(){$(".main-box,.header").css("filter", "blur(0px)");}
				}); 
				

		    });
	
	
});


      //风险 新增风险
function initSituationExploits(limit) {
			helper.ajax('../blackHawk/situation/exploit.html', {
				'paginator.limit': limit
			}, function (data) {
				console.log("_________"+JSON.stringify(data));
				var html = "<ol><span class='titleip'>风险等级</span><span class='titlexh'>资产IP</span><span class='titlename'>CVE编号</span></ol>";
				
				for (var i = 0; i < data.count; i++) {
					var info = data.list[i];
					html += "<li data-asset-id='" + info.asset_id + "' data-service-id='" + info.service_id + "' data-loophole-id='" + info.loophole_id + "'><span class='ip'>" + info.loophole_id + "</span>" +
					"<span class='name'>" + info.level + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + info.asset_ip + "</span></li>";
					$(".main-right .list-cont.rolling").children().remove();
					$(".main-right .list-cont.rolling").html(html);
				}

				$('.main-right .list-cont.exploit li').click(function (e) {
					showAssetActionView({id:$(this).attr('data-asset-id'), action:'risk'});
				});
			});
	}
	

	  
    //资产分类 饼图
	function initAssetProductEChart() {
				// 基于准备好的dom，初始化echarts实例
				var myChart = echarts.init(document.getElementById('piechart01'));

				// 指定图表的配置项和数据
				var option = {
						title: {
							text: '总资产类型',
							textStyle: {
							color: '#fff',
							}
						},
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b}: {c} ({d}%)"
						},
						legend: {
							orient: 'horizontal',
							x: 'right',
							y:'bottom',
							data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
							textStyle: {
								color: '#fff'
							}
						},
						color:[ '#ffff14','#9fe129','#e9f3cd','#a9d035','#bedc68','#d4e79a'  ],
						series : [
									{
										
										name: '访问来源',
										type: 'pie',
										radius: ['34%', '58%'],
										avoidLabelOverlap: true,
										center: ['50%', '50%'],
										data:[
											{value:335, name:'直接访问'},
											{value:310, name:'邮件营销'},
											{value:234, name:'联盟广告'},
											{value:135, name:'视频广告'},
											{value:1548, name:'搜索引擎'}
										],
										itemStyle: {
											normal: {
												
												label: {
													show: true,
													position: 'top',
													formatter: '{b}\n{c}',
												}
											},
											
										},
									}
								]

						};

				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				helper.ajax('../blackHawk/situation/chart/product.html', {}, function (data) {
						var item,
						items = [],
						legendDate=[],
						res = data.list;
						for (var i = 0; i < data.count; i++) {
							item = res[i];
							console.log("_____"+item);
							items.push({
								name: item.type,
								value: item.attempt
							});
							legendDate.push(item.type);
						}
						
						items=[
							{value:2, name:''},
							{value:2, name:'Web服务'},
							{value:3, name:'个人工作PC'},
							{value:5185, name:'其他资产'},
							{value:20, name:'未知类型'},
							{value:52, name:'终端'},
							{value:1, name:'防火墙'}
						]
						legendDate=['','Web服务','个人工作PC','其他资产','未知类型','终端','防火墙']
						// 使用刚指定的配置项和数据显示图表。
						myChart.setOption({
							series: [{
									data: items
								}],
							legend:{
								data:legendDate
							} 
						});
					});
				
	}	 


			
 //风险分类 饼图
function initAlertExploitEChart() {
	// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('piechart03'));

        // 指定图表的配置项和数据
        var option = {
	title: {
        text: '告警类型',
		textStyle: {
		color: '#fff',
		}
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        x: 'right',
		y:'bottom',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
		textStyle: {
			color: '#fff'
		}
    },
	color:[ '#ffff14','#9fe129','#e9f3cd','#a9d035','#bedc68','#d4e79a' ],
    series : [
        {
			
            name: '访问来源',
            type: 'pie',
            radius: ['34%', '58%'],
            avoidLabelOverlap: true,
            center: ['50%', '50%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ],
            itemStyle: {
                normal: {
                    
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{b}\n{c}',
                    }
                },
				
            },
        }
    ]

};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		
		 helper.ajax('../blackHawk/situation/chart/exploit.html', {}, function (data) {
		var item,
		items = [],
		legendDate=[],
		res = data.list;
		for (var i = 0; i < data.count; i++) {
			item = res[i];
			items.push({
				name: item.type,
				value: item.attempt
			});
		}

       items=[
	        {value:1, name:'信任管理'},
            {value:2, name:'信息泄露'},
            {value:52, name:'其他'},
			{value:1, name:'授权问题'},
            {value:1, name:'权限许可和访问控制'},
            {value:8, name:'输入验证'}
	   ]
        legendDate=['信任管理','信息泄露','其他','授权问题','权限许可和访问控制','输入验证']
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption({
			series: [{
					data: items
				}],
				legend:{
				data:legendDate
				} 
		});
	}); 
		
		
}


function initElsaEChart(elem, index) {
	
	// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('piechart02'));

        // 指定图表的配置项和数据
        var option = {

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
        data: ['FTP'],
        right: '4%',
        textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
        }
    },
    grid: {
		top:'2%',
        left: '2%',
        right: '2%',
        bottom: '8%',
        containLabel: false
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisTick: {
            show: false
        },
         axisLine : {    // 轴线
                show: false,
                
            },
        axisLabel : {
                show:true,
                margin: 0,
                textStyle: {
                    color: '#fff',
                }
            },
        splitLine : {
                show:true,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)',

                }
            },
        
        data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
    }],
    yAxis: [{
        type: 'value',
        name: '单位（%）',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        axisLabel: {
            margin: 110,
            textStyle: {
                fontSize: 14
            }
        },
        splitLine: {
			show:false,
            lineStyle: {
                color: '#000'
            }
        }
    }],
    series: [{
        name: 'FTP',
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
                    color: 'rgba(255, 255, 255, 0.2)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: '#9ff32b',
                borderColor: 'rgba(255,188,2,0.27)',
                borderWidth: 12

            }
        },
        data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
    }
        ]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
}	



	//云视图
function initQuneeCloud(limit) {
	var graph = new Q.Graph("canvas");

	helper.ajax('./blackHawk/situation/qunee/cloud.html', {
		limit: limit
	}, function (response) {
		buildQuneeCloud(graph, response);
	});
}


function buildQuneeCloud(_graph, _response) {
	
	var datas = _response.datas;
	//根节点
	var root = _graph.createNode(_RootNodeName);
	root.setStyle(Q.Styles.LABEL_FONT_SIZE, 120);
	root.setStyle(Q.Styles.LABEL_COLOR, "#AEF3EE");
	root.enableSubNetwork = false;
	root.image = quneeImages['group'];
	root.parentChildrenDirection = Q.Consts.DIRECTION_BOTTOM;
	root.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
	root.size={width:400};
	//子节点
	if (datas) {
		Q.forEach(datas, function (data) {
			var json = data.json;
			if (data.type === 'node') {
				var node = _graph.createNode(json.name);

				var label = new Q.LabelUI();
				label.position = Q.Position.CENTER_BOTTOM;
				label.anchorPosition = Q.Position.CENTER_BOTTOM;
				label.border = 0;
				label.padding = new Q.Insets(0, 0);
				label.showPointer = false;
				label.offsetX = 10;
				label.offsetY = -110;
				//label.backgroundColor = '#24566C';
				label.fontSize = 120;

				node.addUI(label, [{
							property: "label",
							propertyType: Q.Consts.PROPERTY_TYPE_CLIENT,
							bindingProperty: "data"
						}, {
							property: "label.color",
							propertyType: Q.Consts.PROPERTY_TYPE_CLIENT,
							bindingProperty: "color"
						}
					]);
				node.set("label", json.data.attempt_asset_sum + '/' + json.data.attempt_loophole_undo+ '/' + json.data.attempt_alarm);
				node.set("label.color", '#FFBC02');
				node.setStyle(Q.Styles.LABEL_COLOR, "#AEF3EE");

				if ((json.data.attempt_loophole_undo + json.data.attempt_alarm) > 0) {
					node.setStyle(Q.Styles.RENDER_COLOR, "#E21667");
					node.setStyle(Q.Styles.SHADOW_COLOR, "#888");
					node.setStyle(Q.Styles.SHADOW_OFFSET_X, 5);
					node.setStyle(Q.Styles.SHADOW_OFFSET_Y, 5);
					node.setStyle(Q.Styles.SHADOW_BLUR, 5);

					var show = true;
					var timer = setInterval(function () {
							if (show) {
								node.removeUI(label);
							} else {
								node.addUI(label);
							}
							show = !show;
						}, 1000);
				}

				node.setStyle(Q.Styles.LABEL_FONT_SIZE, 100);

				//文字位置
				//node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_TOP);

				//node.setStyle(Q.Styles.NODE_COLOR, "rgba(255,255,255,1)");

				node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#2898E0");
				node.enableSubNetwork = json.data.attempt_asset_sum > 0;
				node.image = quneeImages[json.image];

				node.parentChildrenDirection = Q.Consts.DIRECTION_BOTTOM;
				node.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;

				node.set("data", json);

				var edge = _graph.createEdge('', root, node);
				edge.setStyle(Q.Styles.EDGE_COLOR, "rgba(174,243,238,0.5)");
				edge.setStyle(Q.Styles.EDGE_WIDTH, 3);
			}
		}, _graph);
	}
	//布局
	var layout = new Q.BalloonLayouter(_graph);
	//角度分布模式
	//平均分布
	//layout.angleSpacing =Q.Consts.ANGLE_SPACING_REGULAR
	//按需分布 默认
	layout.angleSpacing = Q.Consts.ANGLE_SPACING_PROPORTIONAL
		//半径模式
		//统一半径
		//layout.radiusMode = Q.Consts.RADIUS_MODE_UNIFORM;
		//可变半径 默认
		layout.radiusMode = Q.Consts.RADIUS_MODE_VARIABLE;
	//节点之间的间距
	layout.gap = 85;
	//最小半径长度
	layout.radius = 10;
	//起始旋转角度
	layout.startAngle = Math.PI / 4;
	layout.doLayout({
		callback: function () {
			//全屏
			zoomToOverview(_graph);
			//双击事件
			_graph.ondblclick = function (event) {
				//当前双击图元
				var element = _graph.getElementByMouseEvent(event);
				//图元
				if (element) {
					//节点
					if (element.type === 'Q.Node') {
						var data = event.getData();
						var json = element.get('data');
						//子网节点
						if (data.enableSubNetwork == true) {
							//创建子网视图
							buildQuneeSubNetwork(_graph, element, function () {
								//树型布局
								var tree = new Q.TreeLayouter(_graph);
								tree.layoutType = Q.Consts.LAYOUT_TYPE_EVEN_HORIZONTAL;
								tree.doLayout({
									callback: function () {
										//var localXY = _graph.globalToLocal(event);
										//var logicalXY = _graph.toLogical(localXY.x, localXY.y);

										//_graph.translate(localXY.x, localXY.y,true);//平移
										//_graph.translateTo(localXY.x, localXY.y, 1, true);//设置偏移量和缩放比例
										//_graph.zoomAt(2, localXY.x, localXY.y, true);//按指定点缩放
										//_graph.zoomToOverview(true, 3);//缩放到整个窗口
										//_graph.centerTo(localXY.x, localXY.y, 1, true);//将指定点移动到组件中心
										//_graph.moveToCenter(1, true); //整个画布移动到组件中心
										
										_graph.zoomAt(4, 650, 400, true);
										
										/*_graph.forEachVisibleUI(function(ui){
											const level = ui.data._myd.data.level
											if(level===1){
												console.log(ui);
											}
										},this);*/
									}
								});
							});
						}
						//非子网节点
						else {
							if (json) {
								var level = json.level;
								switch (level) {
									//根节点
								case 1:
									zoomToOverview(_graph, function () {
										_graph.upSubNetwork();
									});
									break;
								case 2:
									break;
								case 3:
									const action = json.data.attempt_loophole_undo > 0 ?'risk':(json.data.attempt_alarm > 0 ? 'alarm' : null);
									showAssetActionView({id:json.id,action:action});
									break;
								}
							}
						}
					}
				} else {
					zoomToOverview(_graph);
				}
			}
		}
	});
}

	
	//子网视图
function buildQuneeSubNetwork(_graph, _parent, _callback) {
	//父节点参数
	var params = _parent.get('data');
	//移除原有图元
	var children = _parent.children.clone();
	if (children.length > 0) {
		Q.forEach(children, function (child) {
			_graph.removeElement(child);
		});
	}
	//请求子网数据
	helper.ajax('./blackHawk/situation/qunee/subnet.html', {
		'params["id"]': params.id
	}, function (response) {
		var datas = response.datas,
		map = {};
		if (datas.length > 0) {
			//根节点
			var root = _graph.createNode(params.name + (' (' + params.data.attempt_asset_sum + '/' + params.data.attempt_loophole_undo+ '/' + params.data.attempt_alarm) + '）');
			root.size = {
				width: 90
			};
			root.setStyle(Q.Styles.LABEL_FONT_SIZE, 30);
			root.setStyle(Q.Styles.LABEL_COLOR, "#AEF3EE");
			root.enableSubNetwork = false;
			root.image = quneeImages[params.image];
			root.parentChildrenDirection = Q.Consts.DIRECTION_BOTTOM;
			root.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
			root.set("data", $.extend({
					level: 1
				}, params));

			_parent.addChild(root);

			var group = null;

			//子节点
			Q.forEach(datas, function (data, index) {
				var json = data.json;
				//二级节点
				if (index == 0 || json.image != datas[index - 1].json.image) {
					group = _graph.createNode('');
					group.size = {
						width: 50
					};
					group.setStyle(Q.Styles.LABEL_FONT_SIZE, 30);
					group.setStyle(Q.Styles.LABEL_COLOR, "#AEF3EE");
					group.enableSubNetwork = false;
					group.image = quneeImages[json.image];
					group.parentChildrenDirection = Q.Consts.DIRECTION_BOTTOM;
					//LAYOUT_TYPE_EVEN 平均分布，根据层次间方向自动确定孩子布局方向
					//LAYOUT_TYPE_EVEN_HORIZONTAL 水平平均分布
					//LAYOUT_TYPE_EVEN_VERTICAL 垂直平均分布
					//LAYOUT_TYPE_TWO_SIDE 两侧分布
					group.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;
					group.set("data", $.extend({
							level: 2
						}, json));

					_parent.addChild(group);

					var edge = _graph.createEdge('', root, group);
					edge.edgeType = Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL;
					edge.setStyle(Q.Styles.EDGE_CORNER, Q.Consts.EDGE_CORNER_NONE);
					edge.setStyle(Q.Styles.EDGE_COLOR, "rgba(174,243,238,0.5)");

					_parent.addChild(edge);
				}
				//三级节点
				if (data.type === 'node') {
					var node = _graph.createNode(json.name);

					node.size = {
						width: 30
					};
					node.setStyle(Q.Styles.LABEL_FONT_SIZE, 30);
					node.setStyle(Q.Styles.LABEL_COLOR, "#AEF3EE");
					node.enableSubNetwork = false;
					node.image = quneeImages[json.image];
					node.parentChildrenDirection = Q.Consts.DIRECTION_BOTTOM;
					node.layoutType = Q.Consts.LAYOUT_TYPE_TWO_SIDE;

					if (json.data.attempt_loophole_undo+json.data.attempt_alarm > 0) {
						var label = new Q.LabelUI();
						label.position = Q.Position.CENTER_TOP;
						label.anchorPosition = Q.Position.CENTER_BOTTOM;
						label.border = 0;
						label.padding = new Q.Insets(0, 0);
						label.showPointer = false;
						label.offsetX = 0;
						label.offsetY = 0;
						//label.backgroundColor = '#24566C';
						label.fontSize = 30;

						node.addUI(label, [{
									property: "label",
									propertyType: Q.Consts.PROPERTY_TYPE_CLIENT,
									bindingProperty: "data"
								}, {
									property: "label.color",
									propertyType: Q.Consts.PROPERTY_TYPE_CLIENT,
									bindingProperty: "color"
								}
							]);
						node.set("label", '' + json.data.attempt_loophole_undo+'/'+json.data.attempt_alarm);
						node.set("label.color", '#FFBC02');

						node.setStyle(Q.Styles.LABEL_COLOR, "#E21667");

						node.setStyle(Q.Styles.RENDER_COLOR, "#E21667");
						node.setStyle(Q.Styles.SHADOW_COLOR, "#888");
						node.setStyle(Q.Styles.SHADOW_OFFSET_X, 2);
						node.setStyle(Q.Styles.SHADOW_OFFSET_Y, 2);
						node.setStyle(Q.Styles.SHADOW_BLUR, 2);

						var show = true;
						var timer = setInterval(function () {
								if (show) {
									node.removeUI(label);
								} else {
									node.addUI(label);
								}
								show = !show;
							}, 1000);
					}

					node.set("data", $.extend({
							level: 3
						}, json));

					_parent.addChild(node);

					var edge = _graph.createEdge('', group, node);
					edge.edgeType = Q.Consts.EDGE_TYPE_VERTICAL_HORIZONTAL;
					edge.setStyle(Q.Styles.EDGE_CORNER, Q.Consts.EDGE_CORNER_NONE);
					edge.setStyle(Q.Styles.EDGE_COLOR, "rgba(174,243,238,0.5)");

					_parent.addChild(edge);
				}
			}, _graph);

			if ($.isFunction(_callback)) {
				_callback();
			}
		}
	});
}
	

