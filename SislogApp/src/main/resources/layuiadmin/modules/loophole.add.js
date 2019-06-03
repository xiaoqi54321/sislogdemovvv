layui.define(function (e) {
	const _params = {};

	const api = {
		ignore: '',//点击列表忽略提交的api
		workOrder: '',//工单信息api
		workOrderInfo: '',//工单详情
	};

	function getInstance() {
		const $ = layui.$;
		let me = {};

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
			if (hand.ignore == 0) {
				str = `<div class="layui-form"><input type="checkbox" value="${hand.gnoreid}" lay-filter="che" name="aaa" title="忽略" checked /></div>`
			} else if (hand.ignore == 1) {
				str = `<div class="layui-form"><input type="checkbox" value="${hand.gnoreid}" lay-filter="che" name="aaa" title="忽略" /></div>`
			}
			return str;
		}

		me.addAssets = function (_elem, _assets) {
			_assets.forEach(function (_asset, _index) {
				let _item = addAsset($.extend(_asset, {
							title: _asset.info.name
						}), _index === 0);
				$(_elem).append(_item);
			});
		}
		return me;
	}
	const events = {
		//提交
		submit: function () {
			const $ = layui.$;
			const helper = layui.helper;
			let panel = $("div.div-order-detail");
			let info = {};
			info.adminName = panel.find("input[name=adminname]").val();
			info.admincontact = panel.find("input[name=admincontact]").val();
			info.workordertime = panel.find("input[name=workordertim]").val();
			info.workorderdsc = panel.find("textarea[name=workorderdsc]").val();
			layer.msg(JSON.stringify(info));
			let map = {
				"params['name']":info.adminName,
				"params['contact']":info.admincontact,
				"params['ordertime']":info.workordertime,
				"params['dsc']":info.workorderdsc,
			}
			helper.ajax(api.workOrderInfo,map,function(){
				layer.alert("成功");
			},function(){
				layer.alert("失败");
			});
		},
	};
	

	const initPageRender = function (requestRender) {
		const $ = layui.$;
		const element = layui.element;
		const form = layui.form;
		const laydate = layui.laydate;

		let info = {
			adminName:'管理员',
			adminContact:'管理员联系方式',
			time: "2019-01-01 00:00:00",
			des: `资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产
		新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增资产新增`
		};
		form.on('checkbox(che)', function(data){
			const helper = layui.helper;
			//阻止事件冒泡
			layui.stope(window.event);
			console.log(data.value); //复选框value值，也可以通过data.elem.value得到
			let map = {
				"params['id']":data.value
			}
			helper.ajax(api.ignore, map ,function(response){
				layer.alert(response);
			},function(response){
				layer.alert(response);
			});
		}); 

		let instance = getInstance();

		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click'
			});
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
		form.render();
        element.render('div.div-assets');
        if ($.isFunction(requestRender)) {
			requestRender();
		}
	};

	const initURLParams = function () {
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

		//下发工单
		$('button.layui-btn.btn-submit').click(function () {
			events['submit'].call(this);
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
			bindControlEvents(function () { });
		});
	});
	e("loophole.addworkorder", {})
});
