/**
 * The function is start font scroll
 */
SM.extend({
    rolling: function (speed, delay) {
        var outClass = 'rolling_out';
        var inClass = 'rolling_in';
        var ele = SM.getEle('.'+outClass);
        var speed = speed > 0 ? speed : 1, timeSpeed = 20, delay = delay >= 0? delay : 2000;
        for(var j = 0; j < ele.length; j++){
            bindRolling(ele[j]);
        }
        function bindRolling(outEle) {
            var outWidth = outEle.clientWidth;
            var inWidth = outEle.scrollWidth;
            var interval = null;
            SM(outEle).children('.'+inClass).width(inWidth);
            if(inWidth > outWidth) startRolling();
            function startRolling() {
                outEle.scrollLeft = 0;
                setTimeout(function () {
                    interval = setInterval(intervalFun,timeSpeed);
                    //if mouseEnter
                    SM.addEvent(outEle, 'mouseenter', function () {
                        window.clearInterval(interval);
                        interval = null;
                    });
                    SM.addEvent(outEle, 'mouseleave', function () {
                        interval = setInterval(intervalFun,timeSpeed);
                    });
                },delay);
                var intervalFun = function () {
                    //if over end
                    if(outEle.scrollLeft+outWidth === inWidth){
                        clearInterval(interval);
                        interval = null;
                        setTimeout(startRolling, delay);
                    }
                    else  outEle.scrollLeft += speed;
                }
            }

        }
    }
});