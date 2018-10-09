
SM.extend({
    /**
     * The function is set loading icon of list
     * @param obj.ul The loading list id
     * @param obj.size The length of data obtained
     * @param obj.callback The ajax function
     * @param obj.isPrompt Prompt text when there is no data?
     */
    dragLoader:(function () {
        let ul = {}, className = 'loading_img', iconId = 'loadingMoreI', listClass = '.list',scrollTime = 10;
        let loadingIcon = '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
        let setLoadingIcon = function (listOut, id, listOutId, callback) {
            let list = document.querySelector('#'+listOutId+' '+listClass);
            let ele = SM.getEle('#'+id), li;
            if(SM.isEmpty(ele)){
                li = SM.createEle('div');
                li.setAttribute('id', id);
                li.setAttribute('class', className);
                li.innerHTML = loadingIcon;
                listOut.appendChild(li);
            }
            let SMList = SM(list);
            let nowLength = 0;
            if(ul[listOutId].isSearchAll) nowLength = SMList.children().length;
            else nowLength = SMList.children('.list_li').length;
            let cha = nowLength - ul[listOutId].listLength, pageIndex = ul[listOutId].pageIndex;
            if(cha >= ul[listOutId].size || (ul[listOutId].listLength === 0 && pageIndex < 1)){
                ul[listOutId].listLength += cha;
                ul[listOutId].isCompleted = true;
            }else{
                let prompt = ul[listOutId].prompt, promptNull = ul[listOutId].promptNull;
                if((pageIndex === 2 && nowLength === ul[listOutId].listLength) || nowLength === 0) {
                    if(ul[listOutId].isPromptNull) ele.innerText = promptNull; else ele.remove();
                }else {
                    if(ul[listOutId].isPrompt) ele.innerText = prompt; else ele.remove();
                }
                //callback tell to null
                if(typeof callback === 'function') callback.call(this, true);
                ul[listOutId].isDestroy = true;
            }
        };
        return function (obj, isReset) {
            let listOutId = obj.id || obj;
            let listOut = this.getEle('#'+listOutId);
            let id = iconId+listOutId;
            if(isReset === true){
                if(SM.isEmpty(document.getElementById(id))) return;
                let list = document.querySelector('#'+listOutId+' '+listClass);//Reset
                if(ul[listOutId].isDeleteAll) list.innerHTML = '';
                else SM(list).children('.list_li').remove();
                ul[listOutId] = {};
                setLoadingIcon(listOut, id, listOutId);
                SM.removeEvent(listOut, 'scroll', ul[listOutId].scrollFun);
            }else{
                if(typeof(obj) === 'string' || this.isEmpty(obj.callback)){
                    if(ul[listOutId].pageIndex !== 0) setLoadingIcon(listOut, id, listOutId, isReset);
                }else{
                    let listHeight = listOut.clientHeight;
                    let isPrompt = obj.isPrompt !== undefined? obj.isPrompt : true;
                    let isPromptNull = obj.isPromptNull !== undefined? obj.isPromptNull : true;
                    let prompt = obj.prompt !== undefined? obj.prompt : '没有更多数据了';
                    let promptNull = obj.promptNull !== undefined? obj.promptNull : '没有更多数据了';
                    let isSearchAll = obj.isSearchAll !== undefined? obj.isSearchAll : false;
                    let isDeleteAll = obj.isDeleteAll !== undefined? obj.isDeleteAll : false;
                    let respond = obj.respond !== undefined? obj.respond : false;
                    ul[listOutId] = {listOut:listOut, listOutId:listOutId, pageIndex: 0, size: obj.size, listLength: 0,
                        isComplete:true, isPrompt:isPrompt, prompt:prompt, promptNull:promptNull, isPromptNull:isPromptNull,
                        isSearchAll:isSearchAll, isDeleteAll: isDeleteAll, respond: respond, isDestroy:false};
                    setLoadingIcon(listOut, id, listOutId);
                    ul[listOutId].pageIndex=1;
                    obj.callback.apply(this, [ul[listOutId].pageIndex++]);
                    ul[listOutId].scrollFun = function() {
                        if(SM.BP('setLoading#'+listOutId, scrollTime)){
                            if(!ul[listOutId].isDestroy){
                                if(ul[listOutId].isCompleted){
                                    let viewH = listHeight;
                                    if(ul[listOutId].respond) viewH = ul[listOutId].listOut.clientHeight;
                                    let contentH =  listOut.scrollHeight;
                                    let scrollTop = listOut.scrollTop;
                                    if(scrollTop / (contentH -viewH - 20) >= 1) {
                                        ul[listOutId].isCompleted = false;
                                        obj.callback.apply(this, [ul[listOutId].pageIndex++]);
                                    }
                                }
                            }else SM.removeEvent(listOut, 'scroll', ul[listOutId].scrollFun);
                        }
                    };
                    this.addEvent(listOut, 'scroll', ul[listOutId].scrollFun);
                }
            }
        }
    })()
});