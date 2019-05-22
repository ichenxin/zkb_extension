(function () {
    var options = {
        count: 100,//监控列表数目
        time: 10000,//监控间距
        popup_time: 5000,//监控时长
        notification: true,//是否开启通知
        listen: true,//是否开启监听
        blacklist: "",
        keywords: "电影,话费,水,票,洞,bug,券,红包,话费,关注,Q,B,q,币,京,东,券,领,线报,现金,领,首发,白菜,无限,软件,快,撸,零,一元,货,流量"//关键词
    }, settings = {
        skin: false
    };
    var form = layui.form, layer = layui.layer;
    chrome.storage.local.get({'options': ''}, function (items) {
        if (items.options !== '') {
            var option = JSON.parse(items.options);
            options.popup_time = option.popup_time;
            options.time = option.time;
            options.notification = option.notification;
            options.listen = option.listen;
            options.keywords = option.keywords;
            options.blacklist = option.blacklist;
        }
        list(options);
        chrome.storage.local.get({'setting':''},function(items){
            if(items.setting){
                var setting = JSON.parse(items.setting);
                settings = setting;
                setOptions(settings);
            }
        })
    });

    function list(options) {
        if (options.listen) {
            $('input[name="listen"]').prop("checked", true);
            $('.listen .layui-form-switch').addClass('layui-form-onswitch');
        }
        if (options.notification) {
            $('input[name="notification"]').prop("checked", true);
            $('.notification .layui-form-switch').addClass('layui-form-onswitch');
        }
        var popup_time = options.popup_time || 5000;
        $('.popup_time').val(popup_time);
        var listen_time = options.time || 10000;
        $('.listen_time').val(listen_time);
        var cache_count = options.count || 100;
        $('.cache_count').val(cache_count);
        var keywords = options.keywords || '';
        $('.keywords').val(keywords);
        var blacklist = options.blacklist || '';
        $('.blacklist').val(blacklist);
    }

    function save() {
        var obj = {
            count: $('.cache_count').val() || 100,//监控列表数目
            time: $('.listen_time').val() || 10000,//监控间距
            popup_time: $('.popup_time').val() || 5000,//弹窗时长
            notification: options.notification,//是否开启通知
            listen: options.listen,//是否开启监听
            keywords: $('.keywords').val(),
            blacklist: $('.blacklist').val()
        };
        obj = JSON.stringify(obj);
        chrome.storage.local.set({'options': obj}, function () {
            layer.msg('保存成功！');
        });
    }


    form.on('switch(notification)', function (data) {
        options.notification = this.checked;
    });
    form.on('switch(listen)', function (data) {
        options.listen = this.checked;
    });
    form.on('switch(skin)', function (data) {
        settings.skin = this.checked;

    });

    function getUser() {
        $.ajax({
            url: 'http://www.zuanke8.com/api/mobile/index.php?sessionid=&version=4.1&zstamp=1552628345&module=zuixin&sign=1c6c5e06377fcc461226805e727e9908',
            dataType: 'json',
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: options.data,
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded",
            success: function (res) {
                // console.log(res.data.member_username);
                if (res.data.member_username) {
                    saveUser(res.data.member_username);
                } else {
                    layer.msg('获取用户信息失败！请先登录账号！');
                    window.open("http://www.zuanke8.com/member.php?mod=logging&action=login");
                }

            },
            error: function (err) {
                layer.msg('获取用户信息失败！');
            }
        });
    }

    function saveUser(str) {
        chrome.storage.local.set({'nickname': str}, function () {
            $('.btn-authorization').hide();
            $('.nickname').show().html(str);
            check(str);
        });
    }

    function check(nickname) {
        $.ajax({
            url: 'http://krapnik.cn/api/check',
            dataType: 'json',
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: {'nickname': nickname},
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded",
            success: function (res) {
                layer.msg(res.msg);
                if (res.success) {
                    saveActivate();
                }
            },
            error: function (err) {
                layer.msg('获取用户信息失败！');
            }
        });
    }

    function saveActivate() {
        chrome.storage.local.set({'activate': true}, function () {
            // layer.msg('保存成功！');
            $('.activate-status').html('已激活');
        });
    }

    function initUser() {
        chrome.storage.local.get({'cdk_url': ''}, function (arg) {
            $('.buy_link').attr('href', arg['cdk_url']);
            chrome.storage.local.get({'nickname': ''}, function (items) {
                if (items['nickname']) {
                    $('.btn-authorization').hide();
                    $('.nickname').show().html(items['nickname']);
                }
                chrome.storage.local.get({'activate': ''}, function (obj) {
                    // layer.msg('保存成功！');
                    if (obj['activate']) {
                        $('.activate-status').html('已激活');
                    }
                });
            });
        });
    }

    function login() {
        var nickname, cdk = $('.cdk').val();
        if (!cdk) {
            layer.msg('请先输入激活码！');
            return;
        }
        chrome.storage.local.get({'nickname': ''}, function (items) {
            if (items['nickname']) {
                nickname = items['nickname'];
                $.ajax({
                    url: 'http://krapnik.cn/api/login',
                    dataType: 'json',
                    type: 'POST',
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {'nickname': nickname, 'cdk': cdk},
                    crossDomain: true,
                    contentType: "application/x-www-form-urlencoded",
                    success: function (res) {
                        layer.msg(res.msg);
                        if (res.success) {
                            saveActivate();
                        }
                    },
                    error: function (err) {
                        layer.msg('获取用户信息失败！');
                    }
                });
            } else {
                layer.msg('请先获取登录账号进行激活码绑定！');
            }
        });
    }

    function saveSetting() {
        var obj = JSON.stringify(settings);
        chrome.storage.local.set({'setting': obj}, function () {
            layer.msg('保存成功！');
        });
    }

    function setOptions(settings){
        if (settings.skin) {
            $('input[name="skin"]').prop("checked", true);
            $('.skin .layui-form-switch').addClass('layui-form-onswitch');
        }
    }

    initUser();

    $('.btn-activate').on('click', login);

    $('.btn-save').on('click', save);

    $('.btn-authorization').on('click', getUser);

    $('.btn-setting').on('click', saveSetting);


})();