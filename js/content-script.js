chrome.extension.onRequest.addListener(function (message, sendid, sendResponse) {
    if (message.evt === "qrcode") {
        var type = message['type'], msg = message['msg'];
        qrcodeMaker(type, msg);
    }

});


//二维码解码&生成
function qrcodeMaker(type, data) {
    var version = "2.5.2", api , content;
    if (type === 'decode') {
        api = 'https://cli.im/api/browser/deqr';
        $.post(api, {data: data, version: version}, function (response) {
            if (response.status !== 1) {
                alert('二维码获取失败，请稍候再试！');
            } else {
                var RawData = response['data']['RawData'];
                var regex = "http://(([a-zA-z0-9]|-){1,}\\.){1,}[a-zA-z0-9]{1,}-*";//网址
                if (RawData.match(regex)) {
                    content = `<h3 style="position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;text-align:center;height:100px;"><a href="${RawData}" target="_blank">${RawData}</h3>`;
                }else{
                    content = `<h3 style="position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;text-align:center;height:100px;">${RawData}</h3>`;
                }
                layx.html('dom', '图片二维码解码', content, {
                    style: layx.multiLine(function () {/*
                                #layx-radiu-style{
                                    border-radius:20px;
                                    -webkit-border-radius:20px;
                                    -moz-border-radius:20px;
                                    -ms-border-radius:20px;
                                }

                                #layx-radiu-style .layx-window-icon{
                                    color:#5FB878;
                                }

                        */
                    })
                });
            }
        }, 'json');
    } else if (type === 'getImage') {
        api = 'https://cli.im/api/browser/generate';
        $.post(api, {data: data, version: version}, function (res) {
            if (res.status !== 1) {
                alert('生成二维码失败，请稍候再试！');
            } else {
                layx.html('dom', '二维码图片生成', `<img alt="qrcode" src=${res.data.qr_filepath} style="position:absolute;left:0;right:0;top:0;bottom:0;margin: auto;">`, {
                    position: 'lt',
                    style: layx.multiLine(function () {/*
                                #layx-radiu-style{
                                    border-radius:20px;
                                    -webkit-border-radius:20px;
                                    -moz-border-radius:20px;
                                    -ms-border-radius:20px;
                                }

                                #layx-radiu-style .layx-window-icon{
                                    color:#5FB878;
                                }

                        */
                    })
                });
            }
        }, 'json');
    }
}