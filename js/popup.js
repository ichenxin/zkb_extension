$(function(){
    var current_version = 1.11;
    $.ajax({
        url: './manifest.json',
        type: 'GET',
        dataType: 'json',
        timeout: 1000,
        cache: false,
        success: function (res) {
            current_version = res.version;
            $('#versionNumber').html(current_version);
            getNewVerion();
        },
        error: function (e) {
            if (e.status === 404) {
                alert('获取数据失败！请检查网络是否畅通！');
            }
        }
    });

    function getNewVerion(){
        $.ajax({
            // url: './json/info.json',
            url: 'https://raw.githubusercontent.com/krapnikkk/zkb_extension/master/json/info.json',
            type: 'GET',
            dataType: 'json',
            timeout: 1000,
            cache: false,
            success: function (res) {
                var new_version = res.version;
                if(new_version>current_version){
                    $('.version-tip').show().html(res.msg);

                }
            },
            error: function (e) {
                if (e.status === 404) {
                    alert('获取数据失败！请检查网络是否畅通！');
                }
            }
        });
    }


});