layui.define(function (e) {
	const initPageOptions = function () {
		const $ = layui.$;
		const form = layui.form;
		const helper = layui.helper;
		//渲染
		//form.render();
	};
	
	const _params = {};

	const api = {
		info:'../../../hai/asset/info/single.html',
		submit: '../../../hai/asset.repair/single.html',
	};

	const events = {
		close:function(){
			const helper = layui.helper;
			
			helper.closeThisTab();
		},
		submit: function (data) {
			const helper = layui.helper;

			helper.ajax(api.submit, {
				params: data
			}, function (response) {
				if (response.result) {
					layer.msg('工单已下发，请注意跟踪工单进展。', function(){
						helper.closeThisTab();
					});
				} else {
					layer.msg(response.message);
				}
			});
		}
	};
	
	function getInstance() {
		const $ = layui.$;
		const form = layui.form;
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
						<div style="display: flex;min-width: 100px;justify-content: flex-end;padding-top: 2px;">
							<input type="checkbox" data-cid="${_loophole.cid}" value="9" class="layui-checkbox input-checkbox-loophole-action" lay-filter="filter-checkbox-loophole-action" title="忽略" />
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
			form.render();
		}
		return me;
	}

	//页面加载初始化
	const initPageRender = function (callback) {
		const $ = layui.$;
		const laydate = layui.laydate;
		const element = layui.element;
		const helper = layui.helper;

		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click',
				format: 'yyyy-MM-dd',
				value: new Date()
			});
		});

		//动态选项类数据初始化，包含select，radio，checkbox
		initPageOptions();		
		
		//资产信息
		helper.ajax(api.info, {
			params: {
				address: _params.address
			}
		}, function (response) {
			if(response.result){
				let instance = getInstance();				
				
				$('span.span-title').html(_params.address);
				
				instance.addLoopholes('div.div-loopholes',response.message.loopholes);
				
				//渲染
				element.render('div.div-loopholes');
			}else{
				layer.msg(response.message);
			}
		});

		if ($.isFunction(callback)) {
			callback();
		}
	}

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

	const bindControlEvents = function (callback) {
		const $ = layui.$;
		const form = layui.form;

		//功能按钮：流程发布、关闭
		$('div.layui-card button.layui-btn:not(".submit,.upload")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
		});
		
		form.on('checkbox(filter-checkbox-loophole-action)', function(e){
			const helper = layui.helper;
			//阻止事件冒泡
			layui.stope(window.event);
		});

		//提交
		form.on('submit(filter-form-asset-repair)', function (e) {
			
			const actions = $('input[type=checkbox].layui-checkbox.input-checkbox-loophole-action');
			const loopholes = [];
			
			$.each(actions,function(_index,_action){
				const me = $(_action);
				const checked = me[0].checked;
				const value = me.val();
				
				loopholes.push({address:_params.address,cid:me.data('cid'),action:(checked?value:2)});
			});
			
			const params = $.extend(e.field, {
				title: '资产漏洞修复-' + _params.address,
				submit:true,
				address: _params.address,
				loopholes:JSON.stringify(loopholes)
			});
			
			events['submit'].call(this,params);
			
			return false;
		});

		if ($.isFunction(callback)) {
			callback();
		}
	}

	layui.use(['index', 'form', 'laydate','element', 'helper'], function () {
		
		initURLParams();
		
		initPageRender(function () {
			bindControlEvents(function () {});
		});
	}),

	e("asset.repair.init", {})
})
