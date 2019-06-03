layui.define(function (e) {
	const params = {};

	const api = {
		credential: '../../../blackHawk/asset/list.html',
		diagram: '../../../common/1/activiti/diagram/image.html',
		historic: '../../../common/1/activiti/credential/historic.html',
		coordinates: '../../../common/1/activiti/credential/coordinates.html',
	};

	function getInstance() {
		const $ = layui.$;
		const table = layui.table;
		const helper = layui.helper;
		let me = {};

		let buildServiceTableId = function (_asset) {
			return 'table-asset-service-' + _asset.token;
		}
		

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
						}, {
							title: '是否中间件',
							width: 120,
							align: 'center',
							templet: function (res) {
								return res.container === 1 ? '是' : '否';
							}
						}, {
							title: '中间件名称',
							width: 240,
							align: 'center',
							templet: function (res) {
								return res.container === 1 ? res.cname : '--'
							}
						}, {
							title: '中间件版本',
							width: 120,
							align: 'center',
							templet: function (res) {
								return res.container === 1 ? res.cversion : '--'
							}
						}
					]],
				page: false, //开启分页
			});
		};

		let addAssetInfo = function (_asset) {
			let _info = _asset.info;
			let _table =
				`<table class="layui-table">
					<tbody>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">详情描述</td>
							<td colspan="4">${_info.description}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">入侵方式</td>
							<td>${_info.intrusion}</td>
							<td style="background-color:#f2f2f2">风险等级</td>
							<td>${_info.riskLevel}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">CVE编号</td>
							<td>${_info.cveid}</td>
							<td style="background-color:#f2f2f2">CNCVE编号</td>
							<td>${_info.cncveid}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">报告来源</td>
							<td colspan="4">${_info.reportSources}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">发现日期</td>
							<td colspan="4">${_info.discoveryDate}</td>
						</tr>
					</tbody>
				</table>`;

			return _table;
		};

		let addAssetServiceTable = function (_asset) {
			let _info = _asset.info;
			let _services = _asset.services;
			let _table = `<table class="layui-hide" id="id-${ buildServiceTableId(_asset) }" lay-filter="filter-${buildServiceTableId(_asset)}"></table>`;
			return _table;
		};

		let addAsset = function (_asset, _expand) {
			_asset.hand = {};
			_asset.hand.ignore = 1; //0已处理  1未处理
			_asset.gnoreid = "";//点击处理checkbox编号
			_asset.titlestate = 0;
			let sign = undefined;
			//标题上的原点颜色
			switch (_asset.titlestate) {
				case 0:
					sign = "sign-success";//绿色
					break;
				case 1:
					sign = "sign-info"; //普通色
					break;
				case 2:
					sign = "sign-warning";//黄色
					break;
				case 3:
					sign = "sign-drange";//红色
					break;
				default:
					break;
			}
			let _result =
				`<div class="layui-colla-item">
					<h2 class="layui-colla-title" style="display: flex;flex-direction: row;">
						<div style="width:100%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
						<div class="sign `+sign+`"></div>
							<span>${ _asset.title}</span>
						</div>
						<div class="btngroup" style="width:50%;display: flex;flex-direction: row;justify-content: flex-end;">`+ addcheck(_asset.hand)+ `</div>
					</h2>
					<div class="layui-colla-content ` + (_expand ? `layui-show` : ``) + `">
						${ addAssetInfo(_asset)}
						
					</div>
				</div>`;
			return _result;
		};
		let addcheck = function (hand) {
			let str = undefined;
			// if (hand.ignore == 0) {
			// 	str = `<div class="layui-form"><input type="checkbox" value="${hand.gnoreid}" lay-filter="che" name="aaa" title="忽略" checked /></div>`
			// } else if (hand.ignore == 1) {
			// 	str = `<div class="layui-form"><input type="checkbox" value="${hand.gnoreid}" lay-filter="che" name="aaa" title="忽略" /></div>`
			// }
			str =  `<div class="layui-form"><select name="business" lay-verify="business">
			<option value="">请选择一个城市</option>
			<option value="010">北京</option>
			<option value="021">上海</option>
			<option value="0571">杭州</option>
		  </select></div>`;
			return str;
		}

		me.addAssets = function (_elem, _assets) {
			_assets.forEach(function (_asset, _index) {
				let _item = addAsset($.extend(_asset, {
							title: _asset.info.name
						}), _index === 0);
				$(_elem).append(_item);
				renderServiceTable({
					elem: '#id-' + buildServiceTableId(_asset),
					id: 'id-' + buildServiceTableId(_asset),
					data: _asset.services,
				});
			});
		}

		me.setCredentialInfo = function (_info) {
			$('div.div-order-detail .span-time-create').html(_info['time-create']);
			$('div.div-order-detail .span-description').html(_info.description);
		};

		me.setCredentialDiagram = function (_data) {
			const src = api.diagram + '?definitionId=' + _data.definitionId;
			const diagram = $('div.div-diagram');

			diagram.html('').append('<img class="img-instance" src="' + src + '" />');
		};

		me.setCredentialCoordinates = function (_data) {
			const diagram = $('div.div-diagram');
			helper.ajax(api.coordinates, {
				params: {
					instanceId: _data.instanceId,
				}
			}, function (response) {
				const coordinates = response.message;

				if (coordinates.historic) {
					coordinates.historic.forEach(function (item, index) {
						const historic = '<div style="position: absolute;border-radius: 16px;border:4px solid green;width: ' + item.width + 'px;height:' + item.height + 'px;top:' + (item.y - 4) + 'px;left: ' + (item.x - 4) + 'px;"></div>';
						diagram.append(historic);
					});
				}

				if (coordinates.current) {
					coordinates.current.forEach(function (item, index) {
						const current = '<div class="div-task-current-' + index + '" data-task-id="' + item.taskId + '" style="' + (item.operable ? '' : '') + 'position: absolute;border-radius: 16px;border:4px solid red;width: ' + item.coordinate.width + 'px;height:' + item.coordinate.height + 'px;top:' + (item.coordinate.y - 4) + 'px;left: ' + (item.coordinate.x - 4) + 'px;"></div>';
						diagram.append(current);
						if (item.operable) {}
					});
				}
			});
		};

		me.setCredentialHistoric = function (_data) {
			const comments = $('ul.ul-comments');
			//历史
			helper.ajax(api.historic, {
				params: {
					instanceId: _data.instanceId,
				}
			}, function (response) {
				let html = '<p>暂无事务历史记录</p>';
				// if (response.list.length > 0) {
				// 	html = '';
				// 	response.list.forEach(function (item, index) {
				// 		html += '<li class="layui-timeline-item"><i class="layui-icon layui-timeline-axis">&#xe63f;</i><div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">' + item.startTime + ' ' + item.taskName + '</h3><p>操作人：' + item.assignee_name + '</p><ul><li>备注：' + (item.comment || '无') + '</li><li>完成时间：' + item.endTime + '</li></ul></div></li>';
				// 	});
				// }
				comments.html('').append(html);
			});
		};

		return me;
	}
	const events = {
		//提交
		submit: function () {
			layer.msg("提交");
		},
	};

	

	const initPageRender = function () {
		const $ = layui.$;
		const element = layui.element;
		const form = layui.form;

		let info = {
			'time-create': "2019-01-01 00:00:00",
			description: `描述`
		};

		let instance = getInstance();

		instance.setCredentialInfo(info);
		instance.setCredentialDiagram({
			definitionId: params.definitionId
		});
		instance.setCredentialCoordinates({
			instanceId: params.instanceId
		});
		instance.setCredentialHistoric({
			instanceId: params.instanceId
		});

		const assets = [{
				token: new Date().getTime(),
				info: {
					description: '详情描述',
					name: '[CVE-2017-10155] ORACLE MYSQL SERVER 组件安全漏洞',
					address: '10.254.222.10',
					intrusion: '远程',
					riskLevel: '高危',
					cveid: 'cveid',
					cncveid: 'cncveid',
					reportSources: '报告来源',
					discoveryDate: '2019-12-12',
				}
			}, {
				token: new Date().getTime() + 1000,
				info: {
					description: '详情描述',
					name: '[CVE-2017-10155] ORACLE MYSQL SERVER 组件安全漏洞',
					address: '10.254.222.10',
					intrusion: '远程',
					riskLevel: '高危',
					cveid: 'cveid',
					cncveid: 'cncveid',
					reportSources: '报告来源',
					discoveryDate: '2019-12-12',
				}
			}
		];
		
		instance.addAssets('div.div-assets', assets);

		// $('select[name="business"]').next().find('').click(function(){
		// 	alert();
		// });
		$(document).on("click","div.layui-form-select", function(e){
			//阻止事件冒泡
			e.stopPropagation();
			alert(1);
			return false;
		})

		// form.on('select(business)', function(data){
		// 	//阻止事件冒泡
		// 	//layui.stope(window.event);
		// 	alert(1)
		// })
		form.render("select");
		element.render('div.div-assets');

		$('.layui-btn').click(function () {
			switch ($(this).html()) {
			case '提交':
				params().events["submit"].call();
				break;
			case '撤回':
				params().events["retreat"].call();
				break;
			case '放弃':
				params().events["giveup"].call();
				break;
			default:
				break;
			}
		});
	};

	const initURLParams = function () {
		const layer = layui.layer;
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
		//查询
		$('.layui-btn.btn-search').click(function () {
			events['search'].call(this);
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
			bindControlEvents(function () {});
		});
	});
	e("loophole.handleworkorder", {})
});
