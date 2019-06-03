layui.define(function (e) {
	const _params = {};

	const api = {
		list: '../../../hai/asset/info/list.html', //资产信息
		single: '../../../hai/asset/info/single.html', //资产信息
		action: '../../../hai/credential/asset.audit/action.html',
		info: '../../../common/1/activiti/credential/info.html', //工单信息
		diagram: '../../../common/1/activiti/diagram/image.html',
		historic: '../../../common/1/activiti/credential/historic.html',
		coordinates: '../../../common/1/activiti/credential/coordinates.html',
	};

	function getInstance() {
		const $ = layui.$;
		const table = layui.table;
		const helper = layui.helper;
		const element = layui.element;
		let me = {};

		function buildServiceTableId(e) {
			return 'table-asset-service-' + e.token;
		}
		
		function renderServiceTable(e){
			const table  = layui.table;
			
			table.render({
					id: 'id-' + buildServiceTableId(e),
					elem: '#id-' + buildServiceTableId(e),
					data: e.services, //data,
					height: 'full-600', //高度填满
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
				});
		}

		let _addAssetInfo = function (_asset) {
			let _table =
				`<table class="layui-table">
					<tbody>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">资产归属</td>
							<td>${_asset.department||'未知'}</td>
							<td style="background-color:#f2f2f2">资产名称</td>
							<td>${_asset.name||'未知'}</td>
							<td style="background-color:#f2f2f2">资产IP</td>
							<td>${_asset.address}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">上报时间</td>
							<td>${_asset['report_date']||'未知'}</td>
							<td style="background-color:#f2f2f2">资产主类</td>
							<td>${_asset['main_class']||'未知'}</td>
							<td style="background-color:#f2f2f2">资产子类</td>
							<td>${_asset['sub_class']||'未知'}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">操作系统</td>
							<td>${_asset.os||'未知'}</td>
							<td style="background-color:#f2f2f2">管理员</td>
							<td>${_asset['security_manager']||'未知'}</td>
							<td style="background-color:#f2f2f2">联系方式</td>
							<td>${_asset['security_phone']||'未知'}</td>
						</tr>
					</tbody>
				</table>`;

			return _table;
		};

		let _addAssetServiceTable = function (_asset) {
			let _table = `<table class="layui-hide" id="id-${buildServiceTableId(_asset)}" lay-filter="filter-${buildServiceTableId(_asset)}"></table>`;

			return _table;
		};

		let _addAsset = function (_index,_asset) {
			let _result =
				`<button class="layui-btn layui-btn-sm" data-event="edit" data-address="${_asset.address}" style="position: absolute;margin-top: 7px;right: 7px;z-index: 1;">编辑</button>
				<button class="layui-btn layui-btn-sm" data-event="fresh" data-address="${_asset.address}" style="position: absolute;margin-top: 7px;right: 57px;z-index: 1;">刷新</button>
				<div class="layui-colla-item" data-index="${_index}" data-address="${_asset.address}">
					${ _addAssetContent(_index,_asset)}
				</div>`;
			return _result;
		};
		
		let _addAssetContent = function(_index,_asset){
			let _result =
				`<h2 class="layui-colla-title" style="display: flex;flex-direction: row;">
					<div style="width:100%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
						<span>【${_index+1}】${_asset.address}</span>
					</div>						
				</h2>
				<div class="layui-colla-content ` + (_index === 0 ? `layui-show` : ``) + `">
					${ _addAssetInfo(_asset)}
					${ _addAssetServiceTable(_asset)}
				</div>`;
			return _result;
		};
		
		me.addAsset = function(_elem, _asset){
			const content = $(_elem).find("div.layui-colla-item[data-address='"+_asset.address+"']");
			
			content.empty().append(_addAssetContent(content.data('index'),_asset,true));
						
			renderServiceTable(_asset);
		};

		me.addAssets = function (_elem, _assets) {
			_assets.forEach(function (_asset, _index) {
				let _item = _addAsset(_index,_asset);
						
				$(_elem).append(_item);
				
				renderServiceTable(_asset);
			});
		}

		me.setCredentialInfo = function (e) {
			const detail = $('div.div-order-detail');
			
			detail.find('span.span-ttime').html(e['ttime_submit']);
			detail.find('span.span-description').html(e['description']);
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
				if (response.list.length > 0) {
					html = '';
					response.list.forEach(function (item, index) {
						html += '<li class="layui-timeline-item"><i class="layui-icon layui-timeline-axis">&#xe63f;</i><div class="layui-timeline-content layui-text"><h3 class="layui-timeline-title">' + item.startTime + ' ' + item.taskName + '</h3><p>操作人：' + item.name + '</p><ul><li>备注：' + (item.comment || '无') + '</li><li>完成时间：' + item.endTime + '</li></ul></div></li>';
					});
				}
				comments.html('').append(html);
			});
		};

		return me;
	}

	function getCredentialParams() {
		const $ = layui.$;
		const params = {
			instanceId: _params.instanceId,
			comment: $('div.div-order-credential textarea[name=comment]').val(),
		};

		return params;
	}

	const events = {
		//关闭
		close: function () {
			const helper = layui.helper;

			helper.closeThisTab();
		},
		fresh:function(){
			const $ = layui.$;
			const element = layui.element;
			const me = $(this);			
			const helper=layui.helper;
			const address = me.data("address");
			
			let instance = getInstance();
			
			//资产列表
			helper.ajax(api.single, {
				params: {
					address: address
				}
			}, function (response) {
				const asset = response.message;
				
				instance.addAsset('div.div-assets', asset);

				//渲染
				element.render('div.div-assets');
			});
		},
		edit:function(){
			const $ = layui.$;
			const me = $(this);
			const helper=layui.helper;
			const address = me.data("address");
			
			helper.openTabsPage('资产编辑-'+address, './views/asset/audit/edit.jsp?address='+address);
		},
		//提交
		submit: function () {
			const $ = layui.$;
			const helper = layui.helper;

			const params = getCredentialParams();

			helper.ajax(api.action, {
				params: params
			}, function (response) {
				if (response.result) {
					helper.closeThisTab();
				}else{
					layer.msg(response.message);
				}
			});
		},
	};

	const initPageRender = function (callback) {
		const $ = layui.$;
		const element = layui.element;
		const helper = layui.helper;

		let instance = getInstance();
		//工单信息
		helper.ajax(api.info, {
			params: {
				id: _params.businessId
			}
		}, function (response) {
			//工单标题
			$('span.span-title').html(response.message.title);

			instance.setCredentialInfo(response.message);
		});
		//资产列表
		helper.ajax(api.list, {
			params: {
				id: _params.businessId
			}
		}, function (response) {
			const assets = response.list;

			assets.forEach(function (asset, _index) {
				$.extend(asset, {
					token: new Date().getTime() + _index * 1000
				});
				if (asset.services) {
					asset.services.forEach(function (service, __index) {
						$.extend(service, {
							timestamp: new Date().getTime() + _index * 1000 + __index * 1000
						});
					});
				}
			});
			instance.addAssets('div.div-assets', assets);

			//渲染
			element.render('div.div-assets');
			
			bindAssetItemEvent();
		});
		
		instance.setCredentialDiagram({
			definitionId: _params.definitionId
		});
		instance.setCredentialCoordinates({
			instanceId: _params.instanceId
		});
		instance.setCredentialHistoric({
			instanceId: _params.instanceId
		});

		if ($.isFunction(callback)) {
			callback();
		}
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
			_params.instanceId = instanceId;
			_params.businessId = businessId;
			_params.definitionId = definitionId;
		}
	}
	
	const bindAssetItemEvent = function(){
		const $ = layui.$;
		//资产信息刷新、编辑
		$('div.div-assets button.layui-btn:not(".submit")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
		});
	}

	const bindControlEvents = function (callback) {
		const $ = layui.$;
		//操作栏
		$('div.layui-card button.layui-btn:not(".submit")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
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
			bindControlEvents(function () {
			});
		});
	});
	e("asset.audit.check", {})
});
