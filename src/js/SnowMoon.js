
(function( global, factory ) {
    "use strict";
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "SM requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }
}(typeof window !== "undefined" ? window : this, function(window) {
    /*------------------------------------ Initialization method --------------------------------------*/
    if(!Array.prototype.indexOf){
        Array.prototype.indexOf = function(ele){
            if(this !== null){
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);
                if (from < 0)  from += len;
                for (; from < len; from++)
                    if (from in this && this[from] === ele)  return from;
            }
            return -1;
        };
    }
    if(!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach( callback, thisArg) {
            var T, k;
            if (this === null) throw new TypeError( "this is null or not defined");
            var O = Object(this);
            var len = O.length >>> 0;
            if(typeof callback !== "function") throw new TypeError( callback + " is not a function");
            if(arguments.length > 1) T = thisArg;
            k = 0;
            while(k < len) {
                var kValue;
                if (k in O) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }
    /*---------------------------------- The common function and property ----------------------------------*/
    var animationQueue = [];                        //Animations queue
    var inlineEle = ['a','abbr','acronym','b','big','cite','code','dfn','em','font','i','img','input','kbd','label','q','s','samp','select','small','span','strong','sub','sup','textarea','tt'];
    var beginAnimation = (function () {             //Begin animation function
        var notPxStyles = ['opacity'];
        var defaultInterval = 10;
        return function(animation){
            function animtaeShow() {
                var px = notPxStyles.indexOf(animation.styleName) === -1 ? 'px' : '', isFilter = animation.styleName === 'filter';
                if (animation.time > 0) {
                    let end = animation.end - animation.start, now = animation.now;
                    animation.now = animation.start + SM.tween[animation.easing](animation.currentTime, 0, end, animation.allTime);
                    if(isFilter) {
                        now = 'alpha(opacity=' +(parseFloat(now)*100)+ ')';
                    }
                    animation.ele.style[animation.styleName] = now + px;
                    animation.time-=defaultInterval;
                    animation.currentTime+=defaultInterval;
                }else {
                    var end = animation.end;
                    if(isFilter) end = 'alpha(opacity=' +(parseFloat(end)*100)+ ')';
                    animation.ele.style[animation.styleName] = end + px;
                    window.clearTimeout(animation.timer);
                    animation.isDestroy = true;
                }
            }
            animation.timer = window.setInterval(animtaeShow, defaultInterval);
        };
    })();
    var getEleFunName = function (selector) {
        var funName, firstStr = selector.substring(0,1), str = selector.substring(1), attr = null;
        if(selector.indexOf('[') !== -1 || selector.indexOf(' ') !== -1 || selector.indexOf('>') !== -1){
            funName = 'querySelectorAll';
            attr = 'query';
            str = selector;
        }else if(firstStr === '#') {
            funName = 'getElementById';
            attr = 'id';
        } else if(firstStr === '.') {
            funName = 'getElementsByClassName';
            attr = 'className';
        } else{
            funName = 'getElementsByTagName';
            attr = 'tagName';
            str = selector;
        }
        return {fun:funName, str:str, attr:attr};
    };
    /*------------------------------------------The SnowMoon---------------------------------------------*/
    /**
     * SM object
     */
    let SnowMoon = function(ele) {};
    /**
     * Animation function for SM object
     */
    SnowMoon.prototype.animate = (function() {
        let getQueryNullIndex = function () {
            for(let j = 0; j < animationQueue.length; j++) if(animationQueue[j] === true) return j;
            return animationQueue.length;
        };
        return function (animate, time, easing) {
            var ele = this.elements, styleName, start, end, time = time || 0, easing = easing;
            for(var key in animate)  styleName = key;
            //If le ie 8 and the style is opacity
            if(SM.ieVersion !== false && SM.ieVersion <= 8 && styleName === 'opacity') styleName = 'filter';
            for (let j = 0; j<ele.length; j++){
                start = SM.withoutPx(SM.getStyle(ele[j], styleName));
                end = SM.getNumOfPx(animate[styleName], start, ele[j]);
                if(typeof easing === 'undefined') easing = 'easeInOut';
                if(styleName === 'opacity' || styleName === 'filter'){
                    for(let n = 0; n < animationQueue.length; n++){
                        if(animationQueue[n].isDestroy !== true && animationQueue[n].styleName === styleName) if(SM(animationQueue[n].ele).isSameNode(ele[j])) return;
                    }
                }
                let index = getQueryNullIndex(), timer = null;
                let animation = animationQueue[index] = {ele:ele[j], timer:timer, currentTime:0, allTime:time, time:time, start:start, now:start, end:end, styleName:styleName, easing:easing, isDestroy:false};
                beginAnimation(animation);                          //Begin
            }
        };
    })();
    /**
     * Animation stop function for SM object
     */
    SnowMoon.prototype.stop = function (isDistroy) {
        let ele = this.elements;
        for (let j = 0; j<ele.length; j++){
            animationQueue.forEach(function (v, i) {
                if(!v.isDestroy)
                    if(SM(v.ele).isSameNode(ele[j])){
                        window.clearTimeout(animationQueue[i].timer);
                        animationQueue[i].timer = undefined;
                        if(isDistroy===true) animationQueue[i].isDestroy = isDistroy;
                    }
            });
        }
        return new SM.fn(ele);
    };
    /**
     * Animation go function for SM object
     */
    SnowMoon.prototype.go = function () {
        var ele = this.elements;
        for (var j = 0; j<ele.length; j++){
            animationQueue.forEach(function (v, i) {
                if(v.timer === undefined)
                    if(SM(v.ele).isSameNode(ele[j]) && !v.isDestroy)
                        beginAnimation(animationQueue[i]);          //Begin
            });
        }
    };
    SnowMoon.prototype.eq = function(num) {
        return new SM.fn(this.elements[num]);
    };
    SnowMoon.prototype.get = function(num) {
        if(SM.isEmpty(num)) return this.elements;
        return this.elements[num];
    };
    SnowMoon.prototype.parent = function() {
        return new SM.fn(this.elements[0].parentNode);
    };
    SnowMoon.prototype.prev = function() {
        var ele = this.elements[0];
        for ( ; ele; ele = ele.previousSibling) if (ele.nodeType === 1 && ele !== this.elements[0]) break;
        if(SM.isEmpty(ele)) return undefined; else return new SM.fn(ele);
    };
    SnowMoon.prototype.next = function() {
        var ele = this.elements[0];
        for ( ; ele; ele = ele.nextSibling) if(ele.nodeType === 1 && ele !== this.elements[0]) break;
        if(SM.isEmpty(ele)) return undefined; else return new SM.fn(ele);
    };
    SnowMoon.prototype.siblings = function(selector) {
        var newEle = [], attr = selector? getEleFunName(selector).attr : null, str = selector? getEleFunName(selector).str : null;
        var n = this.elements[0].parentNode.firstChild;
        for ( ; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== this.elements[0]){
                if(selector) {
                    if(n[attr] === str) newEle.push(n);
                }else newEle.push(n);
            }
        }
        return new SM.fn(newEle);
    };
    SnowMoon.prototype.children = function(selector) {
        let children = this.elements[0].children, newChildren = [];
        if(!selector) return new SM.fn(children);
        else {
            let attr = getEleFunName(selector).attr;
            let str = getEleFunName(selector).str;
            for(let j = 0; j < children.length; j++){
                if(children[j][attr].toLowerCase().indexOf(str) !== -1)
                    newChildren.push(children[j]);
            }
        }
        return new SM.fn(newChildren);
    };
    SnowMoon.prototype.find = function(selector) {
        if(getEleFunName(selector).attr === 'id'){
            let childNodes = this.elements[0].childNodes;
            for(let j = 0; j < childNodes.length; j++)
                if(childNodes[j].id === getEleFunName(selector).str) return new SM.fn(childNodes[j]);
        }
        return new SM.fn(SM.getEle(this.elements[0], selector));
    };
    SnowMoon.prototype.each = function(callback) {
        for(let j = 0; j < this.elements.length; j++){
            if(callback.call(this, this.elements[j], j) === false) break;
        }
    };
    SnowMoon.prototype.fontSize = function(value) {
        if(!SM.isEmpty(value)) for(let j = 0; j<this.elements.length; j++) if(typeof value !== 'number' && value.indexOf('px') !== -1) this.elements[j].style.fontSize = value; else this.elements[j].style.fontSize = value+'px';
        else return SM.withoutPx(SM.getStyle(this.elements[0], 'fontSize'));
    };
    SnowMoon.prototype.width = function(value) {
        if(!SM.isEmpty(value)) for(let j = 0; j<this.elements.length; j++) if(typeof value !== 'number' && value.indexOf('px') !== -1) this.elements[j].style.width = value; else {
            if(typeof value === 'number') this.elements[j].style.width = value+'px'; else this.elements[j].style.width = value;
        }

        else return SM.withoutPx(SM.getStyle(this.elements[0], 'width'));
    };
    SnowMoon.prototype.height = function(value) {
        if(!SM.isEmpty(value)) for(let j = 0; j<this.elements.length; j++) if(typeof value !== 'number' && value.indexOf('px') !== -1) this.elements[j].style.height = value; else this.elements[j].style.height = value+'px';
        else return SM.withoutPx(SM.getStyle(this.elements[0], 'height'));
    };
    SnowMoon.prototype.val = function(value) {
        if(!SM.isEmpty(value)) for(let j = 0; j<this.elements.length; j++) this.elements[j].value = value;
        else return this.elements[0].value;
    };
    SnowMoon.prototype.text = function(value) {
        if(typeof value !== 'undefined') for(let j = 0; j<this.elements.length; j++) this.elements[j].innerText = value;
        return this.elements[0].innerText;
    };
    SnowMoon.prototype.html = function(value) {
        if(typeof value !== 'undefined') for(let j = 0; j<this.elements.length; j++) this.elements[j].innerHTML = value;
        return this.elements[0].innerHTML;
    };
    SnowMoon.prototype.css = function(style, value) {
        var index = -1;
        if(SM.isEmpty(value)){
            if(typeof style === 'string') return SM.getStyle(this.elements[0], style);
            if(typeof style === 'object') {
                for (var key in style) {
                    index = key.indexOf('-'); var keyValue = style[key];
                    if(index !== -1) key = key.substring(0, index) + key.substring(index+1, index+2).toUpperCase() + key.substring(index+2);
                    for(var j = 0; j<this.elements.length; j++) this.elements[j].style[key] = keyValue;
                }
            }
        }else{
            index = style.indexOf('-');
            if(index !== -1) style = style.substring(0, index) + style.substring(index+1, index+2).toUpperCase() + style.substring(index+2);
            for(var j = 0; j<this.elements.length; j++) this.elements[j].style[style] = value;
        }
    };
    SnowMoon.prototype.attr = function(attrName, value) {
        if(!SM.isEmpty(value)) for(var j = 0; j<this.elements.length; j++) this.elements[j].setAttribute(attrName,value);
        else return this.elements[0].getAttribute(attrName);
    };
    SnowMoon.prototype.checked = function(isChecked) {
        if(isChecked === true || isChecked === false) for(var j = 0; j<this.elements.length; j++) this.elements[j].checked = isChecked;
        else return this.elements[0].checked;
    };
    SnowMoon.prototype.scrollLeft = function(num) {
        if(!SM.isEmpty(num)) for(var j = 0; j<this.elements.length; j++) this.elements[j].scrollLeft = num;
        return this.elements[0].scrollLeft;
    };
    SnowMoon.prototype.scrollTop = function(num) {
        if(!SM.isEmpty(num)) for(var j = 0; j<this.elements.length; j++) this.elements[j].scrollTop = num;
        return this.elements[0].scrollTop;
    };
    SnowMoon.prototype.hasClass = function (className) {
        var objClass = this.elements[0].className, objClassList = objClass.split(/\s+/);
        for(var x in objClassList) if(objClassList[x] === className) return true; return false;
    };
    SnowMoon.prototype.addClass = function (className) {
        for(var j = 0; j<this.elements.length; j++){
            var objClass = this.elements[j].className, blank = (objClass !== '') ? ' ' : '';
            objClass = objClass + blank + className;
            this.elements[j].className = objClass;
        }
    };
    SnowMoon.prototype.removeClass = function (className) {
        for(var j = 0; j<this.elements.length; j++) {
            var objClass = ' ' + this.elements[j].className + ' ';
            objClass = objClass.replace(/(\s+)/gi, ' ');
            var removed = objClass.replace(' ' + className + ' ', ' ');
            removed = removed.replace(/(^\s+)|(\s+$)/g, '');
            this.elements[j].className = removed;
        }
    };
    SnowMoon.prototype.click = function(callback) {
        for(var j = 0; j<this.elements.length; j++)
            if(callback) SM.addEvent(this.elements[j], 'click', callback);
            else this.elements[j].click();
    };
    SnowMoon.prototype.change = function(callback) {
        for(var j = 0; j<this.elements.length; j++) SM.addEvent(this.elements[j], 'change', callback);
    };
    SnowMoon.prototype.bind = function(event, callback) {
        for(var j = 0; j<this.elements.length; j++) SM.addEvent(this.elements[j], event, callback);
    };
    SnowMoon.prototype.before = function(ele, targetEle) {
        var parent = this.elements[0];
        if(targetEle){
            if(targetEle.length) parent.insertBefore(ele, targetEle[0]);
            else parent.insertBefore(ele, targetEle);
        }
        else parent.insertBefore(ele, parent.firstChild);
    };
    SnowMoon.prototype.after = function(ele, targetEle) {
        var parent = this.elements[0];
        if(targetEle){
            if(targetEle.isSameNode(parent.lastChild)) parent.appendChild(ele);
            else {
                if(targetEle.length) parent.insertBefore(ele, targetEle[0].nextElementSibling);
                else parent.insertBefore(ele, targetEle.nextElementSibling);
            }
        }else parent.insertAfter(ele,parent.firstChild);
    };
    SnowMoon.prototype.append = function(ele) {
        this.elements[0].appendChild(ele);
    };
    SnowMoon.prototype.remove = function() {
        for(var j = 0; j<this.elements.length; j++){
            var ele = this.elements[j];
            ele.parentNode.removeChild(ele);
        }
    };
    SnowMoon.prototype.isSameNode = function(ele) {
        if(ele.fontSize) ele = ele.get(0);
        var thisEle = this.elements[0];
        if(this.elements[0].isSameNode) return this.elements[0].isSameNode(ele);
        else{
            if(thisEle.innerText !== ele.innerText) return false;
            if(thisEle.nextSibling !== ele.nextSibling) return false;
            if(thisEle.tagName !== ele.tagName) return false;
            if(thisEle.parentNode.innerText !== ele.parentNode.innerText) return false;
            return true;
        }
    };
    SnowMoon.prototype.hidden = (function() {
        var begin = function (ele, delay) {
            var timeout = setTimeout(function () { ele.style.visibility = 'hidden'; window.clearTimeout(timeout); }, delay);
        };
        return function (delay) {
            var delay = delay || 0;
            for(var j = 0; j<this.elements.length; j++) {
                var ele = this.elements[j];
                begin(ele, delay);
            }
        }
    })();
    SnowMoon.prototype.visible = (function() {
        var begin = function (ele, delay) {
            var timeout = setTimeout(function () { ele.style.visibility = 'visible'; window.clearTimeout(timeout); }, delay);
        };
        return function (delay) {
            var delay = delay || 0;
            for(var j = 0; j<this.elements.length; j++) {
                   var ele = this.elements[j];
                   begin(ele, delay);
            }
        }
    })();
    SnowMoon.prototype.hide = (function() {
        var begin = function (ele, delay) {
            if(delay === 0) fun(ele);
            else{
                var timeout = setTimeout(function () {
                    fun(ele);
                    window.clearTimeout(timeout);
                }, delay);
            }
        };
        var fun = function (ele) {
            if(SM.getStyle(ele, 'display') !== 'none') ele.setAttribute('display-show', SM.getStyle(ele, 'display'));
            ele.style.display = 'none';
        };
        return function (delay) {
            var delay = delay || 0;
            for(var j = 0; j<this.elements.length; j++){
                var ele = this.elements[j];
                begin(ele, delay);
            }
        }
    })();
    SnowMoon.prototype.show = (function() {
        var begin = function (ele, delay) {
            if(delay === 0)fun(ele);
            else{
                var timeout = setTimeout(function () {
                    fun(ele);
                    window.clearTimeout(timeout);
                }, delay);
            }
        };
        var fun = function (ele) {
            var displayShow = ele.getAttribute('display-show');
            var showText = null;
            if(SM.isEmpty(displayShow)){
                var tagName = ele.tagName;
                var isInline =  false;
                inlineEle.forEach(function (v) {
                    if(SM.compare(v, tagName)) isInline = true;
                });
                showText = isInline ? 'inline' : 'block';
            }else{
                showText = displayShow;
            }
            ele.style.display = showText;
        };
        return function (delay) {
            delay = delay || 0;
            for(var j = 0; j<this.elements.length; j++){
                var ele = this.elements[j];
                begin(ele, delay);
            }
        }
    })();
    SnowMoon.prototype.fadeIn = function (time) {
        time = time < 10 ? 10 : time;
        for(let j = 0; j<this.elements.length; j++) {
            let ele = SM(this.elements[j]);
            ele.show();
            let oOpacity = SM.isEmpty(this.elements[j].getAttribute('data-o-opacity-show'))? 1 : this.elements[j].getAttribute('data-o-opacity-show');
            ele.css('opacity', '0');
            ele.css('filter', 'Alpha(opacity=0');
            ele.animate({opacity: oOpacity}, time);
        }
    };
    SnowMoon.prototype.fadeOut = function (time) {
        time = time < 10 ? 10 : time;
        for(let j = 0; j<this.elements.length; j++) {
            let ele = SM(this.elements[j]);
            let oOpacity = this.elements[j].getAttribute('data-o-opacity-show');
            if(SM.isEmpty(oOpacity)) {
                oOpacity = SM.getStyle(this.elements[j], 'opacity');
                this.elements[j].setAttribute('data-o-opacity-show', oOpacity);
                ele.css('opacity', oOpacity);
                ele.css('filter', 'Alpha(opacity='+parseInt(oOpacity*100)+')');
            }
            ele.animate({opacity: 0}, time);
            ele.hide(time);
        }
    };
    SnowMoon.prototype.slideDown = function (time, auto) {
        time = time < 10 ? 10 : time;
        for(let j = 0; j<this.elements.length; j++) {
            let ele = SM(this.elements[j]);
            ele.height(0);
            ele.show();
            let scrollHeight = this.elements[j].scrollHeight;
            ele.stop(true).animate({height:scrollHeight}, time);
            if(auto!==false)
                var timeout = setTimeout(function () {
                    ele.css('height','auto');
                    window.clearTimeout(timeout);
                }, time+70)
        }
    };
    SnowMoon.prototype.slideUp = function (time) {
        time = time < 10 ? 10 : time;
        for(let j = 0; j<this.elements.length; j++) {
            let ele = SM(this.elements[j]);
            ele.stop(true).animate({height:0}, time);
            ele.hide(time);
        }
    };
    /*-------------------------------------------------The SM--------------------------------------------------*/
    var SM = (function () {
        var instance = null;
        return function (selector) {
            var ele = selector;
            if(typeof selector === 'string'){
                ele = SM.getEle(selector);
            }
            if(instance === null) {
                instance = true;
                SM.fn.prototype = SnowMoon.prototype;
            }
            return new SM.fn(ele);
        }
    })();
    /**
     * The function is the method for obtaining element nodes and packages thereof
     * @param ele
     */
    SM.fn = function (ele) {
        if(SM.isEmpty(ele)) ele = {};
        this.elements = ele;
        if(SM.isEmpty(ele.length)){
            if(SM.isEmpty(ele)) this.elements.length = 0;
            else this.elements.length = 1;
            this.elements[0] = ele;
        }
        this.length = this.elements.length;
        this.isSM = true;
    };
    /**
     * The function is Method for extending SnowMoon
     * @param obj The extend of functions
     */
    SM.fn.extend = function (obj) {
        SM.appendObj(SM.fn, obj);
    };
    SM.toStr = function (value) { return value+""; };
    SM.trim = function (str) {  return str.replace(/(^\s*)|(\s*$)/g, ""); };
    SM.reverse = function (str) { return str.split('').reverse().join(''); };
    SM.compare = function (a, b) { if(typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase()) return true; else return false; };
    SM.max = function (a, b) { return a > b? a: b; };
    SM.min = function (a, b) { return a < b? a: b; };
    SM.isNum = function (str) {var reg = /^[0-9]+.?[0-9]*$/;if (reg.test(str)) {return true;}return false;};
    SM.url = function (url, isOpen) {  if(url) if(isOpen===true) window.open(url); else window.location.href = url; else return window.location.href;  };
    SM.search = function (name, str) {
        var search = str ? str : decodeURIComponent(window.location.search);
        if(name){
            if (typeof name === 'string'){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = search.substr(1).match(reg);
                if(r!==null) return unescape(r[2]); return undefined;
            }else{
                var list = search.substring(1, search.length).split("&");
                var obj = {};
                list.forEach(function (v) {
                    var l = v.split("=");
                    obj[l[0]] = l[1];
                })
                return obj;
            }
        }
        return search;
    };
    SM.protocol = window.location.protocol;
    SM.host = window.location.host;
    SM.hostname = window.location.hostname;
    SM.port = window.location.port;
    SM.pathname = window.location.pathname;
    SM.hash = window.location.hash;
    SM.getYear = function (date) { date = typeof date === 'undefined' ? new Date():typeof date === 'string'?new Date(date): date; return date.getFullYear(); };
    SM.getMonth = function (date) { date = typeof date === 'undefined' ? new Date():typeof date === 'string'?new Date(date): date; return date.getMonth()+1; };
    SM.getDay = function (date) { date = typeof date === 'undefined' ? new Date():typeof date === 'string'?new Date(date): date; return date.getDate(); };
    SM.getWeek = function (date) { date = typeof date === 'undefined' ? new Date():typeof date === 'string'?new Date(date): date; return date.getDay(); };
    SM.localS = function (key, value) {
        if(typeof value === 'undefined') {
            if(typeof key === 'object'){
                for(let k in key) {
                    if(key[k] === null) localStorage.removeItem(k);
                    else{
                        if(typeof key[k] === 'object') key[k] = JSON.stringify(value);
                        window.localStorage[k] = key[k];
                    }
                }
            }else {
                let value = window.localStorage[key];
                try{
                    value = JSON.parse(value);
                    return value;
                }catch(e) { return value; }
            }
        } else {
            if(value === null) localStorage.removeItem(key);
            else{
                if(typeof value === 'object') value = JSON.stringify(value);
                window.localStorage[key] = value;
            }
        }
    };
    SM.dateFormat = function (date, fmt) {
        if(typeof date === 'string') date = new Date(date);
        let o = {
            "M+": date.getMonth() + 1,                      //Month
            "d+": date.getDate(),                           //Date
            "h+": date.getHours(),                          //Hours
            "m+": date.getMinutes(),                        //Minutes
            "s+": date.getSeconds(),                        //Seconds
            "q+": Math.floor((date.getMonth() + 3) / 3),    //Quarter
            "S": date.getMilliseconds()                     //Milliseconds
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    SM.dataFormatNew =  (function(){
        var subValue = [0,0,0,6,1,0,0,0,0,0,7,5,4,3,2];
        return function(format,data){
            var temp = [0,0,1,0,0,0,0],tmp = 0,start = 0,length=0,amPm="";
            for(var i=0;i<format.length;i++){
                var tm = format[i].charCodeAt(0);
                if(tm===0x79||tm===0x4D||tm===0x64||tm===0x68||tm===0x6D||tm===0x73||tm===0x53||tm===0x75){
                    tmp+=tm,++length;
                    if(tmp>0x79&&tmp!==0xA6&&tmp!==0xF2&&tmp!==0x16B){
                        var sv = subValue[(tm^0x5d)>>2],val = data.substr(start,length);
                        if(sv===7) amPm = val.toLowerCase();
                        else {
                            if(val.length<4){
                                if(val.length===2){
                                    var num1 = val.charCodeAt(1);
                                    if(num1<0x30||num1>0x39){length = 1,temp[sv] = val.charCodeAt(0)&0xf;}
                                    else temp[sv] = (val.charCodeAt(0)&0xf)*10+(num1&0xf);
                                }else if (val.length===3){
                                    var num1 = val.charCodeAt(1);
                                    if(num1<0x30||num1>0x39) {length = 1,temp[sv] = val.charCodeAt(0)&0xf;}else{
                                        num2 = val.charCodeAt(2);
                                        if(num2<0x30||num2>0x39){length = 2,temp[sv] = (val.charCodeAt(0)&0xf)*10+(num1&0xf);}
                                        else temp[sv] = (val.charCodeAt(0)&0xf)*100+(num1&0xf)*10+(num2&0xf);
                                    }
                                }else temp[sv] = val.charCodeAt(0)&0xf;
                            }else {
                                temp[sv] = (val.charCodeAt(0)&0xf)*1000+(val.charCodeAt(1)&0xf)*100+(val.charCodeAt(2)&0xf)*10+(val.charCodeAt(3)&0xf);
                            }
                        }
                        start += length,length = 0,tmp=0;
                    };
                }else start +=1+length,length = 0,tmp=0;
            }
            if(amPm&&temp[3]>-1&&temp[3]<13 && amPm=="pm") temp[3]+=12;
            if(temp[1]>0) --temp[1];
            return new Date(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6]);
        }
    })();
    /**
     * The function is calculates the number of days in which two dates differ
     * @param startDate start date
     * @param endDate end date
     * @returns {Number|*} days
     */
    SM.dateDiff = function(startDate,  endDate){
        let _dt1=new Date(startDate);
        let _dt2=new Date(endDate);
        let dt1=_dt1.getTime();
        let dt2=_dt2.getTime();
        return parseInt((dt2-dt1)/1000/60/60/24);
    };
    /*
     * Tween
     * t: current time
     * b: beginning value
     * c: change in value
     * d: duration
     */
    SM.tween = {
        linear: function(t, b, c, d) { return c*t/d + b; },
        easeIn: function(t,b,c,d){ return c*(t/=d)*t*t + b; },
        easeOut: function(t,b,c,d){ return -c *(t/=d)*(t-2) + b; },
        easeInOut: function(t,b,c,d) { if ((t /= d / 2) < 1) return c / 2 * t * t + b; return -c / 2 * ((--t) * (t - 2) - 1) + b; }
    };
    /**
     * The function is the all functions and this can get the element nodes
     * @returns {*} The element nodes or null
     */
    SM.getEle = function (selector, selectorAfter) {
        let ele = [];
        if(selectorAfter) {
            selectorAfter = SM.trim(selectorAfter);
            let objA = getEleFunName(selectorAfter);
            ele = selector[objA.fun](objA.str);
        }else if(selector) {
            selector = SM.trim(selector);
            let objS = getEleFunName(selector);
            if(SM.ieVersion !== false && SM.ieVersion <= 8 && objS.fun === 'getElementsByClassName'){        //If le ie 8
                let allEle = document.getElementsByTagName('*');
                for(let j = 0; j < allEle.length; j++) if(allEle[j].className === objS.str) ele.push(allEle[j]);
            }else ele = document[objS.fun](objS.str);
            //if select and id
            if (!SM.isEmpty(ele) && objS.attr === 'id' && SM.compare(ele.tagName, 'select')) ele.length = 1;
        }
        return ele;
    };
    /**
     * The function is set identifier of SnowMoon js
     */
    SM.setIdentifier = (function () {
        let identifier = 'SM';
        return function (i) {
            if(!this.isEmpty(i)) {
                identifier = i;
            }
            window[identifier] = SM;
        }
    })();
    /**
     * The function is set images path: the default path is 'images/'
     */
    SM.imgSrc = (function () {
        let imageSrc = 'images/';
        /**
         * @param src This is set the images path, If not specified this, The function return images path
         */
        return function (src) {
            if(src === undefined) return imageSrc;
            imageSrc = src;
        }
    })();
    /**
     * The function is Method for extending SM
     * @param obj The extend of functions
     */
    SM.extend = function (obj) {
        SM.appendObj(SM, obj);
    };
    /**
     * The function is append the object to the back
     * @param obj1 Object1 for function
     * @param obj2 Object2 for function
     */
    SM.appendObj = function (obj1, obj2) {
        for(let key in obj2) {
            obj1[key] = obj2[key];
        }
    };
    /**
     * The function is create element of element name
     * @param elementName element name
     * @returns element
     */
    SM.createEle = function(elementName) {
        return document.createElement(elementName);
    };
    /**
     * The function is add event for element
     * @param eles Element
     * @param type Event type
     * @param handler Function
     * @returns {boolean} if error return false
     */
    SM.addEvent = function(eles, type, handler) {
        if(eles.length){
            for(let j = 0; j < eles.length; j++) setEvent(eles[j]);
        }else setEvent(eles);
        function setEvent(ele) {
            if(ele.addEventListener){
                ele.addEventListener(type, handler, false);
            }else if(ele.attachEvent){
                ele.attachEvent('on'+type, handler)
            }else{
                return false;
            }
        }
    };
    /**
     * The function is remove event for element
     * @param ele Element
     * @param type Event type
     * @param handler Function
     * @returns {boolean} If error return false
     */
    SM.removeEvent = function(ele, type, handler) {
        if(ele.removeEventListener){
            ele.removeEventListener(type, handler, false);
        }else if(ele.detachEvent){
            ele.detachEvent('on'+type, handler);
        }else{
            return false;
        }
    };
    /**
     * The function is judge the data type is empty
     * @param text data
     * @returns {boolean} is empty:true not empty:false
     */
    SM.isEmpty = function (text) {
        if(text === undefined || text === null || text === '') return true; else{
            if(typeof (text) === 'object'){
                for(let key in text)  return false; return true;
            }
            return false;
        }
    };
    /**
     * The function is get the array index for type and value
     * @param array Array
     * @param key Key
     * @param value The type value, If this is no specified, That type become value, Indicates that there are no objects in the array
     * @returns {number} Index
     */
    SM.getArrayIndex = function (array, key, value) {
        var index = -1;
        if(value === undefined){
            array.forEach(function (v, i) {
                if(v === value) index = i;
            });
        }else{
            array.forEach(function (v, i) {
                if(v[key] === value) index = i;
            });
        }
        return index;
    };
    /**
     * The function is get byte length of the text
     * @param text string
     * @returns {number} byte length
     */
    SM.getByteLength = function(text){
        let length = text.length;
        let byteLength = 0;
        for(var i = 0; i < length; i++){
            var word = text.substring(i,i+1);
            if(/^[^\x00-\xff]$/.test(word)) byteLength+=2; else byteLength++;
        }
        return byteLength;
    };
    /**
     * The function is get the text of the longest byte out of position
     * @param text string
     * @param maxByteLength max byte length
     * @returns {number} position
     */
    SM.getTIndexOfBSize = function(text, maxByteLength){
        let length = text.length;
        let byteLength = 0;
        for(let i = 0; i < length; i++){
            let word = text.substring(i,i+1);
            let cha = maxByteLength-byteLength;
            if(/^[^\x00-\xff]$/.test(word)){
                if(cha >= 2) byteLength+=2; else return i;
            } else {
                if(cha >= 1) byteLength++; else return i;
            }
        }
    };
    /**
     * The function is get the html style for style name
     * @param ele Element
     * @param styleName Style name
     * @returns {*} Style result
     */
    SM.getStyle = function(ele, styleName){
        let result;
        if(ele.currentStyle){       //ie
            result = ele.currentStyle[styleName];
            if(styleName === 'filter') if(ele.style.filter === ''){ result = 1; }else{
                var s = ele.style.filter, aIndex = s.indexOf('='), bIndex = s.indexOf(')');
                result = s.substring(aIndex+1, bIndex);
            }
        }else{                      //ff
            var $arr=ele.ownerDocument.defaultView.getComputedStyle(ele, null);
            result = $arr[styleName];
        }
        if(result === 'auto') result = 0;
        return result;
    };
    /**
     * The function is get the html style for style name
     * @param num number
     */
    SM.getPxForRem = function (num) {
        let html = SM.getEle('html')[0];
        let htmlPx = this.withoutPx(this.getStyle(html, 'fontSize'));
        return parseInt(num * htmlPx);
    };
    /**
     * The function is get the html style for style name
     * @param num number
     * @param ele This Element
     */
    SM.getPxForEm = function (num, ele) {
        let parent = ele.parentNode;
        let parentPx = this.withoutPx(this.getStyle(parent, 'fontSize'));
        return parseInt(num * parentPx);
    };
    /**
     * The function is get the number of px For str By Px or Rem or Em
     * @param str String
     * @param start Start number of px
     * @param ele Element
     * @returns {*} End number
     */
    SM.getNumOfPx = function (str, start, ele) {
        if(typeof str === 'number') return str;
        let end = parseFloat(str);
        let pxIndex = str.indexOf('px');                                         //Px
        let emIndex = str.indexOf('em');                                         //Em
        let remIndex = str.indexOf('rem');                                       //Rem
        if(isNaN(end) || pxIndex !== -1 || emIndex !== -1 || remIndex !== -1){
            let a, b;
            if(str.indexOf('+=') !== -1 || str.indexOf('-=') !== -1) a = true;
            if(str.indexOf('+') !== -1 || str.indexOf('-') !== -1) b = true;
            if(remIndex !== -1 || emIndex !== -1){
                let num;
                let index = remIndex !== -1? remIndex: emIndex;
                if(b) num = parseFloat(str.substring(1, index));
                if(a) num = parseFloat(str.substring(2, index));
                if(emIndex !== -1 && remIndex === -1)  num = SM.getPxForEm(num, ele);
                if(remIndex !== -1) num = SM.getPxForRem(num);
                if(b) end = str.substring(0, 1) + num;
                if(a) end = str.substring(0, 2) + num;
            }
            if(pxIndex !== -1) end = str.substring(0, pxIndex);
            return getNumForPx(end, start);
            function getNumForPx(end, start) {
                if(end.indexOf('+=') !== -1) return end = start+parseInt(end.substring(2));
                if(end.indexOf('-=') !== -1) return end = start-parseInt(end.substring(2));
                return parseInt(end);
            }
        }else return end;
    };
    SM.withoutPx = function (str) {
        if(!SM.isEmpty(str) && typeof str !== 'number' && str.indexOf('px') !== -1) return parseInt(str.substring(0, str.length-2)); else return parseFloat(str);
    };
    /**
     * The function is blocking prevention
     * @param obj.id Identifier
     * @param obj.time The delay time
     */
    SM.BP = (function () {
        let list = {}, fn = {
            _beginTime: function (id, time) {
                list[id] = true;
                var timeout = setTimeout(function () {
                    list[id] = false;
                    window.clearTimeout(timeout);
                }, time);
            }
        };
        return function (id, time) {
            if(SM.isEmpty(list[id])){
                list[id] = true;
                fn._beginTime(id, time);
                return true;
            }else{
                if(list[id]) return false; else{
                    fn._beginTime(id, time);
                    return true;
                }
            }
        }
    })();
    /**
     * The function is what browser is access
     * @returns {*}
     */
    SM.browser = (function(){
        let userAgent = navigator.userAgent;
        if (userAgent.indexOf("Opera") > -1) return "opera";
        if (userAgent.indexOf("Firefox") > -1) return "firefox";
        if (userAgent.indexOf("Chrome") > -1) return "chrome";
        if (userAgent.indexOf("Safari") > -1) return "safari";
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && userAgent.indexOf("Opera") <= -1) return "ie";
    })();
    /**
     * The function is get the number of px For str By Px or Rem or Em
     * @returns {*}
     */
    SM.ieVersion = (function () {
        let b_version = navigator.appVersion;
        let version = b_version.split(";");
        if(SM.isEmpty(version[1])) return false;
        else{
            let trim_Version = version[1].replace(/[ ]/g,"");
            if(SM.browser === 'ie'){
                if(trim_Version==="MSIE6.0") return 6;
                if(trim_Version==="MSIE7.0") return 7;
                if(trim_Version==="MSIE8.0") return 8;
                if(trim_Version==="MSIE9.0") return 9;
                if(trim_Version==="MSIE10.0") return 10;
            } return false;
        }
    })();
    /**
     * The function is get cursor position of input or text area
     * @param ele Element of input or text area
     * @returns {number} Position
     */
    SM.getCursorPosition = function(ele) {
        let CaretPos = 0;   // IE Support
        if (document.selection) {
            ele.focus ();
            let Sel = document.selection.createRange ();
            Sel.moveStart ('character', - ele.value.length);
            CaretPos = Sel.text.length;
        } else if (ele.selectionStart || ele.selectionStart === '0') CaretPos = ele.selectionStart; // Firefox support
        return (CaretPos);
    };
    /**
     * The function is set cursor position of input or text area
     * @param ele Element of input or text area
     * @param pos Position
     */
    SM.setCursorPosition = function(ele, pos){
        if(ele.setSelectionRange) {
            ele.focus();
            ele.setSelectionRange(pos,pos);
        } else if (ele.createTextRange) {
            let range = ele.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };
    /**
     * The function is get images url of input files
     * @param file Files of input
     * @returns {*} Image url
     */
    SM.getfileUrl = function(file){
        let url = null;
        if(window.createObjectURL !== undefined) url = window.createObjectURL(file);
        else if(window.URL !== undefined) url = window.URL.createObjectURL(file);
        else if(window.webkitURL !== undefined) url = window.webkitURL.createObjectURL(file);
        return url;
    };
    /**
     * The function is listener browser for return button
     * @param callback Callback function
     * @param args Arguments of callback function
     */
    SM.listenerBack = function (callback, args) {
        SM.addEvent(window, 'popstate', bindFun);
        function bindFun() {
            let hashLocation = location.hash;
            let hashSplit = hashLocation.split("#!/");
            let hashName = hashSplit[1];
            if (hashName !== '') {
                let hash = window.location.hash;
                if (hash === '') {
                    callback.apply(this);
                }
            }
        }
        window.history.pushState('forward', null, './#forward');
    };
    /**
     * The function is bind select for options
     * @param obj.id Id
     * @param obj.options Array of options
     * @param obj.empty Do you want to empty the contents | true or false
     */
    SM.bindSelect = function (obj) {
        let id = obj.id, select = SM.getEle('#'+id), options = obj.options, empty = obj.empty || false;
        if(SM.compare(select.tagName, 'select')){
            if(empty) select.innerText = '';
            options.forEach(function (v) {
                var option = SM.createEle('option');
                var text = v;
                var value = v;
                if(typeof v === 'object'){
                    text = v.text;
                    value = v.value;
                }
                option.innerText = text;
                option.value = value;
                select.appendChild(option);
            })
        }
    };
    /**
     * The function is Determine whether the element appears
     * @param scrollEle The scroll element
     * @param ele The elements to be listened to
     * @param viewEle The elements returned by the view
     * @param isCache In the light of lazyLoad
     * @param obj In the light of lazyLoad
     * @param j In the light of lazyLoad
     * @returns {boolean} isAppear true or false
     */
    SM.appear = function (scrollEle, ele, viewEle, isCache, obj, j) {
        let vpWidth = 0, vpHeight = 0, viewHight = 0;
        if(scrollEle === window) {
            vpWidth = document.documentElement.clientWidth;
            vpHeight = document.documentElement.clientHeight;
            viewHight = vpHeight;
        }else {
            vpWidth = scrollEle.clientWidth;
            vpHeight = scrollEle.clientHeight;
            if(viewEle === window) viewHight = viewEle.innerHeight; else viewHight = viewEle.clientHeight;
        }
        let isWindow = scrollEle === window;
        let parentRectLeft = !isWindow ? scrollEle.getBoundingClientRect().left : 0;
        let parentRectTop = !isWindow ? scrollEle.getBoundingClientRect().top : 0;

        if (isCache === true && obj.cache.indexOf(j) !== -1) return false;
        let rect = ele.getBoundingClientRect();
        let isTrue = rect.top < (vpHeight + parentRectTop) &&               //Vertical
            rect.left < (vpWidth + parentRectLeft) &&                       //Horizontal
            ele.style.display !== 'none';                                   //Image not hide
        if (scrollEle !== viewEle)                                          //IF element not is parent element
            isTrue = isTrue && rect.top < viewHight ? isTrue : false;       //Not gt parentHeight
        return isTrue;                                                      //If the element appears in view position
    };

    /**
     * The function is approx distance between two points on earth ellipsoid
     * @param {Object} lat1 Latitude one
     * @param {Object} lng1 Longitude one
     * @param {Object} lat2 Latitude two
     * @param {Object} lng2 Longitude two
     */
    SM.getDistance = (function(){
        let fn = {
            _EARTH_RADIUS: 6378137.0,    //单位M
            _getRad:  function(d){
                return d * Math.PI/180.0;
            },
        };
        return function (lat1,lng1,lat2,lng2) {
            lat1 = parseFloat(lat1);lng1 = parseFloat(lng1);lat2 = parseFloat(lat2);lng2 = parseFloat(lng2);
            let f = fn._getRad((lat1 + lat2)/2);
            let g = fn._getRad((lat1 - lat2)/2);
            let l = fn._getRad((lng1 - lng2)/2);
            let sg = Math.sin(g) * Math.sin(g);
            let sl = Math.sin(l) * Math.sin(l);
            let sf = Math.sin(f) * Math.sin(f);
            let s,c,w,r,d,h1,h2;
            let a = fn._EARTH_RADIUS;
            let fl = 1/298.257;
            s = sg*(1-sl) + (1-sf)*sl;
            c = (1-sg)*(1-sl) + sf*sl;
            w = Math.atan(Math.sqrt(s/c));
            r = Math.sqrt(s*c)/w;
            d = 2*w*a;
            h1 = (3*r -1)/2/c;
            h2 = (3*r +1)/2/s;
            return parseInt(d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg)));
        }
    })();
    /**
     * The function is implements copy text box content
     * @param id The input id
     * @param callback The cope finished callback function
     */
    SM.copyInput = function (id, callback) {
        var input = document.getElementById(id);
        input.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        if(callback) callback.call(this);
    };
    /**
     * The function is determine the type of browser device
     */
    SM.deviceType = (function() {
        let sUserAgent = navigator.userAgent.toLowerCase();
        let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        let bIsMidp = sUserAgent.match(/midp/i) == "midp";
        let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        let bIsAndroid = sUserAgent.match(/android/i) == "android";
        let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return "phone";
        } else {
            return "pc";
        }
    })();
    /**
     * The function is init page Elements
     */
    SM.initEle = function () {
        //init btn transition with active or hover
        if(SM.deviceType === 'pc') SM('.btn_ts').addClass('sm_hover'); else SM('.btn_ts').addClass('sm_active');
        //init active for iphone
        if(SM.deviceType === 'phone') SM('.sm_active').bind('touchstart', function () {});
    };
    SM.setIdentifier('SM');
    window.onload = function () { SM.initEle(); }
}));


