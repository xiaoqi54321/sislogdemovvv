layui.define(function (e) {

	const api = {
		deploy: '../../common/1/activiti/diagram/deploy.html'
	};

	const events = {
		add: function () {
			const helper = layui.helper;
			helper.ajax(api.deploy, {
				params: {
					key: 'asset.add',
					name: '资产新增',
					category: 'asset.add',
				}
			}, function (response) {
				if (response.result) {
					layer.msg('发布成功');
				} else {
					layer.msg(response.message);
				}
			});
		},
		update: function () {
			const helper = layui.helper;
			helper.ajax(api.deploy, {
				params: {
					key: 'asset.update',
					name: '资产变更',
					category: 'asset.update',
				}
			}, function (response) {
				if (response.result) {
					layer.msg('发布成功');
				} else {
					layer.msg(response.message);
				}
			});
		},
		audit: function () {
			const helper = layui.helper;
			helper.ajax(api.deploy, {
				params: {
					key: 'asset.audit',
					name: '资产稽核',
					category: 'asset.audit',
				}
			}, function (response) {
				if (response.result) {
					layer.msg('发布成功');
				} else {
					layer.msg(response.message);
				}
			});
		},
		repair: function () {
			const helper = layui.helper;
			helper.ajax(api.deploy, {
				params: {
					key: 'asset.repair',
					name: '资产漏洞处置',
					category: 'asset.repair',
				}
			}, function (response) {
				if (response.result) {
					layer.msg('发布成功');
				} else {
					layer.msg(response.message);
				}
			});
		},
	};

	//页面加载初始化
	const initPageRender = function (callback) {
		const $ = layui.$;

		if ($.isFunction(callback)) {
			callback();
		}
	}

	const bindControlEvents = function (callback) {
		const $ = layui.$;

		$('div.layui-card button.layui-btn:not(".submit,.upload")').click(function (e) {
			const me = $(e.delegateTarget);

			events[me.data('event')].call(this);
		});

		if ($.isFunction(callback)) {
			callback();
		}
	}

	layui.use(['index', 'layer', 'helper'], function () {
		initPageRender(function () {
			bindControlEvents(function () {});
		});
	}),

	e("credential.deploy", {})
})
