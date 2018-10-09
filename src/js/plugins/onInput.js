
SM.extend({
    onInput: (function () {
        var getParameters = function (ele) {
            var parms = {};
            parms.value = ele.value;
            parms.length = ele.value.length;
            parms.byteLength = SM.getByteLength(ele.value);
            return parms;
        };
        return function (obj) {
            var id = obj.id, ele = SM.getEle('#'+id);
            var focus = SM.isEmpty(obj.focus) ? null: obj.focus;
            var input = SM.isEmpty(obj.input) ? null: obj.input;
            var blur = SM.isEmpty(obj.blur) ? null: obj.blur;
            if(focus)
                SM.addEvent(ele, 'focus', function (e) {
                    var parms = getParameters(ele);
                    focus.call(this, parms, e);
                });
            if(blur)
                SM.addEvent(ele, 'blur', function (e) {
                    var parms = getParameters(ele);
                    blur.call(this, parms, e);
                });
            if(input)
                SM.addEvent(ele, 'input', function (e) {
                    var parms = getParameters(ele);
                    input.call(this, parms, e);
                });
        }
    })()
});