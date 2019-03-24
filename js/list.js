(function get (key) {
    var obj = {};
    obj[key]='';
    chrome.storage.local.get(obj, function (items) {
        // return items.relist;
        var data = items[key];
        list(data);
    });
    function list(res) {
        var data = JSON.parse(res);
        var ul = $('.fly-list'), li, a, title, info, nickname, views, replies;
        for (var i = 0, len = data.length; i < len; i++) {
            li = $('<li></li>');
            a = $(`<a href="http://www.zuanke8.com/space-uid-${data[i].authorid}.html" target="_blank" class="fly-avatar">${data[i].avatar}</a>`),
                title = $(`<h2><a class="layui-badge">${data[i].fname}</a> <a href="http://www.zuanke8.com/thread-${data[i].tid}-1-1.html" target="_blank">${data[i].subject}</a></h2>`,
                    info = $('<div class="fly-list-info"></div>'),
                    nickname = $(`<a href="http://www.zuanke8.com/space-uid-${data[i].authorid}.html" target="_blank"> <cite>${data[i].author}</cite></a><span>${data[i].addtime}</span>`),
                    views = $(`<span class="fly-list-kiss layui-hide-xs"><i class="iconfont icon-kiss"></i> ${data[i].views}</span>`),
                    replies = $(`<span class="fly-list-nums"> <i class="iconfont icon-pinglun1" title="回答"></i> ${data[i].replies} </span>`));
            info.prepend(nickname, views, replies);
            li.append(a, title, info);
            ul.append(li);
        }
    }
})('relist');

