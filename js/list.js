$(function () {
    var bg = chrome.extension.getBackgroundPage(), timer;
    var obj = {};
    obj['relist'] = '';
    chrome.storage.local.get(obj, function (items) {
        // return items.relist;
        var data = items['relist'];
        list(data);
    });

    function list(res) {
        var data = JSON.parse(res);
        var ul = $('.fly-list'), li, a, title, info, nickname, views, replies;
        ul.empty();
        for (var i = 0, len = data.length; i < len; i++) {
            li = $('<li></li>');
            // a = $(`<a href="http://www.zuanke8.com/space-uid-${data[i].authorid}.html" target="_blank" class="fly-avatar">${data[i].avatar}</a>`);
            a = $(`<a href="http://www.zuanke8.com/space-uid-${data[i].authorid}.html" target="_blank" class="fly-avatar"><img src="img/avatar.png" alt="logo"></a>`);
            title = $(`<h2><a class="layui-badge">${data[i].fname}</a> <a href="http://www.zuanke8.com/thread-${data[i].tid}-1-1.html" target="_blank">${data[i].subject}</a></h2>`);
            info = $('<div class="fly-list-info"></div>');
            nickname = $(`<a href="http://www.zuanke8.com/space-uid-${data[i].authorid}.html" target="_blank"> <cite>${data[i].author}</cite></a><span>${data[i].addtime}</span>`);
            views = $(`<span class="fly-list-kiss layui-hide-xs"><i class="iconfont icon-kiss"></i> ${data[i].views}</span>`);
            replies = $(`<span class="fly-list-nums"> <i class="iconfont icon-pinglun1" title="回答"></i> ${data[i].replies} </span>`);
            info.prepend(nickname, views, replies);
            li.append(a, title, info);
            ul.append(li);
        }
    };

    //加果热帖
    $('.btn-rate').on('click', function () {
        add_rate();
    });

    //获取rate
    function add_rate() {
        var obj = {};
        obj['thread'] = '';
        chrome.storage.local.get(obj, function (items) {
            var threads = items['thread'];
            threads = JSON.parse(threads);
            if (threads) {
                $('.btn-rate').addClass('layui-btn-disabled');
                var len = threads.length, counter = 0;
                for (var i = 0; i < len; i++) {
                    (function (n) {
                        var thread = threads[n];
                        // if(!thread['rate']&&thread['rate']!==0){
                        // thread['rate'] = get_rate(obj['tid'])
                        $.ajax({
                            url: 'http://www.zuanke8.com/api/mobile/index.php?sessionid=&version=4.1&zstamp=1553962728&module=viewthread&sign=97c3aa291dfaf14823ab7e9d5c228fdb',
                            type: 'post',
                            dataType: 'json',
                            xhrFields: {
                                withCredentials: true
                            },
                            data: {page: 1, tid: thread['tid']},
                            crossDomain: true,
                            contentType: "application/x-www-form-urlencoded",
                            async: true,
                            success: function (res) {
                                if (res.ResultCode === "1") {
                                    var rate_list = res.data.postlist;
                                    if (rate_list) {
                                        var rate = rate_list[0].ratelog;
                                        if (rate) {
                                            thread['rate'] = rate.length
                                        } else {
                                            thread['rate'] = 0;
                                        }
                                    } else {
                                        thread['rate'] = 0;
                                    }
                                } else {
                                    thread['rate'] = 0;
                                }
                                counter++;
                                $('.rate-list-details').html(`筛选排序中：${counter}/${len}`);
                                if (counter >= len) {
                                    save('thread', JSON.stringify(threads));
                                    get('thread', sort_rate);
                                    $('.btn-rate').removeClass('layui-btn-disabled');
                                }
                            }
                        });

                        // }
                    })(i);
                }
            } else {
                alert('暂未监听到任何数据！');
            }
        });
    }


    //查询加果数量，并重新排序
    function sort_rate(arr) {
        if (arr) {
            var rates = JSON.parse(arr);
            rates.sort(sortByObj('rate', true, parseInt));
            save('rates', JSON.stringify(rates));
            get('rates', list_rate);
        }
    }

    //对象数组排序
    function sortByObj(filed, rev, primer) {
        rev = (rev) ? -1 : 1;
        return function (a, b) {
            a = a[filed];
            b = b[filed];
            if (typeof (primer) !== 'undefined') {
                a = primer(a);
                b = primer(b);
            }
            if (a < b) {
                return rev * -1;
            }
            if (a > b) {
                return rev * 1;
            }
            return 1;
        }
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

    function list_rate(res) {
        var data = JSON.parse(res);
        var ul = $('.rate-list'), li, a, title, info, nickname, views, replies;
        ul.empty();
        for (var i = 0, len = data.length; i < len; i++) {
            li = $('<li></li>');
            // a = $(`<a href="http://www.zuanke8.com/space-uid-${data[i].authorid}.html" target="_blank" class="fly-avatar">${data[i].avatar}</a>`);
            a = $(`<a href="http://www.zuanke8.com/space-uid-${data[i].authorid}.html" target="_blank" class="fly-avatar"><img src="img/avatar.png" alt="logo"></a>`);
            title = $(`<h2><a class="layui-badge">${data[i].fname}</a> 
                                <a href="http://www.zuanke8.com/thread-${data[i].tid}-1-1.html" target="_blank">${data[i].subject}</a>
                                <a style="font-weight: 700;color:red;">评分数量：${data[i].rate}</a>
                                </h2>`);
            info = $('<div class="fly-list-info"></div>');
            nickname = $(`<a href="http://www.zuanke8.com/space-uid-${data[i].authorid}.html" target="_blank"> <cite>${data[i].author}</cite></a><span>${data[i].addtime}</span>`);
            views = $(`<span class="fly-list-kiss layui-hide-xs"><i class="iconfont icon-kiss"></i> ${data[i].views}</span>`);
            replies = $(`<span class="fly-list-nums"> <i class="iconfont icon-pinglun1" title="回答"></i> ${data[i].replies} </span>`);
            info.prepend(nickname, views, replies);
            li.append(a, title, info);
            ul.append(li);
        }
    }

    //回到顶部

    $('.layui-fixbar-top').on('click', function () {
        clearInterval(timer);
        timer = setInterval(function () {
            // 变量设置在定时器防止重置
            var backTop = $('.layui-layout-body')[0].scrollTop;
            var speedTop = backTop / 5;
            $('.layui-layout-body')[0].scrollTop = backTop - speedTop;
            if (backTop <= 0) {
                clearInterval(timer);
            }
        }, 30)
    })
});








