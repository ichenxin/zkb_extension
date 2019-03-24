(function () {
    var options = {
        data: {
            page: 1,//页码
            mod: "all"//所有栏目

        },
        type: 'relist',//最新主题
        count: 100,//监控列表数目
        time: 5000,//监控间距
        notification: true,//是否开启通知
        listen: true,//是否开启监听
        keywords: "电影,话费,水,票,洞,bug,券,红包,话费,关注,Q,B,q,币,京,东,券,领,线报,现金,领,首发,白菜,无限,软件,快,撸,零,一,0,1,元,货,流量"//关键词
    };

    var t1 = window.setInterval(function () {
        if (!options.listen) {//是否监听
            window.clearInterval(t1);
        } else {
            list();
        }
        if (options.notification) {//是否开启通知
            get('notifications', noticeQueque);
        }

    }, options.time);

    function noticeQueque(arr) {
        if (arr) {
            var notifications = JSON.parse(arr);
            for (var i = 0; i < notifications.length; i++) {
                var obj = notifications[i];
                if (!obj.flag) {
                    notification(obj.tid, obj.msg);
                    notifications[i].flag = true;
                }
            }
            save('notifications', JSON.stringify(notifications));
        }
    }

    var t2;

    function notification(id, msg) {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'img/icon.png',
            title: '监控提醒',
            message: msg
        }, function (notice_id) {
            t2 = setTimeout(function () {
                chrome.notifications.clear(notice_id, function () {

                });
            }, 8000);
            chrome.notifications.onClicked.addListener(function (notificationId) {
                window.clearTimeout(t2);
                t2 = null;
                if (notice_id === notificationId) {
                    chrome.notifications.clear(notice_id, function () {
                        window.open(`http://www.zuanke8.com/thread-${id}-1-1.html`, "_blank");
                    });
                }
            });
        });

    }

    function findKeyWord(list) {
        if (!list[0]) return;
        var arr = str2arr(options.keywords);
        var _cache = [].concat(list);//数组复制
        for (var i = list.length - 1; i > -1; i--) {
            var _key = true;
            for (var j = 0; j < arr.length; j++) {
                if (list[i].subject.indexOf(arr[j]) > 0) {
                    _key = false;
                    var obj = {
                        tid: list[i].tid,
                        msg: list[i].subject,
                        flag: false
                    };
                    notificationPush(obj);
                }
            }
            if (_key) {
                _cache.splice(i, 1);//剔除不存在关键词的数据
            }
            _key = true;
        }
        return _cache;
    }

    function notificationPush(obj) {
        if (obj) {
            var data = {};
            data['notifications'] = '';
            chrome.storage.local.get(data, function (items) {
                var notifications = JSON.parse(items['notifications']);
                var _hasFlag = true;
                for (var i = 0; i < notifications.length; i++) {
                    var notification = notifications[i];
                    if (notification['tid'] === obj['tid']) {
                        _hasFlag = false;
                        break;
                    }
                }
                if (!notifications[0] || _hasFlag) {
                    notifications.push(obj);
                }
                save('notifications', JSON.stringify(notifications));
            })
        }
    }


    function str2arr(str) {
        var keyword = str.indexOf(',') > -1 ? "," : "，";
        return uniq(str.split(keyword));
    }

    function uniq(array) {
        var temp = [];
        for (var i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) === -1) {
                temp.push(array[i]);
            }
        }
        return temp;
    }

    function list() {
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
                if (isNew(res.data.relist[0].addtime)) {
                    push(res.data.relist);
                }
            },
            error: function (err) {

            }
        });
    }

    function isNew(date) {
        var now = new Date();
        if (date.indexOf(`${now.getMonth() + 1}-${now.getDate()}`) > -1) {
            return true;
        }
        return false
    }

    function save(key, value) {
        var obj = {};
        obj[key] = value;
        chrome.storage.local.set(obj, function () {

        });
    }

    function get (key, callback) {
        var obj = {};
        obj[key] = '';
        chrome.storage.local.get(obj, function (items) {
            callback(items[key]);
        });
    }

    function push(data) {
        var obj = {};
        obj[options.type] = '';
        chrome.storage.local.get(obj, function (items) {
            var old = items[options.type];
            if (old) {
                var arr = merge(data, old);
                if (arr.length > options.count) {
                    var len = arr.length;
                    arr.splice(options.count, Math.abs(options.count - len));
                }
                arr = findKeyWord(arr);
                save(options.type, JSON.stringify(arr));
            }
        });
    }

    /**
     * 新旧数组合并
     * @param newArr
     * @param oldArr
     * @returns {*}
     */
    function merge(newArr, oldArr) {
        if (oldArr) {
            var arr = JSON.parse(oldArr);
            if (!arr[0]) {

            } else {
                for (var i = 0, len = newArr.length; i < len; i++) {
                    if (newArr[i].tid === arr[0].tid) {
                        newArr.splice(i, len - i);
                        break;
                    }
                }
            }
            newArr = newArr.concat(arr);
        }
        return newArr;
    }


    // ==============工具箱区================
    //右键菜单
    chrome.contextMenus.create({"title": "文字转二维码图片", "contexts": ["selection"], "onclick": clickOnSelection});
    chrome.contextMenus.create({"title": "将Ta加入黑名单", "contexts": ["selection"], "onclick": clickAddBlackList});
    chrome.contextMenus.create({"title": "解析该二维码图片", "contexts": ["image"], "onclick": clickGetImage});
    var ctxMenuId = chrome.contextMenus.create({"title": "京东商品一键直达", "contexts": ["selection"]});
    chrome.contextMenus.create({
        "parentId": ctxMenuId,
        "title": "PC端",
        "contexts": ["selection"],
        "onclick": clickGetGood
    });
    chrome.contextMenus.create({
        "parentId": ctxMenuId,
        "title": "移动端",
        "contexts": ["selection"],
        "onclick": clickGetGood
    });


    function clickOnSelection(params, tab) {
        var message = {'evt': 'qrcode', 'type': 'getImage', 'msg': params.selectionText};
        chrome.tabs.sendRequest(tab.id, message);
    }

    function clickGetImage(params, tab) {
        var message = {'evt': 'qrcode', 'type': 'decode', 'msg': encodeURI(params.srcUrl)};
        chrome.tabs.sendRequest(tab.id, message);
    }

    function clickGetGood(params) {
        if (params.selectionText.length >= 6) {
            if (/^[0-9]+$/.test(params.selectionText)) {//检查选择的字符是否数字
                var jdItem = params.menuItemId - params.parentMenuItemId == 1 ? "PC" : "mobile";
                switch (jdItem) {
                    case "PC":
                        chrome.tabs.create({url: 'https://item.jd.com/' + encodeURI(params.selectionText) + '.html'});
                        break;
                    case "mobile":
                        chrome.tabs.create({url: 'https://item.m.jd.com/product/' + encodeURI(params.selectionText) + '.html'});
                        break;
                    default:
                        chrome.tabs.create({url: 'https://item.jd.com/' + encodeURI(params.selectionText) + '.html'});
                        break;
                }
            } else {
                alert('请检查选中的字符是否为商品编号！');
            }
        } else {
            alert('商品编号有误！');
        }
    }

    function clickAddBlackList(params){
        var nickname = $URL.encode(params.selectionText);
        $.ajax({
            url: 'http://www.zuanke8.com/home.php?mod=spacecp&ac=friend&op=blacklist',
            dataType: 'json',
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: {"username":nickname,formhash:"ed1e1d45",blacklistsubmit:true,blacklistsubmit_btn:true},
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded",
            success: function (res) {
                console.log(res);
            },
            error: function (err) {

            }
        });
    }


    chrome.webRequest.onBeforeRequest.addListener(function (details){
        if(details.method === "POST" && details.url.indexOf('newBabelAwardCollection')>-1){
            var formData = details.requestBody.formData;
            var url = details.url;
            if(formData){
                // console.log(url + parseObject(formData));
                chrome.tabs.getSelected(function(tabs){
                    url = url + parseObject(formData);
                    var message = {'evt': 'url', 'url': url};
                    chrome.tabs.sendRequest(tabs.id, message);
                })

            }
        }
    },{urls: ["<all_urls>"]},["requestBody"]);

    function parseObject(obj){
        var str = "";
        for(var key in obj){
            if(obj[key][0]){
                str += `&${key}=${obj[key][0]}`;
            }
        }
        return str;
    }
})();

