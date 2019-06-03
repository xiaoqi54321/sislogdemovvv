layui.define(function (e) {
	const events = {
		search: function () {
			const table = layui.table;
			//执行重载
			table.reload(params().tableid, {
				page: {
					curr: 1 //重新从第 1 页开始
				},
				where: params().map
			});
		}
	};

	const params = function () {
		let that = {};
		const $ = layui.$;
		const form = $('.layui-card.layui-form.div-scanning-list');

		let startTime = form.find('input[name=startTime]').val() == "" ? "" : Math.round(new Date(form.find('input[name=startTime]').val()).getTime() / 1000);
		let endTime = form.find('input[name=endTime]').val() == "" ? "" : Math.round(new Date(form.find('input[name=endTime]').val()).getTime() / 1000);

		that.map = {
			
			'params["cve_id"]': form.find('input[name=cveid]').val(),
			'params["cnnvd_id"]': form.find('input[name=cnnveid]').val()
		}
		
		that.tableid = "id-table-database-cve";
		return that;
	}

	const initPageRender = function (requestRender) {
		const $ = layui.$;
		const table = layui.table;
		const laydate = layui.laydate;

		//日期控件
		lay('.layui-input-date').each(function () {
			laydate.render({
				elem: this,
				trigger: 'click'
			});
		});

		//表格
		table.render({
			elem: '#' + params().tableid,
			height: 'full-95', //高度填满
			defaultToolbar: [], //工具栏右侧按钮，默认['filter','exports','print']
			url: '../view/deriveList', //数据请求URL
			cols: [[{
						field: 'ReceivedAt',
						title: '访问时间',
						align: 'center',
						width: 140
					}, {
						field: 'FromHost',
						title: '访问来源端口',
						width: 250,
						align: 'left',
			        }, {
						field: 'accessingPathWay',
						title: '访问方式',
						width: 160,
						align: 'center',
					}, {
						field: 'fromIp',
						title: '访问来源IP',
						width: 100,
						align: 'center',
					}
				]],
			page: true, //开启分页
			where: params().map
		});
		//查询
		$('.layui-btn.btn-search').click(function () {
			events['search'].call(this);
		});
		$(".select").each(function () {
			var s = $(this);
			var z = parseInt(s.css("z-index"));
			var dt = $(this).children("dt");
			var dd = $(this).children("dd");
			var _show = function () {
				dd.slideDown(200);
				dt.addClass("cur");
				s.css("z-index", z + 1);
			}; //展开效果
			var _hide = function () {
				dd.slideUp(200);
				dt.removeClass("cur");
				s.css("z-index", z);
			}; //关闭效果
			dt.click(function () {
				dd.is(":hidden") ? _show() : _hide();
			});
			dd.find("a").click(function () {
				_hide();
			}); //选择效果（如需要传值，可自定义参数，在此处返回对应的“value”值 ）
			dd.find("button.btn-canel").click(function () {
				_hide();
			});
			$("body").click(function (i) {
				!$(i.target).parents(".select").first().is(s) ? _hide() : "";
			});
		})

		requestRender();
	};

	layui.use(['alimx.table', 'laydate'], function () {
		const $ = layui.$;
		const table = layui.table;
		//页面初始化
		initPageRender(function () {});
	});
	e("database.cve", {})
});
