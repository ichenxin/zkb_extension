$(function () {
//获取数据
    var nav_item, nav_name, nav = $('.layui-nav-tree'), content, item_list, item, row, body = $('.layui-body'), col,
        card, card_header, card_body;
    $.ajax({
        url: './json/nav.json',
        // url: 'https://raw.githubusercontent.com/krapnikkk/forumHelper/master/app.json',
        type: 'GET',
        dataType: 'json',
        timeout: 1000,
        cache: false,
        success: function (res) {
            content = res.content;
            for (var i = 0, len = content.length; i < len; i++) {
                nav_item = content[i].item;
                nav_name = content[i].name;
                item_list = content[i].list;
                nav.append($(`<li class="layui-nav-item"><a href="#${nav_item}">${nav_name}</a></li>`));
                row = $(`<div class="layui-row layui-col-space15"><h2 id="${nav_item}">${nav_name}</h2></div>`);
                body.append(row);
                for (var j = 0; j < item_list.length; j++) {
                    item = item_list[j];
                    col = $(`<div class="layui-col-md3"></div>`);
                    card = $(`<div class="layui-card"></div>`);
                    col.append(card);
                    if (item.type === 1) {
                        card_header = $(`<div class="layui-card-header text-red">${item.name}</div>`);
                    } else {
                        card_header = $(`<div class="layui-card-header">${item.name}</div>`);
                    }
                    if(item.sub_url){
                        card_body = $(`<div class="layui-card-body"><p class="layui-card-conetnt">${item.desc}</p><div class="layui-btn-container"><a href="${item.url}" target="_blank"><button class="layui-btn layui-btn-sm layui-btn-radius">直达链接</button></a><a href="${item.sub_url}" target="_blank"><button class="layui-btn layui-btn-sm layui-btn-radius">推广链接</button></a></div></div>`);
                    }else{
                        card_body = $(`<div class="layui-card-body"><p class="layui-card-conetnt">${item.desc}</p><div class="layui-btn-container"><a href="${item.url}" target="_blank"><button class="layui-btn layui-btn-sm layui-btn-radius">直达链接</button></a></div></div>`);
                    }
                    card.append(card_header, card_body);
                    row.append(col);
                }
            }
            $('.update_date').html(res.time);
        },
        error: function (e) {
            if (e.status === 404) {
                alert('获取数据失败！请检查网络是否畅通！');
            }
        }
    });

    //回到顶部
    var timer;
    $('.layui-fixbar-top').on('click',function(){
        timer = setInterval(function(){
            // 变量设置在定时器防止重置
            var backTop = $('.layui-body')[0].scrollTop;
            var speedTop =   backTop/5;
            $('.layui-body')[0].scrollTop = backTop - speedTop;
            if(backTop <= 0){
                clearInterval(timer);
            }
        },30)

    })
});