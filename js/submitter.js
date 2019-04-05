window.onload = function(){
    var form = layui.form,
        t1=null,//获取北京的定时器
        t2 =null,//倒计时的定时器
        t3 =null;//提交的定时器;
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
            now:{//当前北京时间
                string:'1999-01-01 00:00:00',
                timestamp:0,//时间戳
                year:null,
                month:null,
                day:null,
                hour:null,
                minutes:null,
                second:null
            },
            post_span:'500',//提交间隔
            post_url:'http://m.baidu.com/',//提交地址
            post_url_temp:null,//缓存提交地址
            post_count:0,//提交数次
            post_window_count:1,//提交窗口
            is_post:false,//是否正在提交
            post_window_arr:[],
            has_post_count:0,//提交次数
            count_down:{  //倒计时
                string:'1999-01-01 00:00:00',
                day:0,
                hour:0,
                minutes:0,
                second:0
            },
            post_time:{//提交定时
                year:null,
                month:null,
                day:null,
                hour:null,
                minutes:null,
                second:null
            }
        },
        methods:{
            getTime:function(){//获取北京时间
                var self = this;
                fetch('https://api.m.jd.com/client.action?functionId=babelActivityGetShareInfo&client=wh5').then(function(res){
                    return res.json();
                }).then(function(value){
                    var date = new Date(+value.time);
                    self.now.timestamp = +value.time;
                    self.now.year = date.getFullYear();
                    self.now.month = date.getMonth()+1;
                    self.now.day = date.getDate();
                    self.now.hour = date.getHours();
                    self.now.minutes = date.getMinutes();
                    self.now.second = date.getSeconds();
                    self.now.string = date.toString();

                })
            },
            timer:function(){//获取北京时间的定时器
                t1 = setInterval(this.getTime,1000)
            },
            setTime:function(){//初始化表单年月日默认值
                var now = new Date();
                this.post_time.year = now.getFullYear();
                this.post_time.month = now.getMonth()+1;
                this.post_time.day = now.getDate();
                this.post_time.hour = now.getHours();
            },
            post:function(){
                this.post_window_arr.length = this.post_window_count;
                this.is_post = true;
                this.post_url_temp = this.post_url;
                this.count_down.string = String(this.post_time.year)+"/"+String(this.post_time.month)+"/"+String(this.post_time.day)+" "+String(this.post_time.hour)+":"+String(this.post_time.minutes)+":"+String(this.post_time.second);  //拼接时间戳字符
                this.countDown();
            },
            cancel:function(){
                this.stop();
                this.is_post = false;
                this.post_url=this.post_url_temp;
                this.has_post_count = 0;
            },
            countDown:function(){//倒计时
                var self = this;
                t2 = window.setInterval(function(){
                    var t = new Date(self.count_down.string) - self.now.timestamp;
                    self.count_down.day=Math.floor(t/1000/60/60/24);
                    self.count_down.hour=Math.floor(t/1000/60/60%24);
                    self.count_down.minutes=Math.floor(t/1000/60%60);
                    self.count_down.second=Math.floor(t/1000%60);
                    if(t<=0){
                        self.count_down.day = 0;
                        self.count_down.hour=0;
                        self.count_down.minutes=0;
                        self.count_down.second=0;
                        self.commit();
                    }
                },500);

            },
            commit:function(){//提交
                window.clearInterval(t2);
                t2 = null;
                var self = this;
                t3=setInterval(function() {
                    //次数
                    self.has_post_count += Number(self.post_window_count);
                    //刷新提交地址
                    if(self.post_url.indexOf('?')>-1){
                        self.post_url = self.post_url_temp + "&t="+self.has_post_count;
                    }else{
                        self.post_url = self.post_url_temp + "?t="+self.has_post_count;
                    }
                    if(self.has_post_count>=self.post_count&&Number(self.post_count)!==0){
                        self.stop();
                    }
                },self.post_span);
            },
            stop:function(){//停止提交
                if(t2){
                    window.clearInterval(t2);
                    t2 = null;
                }
                if(t3){
                    window.clearInterval(t3);
                    t3 = null;
                }
            }
        },
        mounted: function () {
            var self = this;
            this.timer();
            this.setTime();
            form.on('submit(post)', function(){
                if(!self.is_post){
                    self.post();
                }else{
                    self.cancel();
                }
            });
        }
    })
}
