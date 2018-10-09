/**
 * Created by Administrator on 2017/7/18/018.
 */
SM.extend({
    dialogConfig:{ style:'cell', theme:'default' },
    alert:function (obj, cb, ty) {
        if(SM('#alertMaskDiv').length > 0) return;
        if(typeof obj === 'string'){
            let o = {};
            o.content = obj;
            o.callback = typeof cb === 'function'? cb : undefined;
            o.type = typeof cb === 'string'? cb : typeof ty === 'string' ? ty : 'default';
            obj = o;
        }
        let content = obj.content || '无内容', title = obj.title || '提示', callback = obj.callback, type = obj.type || 'default', yesBtn = obj.yesBtn || '确定', style = obj.style || this.dialogConfig.style;
        let html = '\
            <div class="alert_div">\
                <div class="status">\
                    <div class="alert_title">'+title+'<i class="icon icon_close s_ab_v"></i></div>\
                    <div class="icon_img">\
                        <i class="icon icon_'+type+'"></i>\
                    </div>\
                    <div class="dialog_content">'+content+'</div>\
                </div>\
                <div class="bottom">\
                    <button class="btn yes_btn">'+yesBtn+'</button>\
                </div>\
            </div>';
        let alertMaskDiv = SM.createEle('div');
        alertMaskDiv.setAttribute('id','alertMaskDiv');
        alertMaskDiv.setAttribute('class', style + ' ' + type);
        alertMaskDiv.innerHTML = html;
        document.body.appendChild(alertMaskDiv);
        var timeout = setTimeout(function () {
            let alertMask = SM('#alertMaskDiv');
            let btnYes = alertMask.find('.yes_btn');
            if(SM.dialogConfig.style === 'pc'){
                let closeIcon = alertMask.find('.icon_close');
                closeIcon.bind('click', function () {
                    if(callback) callback.call(this,true);
                    alertMask.remove();
                });
            }
            btnYes.bind('click', function () {
                if(callback) callback.call(this,true);
                alertMask.remove();
            });
            window.clearTimeout(timeout);
        },100);
    },
    prompt:function (obj, cb) {
        if(SM('#promptDiv').length > 0) return;
        if(typeof obj === 'string') {
            let o = {};
            o.content = obj;
            o.callback = cb;
            obj = o;
        }
        let content = obj.content || '无内容', callback = obj.callback, type = obj.type || 'prompt', style = obj.style || this.dialogConfig.style;
        let html = '\
            <div class="status">\
                <div class="icon_div"><i class="icon icon_'+type+'"></i></div>\
            </div>\
            <div class="details">\
                '+content+'\
            </div>';
        let promptDiv = SM.createEle('div');
        promptDiv.setAttribute('id','promptDiv');
        promptDiv.setAttribute('class','prompt_div '+style);
        promptDiv.innerHTML = html;
        document.body.appendChild(promptDiv);
        var timeout1 = window.setTimeout(function () {
            SM('#promptDiv').fadeIn(500);
            window.clearTimeout(timeout1);
        },10);
        var timeout2 = window.setTimeout(function () {
            SM('#promptDiv').fadeOut(500);
            window.clearTimeout(timeout2);
            var timeout3 = setTimeout(function () {
                if(!SM.isEmpty(callback)) callback.call(this);
                promptDiv.parentNode.removeChild(promptDiv);
                window.clearTimeout(timeout3);
            }, 500);
        },2000);
    },
    loading: function (obj) {
        let loadingMask = SM('#loadingMaskDiv');
        if(obj === true){
            if(loadingMask.length > 0) loadingMask.fadeOut(500);
        }else{
            if(typeof obj === 'string') {
                let o = {};
                o.content = obj;
                obj = o;
            }else if(typeof obj === 'undefined') obj = {};
            let content = obj.content || '玩命加载中...', style = obj.style || this.dialogConfig.style;
            if(loadingMask.length > 0) {
                loadingMask.find('.dialog_content').text(content);
                loadingMask.fadeIn(0);
            }else {
                let html = '\
                    <div class="loading_div">\
                        <div class="loading_icon">\
                            <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>\
                        </div>\
                        <div class="dialog_content">'+content+'</div>\
                    </div>';
                let loadingMaskDiv = SM.createEle('div');
                loadingMaskDiv.setAttribute('id', 'loadingMaskDiv');
                loadingMaskDiv.setAttribute('class', style);
                loadingMaskDiv.innerHTML = html;
                SM.addEvent(loadingMaskDiv, 'touchmove', function () {
                    event.preventDefault();
                });
                document.body.appendChild(loadingMaskDiv);
            }
        }
    },
    confirm:function (obj, cb, ty) {
        if(SM('#confirmMaskDiv').length > 0) return;
        if(typeof obj === 'string') {
            let o = {};
            o.content = obj;
            o.callback = typeof cb === 'function'? cb : undefined;
            o.type = typeof cb === 'string'? cb : typeof ty === 'string' ? ty : undefined;
            obj = o;
        }
        let content = obj.content || '无内容', title = obj.title || '选择提示', callback = obj.callback, yesBtn = obj.yesBtn || '确定', noBtn = obj.noBtn || '取消', type = obj.type || 'modal', style = obj.style || this.dialogConfig.style;
        let html = '\
            <div class="confirm_div">\
                <div class="status">\
                    <div class="alert_title">'+title+'<i class="icon icon_close s_ab_v"></i></div>\
                    <div class="dialog_content">'+content+'</div>\
                </div>\
                <div class="bottom flex">\
                    <div class="box">\
                        <button class="btn no_btn">'+noBtn+'</button>\
                    </div>\
                    <div class="box">\
                        <button class="btn yes_btn">'+yesBtn+'</button>\
                    </div>\
                </div>\
            </div>';
        let confirmMaskDiv = SM.createEle('div');
        confirmMaskDiv.setAttribute('id','confirmMaskDiv');
        confirmMaskDiv.setAttribute('class', style + ' ' + type);
        confirmMaskDiv.innerHTML = html;
        document.body.appendChild(confirmMaskDiv);
        var timeout = setTimeout(function () {
            let confirmMask = SM('#confirmMaskDiv');
            let btnYes = confirmMask.find('.yes_btn');
            let btnNo = confirmMask.find('.no_btn');
            if(SM.dialogConfig.style === 'pc'){
                let closeIcon = confirmMask.find('.icon_close');
                closeIcon.bind('click', function () {
                    if(callback) callback.call(this,false);
                    confirmMask.remove();
                });
            }
            btnYes.bind('click', function () {
                if(callback) callback.call(this,true);
                confirmMask.remove();
            });
            btnNo.bind('click', function () {
                if(callback) callback.call(this,false);
                confirmMask.remove();
            });
            window.clearTimeout(timeout);
        }, 10);
    }
});