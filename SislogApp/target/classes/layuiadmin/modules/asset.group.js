layui.define(function(e) {
    const api = {
        delAssetsApi: '../../blackHawk/asset/group/default.html',
        requestSelectApi: '../../common/1/option/getOptions.html',
        groupAddApi: '../../blackHawk/asset/group/add.html',
        assetsList: '../../blackHawk/asset/list.html',
        groupListApi: '../../blackHawk/asset/group/list.html',
        groupInfoApi: '../../blackHawk/asset/group/info.html',
        groupUpdateApi: '../../blackHawk/asset/group/update.html',
        groupDeleApi: '../../blackHawk/asset/group/delete.html',
        groupTo: '../../blackHawk/asset/group/to.html'
    }

    let pagegroupId = undefined;
    const events = {
        //重新加载资产列表
        tabload: function(_groupid){
            const table = layui.table;
            table.reload('id-table-assetsGroup', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    'params["group"]': _groupid
                }
            });
        },
        //增加组，和修改组弹框事件
        addGroup: function(obj) {
            const $ = layui.$;
            const form = layui.form;
            let panel = $(".view-addgroup");

            form.val('addgroup',{
                groupName:'',
                groupDsc:''
            });

            layer.open({
                type: 1,
                title: '资产组',
                area: ['500px'],
                shade: 0.5,
                scrollbar: false,
                resize: false,
                content: panel,
                success: function() {
                    if (obj) {
                        panel.attr("groupid",obj.groupId);
                        panel.find("input[name='groupName']").val(obj.groupName);
                    }else{
                        panel.attr("groupid",undefined);
                    }
                },
                end: function() {},
                cancel: function() {}
            });
        },
        //转移的提交事件
        addTransferSubmit:function(){
            const $ = layui.$;
            const helper = layui.helper;

            let panel = $('.view-addtransfer');
            let _cacheId = panel.attr("groupid");
            if ($("input[name=groupName]").length == 0) {
                layer.alert("请输入资产组名称！");
                layer.close(layer.index);
                return false;
            } else {
                var map = {
                    'params["id"]': _cacheId,
                    'params["group"]': panel.find("select[name=assetGroup]").val()
                };
                helper.ajax(api.groupTo, map, function(response) {
                    events["tabload"].call(this,pagegroupId);
                });
            }
            layer.close(layer.index);
        },
        //通用的close关闭事件
        close: function() {
            layer.closeAll();
        },
        //添加资产组和修改资产组的提交事件
        addGroupSubmit: function(obj) {
            const helper = layui.helper;
            const $ = layui.$;
            let panel = $(".view-addgroup");
            let _groupId = panel.attr("groupid");
            if (_groupId) {
                helper.ajax(api.groupUpdateApi, {
                    'params["id"]': _groupId,
                    'params["name"]': obj.data.groupName,
                    'params["dsc"]': obj.data.groupDsc
                }, function(response) {
                    layer.alert(response.message.message,function(){
                    });
                    grouplist();
                    layer.closeAll();
                },function(error){
                    layer.alert(JSON.stringify(error.message.message));
                });
            } else {
                helper.ajax(api.groupAddApi, {
                    'params["id"]': undefined,
                    'params["name"]': obj.data.groupName,
                    'params["dsc"]': obj.data.groupDsc
                }, function(response) {
                    layer.alert(response.message.message,function(){
                    });
                    grouplist();
                    layer.closeAll();
                }, function(error) {});
            }
            layer.closeAll();
        },
        //添加资产提交事件
        assetSubmit: function() {
            const tablesAssetsData = layui.table.checkStatus("id-table-assets").data;
            let addassetsCache = [];
            //遍历选中行的数据获取选中行的ID
            tablesAssetsData.forEach(element => {
                addassetsCache.push(element.id);
            });

            if (addassetsCache.length > 0) {
                layer.confirm('确认将选中资产加入到组？', {
                    btn: ['是', '否'],
                }, function() {
                    const helper = layui.helper;
                    helper.ajax(api.groupTo, {
                        'params["id"]': addassetsCache.join(','),
                        'params["group"]': pagegroupId
                    }, function(response) {
                        if (response.result) {
                            events["tabload"].call(this,pagegroupId);
                            layer.closeAll();
                        }
                    });
                }, function() {});
            } else {
                layer.msg("请选择一条资产");
            }
        },
        //添加资产弹框事件
        addAssets: function(obj) {
            const $ = layui.$;
            const form = layui.form;

            form.val('addassets', {
                "assetIp": "",
                "assetsDep": -1
            });
            let panel = $(".view-addassets");
            layer.open({
                type: 1,
                title: '添加资产',
                area: ['1024px'],
                shade: 0.5,
                scrollbar: false,
                resize: false,
                content: panel,
                success: function() {},
                end: function() {},
                cancel: function() {}
            });
        },
        //移除的点击事件
        delAssets: function(obj) {
            const helper = layui.helper;
            layer.confirm('确认从该资产组移除选中资产？', {
                btn: ['是', '否'],
            }, function(index) {
                let map = {
                    'params["id"]': obj.cache.join(',')
                };
                helper.ajax(api.delAssetsApi, map, function(response) {
                    events["tabload"].call(this,pagegroupId);
                    layer.close(layer.index);
                });
            });
        },
        //转移的弹框事件
        transferAssets: function(obj) {
            const $ = layui.$;
            const form = layui.form;
            let panel = $('.view-addtransfer');
            panel.attr("groupId",obj.cache.join(','));
            form.val('addtransfer',{
                assetGroup:-1,
                transfergroupName:''
            });
            layer.open({
                type: 1,
                title: '添加到组',
                area: ['500px'],
                shade: 0.5,
                scrollbar: false,
                resize: false,
                content: panel,
                success: function() {
                    //点击转移弹出的分组
                    let objAssetGroup = {
                        cache: false,
                        code: 'NSSA_ASSET_GROUP_SELECT',
                        selected: 'assetGroup'
                    }
                    events["requestSelect"].call(this, objAssetGroup);
                },
                end: function() {},
                cancel: function() {}
            });
        },
        //加入的点击事件
        transferJoin: function(obj) {
            const $ = layui.$;
            const helper = layui.helper;
            let groupName = $("input[name=transfergroupName]").val();
            helper.ajax(api.groupAddApi, {
                'params["id"]': undefined,
                'params["name"]': groupName,
                'params["dsc"]': ""
            }, function(response) {
                let groupinfo = {};
                groupinfo.group = response.message;
                groupinfo.cache = obj.cache;
                events["groupTo"].call(this, groupinfo);
            }, function(error) {});

            return false;
        },
        //转移资产事件
        groupTo: function(obj) {
            const helper = layui.helper;
            helper.ajax(api.groupTo, {
                'params["id"]': obj.cache.join(','),
                'params["group"]': obj.group
            }, function(response) {
                layer.alert(response.message.message, function() {
                    events["tabload"].call(this,obj.group);
                });
            })
        },
        //列表组删除
        groupListDel: function(obj) {
            const helper = layui.helper;
            let _groupId = obj.groupId;
            let _groupName = obj.groupName;
            layer.confirm('确认删除该资产组【' + _groupName + '】？', {
                btn: ['是', '否'] //按钮
            }, function(index) {
                helper.ajax(api.groupDeleApi, {
                    'params["id"]': _groupId,
                    'params["name"]': _groupName,
                }, function(response) {
                    grouplist();
                    layer.closeAll();
                });
            });
        },
        requestSelect: function(res) {
            const $ = layui.$;
            const helper = layui.helper;
            const form = layui.form;
            helper.ajax(api.requestSelectApi, {
                cache: false,
                code: res.code
            }, function(response) {
                $.each(response.list, function(index, item) {
                    let obj = {};
                    obj.expr = "select[name=" + res.selected + "]";
                    obj.text = item.name;
                    obj.val = item.value;
                    helper.addOption(obj);
                });
                form.render('select');
            });
        }
    };

    //加载资产组表
    const grouplist = function() {
        const helper = layui.helper;
        const $ = layui.$;
        const table = layui.table;

        $(".grouping-nav").empty();
        helper.ajax(api.groupListApi, null, function(response) {
            let str = "";
            $(".grouping-nav").empty();
            response.list.forEach((element, index) => {
                let classhead = "";
                if (index == 0) {
                    pagegroupId = element.id;
                    classhead= "layui-this layui-nav-itemed";
                    $("span.span-group-name").html(element.name);
                }else{
                    classhead= "";
                }
                str += `<li class="layui-nav-item `+classhead+`">
                        <div class="list-icon"> 
                        <i class="layui-inline layui-icon layui-icon-delete"></i> 
                        <i class="layui-inline layui-icon layui-icon-edit"></i></div>
                        <a href="javascript:;" data-value="${element.id}">${element.name}</a>
                    </li>`;
                
            });
            $(".grouping-nav").append(str);

            //默认打开的资产列表
            table.render({
                elem: '#id-table-assetsGroup',
                height: 'full-156',
                url: api.assetsList, //数据请求URL
                cols: [
                    [{
                        type: 'checkbox',
                        fixed: 'left',
                    }, {
                        field: 'address',
                        title: '资产IP',
                        width: 200,
                        align: 'left',
                        templet: function(res) {
                            if (res.address == undefined) {
                                return "--";
                            }
                            return res.address;
                        }
                    }, {
                        field: 'name',
                        title: '资产名称',
                        minWidth: 220,
                        align: 'left',
                        templet: function(res) {
                            if (res.name == undefined) {
                                return "--";
                            }
                            return res.name;
                        }
                    }, {
                        field: 'product',
                        title: '资产类型',
                        width: 100,
                        align: 'center',
                        templet: function(res) {
                            if (res.product == undefined) {
                                return "--";
                            }
                            return res.product;
                        }
                    }, {
                        field: 'os',
                        title: '操作系统',
                        width: 100,
                        align: 'center',
                        templet: function(res) {
                            if (res.os == undefined) {
                                return "--";
                            }
                            return res.os;
                        }
                    }, {
                        field: 'department',
                        title: '归属部门',
                        width: 200,
                        minWidth: 180,
                        align: 'left',
                        templet: function(res) {
                            if (res.department == undefined) {
                                return "--";
                            }
                            return res.department;
                        }
                    }, {
                        field: 'responsible',
                        title: '责任人',
                        width: 100,
                        minWidth: 80,
                        align: 'center',
                        templet: function(res) {
                            if (res.responsible == undefined) {
                                return "--";
                            }
                            return res.responsible;
                        }
                    }, {
                        field: 'report_date',
                        title: '资产上报时间',
                        width: 160,
                        minWidth: 140,
                        align: 'center',
                        templet: function(res) {
                            if (res.report_date == undefined) {
                                return "--";
                            }
                            return res.report_date;
                        }
                    }]
                ],
                page: true, //开启分页
                where: {
                    'params["group"]': pagegroupId,
                }
            });

            helper.ajax(api.groupInfoApi, {
                'params["id"]': pagegroupId
            }, function(response) {
                $("span-group-name").html(response.data.name);
                $(".assetNum").html(response.data.attempt_asset);
                $(".riskNum").html(response.data.attempt_loophole);
            });
        });

    }

    const initPageRender = function(callback) {
        const table = layui.table;
        const $ = layui.$;

        //加载资产组列表
        grouplist();

        //下拉框资产分组
        let selAssetGroup = {
            code: 'NSSA_ASSET_GROUP_FILTER',
            selected: "assetGroup"
        };
        events["requestSelect"].call(this, selAssetGroup);

        //点击添加弹出的，部门列表项
        let objAssetsDep = {
            code: 'NSSA_DEPARTMENT_FILTER',
            selected: "assetsDep"
        };
        events["requestSelect"].call(this, objAssetsDep);
        

        //点击添加弹出的资产列表
        table.render({
            elem: '#id-table-assets',
            id: 'id-table-assets',
            height: 'full-355',
            defaultToolbar: [],
            url: api.assetsList,
            cols: [
                [{
                    type: 'checkbox',
                    fixed: 'left',
                }, {
                    field: 'address',
                    title: '资产IP',
                    width: 140,
                    align: 'center',
                }, {
                    field: 'name',
                    title: '资产名称',
                    width: 270,
                    align: 'left',
                }, {
                    field: 'department',
                    title: '归属部门',
                    width: 200,
                    align: 'center',
                    templet: function(res) {
                        return res.department || '--';
                    }
                }, {
                    field: 'responsible',
                    title: '责任人',
                    width: 120,
                    align: 'center',
                    templet: function(res) {
                        return res.responsible || '--';
                    }
                }, {
                    field: 'group',
                    title: '当前所在组',
                    width: 200,
                    align: 'center',
                }]
            ],
            page: true,
            where: {
                'params["ip"]': $('input[name=assetIp]').val(),
                'params["department"]': $('select[name=assetsDep]').val()
            }
        });

        if ($.isFunction(callback)) {
            callback();
        }
    };

    const bindControlEvents = function(callback) {
        const $ = layui.$;
        const helper = layui.helper;
        const form = layui.form;

        $(".layui-group").click(function() {
            events[$(this).data("event")].call(this);
        });

        //添加，修改，资产组的form事件
        form.on('submit(addgroup)', function(data) {
            let objGroup = {};
            objGroup.data = data.field;
            events[$(this).data("event")].call(this,objGroup);
            return false;
        });


        //转移的form事件
        form.on('submit(addTransfer)', function(data) {
            let objTransfer = {};
            objTransfer.data = data.field;
            events[$(this).data("event")].call(this,objTransfer);
            return false;
        });

        //点击添加，弹出的资产列表的查询
        form.on('submit(addassets)', function(data) {
            const table = layui.table;
            table.reload("id-table-assets", {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    'params["ip"]': $('input[name=assetIp]').val(),
                    'params["department"]': $('select[name=assetsDep]').val()
                }
            });
            return false;
        });

        //加入
        $("button.layui-join").click(function() {
            // 获取选中数据的表格ID
            const tablesAssetsData = layui.table.checkStatus("id-table-assetsGroup").data;
            let cache = [];
            tablesAssetsData.forEach(element => {
                cache.push(element.id);
            });
            let obj = {};
            obj.cache = cache;
            events[$(this).data("event")].call(this, obj);
        });

        //点击资产组请求的事件
        $(document).on('click', '.layui-nav-item a', function() {
            const table = layui.table;
            $(this).parent("li").siblings().removeClass('layui-this layui-nav-itemed');
            $(this).parent('li').addClass('layui-this layui-nav-itemed');
            pagegroupId = $(this).data("value");
            helper.ajax(api.groupInfoApi, {
                'params["id"]': pagegroupId
            }, function(response) {
                $("span.span-group-name").html(response.data.name);
                $(".assetNum").html(response.data.attempt_asset);
                $(".riskNum").html(response.data.attempt_loophole);
            });

            table.reload('id-table-assetsGroup', {
                page: {
                    curr: 1
                },
                where: {
                    'params["group"]': pagegroupId,
                }
            });
        });

        //添加，移除，转移 点击事件
        $(".cont ul li a").click(function() {

            const tablesData = layui.table.checkStatus("id-table-assetsGroup").data;
            let cache = [];
            tablesData.forEach(element => {
                cache.push(element.id);
            });

            if ($(this).data("event") == "addAssets") {
                events[$(this).data("event")].call();
            }else {
                if (cache.length == 0) {
                    layer.alert("所选资产不能为空");
                } else {
                    let obj = {};
                    obj.cache = cache;
                    events[$(this).data("event")].call(this, obj);
                }
            }
        });

        //列表组下的操作，修改，删除
        $(document).on('click', '.layui-nav-item i', function() {

            let groupId = $(this).parent().next("a").data("value");
            let groupName = $(this).parent().next("a").html();
            let obj = {};
            obj.groupId = groupId;
            obj.groupName = groupName;
            if ($(this).hasClass('layui-icon-edit')) {
                events["addGroup"].call(this, obj);
            } else if ($(this).hasClass('layui-icon-delete')) {
                events["groupListDel"].call(this, obj);
            }
        });

        $(".select").each(function() {
            var s = $(this);
            var z = parseInt(s.css("z-index"));
            var dt = $(this).children("dt");
            var dd = $(this).children("dd");
            var _show = function() {
                dd.slideDown(200);
                dt.addClass("cur");
                s.css("z-index", z + 1);
            }; //展开效果
            var _hide = function() {
                dd.slideUp(200);
                dt.removeClass("cur");
                s.css("z-index", z);
            }; //关闭效果
            dt.click(function() {
                dd.is(":hidden") ? _show() : _hide();
            });
            dd.find("a").click(function() {
                _hide();
            }); //选择效果（如需要传值，可自定义参数，在此处返回对应的“value”值 ）
            $("body").click(function(i) {
                !$(i.target).parents(".select").first().is(s) ? _hide() : "";
            });
        });

        if ($.isFunction(callback)) {
            callback();
        }
    }

    layui.use(['alimx.table', 'helper', 'layer', 'form'], function() {

        //页面初始化
        initPageRender(bindControlEvents(function() {}));
    })

    e("asset.group", {})
});