layui.define(function (e) {
    const api = {
        list: '../../blackHawk/subnet/getSubnetList.html', //表格api
        add: '../../blackHawk/subnet/addSubnet.html',//添加
        edit: '../../blackHawk/subnet/updateSubnet.html',//修改
        del: '../../blackHawk/subnet/deleteSubnet.html',//删除
        options: '../../common/1/option/getOptions.html'
    }
    //事件
    const events = {
        search: function () {
            events["reload"].call(this);
        },
        subNetSubmit: function (obj) {
            //接到的参数
            let data = obj.data;
            const helper = layui.helper;
            const $ = layui.$;
            const form = layui.form;
            const panel = $(".view-subnet");
            let subType = panel.attr("type");

            if (subType == 'add') {

                form.val('subnet',{
                    name:'',
                    segment_start:'',
                    segment_end:'',
                    responsible_name:-1,
                    department_name:-1
                });
                let params = {
                    'params["name"]': data.name,
                    'params["segment_start"]': data.segment_start,
                    'params["segment_end"]': data.segment_end,
                    'params["responsible_"]': data.responsible_name,
                    'params["department_"]': data.department_name,
                };

                helper.ajax(api.add, params, function (response) {
                    layer.alert(response.message.message, function () {
                        events["reload"].call(this);
                        layer.closeAll();
                    });
                });
            } else if (subType == 'edit') {
                let params = {
                    'params["id"]': panel.attr("subnetid"),
                    'params["name"]': data.name,
                    'params["segment_start"]': data.segment_start,
                    'params["segment_end"]': data.segment_end,
                    'params["responsible_"]': data.responsible_name,
                    'params["department_"]': data.department_name,
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
            const panel = $(".view-subnet");
            panel.attr("type", 'edit');
            panel.attr("subnetid", obj.id);
            form.val("subnet", {
                "name": obj.name,
                "segment_start": obj.segment_start,
                "segment_end": obj.segment_end,
                "responsible_name": obj.responsible_,
                "department_name": obj.department_
            });

            layer.open({
                type: 1,
                title: '修改子网',
                area: ['600px'],
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
                            events["reload"].call(this);
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
            const panel = $(".view-subnet");
            panel.attr("type", 'add');
            form.val('subnet',{
                name:'',
                segment_start:'',
                segment_end:'',
                responsible_name:-1,
                department_name:-1
            });
            layer.open({
                type: 1,
                title: '添加子网',
                area: ['600px'],
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
            table.reload('id-table-subnet', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    'params["ip"]': $(".form-subnet").find("input[name=subnetIp]").val(),
                    'params["name"]': $(".form-subnet").find("input[name=subnetName]").val()
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

    const initPageRender = function (callback) {
        const $ = layui.$;
        const table = layui.table;
        const form = layui.form;

        //验证
        form.verify({
            ip: function (value, item) {
                function isValidIP(ip) {
                    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                    return reg.test(ip);
                }
                if (isValidIP(value) == false) {
                    return '请输入正确的IP地址';
                }
            }
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
            dd.find("button.btn-cancel").click(function () {
                _hide();
            });
            $("body").click(function (i) {
                !$(i.target).parents(".select").first().is(s) ? _hide() : "";
            });
        });

        table.render({
            elem: '#id-table-subnet',
            id: 'id-table-subnet',
            height: 'full-100',
            url: api.list,
            cols: [[{
                field: 'name',
                title: '子网名称',
                width: 140,
                align: 'left',
            }, {
                field: 'segment_start',
                title: '子网网段起始',
                minWidth: 160,
                align: 'left',
            }, {
                field: 'segment_end',
                title: '子网网段截至',
                minWidth: 160,
                align: 'left',
            }, {
                field: 'responsible_name',
                title: '责任人',
                minWidth: 160,
                align: 'left',
            }, {
                field: 'department_name',
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
            limit:10,
            where: {
                'params["ip"]': $(".form-subnet").find("input[name=subnetIp]").val(),
                'params["name"]': $(".form-subnet").find("input[name=subnetName]").val()
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
        form.on('submit(filter-form-subnet)', function (e) {
            events['reload'].call(this);
            return false;
        });

        //修改的提交事件
        form.on('submit(subnet)', function (e) {
            let obj = {};
            obj.data = e.field;
            events["subNetSubmit"].call(this, obj);
            return false;
        });

        $("form.form-subnet a.layui-btn-add").click(function () {
            const $ = layui.$;
            const me = $(this);
            events[me.data("event")].call(this);
        });

        //关闭事件
        $(".layui-btn-close").click(function () {
            events["close"].call(this);
        });

        //表格的修改事件
        table.on('tool(id-table-subnet)', function (e) {
            events[e.event].call(this, e.data);
        });
        //部门
        let objDepartMent = {
            code: 'NSSA_DEPARTMENT_FILTER',
            elem: '.view-subnet select[name=department_name]'
        };
        events["options"].call(this, objDepartMent);


        //责任人
        let objResponsible = {
            code: 'NSSA_RESPONSIBLE',
            elem: '.view-subnet select[name=responsible_name]'
        };
        events["options"].call(this, objResponsible);

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

    e("config.subnet", {})
});
