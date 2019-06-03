layui.define(function (e) {
    const api = {
        list: '../../blackHawk/user/getUserList.html', //表格api
        update: '../../blackHawk/user/updateUser.html',//修改的人员的api
        options: '../../common/1/option/getOptions.html',
        setting: '../../blackHawk/user/updateUserAdmin.html'//设置管理员
    }

    const events = {
        search: function () {
            events["reload"].call(this);
        },
        setadmin: function (obj) {
            const helper = layui.helper;
            const table = layui.table;
            let ids = table.checkStatus('tableAssignee').data;
            if (ids.length <= 0) {
                layer.alert('选项不能为空', function () {
                    layer.closeAll();
                });
            } else {
                let params = {
                    "params['id']": ids[0].id,
                    "params['admin_']": 1
                };
                layer.open({
                    content: '管理员只能存在一个，确定设置当前用户为管理员吗？'
                    , btn: ['是', '否'],
                    yes: function () {
                        helper.ajax(api.setting, params, function (response) {
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
            }
        },
        assigneeSubmit: function (obj) {
            const $ = layui.$;
            //接到的参数
            let data = obj.data;
            let panel = $(".view-assignee");
            const helper = layui.helper;
            if (data.admin === 'on') {
                layer.open({
                    content: '管理员只能存在一个，确定设置当前用户为管理员吗？'
                    , btn: ['是', '否']
                    , yes: function () {
                        let params = {
                            'params["id"]': panel.attr("assigneeid"),
                            'params["department"]': data.department,
                            'params["phone_"]': data.userPhone,
                            'params["email_"]': data.userEmail,
                            'params["admin_"]': 1,
                        };
                        helper.ajax(api.update, params, function (response) {
                            layer.alert(response.message.message, function () {
                                events["reload"].call(this);
                                layer.closeAll();
                            });

                        });
                    }
                    , btn2: function (_index) {
                        layer.close(_index);
                    }
                });
            } else {
                let params = {
                    'params["id"]': panel.attr("assigneeid"),
                    'params["department"]': data.department,
                    'params["phone_"]': data.userPhone,
                    'params["email_"]': data.userEmail,
                    'params["admin_"]': 0,
                };
                helper.ajax(api.update, params, function (response) {
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
            const panel = $(".view-assignee");
            panel.attr("assigneeid", obj.id);

            layer.open({
                type: 1,
                title: '修改人员',
                area: ['400px'],
                shade: 0.5,
                scrollbar: false,
                resize: false,
                content: panel,
                success: function () {

                    form.val("assignee", {
                        "department": obj.department,
                        "userPhone": obj.phone_,
                        "userEmail": obj.email_,
                    });
                },
                end: function () { },
                cancel: function () { }
            });
        },
        reload: function () {
            const table = layui.table;
            const $ = layui.$;
            //执行重载
            table.reload('tableAssignee', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    'params["name"]': $(".form-assignee").find("input[name=userName]").val()
                }
            });
        },
        options: function (e) {
            const $ = layui.$;
            const helper = layui.helper;
            const form = layui.form;
            $(e.elem).empty();
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
        })


        //监听行单击事件（单击事件为：rowDouble）
        table.on('row(tableAssignee)', function (obj) {
            var data = obj.data;

            // layer.alert(JSON.stringify(data), {
            //     title: '当前行数据：'
            // });

            // 标注选中样式
            obj.tr.find('input[lay-type="layTableRadio"]').prop("checked", true);

            var index = obj.tr.data('index')
            var thisData = table.cache.tableAssignee;//tableName 表名
            //重置数据单选属性
            layui.each(thisData, function (i, item) {
                if (index === i) {
                    item.LAY_CHECKED = true;
                } else {
                    delete item.LAY_CHECKED;
                }
            });
            form.render('radio');
        });

        table.render({
            elem: '#tableAssignee',
            id: 'tableAssignee',
            height: 'full-100',
            url: api.list,
            cols: [[{
                type: 'radio'
            }, {
                field: 'name',
                title: '姓名',
                width: 140,
                align: 'left',
            }, {
                field: 'department_name',
                title: '部门',
                minWidth: 160,
                align: 'left',
            }, {
                field: 'admin_',
                title: '是否为管理员',
                minWidth: 80,
                align: 'left',
                templet: function (res) {
                    if (res.admin_) {
                        return "是";
                    }
                    return "否"
                }
            }, {
                field: 'phone_',
                title: '电话',
                width: 260,
                align: 'left',
                templet: function (res) {
                    return res.phone_ || '--';
                }
            }, {
                field: 'email_',
                title: 'email',
                width: 260,
                align: 'left',
                templet: function (res) {
                    return res.email_ || '--';
                }
            }, {
                title: '操作',
                width: 160,
                align: 'center',
                toolbar: '#id-table-assignee-tool'
            }
            ]],
            page: true,
            limit: 10,
            where: {
                'params["name"]': $(".form-assignee").find("input[name=userName]").val()
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
        form.on('submit(filter-form-assignee)', function (e) {
            const params = {
                'params["name"]': e.field.userName
            };
            events['reload'].call(this, params);
            return false;
        });

        //部门
        let objDepartMent = {
            code: 'NSSA_DEPARTMENT_FILTER',
            elem: '.view-assignee select[name=department]'
        };
        events["options"].call(this, objDepartMent);

        //修改的提交事件
        form.on('submit(assignee)', function (e) {
            let obj = {};
            obj.data = e.field;
            events["assigneeSubmit"].call(this, obj);
            return false;
        });

        $(".layui-btn-setadmin").click(function () {
            events["setadmin"].call(this);
        });

        //关闭事件
        $(".layui-btn-close").click(function () {
            events["close"].call(this);
        });

        //表格的修改事件
        table.on('tool(tableAssignee)', function (e) {
            events[e.event].call(this, e.data);
        });

        if ($.isFunction(callback)) {
            callback();
        }
    };

    layui.use(['alimx.table', 'laydate', 'helper', 'layer', 'form'], function () {

        //页面初始化
        initPageRender(function () {
            bindControlEvents(function () { })
        });

    });

    e("config.assignee", {})
});
