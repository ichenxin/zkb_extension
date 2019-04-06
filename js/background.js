(function () {
    var options = {
        data: {
            page: 1,//页码
            mod: "all"//所有栏目

        },
        type: 'relist',//最新主题
        count: 100,//监控列表数目
        time: 5000,//监控间距
        popup_time: 5000,//弹窗通知时长
        notification: true,//是否开启通知
        blacklist:"",
        listen: true,//是否开启监听
        keywords: "电影,话费,水,票,洞,bug,券,红包,话费,关注,Q,B,q,币,京,东,券,领,线报,现金,领,首发,白菜,无限,软件,快,撸,零,一,0,1,元,货,流量"//关键词
    };
    var t1 = window.setInterval(function () {
        chrome.storage.local.get({'options': ''}, function (items) {
            var obj = items.options;
            if (obj) {
                obj = JSON.parse(obj);
                options.count = obj.count;
                options.time = obj.time;
                options.popup_time = obj.popup_time;
                options.notification = obj.notification;
                options.listen = obj.listen;
                options.blacklist = obj.blacklist;
                options.keywords = obj.keywords;
            }
            if (!options.listen) {//是否监听
                window.clearInterval(t1);
            } else {
                list();
            }
            if (options.notification) {//是否开启通知
                get('notifications', noticeQueque);
            }
        })
    }, options.time);


    function noticeQueque(arr) {
        if (arr) {
            var notifications = JSON.parse(arr);
            for (var i = 0; i < notifications.length; i++) {
                var obj = notifications[i];
                if (!obj.flag) {
                    notification(obj.tid, obj.msg,obj.cate);
                    notifications[i].flag = true;
                }
            }
            save('notifications', JSON.stringify(notifications));
        }
    }

    var t2,now;

    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    function notification(id, msg,cate) {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'img/icon.png',
            title: cate,
            message: msg
        }, function (notice_id) {
            t2 = setTimeout(function () {
                chrome.notifications.clear(notice_id, function () {

                });
            }, options.popup_time);
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
        var arr = str2arr(options.keywords);//关键词
        var blacklist = str2arr(options.blacklist);
        var _cache = [].concat(list);//数组复制
        for (var i = list.length - 1; i > -1; i--) {
            var _key = true;
            for (var j = 0; j < arr.length; j++) {
                if (list[i].subject.indexOf(arr[j]) > 0 && blacklist.indexOf(list[i].author) !== 0) {
                    _key = false;
                    var obj = {
                        tid: list[i].tid,
                        msg: list[i].subject,
                        cate:list[i].fname,
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
                if (items['notifications']) {
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
                } else {
                    var _obj = obj;
                    _obj._hasFlag = true;
                    save('notifications', JSON.stringify([_obj]));
                }
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
                    var data = res.data.relist;
                    save_thread(data);
                    push(data);
                }
            },
            error: function (err) {

            }
        });
    }

    function isNew(date) {
        now = new Date().format("yyyy-MM-dd hh:mm:ss");
        if (now.indexOf(date.substring(0,4)) > -1) {
            return true;
        }
        return false
    }

    //保存所有赚客大家谈数据【新旧数据合并】
    function save_thread(data){
        var obj = {};
        obj['thread'] = '';
        chrome.storage.local.get(obj, function (items) {
            var arr = items['thread'];
            if (arr) {
                arr = merge(data, arr);
            }
            save('thread', JSON.stringify(arr));
            clear_thread();
        });
    }

    //清洗数据
    function clear_thread(){
        var obj = {};
        obj['thread'] = '';
        chrome.storage.local.get(obj, function (items) {
            var threads = items['thread'];
            threads = JSON.parse(threads);
            for (var i = threads.length; i > -1; i--) {
                var thread = threads[i];
                if(thread){
                    var fname = thread.fname;
                    if(fname!=="赚客大家谈"){//栏目清洗
                        threads.splice(i,1);
                    }else{
                        var addtime = thread.addtime;
                        if(!compareTime(addtime)){//时间清洗
                            threads.splice(i,1);
                        }
                    }
                }
            }
            save('thread', JSON.stringify(threads));
        });
    }

    function compareTime(time){
        if(now.indexOf(time.substring(0,3)) === -1){//日月校验 当日有效,第二天的数据直接清空
            return false;
        }
        var thread_hour = +time.substring(6,8),hour = new Date().getHours(),
            tread_minutes = +time.substring(9,11),minutes = new Date().getMinutes() ;
        var thread_time = thread_hour*60 + tread_minutes,now_time = hour*60 + minutes;
        if(Math.abs(now_time-thread_time)>60){//小时校验
            return false
        }
        return true;
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
            } else {
                save(options.type, JSON.stringify(findKeyWord(data)));
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

    function clickAddBlackList(params) {
        // var nickname = $URL.encode(params.selectionText);
        var nickname = params.selectionText;
        $.ajax({
            url: 'http://www.zuanke8.com/home.php?mod=spacecp&ac=friend&op=blacklist',
            dataType: 'json',
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: {"username": nickname, formhash: "ed1e1d45", blacklistsubmit: true, blacklistsubmit_btn: true},
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded",
            success: function (res) {

            },
            error: function (err) {

            }
        });
    }


    chrome.webRequest.onBeforeRequest.addListener(function (details) {
        if (details.method === "POST" && details.url.indexOf('newBabelAwardCollection') > -1) {
            var formData = details.requestBody.formData;
            var url = details.url;
            if (formData) {
                // console.log(url + parseObject(formData));
                chrome.tabs.getSelected(function (tabs) {
                    url = url + parseObject(formData);
                    var message = {'evt': 'url', 'url': url};
                    chrome.tabs.sendRequest(tabs.id, message);
                })

            }
        }
    }, {urls: ["<all_urls>"]}, ["requestBody"]);

    function parseObject(obj) {
        var str = "";
        for (var key in obj) {
            if (obj[key][0]) {
                str += `&${key}=${obj[key][0]}`;
            }
        }
        return str;
    }



})();

