/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-09-05 03:08:59
 * @Email:  codearvin@gmail.com
 * @Filename: gesture.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-09-05 03:25:08
 * @description: 移动端手势库的简单实现，参考：https://juejin.im/post/5a795e6d6fb9a0635630fe2b
 *               实现了下面几种手势：
 *               1. `touchstart`
 *               2. `touchmove`
 *               3. `touchend`
 *               4. `touchcancel`
 *               5. `tap`: 单击
 *               6. `longtap`: 长按
 *               7. `dbtap`: 双击
 *               8. `swipe`: 快速滑过屏幕
 *               9. `slide`: 滑动
 *               10. `pinch`: 缩放
 *               11. `rotate`: 旋转
 * @questions:
 * 1. params是公用的
 * 2. swipe现在是按照起点终点来判断的，感觉不太好
 * @use: const gesture = new Gesture(target, selector); // 创建实例
 *       gesture.on('tap', (params, event) => {});      // 监听事件，支持链式调用
 *       gesture.off('tap');                            // 卸载对应全部回调
 *       gesture.destory();                             // 销毁实例
 */


function Gesture(target, selector) {
    this.target = target instanceof HTMLElement ?
                  target :
                  (
                      typeof target === 'string' ?
                      document.querySelector(target) :
                      null
                  );
    // 找不到则不初始化
    if (!this.target) return;

    // 绑定基本事件，需要注意this的指向，事件的处理方法均在prototype实现
    this._touch = this._touch.bind(this);
    this._move = this._move.bind(this);
    this._end = this._end.bind(this);
    this._cancel = this._cancel.bind(this);
    this.target.addEventListener('touchstart', this._touch);
    this.target.addEventListener('touchmove', this._move);
    this.target.addEventListener('touchend', this._end);
    this.target.addEventListener('touchcancel', this._cancel);

    this.selector = selector; // 选择器a
    this.pretouch = {}; // 双击需要记录上一次触摸的手指信息
    this.longTapTimeout = null; // 用于触发长按的定时器
    this.tapTimeout = null; // 用于触发点击的定时器
    this.doubleTap = false; // 用于记录是否执行双击的定时器
    this.handles = {}; // 用于存放回调函数
    this._init();

}

// util
/**
 * obj是否是selector对应的元素的后代元素
 * @param  {Object}  obj      目标元素
 * @param  {String}  selector 目标父元素的选择器
 * @return {Boolean}          目标元素是否是选择器代表的元素的后代
 */
