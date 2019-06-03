layui.define(function (e) {
    const api = {
        list: '../../blackHawk/deptment/getDeptmentList.html', //表格api
        add: '../../blackHawk/deptment/addDeptment.html',//添加
        edit: '../../blackHawk/deptment/updateDeptment.html',//修改
        del: '../../blackHawk/deptment/deleteDeptment.html',//删除
        options: '../../common/1/option/getOptions.html'
    }
    //事件
    const events = {
        search: function () {
            events["reload"].call(this);
        },
        departmentSubmit: function (obj) {
            //接到的参数
            let data = obj.data;
            const helper = layui.helper;
            const $ = layui.$;
            const panel = $(".view-department");
            let subType = panel.attr("type");
            if (subType == 'add') {
                let params = {
                    'params["department"]': data.department,
                    'params["province"]': data.dep_province
                };

                helper.ajax(api.add, params, function (response) {
                    layer.alert(response.message.message, function () {
                        events["reload"].call(this);
                        layer.closeAll();
                    });
                });
            } else if (subType == 'edit') {
                let params = {
                    'params["id"]': panel.attr("deparid"),
                    'params["department"]': data.department,
                    'params["province"]': data.dep_province
                };
                helper.ajax(api.edit, params, function (response) {
                    layer.alert(response.message.message, function () {
                        events["reload"].call(this);
                        layer.closeAll();
                    });

                });
            }
        },
        close: function () {
            layer.closeAll();
        },
        edit: function (obj) {
            const $ = layui.$;
            const form = layui.form;
            const panel = $(".view-department");
            panel.attr("type", 'edit');
            panel.attr("deparid", obj.id);
            form.val("department", {
                "province": obj.province,
                "department": obj.department,
            });
            layer.open({
                type: 1,
                title: '修改部门',
                area: ['400px'],
                shade: 0.5,
                scrollbar: false,
                resize: false,
                content: panel,
                success: function () {
                },
                end: function () { },
                cancel: function () { }
            });
        },
        del: function (obj) {
            const helper = layui.helper;
            layer.open({
                content: '是否删除信息？',
                btn: ['是', '否'],
                yes: function () {
                    let params = {
                        'params["id"]': obj.id
                    };
                    helper.ajax(api.del, params, function (response) {
                        layer.alert(response.message.message, function () {
                            events.reload();
                            layer.closeAll();
                        });
                    });
                },
                btn2: function () {
                    layer.closeAll();
                }
            });
        },
        add: function () {
            const $ = layui.$;
            const form = layui.form;
            const panel = $(".view-department");
            panel.attr("type", 'add');
            form.val("department", {
                "province": '',
                "department": '',
            });
            layer.open({
                type: 1,
                title: '添加部门',
                area: ['400px'],
                shade: 0.5,
                scrollbar: false,
                resize: false,
                content: panel,
                success: function () {
                },
                end: function () { },
                cancel: function () { }
            });
        },
        reload: function () {
            const table = layui.table;
            const $ = layui.$;
            //执行重载
            table.reload('id-table-department', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    'params["department"]': $(".form-department").find("input[name=department]").val()
                }
            });
        },
        options: function (e) {
            const $ = layui.$;
            const helper = layui.helper;
            const form = layui.form;
            helper.ajax(api.options, {
                cache: false,
                code: e.code
            }, function (response) {
                $.each(response.list, function (index, item) {
                    let conf = {};
                    conf.expr = e.elem;
                    conf.text = item.name;
                    conf.val = item.value;
                    helper.addOption(conf);
                });
                form.render('select');
            });
        }
    };

    const province = [
        "青海","北京","天津","河北",
        "山西","内蒙古", "辽宁", "吉林", 
        "黑龙江", "上海", "江苏", "浙江", 
        "安徽", "福建", "江西", "山东", 
        "河南", "湖北", "湖南", "广东", 
        "广西","海南", "重庆", "四川", 
        "贵州", "云南", "西藏", "陕西", 
        "甘肃", "青海", "宁夏", "新疆", 
        "香港", "澳门", "台湾"
    ];

    const initPageRender = function (callback) {
        const $ = layui.$;
        const table = layui.table;
        const form = layui.form;
        const helper = layui.helper;

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
            dd.find("button.btn-cancel").click(function () {
                _hide();
            });
            $("body").click(function (i) {
                !$(i.target).parents(".select").first().is(s) ? _hide() : "";
            });
        });

        province.forEach(element => {
            //添加默认项
            let conf = {};
            conf.expr = '.view-department select[name=dep_province]';
            conf.text = element;
            conf.val = element;
            helper.addOption(conf);
        });
        

        $(".view-department select[name=dep_province]").val('青海');
        form.render('select');

        table.render({
            elem: '#id-table-department',
            id: 'id-table-department',
            height: 'full-100',
            url: api.list,
            cols: [[{
                field: 'province',
                title: '省份',
                width: 140,
                align: 'left',
            }, {
                field: 'department',
                title: '部门',
                minWidth: 160,
                align: 'left',
            }, {
                title: '操作',
                width: 160,
                align: 'center',
                toolbar: '#id-table-department-tool'
            }
            ]],
            page: true,
            limit: 10,
            where: {
                'params["department"]': $(".form-department").find("input[name=department]").val()
            }
        });

        if ($.isFunction(callback)) {
            callback();
        }
    };

    const bindControlEvents = function (callback) {
        const $ = layui.$;
        const form = layui.form;
        const table = layui.table;

        //查询
        form.on('submit(filter-form-department)', function (e) {
            const params = {
                'params["department"]': e.field.department
            };
            events['reload'].call(this, params);
            return false;
        });

        //修改的提交事件
        form.on('submit(department)', function (e) {
            let obj = {};
            obj.data = e.field;
            events["departmentSubmit"].call(this, obj);
            return false;
        });

        $("form.form-department a.layui-btn-add").click(function () {
            const $ = layui.$;
            const me = $(this);
            events[me.data("event")].call(this);
        });

        //关闭事件
        $(".layui-btn-close").click(function () {
            events["close"].call(this);
        });

        //表格的修改事件
        table.on('tool(id-table-department)', function (e) {
            events[e.event].call(this, e.data);
        });

        //部门
        let objDepartMent = {
            code: 'NSSA_DEPARTMENT_FILTER',
            elem: '.view-assignee select[name=department]'
        };
        events["options"].call(this, objDepartMent);

        if ($.isFunction(callback)) {
            callback();
        }
    };

    layui.use(['alimx.table', 'laydate', 'helper', 'layer', 'form'], function () {

        //页面初始化
        initPageRender(function () {
            bindControlEvents(function () { });
        });

    });

    e("config.department", {})
});
