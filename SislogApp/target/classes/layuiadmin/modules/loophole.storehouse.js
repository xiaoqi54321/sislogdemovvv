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

    let startTime = form.find('input[name=startTime]').val() == ""?"":Math.round(new Date(form.find('input[name=startTime]').val()).getTime()/1000);
    let endTime = form.find('input[name=endTime]').val() == ""?"":Math.round(new Date(form.find('input[name=endTime]').val()).getTime()/1000);

    that.map = {
      'params["cve_id"]': form.find('input[name=cveid]').val(),
      'params["cnnvd_id"]': form.find('input[name=cnnveid]').val(),
      'params["level"]': form.find('select[name=dangerlevel]').val(),
      'params["threat"]': form.find('select[name=intrusionmode]').val(),
      'params["date_start"]': startTime,
      'params["date_end"]': endTime,
    }
    that.tableid = "id-table-finance-assetslist";
    return that;
  }

  const initPageRender = function (requestRender) {
    const laydate = layui.laydate;
    const $ = layui.$;

    //日期控件
    lay('.layui-input-date').each(function () {
      laydate.render({
        elem: this,
        trigger: 'click'
      });
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
			var _show = function () { dd.slideDown(200); dt.addClass("cur"); s.css("z-index", z + 1); };   //展开效果
			var _hide = function () { dd.slideUp(200); dt.removeClass("cur"); s.css("z-index", z); };    //关闭效果
			dt.click(function () { dd.is(":hidden") ? _show() : _hide(); });
			dd.find("a").click(function () { _hide(); });     //选择效果（如需要传值，可自定义参数，在此处返回对应的“value”值 ）
			dd.find("button.btn-canel").click(function(){_hide();});
			$("body").click(function (i) { !$(i.target).parents(".select").first().is(s) ? _hide() : ""; });
		})

    requestRender();
  };

  layui.use(['alimx.table', 'element', 'laydate', 'helper', 'layer', 'form'], function () {
    const $ = layui.$;
    const table = layui.table;
    //页面初始化
    initPageRender(function () {
      //表格
      table.render({
        elem: '#' + params().tableid,
        height: 'full-145', //高度填满
        defaultToolbar: [], //工具栏右侧按钮，默认['filter','exports','print']
        url: '../../../cve/list.html', //数据请求URL
        data: [],
        cols: [[{
          field: 'id',
          title: 'id',
          minWidth: 120,
        }, {
          field: 'cve_id',
          title: 'cve编号',
          minWidth: 120
        }, {
          field: 'cnnvd_id',
          title: 'cnnvd编号',
          minWidth: 120,
          align: 'center',
          templet: function (res) {
            return res.cnnvd_id;
          }
        }, {
          field: 'title',
          title: '漏洞名称',
          minWidth: 170,
          align: 'center',
          templet: function (res) {
            return res.title
          }
        }, {
          field: 'level',
          title: '威胁程度',
          minWidth: 170,
          align: 'center',
        }, {
          field: 'threat',
          title: '入侵方式',
          minWidth: 170,
          align: 'center',
        }, {
          field: 'description',
          title: '漏洞描述',
          minWidth: 500,
          align: 'center'
        }
        ]],
        page: true, //开启分页 
        where: params().map,
        done: function () {
          $("[data-field='id']").css('display', 'none');//隐藏列
        }
      });
    });
  });
  e("loophole.storehouse", {})
});
