
SM.extend({
    /**
     * The function is set ellipsis for text by line
     * @param obj.id Element id
     * @param obj.line Line number
     * @param obj.space The distance between buttons and text
     */
    ellipsis: (function() {
        var list = [];
        var retractBtn = '<span class="retract_btn">收回</span>';
        var developBtn ='<span class="develop_btn">展开</span>';
        var bindBtnFun = function (state, id) {
            var i = SM.getArrayIndex(list, 'id', id), ele = list[i].ele, time = list[i].time;
            ele.innerHTML = state === 0 ? list[i].ellipsisText + developBtn: list[i].text + retractBtn;
            if(state === 0){
                if(time !== 0) SM(ele).animate({height: list[i].ellipsisHeight}, time);
                var btn = ele.lastElementChild;
                btn.style.right = list[i].paddingRight + 'px';
                btn.style.bottom = list[i].paddingBottom + 'px';
                SM.addEvent(btn, 'click', function () {
                    list[i].state = 1;
                    bindBtnFun(list[i].state,id);
                });
            }
            if(state === 1){
                if(time !== 0) SM(ele).animate({height: list[i].height}, time);
                SM.addEvent(ele.lastElementChild, 'click', function () {
                    list[i].state = 0;
                    bindBtnFun(list[i].state,id);
                });
            }
        };
        var setDefaultSpace = function (fontSize) {
            var multiple = 0;
            if (fontSize <= 25)  multiple = 4;
            if (fontSize <= 20)  multiple = 5;
            if (fontSize <= 18)  multiple = 6;
            if (fontSize <= 17)  multiple = 7;
            if (fontSize <= 16)  multiple = 7.5;
            if (fontSize <= 15)  multiple = 8;
            if (fontSize <= 14)  multiple = 9;
            if (fontSize <= 13)  multiple = 11;
            if (fontSize <= 12)  multiple = 12;
            if (fontSize <= 11)  multiple = 15;
            return fontSize * multiple;
        };
        return function (obj) {
            if(obj){
                var id = obj.id, last = this.getArrayIndex(list, 'id', id), i = list.length, time = obj.time? obj.time : 0;
                if(last !== -1) i = last;
                var ele = last !== -1 ? list[i].ele : SM.getEle('#'+id),
                    text = last !== -1 ? list[i].text : ele.innerText,
                    state = last !== -1 ? list[i].state : 0,
                    line = obj.line > 1? obj.line: 1,
                    width = ele.clientWidth,
                    paddingRight = SM.withoutPx(this.getStyle(ele, 'paddingRight')),
                    paddingBottom = SM.withoutPx(this.getStyle(ele, 'paddingBottom')),
                    fontSize = SM.withoutPx(this.getStyle(ele,'fontSize')),
                    sapce = obj.space > 0? setDefaultSpace(fontSize) + obj.space : setDefaultSpace(fontSize),
                    containByteSize = Math.round(((width*line)-sapce) / fontSize) * 2;
                if(text.length*2 > containByteSize){
                    var index = this.getTIndexOfBSize(text, containByteSize);
                    var ellipsisText = text.substring(0,index) + '...';
                    ele.innerHTML = text + retractBtn;
                    var height = ele.clientHeight;
                    ele.innerHTML = ellipsisText + developBtn;
                    var ellipsisHeight = ele.clientHeight;
                    list[i] = {id:id, ele:ele, text:text, ellipsisText:ellipsisText, state:state, paddingRight:paddingRight, paddingBottom:paddingBottom, height:height, ellipsisHeight:ellipsisHeight, time:time};
                    var p = this.getStyle(ele, 'position'); if(p !== 'relative' && p !== 'absolute' && p !== 'fixed') ele.style.position = 'relative';
                    bindBtnFun(state ,id);
                }
            }else{          //Reset
                list = [];
            }
        };
    })()
});
