layui.define(function (e) {
	const _params = {};

	const api = {
		list: '../../../hai/asset/info/list.html', //资产信息
		single: '../../../hai/asset/info/single.html', //资产信息
		action: '../../../hai/credential/asset.repair/action.html',
		info: '../../../common/1/activiti/credential/info.html', //工单信息
		diagram: '../../../common/1/activiti/diagram/image.html',
		historic: '../../../common/1/activiti/credential/historic.html',
		coordinates: '../../../common/1/activiti/credential/coordinates.html',
	};
	
	function getInstance() {
		const $ = layui.$;
		const form = layui.form;
		const helper = layui.helper;
		let me = {};

		let _getLoopholeInfo = function (_loophole) {
			let _table =
				`<table class="layui-table">
					<tbody>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">详情描述</td>
							<td colspan="4">${_loophole.description||'未提供'}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">入侵方式</td>
							<td>${_loophole.threat||'未定义'}</td>
							<td style="background-color:#f2f2f2">风险等级</td>
							<td>${_loophole.level||'未定义'}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">CVE编号</td>
							<td>${_loophole.cid}</td>
							<td style="background-color:#f2f2f2">CNCVE编号</td>
							<td>${_loophole.nid}</td>
						</tr>
						<tr>
							<td width="100" style="background-color:#f2f2f2;">发现日期</td>
							<td colspan="4">${_loophole.ttime_create||''}</td>
						</tr>
					</tbody>
				</table>`;

			return _table;
		};
		
		let _getLoopholeStatus = function(_loophole){
			switch(_loophole.status){
				case 1:return '待处理';
				case 2:return '处理中';
				case 3:return '已处理';
				case 4:return '延期处理';
				case 5:return '不处理';
				case 9:return '已忽略';
			}
		}

		let _getLoopholeCollaItem = function (_loophole,_expand) {
			let sign = '';
			//标题上的原点颜色
			switch (_loophole.level) {
				case '低危':
					sign = "sign-info"; //普通色
					break;
				case '中危':
					sign = "sign-warning";//黄色
					break;
				case '高危':
					sign = "sign-drange";//红色
					break;
				default:
					break;
			}
			
			let _item =
				`<div class="layui-colla-item">
					<h2 class="layui-colla-title" style="display: flex;flex-direction: row;padding-right:0px;">
						<div style="width:100%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
							<div class="sign `+sign+`"></div>	
							<span>${ _loophole.title}</span>
						</div>
						<div style="min-width: 100px;justify-content: flex-end;line-height: 35px;">
							<span style="margin-top: 4px;display: block;">${ _getLoopholeStatus(_loophole)}</span>
						</div>
					</h2>
					<div class="layui-colla-content ` + (_expand ? `layui-show` : ``) + `">
						${ _getLoopholeInfo(_loophole)}
					</div>
				</div>`;
				
			return _item;
		};
		
		me.setAssetInfo = function(_elem, _asset){
			$(_elem).html(_asset.address);
		};

		me.addLoopholes = function (_elem, _loopholes) {
			_loopholes.forEach(function (_loophole, _index) {
				let _item = _getLoopholeCollaItem(_loophole,_index === 0);
				$(_elem).append(_item);
			});
		};		

		me.setCredentialInfo = function (e) {
			const detail = $('div.div-order-detail');
			
			detail.find('span.span-ttime').html(e['ttime_submit']);
			detail.find('span.span-name').html(e['name']);
			detail.find('span.span-phone').html(e['phone']);
			detail.find('span.span-department').html(e['department']);
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
			address:$('span.span-address').html(),
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
		//入库
		storage: function (_data) {
			const $ = layui.$;

			const params = getCredentialParams();

			$.extend(params, {
				result: true
			});

			events['action'].call(this, {
				params: params
			});
		},
		//驳回
		abandon:function(){
			const $ = layui.$;

			const params = getCredentialParams();

			if (params.comment.trim() === '') {
				layer.msg('工单驳回时，备注信息必填');
				return;
			}

			$.extend(params, {
				result: false
			});

			events['action'].call(this, {
				params: params
			});
		},
		action:function(e){			
			const helper = layui.helper;

			helper.ajax(api.action, {
				params: e.params
			}, function (response) {
				if (response.result) {
					helper.closeThisTab();
				}else{
					layer.msg(response.message);
				}
			});
		}
	};

	const initPageRender = function (callback) {
		const $ = layui.$;
		const form = layui.form;
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
			//工单信息
			instance.setCredentialInfo(response.message);
		});
		//资产列表
		helper.ajax(api.list, {
			params: {
				id: _params.businessId
			}
		}, function (response) {
			let instance = getInstance();
			
			let asset = response.list[0];
			
			_params.address = asset.address;
			
			instance.setAssetInfo('span.span-address',asset);
				
			instance.addLoopholes('div.div-loopholes',asset.loopholes);

			
			form.render();
			//渲染
			element.render('div.div-loopholes');
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

	const bindControlEvents = function (callback) {
		const $ = layui.$;
		const form = layui.form;
		//操作栏
		$('div.layui-card button.layui-btn:not(".submit,.upload")').click(function (e) {
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
	e("asset.repair.validate", {})
});
