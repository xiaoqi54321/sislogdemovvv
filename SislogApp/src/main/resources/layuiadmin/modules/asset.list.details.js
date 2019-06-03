layui.define(function (e) {
	const events = {
		add: function (data) {
			const $ = layui.$;
			const helper = layui.helper;

			helper.ajax('../../finance/reimburse/add.html', {
				params: {
					amount: Math.ceil(Math.random() * 10000)
				}
			}, function (response) {
				events['search'].call(this);
			});
		},
		process: function (data) {
			const $ = layui.$;
			const helper = layui.helper;

			if (data.gateway || data.result) {
				data.result = (data.result === 'on' ? true : false);
			}
			//这是个请求是？？？？？  完成节点任务？？？
			helper.ajax('../../finance/reimburse/action.html', {
				params: data
			}, function (response) {
				const panel = $('div.layui-view-model.view-process');
				if (response.result) {
					layer.close(panel.attr('layer-id'));
				}
			});
		},
		instance: function (data) {
			const $ = layui.$;
			const form = layui.form;
			const panel = $('div.layui-view-model.view-instance');
			const assetsitem = panel.find('.layui-card');

			layer.open({
				type: 1,
				title: "资产详情",
				area: ['500px', '500px'],
				btn:['确定','取消']
				,yes:function(_index){
					const panel = $('div.layui-view-model.view-instance');
					const assetsitem = panel.find('.layui-card');
					const helper = layui.helper;
					helper.ajax(api.update, {
						'params["id"]': params().id(),
						'params["name"]': assetsitem.find("input[name=assetsname]").val(),
						'params["mac"]': assetsitem.find("input[name=macAddr]").val(),
						'params["os"]': assetsitem.find("select[name=assetsSystem]").val(),
						'params["responsible"]': assetsitem.find("input[name=assetsPersion]").val(),
						'params["product"]': assetsitem.find("select[name=assetsType]").val(),
						'params["group"]': assetsitem.find("select[name=assetsGroup]").val(),
						'params["dsc"]': assetsitem.find("textarea[name=assetsRemark]").val(),
						}, function (response) {
							layer.msg(response.message.message);
							layer.close(_index);
						})
				},btn2:function(_index){
					layer.close(_index);
				},
				btnAlign: 'c', 
				shade: 0.5,
				scrollbar: false,
				resize: false,
				content: panel,
				success: function (options, index) {
					console.log("obj.group = " + JSON.stringify(data.info.group));
					assetsitem.find("input[name=assetsname]").val(data.info.name);
					assetsitem.find("input[name=macAddr]").val(data.info.mac);
					assetsitem.find("input[name=assetsPersion]").val(data.info.last_user_login);
					assetsitem.find("select[name=assetsSystem]").find("option:contains('"+(data.info.assetsSystem == undefined) ? "-1" : data.info.assetsSystem+"')").attr("selected",true);
					assetsitem.find("select[name=assetsType]").find("option:contains('"+(data.info.product == undefined) ? "-1" : data.info.product+"')").attr("selected",true);
					assetsitem.find("select[name=assetsGroup]").find("option:contains('" + (data.info.group == undefined) ? "-1" : data.info.group +"')").attr("selected",true);
					assetsitem.find("textarea[name=assetsRemark]").val(data.info.assetsRemark);
					form.render("select");
				},
				end: function () { },
				cancel: function () { }
			});
		},
		requestSelect: function (res) {
			const $ = layui.$;
			const helper = layui.helper;
			const form = layui.form;
			helper.ajax("../../../common/1/option/getOptions.html", {
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

	const api = {
		assestInfo: '../../../blackHawk/asset/info.html',
		loophole: '../../../blackHawk/asset/loophole/list.html',
		server: '../../../blackHawk/asset/service/list.html',
		update:'../../../blackHawk/asset/update.html'
	};
	
	const params = function () {
		const helper = layui.helper;
		let that = {};
		that.map = {}
		let additemcontent = function (content) {
			let str = `<table class="layui-table">
			<thead>
				<tr>
					<td width="100">详细描述：</td>
					<td>${content.description}</td>
				</tr>
				<tr>
					<td>入侵方式：</td>
					<td>${content.intrusionmode}</td>
				</tr>
				<tr>
						<td>风险等级：</td>
						<td>${content.risklevel}</td>
					</tr>
				<tr>
					<td>报告来源：</td>
					<td>${content.reference}</td>
				</tr>
				<tr>
					<td>发现日期：</td>
					<td>${content.discoverytime}</td>
				</tr>
				<tr>
					<td>CVE编号：</td>
					<td>${content.cveid}</td>
				</tr>
				<tr>
					<td>CNCVE编号：</td>
					<td>${content.cncveid}</td>
				</tr>
			</thead>
	</table>`;
			return str;
		}
		that.additems = function (obj) {
			let sign = "sign-success";
			//标题上的原点颜色
			switch (obj.titlestate) {
				case '低危':
					sign = "sign-success";//绿色
					break;
				case 1:
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
			let str = `<div class="layui-colla-item">
			<h2 class="layui-colla-title" style="display: flex;flex-direction: row;">
				<div style="width:50%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
						<div class="sign `+ sign + `"></div>
						<span>${ obj.title}</span>
				</div>
				<div class="btngroup" style="width:50%;display: flex;flex-direction: row;justify-content: flex-end;">`+ that.addhand(obj.hand) + `</div>
			</h2>
			<div class="layui-colla-content">
				${ additemcontent(obj.content)}
			</div>
		</div>`;
			return str;
		}
		/**
		 * hand.isstate 判断是否标记为已处理 0已经处理  1未处理
		 * hand.id 点击忽略和已处理传递的id
		 */
		that.addhand = function (hand) {
			let str = undefined;
			if (hand) {
				if (hand.isstate == 0) {
					str = `<button class="layui-btn layui-btn-primary">已处理</button>`
				} else if (hand.isstate == 1) {
					str = `<span style="float: right;">标记为：</span>
					<button data-value="${hand.id}" class="layui-btn layui-btn-danger ignore">忽略</button>
					<button data-value="${hand.id}" class="layui-btn handle">已处置</button>`
				}
				return str;
			}
		}
		that.id = function () {
			return helper.getParamValue("id");
		}
		that.tableid = "id-table-assets";
		that.tablewarningid = "id-table-warning";
		return that;
	};
	//页面初始化获取资产ID
	params().map = {
		'params["id"]': params().id() //资产IP
	};

	//初始化资产详情
	const initAssetsInfo = function (obj, $) {
		$('.assname').html(obj.name);
		$('.assip').html(obj.ip);
		$('.asspersion').html(obj.last_user_login);
		$('.asslastTime').html(obj.last_time_login);
		$('.assphone').html(obj.phone);
		$('.assemail').html(obj.email); //邮箱
		$('.assdepar').html(obj.group); //部门
		$('.assmac').html(obj.mac);
		$('.asstype').html(obj.product);
		$('.asscreate').html(obj.first_time);
		$('.assremark').html(obj.dsc);
	};

	const bindControlEvents = function () {
		const $ = layui.$;
		const table = layui.table;
		const helper = layui.helper;
		const element = layui.element;
		const assetsinfo = {
			id: params().id(),
			name: undefined,
			department: undefined,
			responsible: undefined,
			group: undefined,
			phone: undefined,
			email: undefined,
			ip: undefined,
			mac: undefined,
			product: undefined,
			dsc: undefined,
			last_user_login: undefined,
			first_time: undefined,
			last_time: undefined,
			alive: undefined
		}

		//服务
		table.render({
			elem: '#' + params().tableid,
			height: 'full-145', //高度填满
			defaultToolbar: [], //工具栏右侧按钮，默认['filter','exports','print']
			url: api.server, //数据请求URL
			cols: [[{
				field: 'id',
				title: 'id',
				minWidth: 20,
			}, {
				field: 'name',
				title: '服务名称',
				minWidth: 120,
				align: 'center',
			}, {
				field: 'protocol',
				title: '协议',
				minWidth: 100,
				align: 'center',
			}, {
				field: 'port',
				title: '端口',
				minWidth: 100,
			}, {
				field: 'product',
				title: '应用',
				width: 200,
				align: 'center',
			}, {
				field: 'version',
				title: '版本',
				width: 100,
				align: 'center',
				templet: function (res) {
					return res.version;
				}
			}, {
				field: 'cpe',
				title: 'cpe',
				width: 160,
				align: 'center',
				templet: function (res) {
					if (res.cpe == undefined) {
						return '--';
					}
					return res.cpe;
				}
			}, {
				field: 'alive',
				title: '是否存活',
				width: 100,
				align: 'center',

			}, {
				field: 'dsc',
				title: '描述	',
				width: 140,
				align: 'center',

			}, {
				field: 'cnt_loophole',
				title: '风险数',
				width: 140,
				align: 'center',
			}
			]],
			page: true, //开启分页
			where: params().map,
			done:function(){
				$("[data-field='id']").css('display', 'none');//隐藏列
			}
		});

		//获取资产信息
		helper.ajax(api.assestInfo, {
			'params["id"]': params().id()
			}, function (response) {
			console.log("response = "+JSON.stringify(response));
			if (response.data) {
				assetsinfo.name = response.data.name;
				assetsinfo.department = response.data.department;
				assetsinfo.responsible = response.data.responsible;
				assetsinfo.group = response.data.group;
				assetsinfo.phone = response.data.phone;
				assetsinfo.email = response.data.email;
				assetsinfo.ip = response.data.ip;
				assetsinfo.mac = response.data.mac;
				assetsinfo.product = response.data.product;
				assetsinfo.dsc = response.data.dsc;
				assetsinfo.last_user_login = response.data.last_user_login;
				assetsinfo.first_time = response.data.first_time;
				assetsinfo.last_time = response.data.last_time;
				assetsinfo.alive = response.data.alive;
				assetsinfo.assetsSystem=response.data.os;				
				initAssetsInfo(assetsinfo, $);
			}

		});

		//风险列表
		helper.ajax(api.loophole, {
			'params["id"]': params().id()
			}, function (response) {
			//console.log("list = " + JSON.stringify(response.list));
			$.each(response.list, function (index, itemForResponse) {
				let item = {};
				item.title = itemForResponse.patch;
				item.titlestate = itemForResponse.level;
				item.hand = {};
				item.hand.id = index; //点击触发事件以后传递的索引id
				item.hand.isstate = itemForResponse.processed; //是否标记为已处理 0已经处理  1未处理

				item.content = {};
				item.content.describe = itemForResponse.description;
				item.content.intrusionmode = itemForResponse.threat;
				item.content.risklevel = itemForResponse.level;
				item.content.reference = itemForResponse.reference
				item.content.discoverytime = itemForResponse.create_time;
				item.content.cveid = itemForResponse.cve_id;
				item.content.cncveid = itemForResponse.cnnvd_id;
				$(".loophole-items").append(params().additems(item));

				element.render('.loophole-items');
			})
		});

		//资产分类列表
		let objAsset = {
			code: 'NSSA_ASSET_PRODUCT_FILTER',
			selected: "assetsType"
		};

		events["requestSelect"].call(this, objAsset);

		//资产分组
		let objAssetGroup = {
			code: 'NSSA_ASSET_GROUP_FILTER',
			selected: "assetsGroup"
		};

		events["requestSelect"].call(this, objAssetGroup);

		let objAssetOs = {
			code: 'NSSA_ASSET_OS',
			selected: "assetsSystem"
		};

		events["requestSelect"].call(this, objAssetOs);
		element.render('.loophole-items');
	};

	const initPageRender = function (callback) {
		const laydate = layui.laydate;
		const $ = layui.$;
		console.log("id= "+getQueryString("id"));

		$("button.btn-canel").click(function () {
			layer.close(layer.index);
		});

		$('.instance').click(function () {
			let obj = {};
			obj.info = assetsinfo;
			events["instance"].call(this, obj);
		});

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

		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click',
			});
		});

		//查询
		$('.layui-form.div-finance-reimburse-list .layui-btn.btn-search').click(function () {
			events['search'].call(this);
		});

		if ($.isFunction(callback)){
			callback();
		}
	};

	layui.use(['alimx.table', 'laydate', 'helper', 'layer', 'form'], function () {
		//页面初始化
		initPageRender(function(){
			bindControlEvents(function(){ })
		});
	});
	e("asset.list.details", {});
});
