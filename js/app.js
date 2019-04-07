(function() {
    var t = document.querySelector("#starCanvas");
    var i = t.getContext("2d");
    var n = {}
        , a = 0
        , r = {
        r: 1400,
        height: 260,
        density: 300,
        maxLife: 100,
        groundLevel: t.height,
        leftWall: 0,
        rightWall: t.width,
        alpha: 0,
        maxAlpha: 1
    };
    var o = function() {
        var e = Math.random();
        var t = Math.ceil(1 / (1 - e));
        var i = [];
        for (var n = 0; n < t; n++) {
            i.push(Math.random())
        }
        return Math.min.apply(null, i)
    };
    function l() {
        t.width = window.innerWidth;
        t.height = window.innerHeight;
        r.rightWall = t.width;
        r.groundLevel = t.height;
        for (var e in n) {
            n[e].y = o() * t.height
        }
        s();
        if (t.width <= 480) {
            document.body.className = "mobile"
        } else {
            document.body.className = "pc"
        }
    }
    l();
    window.addEventListener("resize", l);
    function s() {
        i.clearRect(0, 0, t.width, t.height)
    }
    function c() {
        var e = t.width / 2
            , i = t.height;
        this.x = Math.floor(Math.random() * t.width);
        this.y = o() * t.height;
        this.vx = Math.random() * .1 + .05;
        this.particleSize = .5 + (Math.random() + .1 / 4);
        a++;
        n[a] = this;
        this.alpha = 0;
        this.maxAlpha = .2 + this.y / t.height * Math.random() * .8;
        this.alphaAction = 1
    }
    c.prototype.draw = function() {
        this.x += this.vx;
        if (this.alphaAction == 1) {
            if (this.alpha < this.maxAlpha) {
                this.alpha += .005
            } else {
                this.alphaAction = -1
            }
        } else {
            if (this.alpha > .2) {
                this.alpha -= .002
            } else {
                this.alphaAction = 1
            }
        }
        if (this.x + this.particleSize * 2 >= r.rightWall) {
            this.x = this.x - r.rightWall
        }
        i.beginPath();
        i.fillStyle = "rgba(255,255,255," + this.alpha.toString() + ")";
        i.arc(this.x, this.y, this.particleSize, 0, Math.PI * 2, true);
        i.closePath();
        i.fill()
    }
    ;
    function u() {
        s();
        var e = 400;
        if (!history.pushState) {
            e = 200
        } else if (document.msHidden != undefined) {
            e = 300
        }
        if (screen.width < 1024) {
            e = 200
        }
        if (screen.width < 640) {
            e = 100
        }
        if (Object.keys(n).length > e) {
            r.density = 0
        }
        for (var t = 0; t < r.density; t++) {
            if (Math.random() > .97) {
                new c
            }
        }
        for (var t in n) {
            n[t].draw()
        }
        requestAnimationFrame(u)
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(e) {
            setTimeout(e, 17)
        }
    }
    u();

})();