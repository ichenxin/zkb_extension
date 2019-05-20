$(function () {
//获取数据
    var content, item, row, body = $('.layui-tab-content'), col,
        card, card_header, card_body;
    $.ajax({
        url: './json/script.json',
        // url: 'https://raw.githubusercontent.com/krapnikkk/zkb_extension/master/json/nav.json',
        type: 'GET',
        dataType: 'json',
        timeout: 3000,
        cache: false,
        success: function (res) {
            content = res.data;
            chrome.storage.local.get({'activate': ''}, function (obj) {
                list(content, obj['activate']);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus === "timeout") {
                alert('获取数据失败！好像网络不大支持访问github哦！');
            }
        }
    });

    function list(content, flag) {
        row = $(`<div class="layui-row layui-col-space15"></div>`);
        body.append(row);
        for (var i = 0, len = content.length; i < len; i++) {
            item = content[i];
            col = $(`<div class="layui-col-md3"></div>`);
            row.append(col);
            card = $(`<div class="layui-card"></div>`);
            col.append(card);
            card_header = $(`<div class="layui-card-header">${item.name}</div>`);
            if (flag) {

                card_body = $(`<div class="layui-card-body"><p>使用有效期：${item.active_time}</p><p><span>是否可用：${item.switch === 1 ? '是' : '否'}</span><span style="margin-left:20px">需要激活：${item.activate === 1 ? '是' : '否'}</span></p><p class="layui-card-conetnt">${item.intro}</p><div class="layui-btn-container"><a href="${item.details_url}" target="_blank"><button class="layui-btn layui-btn-sm layui-btn-radius">前往使用</button></a></div></div>`);
            } else {
                if (item.activate == 0) {
                    card_body = $(`<div class="layui-card-body"><p>使用有效期：${item.active_time}</p><p><span>是否可用：${item.switch === 1 ? '是' : '否'}</span><span style="margin-left:20px">需要激活：${item.activate === 1 ? '是' : '否'}</span></p><p class="layui-card-conetnt">${item.intro}</p><div class="layui-btn-container"><a href="${item.details_url}" target="_blank"><button class="layui-btn layui-btn-sm layui-btn-radius">前往使用</button></a></div></div>`);
                } else {
                    card_body = $(`<div class="layui-card-body"><p>使用有效期：${item.active_time}</p><p><span>是否可用：${item.switch === 1 ? '是' : '否'}</span><span style="margin-left:20px">需要激活：${item.activate === 1 ? '是' : '否'}</span></p><p class="layui-card-conetnt">${item.intro}</p><div class="layui-btn-container"><a class=""><button class="layui-btn layui-btn-sm layui-btn-radius btn-unsign">前往使用</button></a></div></div>`);
                }
            }
            card.append(card_header, card_body);
        }
        $('.btn-unsign').on('click',function(){
            alert('请先激活后再使用该脚本！');
        })
    }

    //回到顶部
    var timer;
    $('.layui-fixbar-top').on('click', function () {
        clearInterval(timer);
        timer = setInterval(function () {
            // 变量设置在定时器防止重置
            var backTop = $('.layui-body')[0].scrollTop;
            var speedTop = backTop / 5;
            $('.layui-body')[0].scrollTop = backTop - speedTop;
            if (backTop <= 0) {
                clearInterval(timer);
            }
        }, 30)
    })

});