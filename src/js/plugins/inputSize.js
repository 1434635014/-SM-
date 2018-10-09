
SM.extend({
    /**
     * The function is set max size of byte length
     * @param obj.id The id of input or text area
     * @param obj.size Max size of input
     * @param obj.callback  If the callback function is specified, It will return the length after each input
     */
    inputSize: (function () {
        var list = [];
        var bindEvent = function (ele, callback) {
            SM.addEvent(ele, 'keydown', setCursorPosFun);
            SM.addEvent(ele, 'input', setMaxSizeFun);
            function setCursorPosFun(e) {
                var id = ele.id, i = SM.getArrayIndex(list, 'id', id);
                list[i].cursorPos = SM.getCursorPosition(ele);
            };
            function setMaxSizeFun(e){
                var id = ele.id, i = SM.getArrayIndex(list, 'id', id), value = ele.value, byteLength = list[i].byteLength, cursorPos = list[i].cursorPos, show = list[i].show;
                if(SM.getByteLength(ele.value) > byteLength) {
                    ele.value = value.substring(0,SM.getTIndexOfBSize(value, byteLength));
                    SM.setCursorPosition(ele, cursorPos);
                }
                var length = SM.getByteLength(ele.value) % 2 === 0? parseInt(SM.getByteLength(ele.value)/2) : Math.ceil(SM.getByteLength(ele.value)/2);
                if(show) show.innerText = SM.toStr(length);
                if(!SM.isEmpty(callback)) callback.apply(this,[length]);
            };
            setMaxSizeFun();
            setCursorPosFun();
        };
        return function (obj) {
            var ele = SM.getEle('#'+obj.id), byteLength = parseInt(obj.size)*2, show = SM.isEmpty(obj.showId) ? null : SM.getEle('#'+obj.showId), callback = obj.callback;
            list[list.length] = {id:obj.id, ele:ele, byteLength:byteLength, cursorPos: 0, show: show};
            bindEvent(ele, callback);
        }
    })()
});