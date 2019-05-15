var url = window.location.href;
if (url.indexOf('myJdcomments') > -1) {
    jdSign();
}else if(url.indexOf('my_cmmdty_review') > -1){
    snSign();
}

function jdSign() {
    $("body").prepend('<iframe src="https://club.jd.com/myJdcomments/myJdcomment.action?sort=0" style="width:99%;height:800px" id="JDifr"></iframe>');
    var isFiveStar = true;
    $("#topTitle").click(function () {
        (isFiveStar = !isFiveStar) ? $("#topTitle").css("background-color", "#e2231a") : $("#topTitle").css("background-color", "#8B0000");
    });
    var pendingNum = 1;
    var waitSubmitIds;
    var curId = 0;
    var maxCurId = 0;
    $("#JDifr").load(function () {
        if ($("#JDifr").attr("src").indexOf("sort") > 0) {
            pendingNum = ($("#JDifr").contents().find("a.text:first").siblings().length > 0 && $("#JDifr").contents().find("a.text:first").attr("href") == "?sort=0") ? parseInt($("#JDifr").contents().find("a.text:first").next().text()) : 0;
            waitSubmitIds = $("#JDifr").contents().find(".number").length > 0 ? $("#JDifr").contents().find(".number").text().match(/\d{10,12}/g) : 0;
            maxCurId = waitSubmitIds ? waitSubmitIds.length : 0;
            curId = 0;
            if (pendingNum !== 0 && maxCurId > 0) {
                gotoNextURL("order");
            } else {
                alert("订单全部评价完毕！！！");
            }
        } else if ($("#JDifr").attr("src").indexOf("ruleid") > 0 && curId < maxCurId) {
            sumbitEvaluate();
            gotoNextURL("order");
        } else if (curId === maxCurId) {
            gotoNextURL("main");
        } else {
            alert("异常了！联系作者！");
        }
        $("#JDifr").contents().find("html").css("overflow", "hidden");
    });

    function gotoNextURL(nextURL) {
        trueNextURL = (nextURL === "main") ? ("https://club.jd.com/myJdcomments/myJdcomment.action?sort=0") : ("https://club.jd.com/myJdcomments/orderVoucher.action?ruleid=" + waitSubmitIds[curId]);
        window.setTimeout(function () {
                $("#JDifr").attr("src", trueNextURL);
            },
            4000);
    }

    function sumbitEvaluate() {
        if ($("#JDifr").attr("src").indexOf("club.jd.com") > 0) {
            var tempInter,
                isTag,
                contentArr = [
                    '商品质量很好，很满意，配送速度快啊，而且配送员态度也非常好。',
                    '挺好的，非常实用。京东的物流很快哟~希望以后会更快╭(╯3╰)╮',
                    '多快好省，京东给力，下次还是要选择京东商城，没错，非常满意', '非常好，一起买的，价格便宜，快递又快，京东商城还是非常的专业和贴心!',
                    '活动期间买的很实惠，京东自营，值得信赖。', '便宜好用，值得推荐买买买，同事都说好用。下次继续买买买，哈哈哈…',
                    '京东物流就是一个字快，昨晚10点多，11点前下的单今天早上就收到，包装得很好。', '京东购物使我们的生活更便捷了！京东商品丰富，无所不有，自营商品更是价格优惠！',
                    '一直上京东商城网购，东西非常不错，价格便宜，物流快，是正品', '质量很好，性价比高，值得购买，送货速度快！！', '怒赞！（此评论虽仅有两个字，可谓言简意赅，一字千金，字字扣人心弦!',
                    '我为什么喜欢在京东买东西，因为今天买明天就可以送到。', '非常感谢京东商城给予的优质的服务，从仓储管理、物流配送等各方面都是做的非常好的。',
                    '多快好省，京东给力，下次还是要选择京东商城，没错，非常满意',
                    '非常好，一起买的，价格便宜，快递又快，京东商城还是非常的专业和贴心，可以显示快递的位置，随时掌握快递进度，很先进！',
                    '活动期间买的很实惠，京东自营，值得信赖。',
                    '便宜好用，值得推荐买买买，同事都说好用。下次继续买买买，哈哈哈…',
                    '京东物流就是一个字快，昨晚10点多，11点前下的单今天早上就收到，包装得很好。',
                    '京东购物使我们的生活更便捷了！京东商品丰富，无所不有，自营商品更是价格优惠，童叟无欺。快递给力，包装实在。体验足不出户购物的感觉，就在京东！购物就上京东，有京东，足够！',
                    '一直上京东商城网购，东西非常不错，价格便宜，物流快，是正品',
                    '质量很好，性价比高，值得购买，送货速度快！！',
                    '怒赞！（此评论虽仅有两个字，可谓言简意赅，一字千金，字字扣人心弦，催人泪下，足可见评论人扎实的文字功底和信手拈来的写作技巧，再加上以感叹号收尾，点睛之笔，妙笔生花，意境深远，把评论人的感情表达得淋漓尽致，有浑然天成之感，实乃评论中之极品，祝福中之绝笔也）'
                ];
            tempInter = setInterval(function () {
                    window.clearInterval(tempInter);
                    $("#JDifr").contents().find(".star5:visible").each(function () {
                        isFiveStar ? $(this).click() : (Math.random(0, 1) > 0.5 ? $(this).click() : $(this).siblings('.star4').click());
                    });
                    isTag = $("#JDifr").contents().find(".m-tagbox a");
                    if (isTag) {
                        $("#JDifr").contents().find(".m-tagbox a:first-child").addClass("tag-checked");
                    }
                    var tLen = $("#JDifr").contents().find('textarea:visible').length;
                    if (tLen) {
                        for (var ti = 0; ti < tLen; ti++) {
                            $("#JDifr").contents().find('textarea:visible').eq(ti).text(contentArr[Math.floor(contentArr.length * Math.random())]);
                        }
                    }
                    window.setTimeout(function () {
                            $("#JDifr").contents().find('.btn-submit')[0].click();
                            curId++;
                        },
                        2000);
                },
                1000);
        }
    }
}

