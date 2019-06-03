layui.define(function (e) {
    const api = {

    }
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
		del: function (data) {
			const $ = layui.$;
			const helper = layui.helper;

			if (data.gateway || data.result) {
				data.result = (data.result === 'on' ? true : false);
			}

			helper.ajax('../../finance/reimburse/action.html', {
				params: data
			}, function (response) {
				const panel = $('div.layui-view-model.view-process');
				if (response.result) {
					layer.close(panel.attr('layer-id'));
				}
			});
		},
		transfer: function (data) {
			const $ = layui.$;
			const form = layui.form;
			const panel = $('div.layui-view-model.view-instance');
			const assetsitem = panel.find('.layui-card');

			//返回的结果集
			let assets = {
				assetsName: '资产名称',
				assetsType: "web服务",
				assetsSystem: "window",
				macAddr: 'TE-EW-32-GD-YT-YT-EE',
				assetsPersion: "zhangsan",
				assetsType: "firewall",//资产类型
				assetsGroup: "guangdong",
				assetsRemark: '资产描述'
			};

			layer.open({
				type: 1,
				title: "组编辑",
				area: ['500px', ''],
				shade: 0.5,
				scrollbar: false,
				resize: false,
				content: panel,
				success: function (options, index) {
					assetsitem.find("input[name=assetsname]").val(assets.assetsName);
					assetsitem.find("select[name=assetsSystem]").val(assets.assetsSystem);
					assetsitem.find("input[name=macAddr]").val(assets.macAddr);
					assetsitem.find("select[name=assetsPersion]").val(assets.assetsPersion);
					assetsitem.find("select[name=assetsType]").val(assets.assetsType);
					assetsitem.find("select[name=assetsGroup]").val(assets.assetsGroup);
					assetsitem.find("textarea[name=assetsRemark]").html(assets.assetsRemark);
					form.render("select");
				},
				end: function () { },
				cancel: function () { }
			});
		},
	};

	const params = function () {
		const $ = layui.$;
		let that = {};
		that.map = {
			params: {}
		};
		that.server = function () {
			console.log('服务的查询条件');
		}
		that.warning = function () {
			console.log('告警的查询条件');
		}
		return that;
	}


	const initPageRender = function (bindControlEvents) {
		const laydate = layui.laydate;
		
        
        if ($.isFunction(bindControlEvents)) {
			bindControlEvents();
		}
    };
    
    const bindControlEvents = function(callback){
        const table = layui.table;


        
		//服务
		table.render({
			elem: '#id-table-assetsGroup',
			height: 'full-145', //高度填满
			defaultToolbar: [], //工具栏右侧按钮，默认['filter','exports','print']
			//url: '../../layuiadmin/modules/data.json', //数据请求URL
			data: [{
				"id": 1,
				"assetsIp": '资产IP',
				"assetsName": "资产名称",
				"assetsType": "资产类型",
				"assetsOs": "操作系统",
				"assetsDepartment": "归属部门",
				"assetsPerson": "责任人",
				"assetsTime": "资产发现时间",
			}
			],
			title: '服务', //标题，导出、打印时会依据该配置生成文件名
			cols: [[{
				type: 'checkbox',
				fixed: 'left',
			},{
				field: 'assetsIp',
				title: '资产IP',
                minWidth: 20,
                align: 'center',
				templet: function (res) {
                    if (res.assetsIp == undefined) {
                        return "--";
                    }
					return res.assetsIp;
				}
			}, {
				field: 'assetsName',
				title: '资产名称',
				minWidth: 120,
				align: 'center',
				templet: function (res) {
                    if (res.assetsName == undefined) {
                        return "--";
                    }
					return res.assetsName;
				}
			}, {
				field: 'assetsType',
				title: '资产类型',
				minWidth: 100,
				align: 'center',
				templet: function (res) {
                    if (res.assetsType == undefined) {
                        return "--";
                    }
					return res.assetsType;
				}
			}, {
				field: 'assetsOs',
				title: '操作系统',
                minWidth: 100,
                align: 'center',
				templet: function (res) {
                    if (res.assetsOs == undefined) {
                        return "--";
                    }
					return res.assetsOs;
				}
			}, {
				field: 'assetsDepartment',
				title: '归属部门',
				width: 200,
				align: 'center',
				templet: function (res) {
                    if (res.assetsDepartment == undefined) {
                        return "--";
                    }
					return res.assetsDepartment;
				}
			}, {
				field: 'assetsPerson',
				title: '责任人',
				width: 100,
				align: 'center',
				templet: function (res) {
                    if (res.assetsPerson == undefined) {
                        return "--";
                    }
					return res.assetsPerson;
				}
			}, {
				field: 'assetsTime',
				title: '资产发现时间',
				width: 160,
				align: 'center',
				templet: function (res) {
                    if (res.assetsTime == undefined) {
                        return "--";
                    }
					return res.assetsTime;
				}
			}
			]],
			page: true, //开启分页
			where: params().server(),
        });
        if ($.isFunction(callback)) {
			callback();
		}
    }

	layui.use(['alimx.table', 'laydate', 'helper', 'layer', 'form', 'echarts'], function () {
		const $ = layui.$;

		//页面初始化
		initPageRender(bindControlEvents(function(){}));
		
		$(".select").each(function(){
		var s=$(this);
		var z=parseInt(s.css("z-index"));
		var dt=$(this).children("dt");
		var dd=$(this).children("dd");
		var _show=function(){dd.slideDown(200);dt.addClass("cur");s.css("z-index",z+1);};   //展开效果
		var _hide=function(){dd.slideUp(200);dt.removeClass("cur");s.css("z-index",z);};    //关闭效果
		dt.click(function(){dd.is(":hidden")?_show():_hide();});
		dd.find("a").click(function(){_hide();});     //选择效果（如需要传值，可自定义参数，在此处返回对应的“value”值 ）
		$("body").click(function(i){ !$(i.target).parents(".select").first().is(s) ? _hide():"";});
	})
		
	});
	e("assets.list.group", {})
});
