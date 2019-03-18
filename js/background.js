

chrome.notifications.create('msg', {
    type: 'basic',
    iconUrl: 'img/icon.png',
    title: '温馨提醒！',
    message: ''
});

chrome.notifications.onClicked.addListener(function(){
    chrome.notifications.clear('msg', function(){
        window.open("http://baidu.com", "_blank");
    });
});

var data = {
    page:1,
    mod:"all"
};
$.ajax({
    url: 'http://www.zuanke8.com/api/mobile/index.php?sessionid=&version=4.1&zstamp=1552628345&module=zuixin&sign=1c6c5e06377fcc461226805e727e9908',
    dataType: 'json',
    type: 'POST',
    xhrFields: {
        withCredentials: true
    },
    data:data,
    crossDomain: true,
    contentType: "application/x-www-form-urlencoded",
    success: function (res) {
        console.log(res.data.relist);
    },
    error: function (err) {

    }
});
