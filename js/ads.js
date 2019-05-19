(function () {
    function getInfo() {
        $.ajax({
            url: './json/ads.json',
            // url: 'https://raw.githubusercontent.com/krapnikkk/zkb_extension/master/json/ads.json',
            type: 'GET',
            dataType: 'json',
            timeout: 5000,
            cache: false,
            success: function (res) {
                if (res.ad_flag === 1) {//开关
                    if (res['ad_frequency'] === 1) {//频率校验 0 ：once 1:everyday
                        chrome.storage.local.get({'date': ''}, function (items) {
                            if (items['date'] !== new Date().getDate()) {
                                chrome.storage.local.set({'date': new Date().getDate()}, function () {
                                    layer.open({
                                        type: res.ad_type,
                                        title: res.ad_title,
                                        closeBtn: 1,
                                        shadeClose: true,
                                        shade: false,
                                        maxmin: true, //开启最大化最小化按钮
                                        area: ['800px', '600px'],
                                        content: res.ad_type === 1 ? res['ad_content'] : res['ad_url']
                                    });
                                });
                            }
                        })
                    } else {//频率校验 0 ：once
                        chrome.storage.local.get({'ads_flag': ''}, function (items) {
                            if (items['ads_flag'] !== res.id) {//未阅读标记
                                chrome.storage.local.set({'ads_flag': res.id}, function () {
                                    layer.open({
                                        type: res.ad_type,
                                        title: res.ad_title,
                                        closeBtn: 1,
                                        shadeClose: true,
                                        shade: false,
                                        maxmin: true, //开启最大化最小化按钮
                                        area: ['800px', '600px'],
                                        content: res.ad_type === 1 ? res['ad_content'] : res['ad_url']
                                    });
                                });
                            }
                        });
                    }

                }

            },
            error: function (e) {
                if (e.status === 404) {
                    console.log('获取数据失败！请检查网络是否畅通！');
                }
            }
        });
    }

    getInfo();
})();