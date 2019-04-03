window.onload = function(){
    var t1,t2,t3,r,d,bjtime;	 //设置定时器
    Date.prototype.toString = function() {
        return this.getFullYear()
            + "-" + (this.getMonth()>8?(this.getMonth()+1):"0"+(this.getMonth()+1))
            + "-" + (this.getDate()>9?this.getDate():"0"+this.getDate())
            + " " + (this.getHours()>9?this.getHours():"0"+this.getHours())
            + ":" + (this.getMinutes()>9?this.getMinutes():"0"+this.getMinutes())
            + ":" + (this.getSeconds()>9?this.getSeconds():"0"+this.getSeconds());
    };
    new Vue({
        el:'.layui-layout',
        data:{
            t1:'1999-01-01 00:00:00',//定时器
            now:null,
            hide:false,
            count:0,
            c:0,
            time:500,
            api:null,
            reapi:null,
            url:null,
            iframeCount:null,
            iframearr:[],
            nowDate:{   //定时时间
                year:00,
                mouth:00,
                day:00,
                hour:00,
                minutes:00,
                second:00
            },
            reDate:{  //倒计时
                day:null,
                hour:null,
                minutes:null,
                second:2
            }
        },
        methods:{
            getTime:function(){
                var self = this;
                fetch('https://api.m.jd.com/client.action?functionId=babelActivityGetShareInfo&client=wh5').then(function(res){
                    return res.json();
                }).then(function(value){
                    self.now = new Date(+value.time).toString();
                })
            },
            timer:function(){
                this.t1 = setInterval(this.getTime,1000)
            }
        },
        mounted: function () {
            this.timer();
        }
    })
}
