SM.extend({
    /**
     * The function is listener event of touch、mouse or wheel
     * @param obj.id Element id
     * @param obj.ele Element， If id is undefinition
     * @param obj.event Event of monitor
     * @param obj.start Callback of start function
     * @param obj.move Callback of move function
     * @param obj.end Callback of end function
     *
     */
    monitor: (function () {
        var list = {};
        var getParameters = function (l) {
            var paras = {}, startX = l.start.x, startY = l.start.y, endX = l.end.x, endY = l.end.y, moved = l.moved;
            var mx = endX - startX;
            var my = endY - startY;
            paras.isLeft = mx > moved ? false : mx < -moved ? true : null;
            paras.isRight = mx > moved ? true : mx < -moved ? false : null;
            paras.isUp = my > moved ? false : my < -moved ? true : null;
            paras.isDown = my > moved ? true : my < -moved ? false : null;
            paras.startX = startX;
            paras.startY = startY;
            paras.endX = endX;
            paras.endY = endY;
            paras.moveX = mx;
            paras.moveY = my;
            return paras;
        };
        return function (obj) {
            var id = obj.id, ele = obj.ele ? obj.ele.isSM ? obj.ele.get(0): obj.ele : SM.getEle('#'+id), event = obj.event,  start = obj.start, move = obj.move, end = obj.end, moved = obj.moved && obj.moved > 0? obj.moved: 0;
            if(this.isEmpty(id)) id = 'monitor'+Math.ceil(Math.random()*10);
            list[id] = {start:{}, move:{}, end:{}, moved: moved};
            //Touch even
            if(event === 'touch'){
                SM.addEvent(ele, 'touchstart', function (e) {
                    e = e || window.event;
                    var startX = list[id].start.x =  e.touches[0].clientX;
                    var startY = list[id].start.y =  e.touches[0].clientY;
                    if(start) start.call(this, {startX:startX, startY:startY});
                    if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
                });
                if(move) {
                    SM.addEvent(ele, 'touchmove', function (e) {
                        e = e || window.event;
                        var moveX = list[id].end.x =  e.changedTouches[0].clientX;
                        var moveY = list[id].end.y =  e.changedTouches[0].clientY;
                        move.call(this, {moveX:moveX, moveY:moveY});
                        if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
                    });
                }
                if(end) {
                    SM.addEvent(ele, 'touchend', function (e) {
                        e = e || window.event;
                        list[id].end.x =  e.changedTouches[0].clientX;
                        list[id].end.y =  e.changedTouches[0].clientY;
                        var paras = getParameters(list[id]);
                        if(end) end.call(this, paras);
                        if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
                    });
                }
            }
            //Mouse even
            if(event === 'mouse'){
                SM.addEvent(ele, 'mousedown', function (e) {
                    e = e || window.event;
                    var startX = list[id].start.x =  e.clientX;
                    var startY = list[id].start.y =  e.clientY;
                    if(start) start.call(this, {startX:startX, startY:startY});
                    if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
                });
                if(move) {
                    SM.addEvent(ele, 'mousemove', function (e) {
                        e = e || window.event;
                        var moveX = e.clientX;
                        var moveY = e.clientY;
                        move.call(this, {moveX:moveX, moveY:moveY});
                    });
                    if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
                }
                if(end){
                    SM.addEvent(ele, 'mouseup', function (e) {
                        e = e || window.event;
                        list[id].end.x =  e.clientX;
                        list[id].end.y =  e.clientY;
                        var paras = getParameters(list[id]);
                        end.call(this, paras);
                    });
                    if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
                }
            }
            //Wheel even
            if(event === 'wheel'){
                var wheelFun = function (e) {
                    e = e || window.event;
                    var deltaX = e.deltaX || e.wheelDeltaX*-1 || 0;
                    var deltaY = e.deltaY || e.wheelDeltaY*-1 || (e.wheelDeltaY === undefined) && e.wheelDelta*-1 || e.detail || 0;
                    if(end) end.call(this, {deltaX:deltaX, deltaY:deltaY, isDown:deltaY>0, isUp:deltaY<0, isLeft:deltaX<0, isRight:deltaY>0});
                    if(e.preventDefault) e.preventDefault();
                    if(e.stopPropagation) e.stopPropagation();
                    e.cancelBubble = true;
                    e.returnValue = false;
                };
                if(SM.browser === 'firefox')
                    SM.addEvent(ele, 'DOMMouseScroll', wheelFun);
                else
                    SM.addEvent(ele, 'mousewheel', wheelFun);
            }
        };
    })()
});