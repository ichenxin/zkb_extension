(function () {
    var options = {
        count: 100,//监控列表数目
        time: 5000,//监控间距
        popup_time: 5000,//监控时长
        notification: true,//是否开启通知
        listen: true,//是否开启监听
        blacklist:"",
        keywords: "电影,话费,水,票,洞,bug,券,红包,话费,关注,Q,B,q,币,京,东,券,领,线报,现金,领,首发,白菜,无限,软件,快,撸,零,一元,货,流量"//关键词
    };
    var form = layui.form,layer = layui.layer;
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
        var listen_time = options.time || 5000;
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
            time: $('.listen_time').val() || 5000,//监控间距
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


    $('.btn-save').on('click', save);

})();