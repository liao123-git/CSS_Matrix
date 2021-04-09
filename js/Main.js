class Main {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.car = $('.car');
        this.dir = [0, 0, 0, 0];
        this.init();
    }

    init() {
        this.update();
        $(window).keydown((e) => {
            this.keyEvent(e, .01);
        }).keyup((e) => {
            this.keyEvent(e);
        })
    }

    keyEvent(e, down = 0) {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            /* 点击的键盘为上下左右其中一个 */

            if (down && this.dir[e.keyCode - 37]) {
                /* 由于长摁键盘会进多次 键盘点击事件(keydown) ，所以要判断在点击键盘时 方向数组对应值(this.dir[e.keyCode - 37]) 为 0 才能重新赋值，否则就等于自身 */
                down = this.dir[e.keyCode - 37];
            }

            this.dir[e.keyCode - 37] = down;
        }
    }

    carTransform() {
        let distance = 0; // 移动距离，斜边，用来计算新的坐标
        let is_moving = 0; // 是否在移动，是的话记录当前移动速度

        this.dir.forEach((v, k) => {
            /* 移动 */

            if (k === 1 || k === 3) {
                /* 只有上和下能进 */

                if (v) {
                    /* 键盘处于点击的状态 */

                    if (is_moving) {
                        /* 防止上和下同时点击 */

                        distance = 0;
                        this.dir[1] -= .005;
                        is_moving = 0;
                    } else {
                        if (v < 2) this.dir[k] += .005;
                        /* 速度最高为 2 */

                        distance -= (k - 2) * v;
                        /* 根据速度算出本次移动的距离，如果 k = 1 , (k - 2) * v = -1 * v  */

                        is_moving = this.dir[k];
                        /* 记录当前速度，旋转角度由移动速度得出 */
                    }
                }
            }
/*
            原版
            v && v < 2 && (this.dir[k] += .005);
            is_moving ? (v !== 0 && k % 2 !== 0 && (distance -= (k - 2) * v) && (is_moving = this.dir[k])) : ((distance = 0) && (this.dir[1] -= .005));
*/
        });

        this.dir.forEach((v, k) => {
            /* 旋转 */

            if (k === 0 || k === 2) {
                /* 只有左和右能进 */

                if (v) {
                    /* 键盘处于点击的状态 */

                    this.angle += (k - 1) * is_moving * .3;
                    /* 根据移动速度算出旋转角度 */
                }
            }
/*
            原版
            v !== 0 && k % 2 === 0 && (this.angle += (k - 1) * is_moving * .3);
*/
        });

        let radian = this.angle / 180 * Math.PI; // 角度转弧度

        let a = Math.cos(radian);
        let b = Math.sin(radian);
        let c = -Math.sin(radian);
        let d = Math.cos(radian);
        /* 矩阵的四个小项 */

        this.x += Math.sin(radian) * distance;
        this.y -= Math.cos(radian) * distance;
        /* 新坐标 */

        this.car.css({
            transform: `matrix(${a},${b},${c},${d},${this.x},${this.y})`,
        });
    }

    update() {
        this.carTransform();
        window.setInterval(() => {
            this.carTransform();
        }, 1000 / config.REFRESH_RATE);
    }
}

$(() => {
    new Main();
});
