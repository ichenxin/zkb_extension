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
                        <button id="btn-copy" style="display: inline-block;height: 38px;line-height: 38px;background-color: rgb(0, 150, 136);color: rgb(255, 255, 255);white-space: nowrap;text-align: center;font-size: 14px;cursor: pointer;padding: 0px 18px;border-width: initial;border-style: none;border-color: initial;border-image: initial;border-radius: 2px;">复制并前往定时提交器</button>
                    </div>
                    </div>`;
    layx.html('dom', '图片二维码解码', content, {
        style: layx.multiLine(function () {
            /*
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
            chrome.runtime.sendMessage({}, function (response) {
            });
        }
    })
}

// 向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    temp.setAttribute('charset', 'utf-8');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        // this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}

/**
 * 拉取脚本列表
 */
function getScript() {
    $.ajax({
        // url: chrome.extension.getURL('json/script.json'),
        url: 'https://raw.githubusercontent.com/krapnikkk/zkb_extension/master/json/script.json',
        type: 'GET',
        dataType: 'json',
        timeout: 1000,
        cache: false,
        success: function (res) {
            var data = res.data;
            chrome.storage.local.set({'script': JSON.stringify(data)}, function () {
                createScript();
            });
        },
        error: function (e) {

        }
    });
}

/**
 * 构建insert脚本
 */
function createScript() {
    chrome.storage.local.get({'script': ""}, function (items) {
        var data = JSON.parse(items['script']);
        chrome.storage.local.get({'activate': ''}, function (args) {
            var activate = Boolean(args['activate']);
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (obj.switch) {
                    if (Boolean(obj['activate']) === activate || obj['free'] === 1) {//activate||free
                        if (window.location.href.indexOf(obj.url) > -1) {//url
                            if (obj['show_time']) {
                                craetTimeWidget(obj['name'], obj['intro']);//加载时间面板
                                injectCustomJs();
                            }
                            var fn = b64_to_utf8(obj.content);
                            if (fn) {
                                try {
                                    eval(fn);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }
                        }
                    }
                }
            }
        });
    });
}

/**
 * 创建时间控件
 */
function craetTimeWidget(name, intro) {
    var dom = $(`<div class="time_widget" style="width:300px;height:100px; text-align:center;background-color: #f6f6f6; position: fixed;top:0px;z-index:99999;"><div><a href="https://time.is/Beijing" id="time_is_link" rel="nofollow" style="font-size:18px">北京时间:</a> <span id="Beijing_z43d" style="font-size:18px"></span></div><h2>${name}</h2><p>${intro}</p></div>`);
    $('body').prepend(dom);
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

injectCustomJs('js/t.js');
getScript();