const isTarget = (obj, selector) => {
    while (obj !== undefined && obj !== null && obj.tagName.toUpperCase() !== 'BODY') {
        if (obj.matches(selector)) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
};

/**
 * 计算向量的模
 * @param  {Object} v { x, y }
 * @return {Number}   向量的模
 */
const calcLen = v => Math.sqrt(v.x**2 + v.y**2);

/**
 * 计算两个向量的夹角
 * @param  {Object} a { x, y }
 * @param  {Object} b { x, y }
 * @return {Number}   顺时针为正，逆时针为负
 */
const calcAngle = (a, b) => {
    const l = calcLen(a) * calcLen(b);
    let cosValue, angle;

    if (l) {
        cosValue = (a.x * b.x + a.y * b.y) / l;
        angle = Math.acos(Math.min(cosValue, 1));
        angle = (a.x * b.y - b.x * a.y) > 0 ? -angle : angle;
        return angle * 180 / Math.PI;
    }

    return 0;
}


Gesture.prototype = {
    constructor: Gesture,

    _init: function() {
        // 参数初始化
        this.touch = {};
        this.movetouch = {};
        this.params = {
            zoom: 1, // 缩放
            deltaX: 0, // 移动中前后两个位置X坐标差值
            deltaY: 0, // 移动中前后两个位置Y坐标差值
            diffX: 0, // 当前位置与首次触摸位置X坐标差值
            diffY: 0, // 当前位置与首次触摸位置Y坐标差值
            angle: 0, // 双指旋转角度
            direction: '' // 滑动方向，目前是按照手指接触和离开屏幕位置坐标来计算的
        };
    },

    _touch: function(e) {
        this.params.event = e; // 记录触摸时的事件对象，params为回调时的传参
        this.e = e.target; // 触摸的具体元素
        let point = e.touches ? e.touches[0] : e; // 获得触摸参数
        let now = Date.now();

        // 触摸相关参数
        this.touch.startX = point.pageX; // 首次触摸X坐标
        this.touch.startY = point.pageY; // 首次触摸Y坐标
        this.touch.startTime = now; // 首次触摸时间戳

        // 由于多次触摸的情况，单击和双击都是针对单次触摸，需要先清空定时器
        this.longTapTimeout && clearTimeout(this.longTapTimeout);
        this.tapTimeout && clearTimeout(this.tapTimeout);
        this.doubleTap = false;

        this._emit('touchstart'); // 执行原生的touchstart回调

        if (e.touches.length > 1) {
            // 多点触摸
            let point2 = e.touches[1];
            this.preVector = { // 首次触摸前两个手指的向量
                x: point2.pageX - this.touch.startX,
                y: point2.pageX - this.touch.startY
            };
            this.startDistance = calcLen(this.preVector); // 首次触摸向量长度
        } else {
            // 单点触摸
            let self = this;

            // 手指触摸后立即开启长按定时器，800ms后执行
            this.longTapTimeout = setTimeout(function() {
                self._emit('longtap');
                self.doubleTap = false;
                e.preventDefault(); // 这里是什么意思？
            }, 800);

            // 计算是否为双击
            // 两次点击时间在300ms以内 且 X、Y坐标相差30px以内算作双击
            this.doubleTap = this.pretouch.time &&
                             now - this.pretouch.time < 300 &&
                             Math.abs(this.touch.startX - this.pretouch.startX) < 30 &&
                             Math.abs(this.touch.startY - this.pretouch.startY) < 30;

            // 更新pretouch
            this.pretouch = {
                startX: this.touch.startX,
                startY: this.touch.startY,
                time: this.touch.startTime
            };
        }

    },

    _move: function(e) {
        let point = e.touches ? e.touches[0] : e;
        this._emit('touchmove'); // 执行原生的touchmove回调

        if (e.touches.length > 1) {
            // 多指触摸
            const point2 = e.touches[1];
            const v = { // 当前触摸前两指向量
                x: point2.pageX - point.pageX,
                y: point2.pageY - point.pageY
            };

            if (this.preVector.x !== null) {
                if (this.startDistance) { // 根据当前向量长度与首次触摸向量长度计算缩放值
                    this.params.zoom = calcLen(v) / this.startDistance;
                    this._emit('pinch');
                }
                this.params.angle = calcAngle(v, this.preVector); // 根据移动前后两个向量(**不是和首次触摸向量**)计算旋转角度，顺时针为正，逆时针为负
                this._emit('rotate');
            }
            // 更新上一次移动向量坐标
            this.preVector.x = v.x;
            this.preVector.y = v.y;
        } else {
            // 单指触摸

            // 与手指刚触摸时的相对坐标
            let diffX = this.params.diffX = point.pageX - this.touch.startX;
            let diffY = this.params.diffY = point.pageY - this.touch.startY;

            // 与上一次移动的相对坐标
            if (this.movetouch.x) {
                this.params.deltaX = point.pageX - this.movetouch.x;
                this.params.deltaY = point.pageY - this.movetouch.y;
            } else {
                this.params.deltaX = this.params.deltaY = 0;
            }

            // 手指滑动距离超过30，所有单手非滑动事件(longTap、tap、doubleTap)取消
            if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
                this.longTapTimeout && clearTimeout(this.longTapTimeout);
                this.tapTimeout && clearTimeout(this.tapTimeout);
                this.doubleTap = false;
            }

            this._emit('slide'); // 执行滑动回调

            // 更新移动手指信息
            this.movetouch.x = point.pageX;
            this.movetouch.y = point.pageY;
        }
    },

    _end: function() {
        this.longTapTimeout && clearTimeout(this.longTapTimeout); // 手指离开，取消长按事件
        let timestamp = Date.now();
        let deltaX = (this.movetouch.x || 0) - this.touch.startX;
        let deltaY = (this.movetouch.y || 0) - this.touch.startY;

        // swipe
        if ((this.movetouch.x && Math.abs(deltaX) > 30) || (this.movetouch.y && Math.abs(deltaY) > 30)) {
            if (Math.abs(deltaX) < Math.abs(deltaY)) {
                if (deltaY < 0) {
                    // swipe up
                    this.params.direction = 'up';
                } else {
                    // swipe down
                    this.params.direction = 'down';
                }
            } else {
                if (deltaX < 0) {
                    // swipe left
                    this.params.direction = 'left';
                } else {
                    // swipe right
                    this.params.direction = 'right';
                }
            }
            this._emit('swipe'); // 方向信息在 this.params.direction中
        } else {
            let self = this;
            if (!this.doubleTap && timestamp - this.touch.startTime < 300) {
                // 单次点击300ms内离开，执行单击事件
                this.tapTimeout = setTimeout(function() {
                    self._emit('tap');
                }, 300);
            } else if(this.doubleTap) {
                // 300ms 内再次点击且离开，执行双击事件，取消单击事件
                this._emit('dbtap');
                this.tapTimeout && clearTimeout(this.tapTimeout);
            }
            // this._emit('finish');
        }

        this._emit('end');
        this._init();
    },

    _cancel() {
        this._emit('touchcancel');
        this._end();
    },

    /**
     * 监听事件
     * @param  {String}   type     监听事件名称
     * @param  {Function} callback 监听函数
     * @return {Object}            this
     */
    on: function(type, callback) {
        !this.handles[type] && (this.handles[type] = []);
        this.handles[type].push(callback);
        return this;
    },

    /**
     * 触发事件
     * @param  {String} type 事件名称
     * @param  {Object} e    event
     * @return
     */
    _emit: function(type, e) {
        !this.handles[type] && (this.handles[type] = []);
        // 只有是目标元素才执行
        if (isTarget(this.e, this.selector) || !this.selector) {
            this.handles[type].forEach((handler) => {
                typeof handler === 'function' && handler(this.params, e);
            });
        }
    },

    // 卸载对应回调
    off: function(type) {
        this.handles[type] = [];
    },

    // 销毁对象
    destory: function() {
        this.longTapTimeout && clearTimeout(this.longTapTimeout);
        this.tapTimeout && clearTimeout(this.tapTimeout);
        this.target.removeEventListener('touchstart', this._touch);
        this.target.removeEventListener('touchmove', this._move);
        this.target.removeEventListener('touchend', this._end);
        this.target.removeEventListener('touchcancel', this._cancel);
        // 遍历属性并置空
        const keys = Object.keys(this);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
            this[keys[i]] && (this[keys[i]] = null);
        }
        return true;
    }
};

export default Gesture;
