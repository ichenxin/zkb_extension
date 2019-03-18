
//无需再执行layui.use()方法加载模块，直接使用即可
var form = layui.form,element = layui.element,layer = layui.layer;

$(function() {
    $.ajax({
        url: 'http://99shou.cn/charge/phone/list',
        dataType: 'json',
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        contentType: "application/json",
        success: function (res) {

        },
        error: function (err) {

        }
    });
});




