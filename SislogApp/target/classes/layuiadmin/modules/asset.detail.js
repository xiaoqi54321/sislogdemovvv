layui.define(function (e) {
	const _params = {};

	const api = {
		info: '../../hai/asset/info/single.html',
	};

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

	const events = {
		/**
		 * @ obj.code  {code码}
		 * @ obj.selected  {selectname索引}
		 */
		select_respons: function (res) {
			const $ = layui.$;
			const helper = layui.helper;
			const form = layui.form;
			helper.ajax("../../common/1/option/getOptions.html", {
				cache: false,
				code: res.code
			}, function (response) {
				$.each(response.list, function (index, item) {
					let obj = {};
					obj.expr = "select[name=" + res.selected + "]";
					obj.text = item.name;
					obj.val = item.value;
					//obj.val = item.value;
					helper.addOption(obj);
				});
				form.render('select');
			});
		}
	};

	function getInstance() {
		const $ = layui.$;
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
					</h2>
					<div class="layui-colla-content ` + (_expand ? `layui-show` : ``) + `">
						${ _getLoopholeInfo(_loophole)}
					</div>
				</div>`;
				
			return _item;
		};

		me.addLoopholes = function (_elem, _loopholes) {
			_loopholes.forEach(function (_loophole, _index) {
				let _item = _getLoopholeCollaItem(_loophole,_index === 0);
				$(_elem).append(_item);
			});
		}
		return me;
	}

	const initAssetInfo = function (info) {
		const $ = layui.$;
		const table = layui.table;
		const element = layui.element;
		
		const elem = $('div.div-info');
		
		elem.find('h4.address').html(info.address);
		elem.find('h4.name').html(info.name);
		
		elem.find('p.cnt_services').html(info.services.length);
		elem.find('p.cnt_loopholes').html(info.loopholes.length);
		elem.find('span.product').html(info.main_class);
		elem.find('span.department').html(info.department);
		elem.find('span.security_manager').html(info.security_manager);
		elem.find('span.security_phone').html(info.security_phone);
		elem.find('span.report_date').html(info.report_date);
		
		
		let instance = getInstance();
				
				instance.addLoopholes('div.div-loopholes',info.loopholes);
				
				//渲染
				element.render('div.div-loopholes');

		//服务
		table.render({
			elem: '#id-table-services',
			height: 'full-105', //高度填满
			defaultToolbar: ['filter'], //工具栏右侧按钮，默认['filter','exports','print']
			toolbar:true,
			data:info.services,
			cols: [[{
								type: 'numbers',
								fixed: 'left'
							}, {
								field: 'protocol',
								title: '协议',
								width: 120,
								align: 'center',
							}, {
								field: 'port',
								title: '端口',
								width: 80,
								align: 'center',
							}, {
								field:'manage',
								title: '是否后台管理端口',
								width: 150,
								align: 'center',
								hide:true,
								templet: function (res) {
									return (res.manage === 1 || res.manage === true) ? '是' : '否';
								}
							}, {
								field:'self',
								title: '是否系统自带服务',
								width: 150,
								align: 'center',
								hide:true,
								templet: function (res) {
									return (res.self === 1 || res.self === true) ? '是' : '否';
								}
							}, {
								field: 'name',
								title: '软件名称',
								minWidth: 140,
								align: 'left',
							}, {
								field: 'version',
								title: '软件版本',
								width: 100,
								align: 'left',
							}, {
								title: '是否Web服务',
								width: 120,
								align: 'center',
								templet: function (res) {
									return (res.web === 1 || res.web === true) ? '是' : '否';
								}
							}, {
								title: '状态',
								width: 80,
								align: 'center',
								templet: function (res) {
									switch(res.status)
											{
											case 1:
											  return '入库'
											  break;
											case 2:
											return '新增'
											  break;
										    case 3:
											return '变更中'
											  break;
											  case 4:
											return '移除中'
											  break;
											case 5:	
											return '待稽核'
											  break;
											  case 6:
											return '稽核中'
											  break;
											case 9:
											return '已删除'
											  break;  
											default:
											  return '--'
											}
									
									
									
								}
							},{
								title: '域名地址',
								width: 180,
								align: 'left',
								templet: function (res) {
									return (res.web === 1 || res.web === true) ? res.domain : '--'
								}
							}, {
								field:'cverscontainerion',
								title: '是否中间件',
								width: 120,
								align: 'center',
								hide:true,
								templet: function (res) {
									return (res.container === 1 || res.container === true) ? '是' : '否';
								}
							}, {
								field:'cname',
								title: '中间件名称',
								width: 240,
								align: 'center',
								hide:true,
								templet: function (res) {
									return (res.container === 1 || res.container === true) ? res.cname : '--'
								}
							}, {
								field:'cversion',
								title: '中间件版本',
								width: 120,
								align: 'center',
								hide:true,
								templet: function (res) {
									return (res.container === 1 || res.container === true) ? res.cversion : '--'
								}
							}
				]],
			page: false, //开启分页
		});
	};

	const initPageRender = function (callback) {
		const $ = layui.$;
		const table = layui.table;
		const helper = layui.helper;

		//获取资产信息
		helper.ajax(api.info, {
			params: {
				address: _params.address
			}
		}, function (response) {
			if (response.result) {
				initAssetInfo(response.message);
			} else {
				layer.msg(response.message);
			}
		})

		if ($.isFunction(callback)) {
			callback();
		}
	};

	const bindControlEvents = function (callback) {
		const $ = layui.$;

		//手风琴下拉框的点击事件
		$(".loophole-items > .layui-colla-item > h2 > .btngroup > button").click(function (e) {
			e.stopPropagation();
			if ($(this).hasClass('handle')) {
				// 已处理
				//alert('已处理'+$(this).data("value"));
			} else if ($(this).hasClass('ignore')) {
				// 忽略
				//alert('忽略'+$(this).data("value"));
			}

			//提交成功以后 修改按钮
			let hand = {
				isstate: 0
			};
			$(this).parent().html(params().addhand(hand));
		});

		if ($.isFunction(callback)) {
			callback();
		}
	};

	layui.use(['alimx.table', 'helper', 'layer'], function () {
		//必要参数
		initURLParams();

		//页面初始化
		initPageRender(function () {
			bindControlEvents(function () {});
		});
	});
	
	e("asset.detail", {})
});
