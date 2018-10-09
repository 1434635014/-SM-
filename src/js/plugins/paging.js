/**
 * Created by Administrator on 2017/7/4/004.
 */
SM.extend({
    paging: (function () {
        let list = {};
        let fn = {
            _getPageNum: function (id, value) {
                let pageCount = list[id].page.pageCount;
                if(value > pageCount) return pageCount;
                return value;
            },
            _bindSkipBtnClick: function (id) {
                let skipBtn = SM(list[id].ele).find('.paging_skip .skip_btn > button.btn');
                let pageNumInput = SM(list[id].ele).find('.paging_skip .skip_input > input.page_num');
                skipBtn.bind('click', function () {
                    if(!list[id].isRequest) {
                        var value = parseInt(pageNumInput.val());
                        if(!SM.isEmpty(value) && !isNaN(value) && value > 0){
                            if(value !== list[id].page.pageIndex){
                                list[id].page.pageIndex = fn._getPageNum(id, value);
                                fn._request(id);
                            }
                        }
                    }
                });
            },
            _bindPageBtnClick: function (id) {
                let pageBtnEle = list[id].pageBtnEle, pageBtn = SM(pageBtnEle).children('.p_btn');
                pageBtn.bind('click', function (e) {
                    if(!list[id].isRequest) {
                        e = e || window.event;
                        var ele = e.target, num;
                        if(SM.compare(ele.tagName, 'div')) num = parseInt(ele.getAttribute('data-page-num')); else num = parseInt(ele.parentNode.getAttribute('data-page-num'));
                        if(!SM.isEmpty(num) && num >= 1 && num <= list[id].page.pageCount){
                            list[id].page.pageIndex = num;
                            fn._request(id);
                        }
                        e.preventDefault(); e.stopPropagation(); return false;
                    }
                });
            },
            _createPageView: function (id) {
                let pageBtnList = [], pageBtnEle = list[id].pageBtnEle, pageIndex = list[id].page.pageIndex, pageCount = list[id].page.pageCount, pageBtnNum = list[id].pageBtnNum;
                pageBtnEle.innerText = '';
                if(pageCount <= pageBtnNum){
                    for(let j = 0; j < pageCount; j++) pageBtnList[j] = j+1;
                }else{
                    let median = pageBtnNum % 2 === 0 ? pageBtnNum / 2 : Math.floor(pageBtnNum / 2) + 1;
                    //If D-value less than the median value
                    if(pageIndex <= median || (pageCount - pageIndex) < median){
                        if(pageIndex <= median)      //Left
                            for(let j = 0; j < pageBtnNum; j++) {
                                if(j === pageBtnNum-2) pageBtnList[j] = '...';
                                else if(j === pageBtnNum-1) pageBtnList[j] = pageCount;
                                else pageBtnList[j] = j+1;
                            }
                        else                        //Right
                            for(let j = 0; j < pageBtnNum; j++) {
                                if(j === 0) pageBtnList[j] = j+1;
                                else if(j === 1) pageBtnList[j] = '...';
                                else pageBtnList[j] = pageCount - pageBtnNum + (j+1);
                            }
                    }else{
                        for(let j = 0; j < (pageBtnNum+2); j++)
                            if(j===0) pageBtnList[j] = j+1;
                            else if(j === 1) pageBtnList[j] = '...';
                            else if(j === (pageBtnNum+2)-2) pageBtnList[j] = '...';
                            else if(j === (pageBtnNum+2)-1) pageBtnList[j] = pageCount;
                            else {
                                if(j === (median)) pageBtnList[j] = pageIndex;
                                else pageBtnList[j] = pageIndex - (median-j);
                            }
                    }
                }
                pageBtnEle.appendChild(this._createPageBtn(pageIndex, 'prev'));
                for(let n = 0; n < pageBtnList.length; n++)
                    if(pageIndex !== pageBtnList[n]) pageBtnEle.appendChild(this._createPageBtn(pageBtnList[n])); else pageBtnEle.appendChild(this._createPageBtn(pageBtnList[n], 'current'));
                pageBtnEle.appendChild(this._createPageBtn(pageIndex, 'next'));

                this._bindPageBtnClick(id);
                list[id].isRequest = false;         //Reset request
            },
            _request: function (id, init) {
                list[id].isRequest = true;

                //Ajax
                let data = {
                    pageIndex: list[id].page.pageIndex,
                    options:list[id].options,
                    callback: function(){
                        if(init===undefined) fn._createPageView(id);
                    },
                    init: init,
                    isFirst: !SM.isEmpty(init)
                };
                list[id].request.call(this, data);
            },
            _createView: function (id) {
                list[id].ele.innerText = '';
                let pageBtnDiv = SM.createEle('div'); pageBtnDiv.setAttribute('class', 'page_btn');
                let pagingSkipDiv = SM.createEle('div'); pagingSkipDiv.setAttribute('class', 'paging_skip');
                let skipTitleDiv = SM.createEle('div'); skipTitleDiv.setAttribute('class', 'skip_title'); skipTitleDiv.innerText = '跳转';
                let skipInputDiv = SM.createEle('div'); skipInputDiv.setAttribute('class', 'skip_input');
                let skipInput = SM.createEle('input'); skipInput.setAttribute('class', 'input page_num'); skipInput.setAttribute('type', 'text');
                skipInputDiv.appendChild(skipInput);
                let skipBtnDiv = SM.createEle('div'); skipBtnDiv.setAttribute('class', 'skip_btn');
                let skipBtn = SM.createEle('button'); skipBtn.setAttribute('class', 'btn'); skipBtn.innerText = '确定';
                skipBtnDiv.appendChild(skipBtn);
                pagingSkipDiv.appendChild(skipTitleDiv);pagingSkipDiv.appendChild(skipInputDiv);pagingSkipDiv.appendChild(skipBtnDiv);
                list[id].ele.appendChild(pageBtnDiv); list[id].ele.appendChild(pagingSkipDiv);
            },
            _createPageBtn: function (num, type) {
                let pageBtn = SM.createEle('div');
                if(type==='current') pageBtn.setAttribute('class', 'p_btn current'); else pageBtn.setAttribute('class', 'p_btn');
                if(num==='...') pageBtn.setAttribute('class', 'p_btn ell');
                if(type==='prev') num--;
                if(type==='next') num++;
                pageBtn.setAttribute('data-page-num', num);
                if(type === 'prev'){
                    let last = SM.createEle('i'); last.setAttribute('class', 'icon icon_prev'); pageBtn.appendChild(last);
                }else if(type === 'next'){
                    let next = SM.createEle('i'); next.setAttribute('class', 'icon icon_next'); pageBtn.appendChild(next);
                }else{
                    pageBtn.innerText = num;
                };
                return pageBtn;
            },
            _getPageCount: function (pageSize, pageTotal) {
                return pageTotal === 0 ? 1: pageTotal % pageSize !== 0 ? Math.floor(pageTotal / pageSize) + 1 : parseInt(pageTotal / pageSize);
            }
        };

        return function(obj){
            let id = obj.id, ele = document.getElementById(id), page = obj.page, request = obj.request, options = obj.options || null, pageBtnNum = obj.pageBtnNum || 7, n;
            page.pageIndex = page.pageIndex || 1;
            list[id] = { ele : ele, request : request, page: page, options : options, pageBtnNum: pageBtnNum, isRequest: true, isInit: false };

            let callback = function (pageTotal, isHaveTotal) {
                if(SM.isEmpty(pageTotal)|| pageTotal <= page.pageSize) { ele.innerText = '';  return false; }
                fn._createView(id);
                list[id].pageBtnEle = SM(ele).children('.page_btn').get(0);
                list[id].pageTotal = pageTotal;
                page.pageCount = fn._getPageCount(page.pageSize, pageTotal);
                fn._createPageView(id);
                fn._bindSkipBtnClick(id);
                if(isHaveTotal) fn._request(id);
            };
            if(SM.isEmpty(page.pageTotal)) fn._request(id, callback); else callback.call(this, page.pageTotal, true);
        }
    })()
});

