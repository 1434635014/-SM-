SM.extend({
    /**
     *  The function is collapse
     *  @param obj.id The collapse element id
     *  @param obj.time The time it takes to open the collapse
     */
    collapse: (function () {
        var n = 0, fn = {
            _collapseClass: 'collapse',
            _foldingClass: 'collapse_text',
            _bindClick: function (ele, time, id) {
                var num = 0;
                SM.addEvent(ele, 'click', function (e) {
                    if(num === 0) num = ++n;
                    if(SM.BP('collapse#'+id+num, time)){
                        var e = e || window.e, ele = SM(e.target);
                        var nextCollapse = ele.next('.collapse');
                        if(nextCollapse && nextCollapse.length > 0)
                            if(nextCollapse.attr('data-collapse') === 'true'){
                                nextCollapse.slideUp(time);
                                nextCollapse.attr('data-collapse', 'false');
                            }else {
                                nextCollapse.slideDown(time);
                                nextCollapse.attr('data-collapse', 'true');
                            }
                    }
                    e.preventDefault();
                });
            }
        };
        return function (obj) {
            var id = obj.id, ele = SM.getEle('#'+id), time = obj.time > 0 ? obj.time : 0;
            var foldingEle = SM(ele).find('.'+fn._foldingClass);
            for(var j = 0; j < foldingEle.length; j++){
                fn._bindClick(foldingEle.get(j), time, id);
            }
        };
    })()
});