function snSign(){
    var contentArr = ['商品质量很好，很满意，配送速度快啊，而且配送员态度也非常好。',
        '挺好的，非常实用。苏宁的物流很快哟~希望以后会更快╭(╯3╰)╮',
        '苏宁给力，下次还是要选择苏宁商城，没错，非常满意',
        '非常好，一起买的，价格便宜，快递又快，苏宁商城还是非常的专业和贴心，可以显示快递的位置，随时掌握快递进度，很先进！',
        '活动期间买的很实惠，苏宁自营，值得信赖。',
        '便宜好用，值得推荐买买买，同事都说好用。下次继续买买买，哈哈哈…',
        '苏宁就是一个字快，昨晚10点多，11点前下的单今天早上就收到，包装得很好。',
        '苏宁购物使我们的生活更便捷了！苏宁商品丰富，无所不有，自营商品更是价格优惠，童叟无欺。快递给力，包装实在。体验足不出户购物的感觉，就在苏宁！购物就上苏宁，有苏宁，足够！',
        '一直上苏宁商城网购，东西非常不错，价格便宜，物流快，是正品',
        '质量很好，性价比高，值得购买，送货速度快！！',
        '怒赞！（此评论虽仅有两个字，可谓言简意赅，一字千金，字字扣人心弦，催人泪下，足可见评论人扎实的文字功底和信手拈来的写作技巧，再加上以感叹号收尾，点睛之笔，妙笔生花，意境深远，把评论人的感情表达得淋漓尽致，有浑然天成之感，实乃评论中之极品，祝福中之绝笔也）'
    ];
    var t1 = setInterval(function(){
        var i =parseInt(10*Math.random());
        if($('.btn-evlu').length>0){
            $('.btn-evlu').eq(0).trigger("click");
            $('.thought-wrap textarea').val(contentArr[i]);;
            setTimeout(function(){
                $('.cmt-btn').eq(0).trigger("click");
            },2000);
            setTimeout(function(){
                $('.comment-item-wrap').eq(0).remove();
            },3000)
        }else{
            alert("暂无更多商品评价！");
            window.clearInterval(t1);
        }
    },4000)
}

if (document.querySelector('#Beijing_z43d')){
    time_is_widget.init({Beijing_z43d:{}});
}


