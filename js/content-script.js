chrome.extension.onRequest.addListener(function (message, sendid, sendResponse) {
    if (message.evt === "qrcode") {
        var type = message['type'], msg = message['msg'];
        qrcodeMaker(type, msg);
    } else if (message.evt === "url") {
        var url = message.url;
        sendURL(url);
    }
});

//二维码解码&生成
function qrcodeMaker(type, data) {
    var version = "2.5.2", api, content;
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
                } else {
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

//京东整点领券地址
function sendURL(url) {
    var content = `<div style="position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;text-align:center;height:500px;">
                    <div class="layui-form-item">
                        <textarea id="copyInput" name="url" style="width:700px;height:300px;margin:10px auto;display: block">${url}</textarea>
                        <button id="btn-copy" style="display: inline-block;height: 38px;line-height: 38px;background-color: rgb(0, 150, 136);color: rgb(255, 255, 255);white-space: nowrap;text-align: center;font-size: 14px;cursor: pointer;padding: 0px 18px;border-width: initial;border-style: none;border-color: initial;border-image: initial;border-radius: 2px;">复制</button>
                    </div>
                    <h3><a href="./submitter.html" target="_blank">定时提交器</a></h3>
                    </div>`;
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
    $('#btn-copy').on('click', function () {
        $('#copyInput').select();
        var tag = document.execCommand("Copy");
        if (tag) {
            alert('已经将内容复制到粘贴板！');
            window.open("./submitter.html","_blank");
        }
    })
}

// 向页面注入JS
function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.setAttribute('charset', 'utf-8');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}



var url = window.location.href;
if(url.indexOf('myJdcomment')>-1){
    layx.confirm('插件提示','检测到您正在进行京东评价，是否自动评价？',null,{
        buttons:[
            {
                label:'确定',
                callback:function(id, button, event){
                    injectCustomJs();
                    layx.destroy(id);
                }
            },
            {
                label:'关闭',
                callback:function(id, button, event){
                    layx.destroy(id);
                }
            }
        ]
    });
}else if(url.indexOf('my_cmmdty_review') > -1){
    layx.confirm('插件提示','检测到您正在进行苏宁评价，是否自动评价？',null,{
        buttons:[
            {
                label:'确定',
                callback:function(id, button, event){
                    injectCustomJs();
                    layx.destroy(id);
                }
            },
            {
                label:'关闭',
                callback:function(id, button, event){
                    layx.destroy(id);
                }
            }
        ]
    });
}