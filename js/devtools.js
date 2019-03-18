var cookies = '';
chrome.storage.local.get({cookies: ''}, function (items) {
    cookies = items.cookies;
});
chrome.devtools.network.onRequestFinished.addListener(
    function (request) {
        if (cookies === '' && request.response.content.mimeType === "application/json") {
            if (request.request.url.indexOf('user/main.jsp') > -1) {
                // var cookies = spiltCookies(request.request.cookies);
                // chrome.storage.local.set({cookies: cookies}, function () {
                //
                // });
                'console.log(' + JSON.stringify(request) + ')'
            }
        }
    });

// function spiltCookies(ck) {
//     for (var i = 0; i < ck.length; i++) {
//         cookies += `${ck[i].name}=${ck[i].value};`;
//     }
//     if (cookies) {
//         return cookies;
//     }
// }