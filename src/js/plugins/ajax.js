
SM.extend({
    /**
     * The function is Ajax
     * @param obj
     */
    ajax: function (obj) {
        let xmlhttp, type, url, async, dataType, data, res, timeout, contentType, header, xhrFields;
        if (typeof(obj) !== 'object')  return false;

        type = obj.type === undefined ? 'POST' : obj.type.toUpperCase();
        url = obj.url === undefined ? window.location.href : obj.url;
        async = obj.async === undefined ? true : obj.type;
        dataType = obj.dataType === undefined ? 'HTML' : obj.dataType.toUpperCase();
        data = obj.data === undefined ? {} : obj.data;
        timeout = obj.timeout === undefined ? 0 : obj.timeout;
        contentType = obj.contentType || "application/x-www-form-urlencoded";
        header = obj.header || {};
        xhrFields = obj.xhrFields || {};

        let formatParams = function () {
            if (typeof(data) === "object") {
                let str = "";
                for (let pro in data) {
                    str += pro + "=" + data[pro] + "&";
                }
                data = str.substr(0, str.length - 1);
            }
            if (type === 'GET' || dataType === 'JSONP') {
                if (url.lastIndexOf('?') === -1) {
                    url += '?' + data;
                } else {
                    url += '&' + data;
                }
            }
        };
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (dataType === 'JSONP') {
            if (typeof(obj.beforeSend) === 'function') obj.beforeSend(xmlhttp);
            let callbackName = ('jsonp_' + Math.random()).replace(".", "");
            let oHead = document.getElementsByTagName('head')[0];
            data.callback = callbackName;
            let ele = document.createElement('script');
            ele.type = "text/javascript";
            ele.onerror = function () {
                obj.error && obj.error("请求失败");
            };
            oHead.appendChild(ele);
            window[callbackName] = function (json) {
                oHead.removeChild(ele);
                window[callbackName] = null;
                obj.success && obj.success(json);
            };
            formatParams();
            ele.src = url;
            return false;
        } else {
            formatParams();
            xmlhttp.open(type, url, async);
            xmlhttp.setRequestHeader("Content-type", contentType+"; charset=utf-8");
            for (var key in header)
                xmlhttp.setRequestHeader(key, header[key]);
            for (var key in xhrFields)
                xmlhttp[key] = xhrFields[key]
            if (typeof(obj.beforeSend) === 'function') obj.beforeSend(xmlhttp);
            xmlhttp.send(data);
            var timeoutTimer;
            xmlhttp.onreadystatechange = function () {
                window.clearTimeout(timeoutTimer);
                if (xmlhttp.status !== 200) {
                    if(xmlhttp.status!==0) obj.error(xmlhttp.status) && obj.error(xmlhttp.status);
                    return false;
                }
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    if (dataType === 'JSON') {
                        try {
                            res = JSON.parse(xmlhttp.responseText);
                        } catch (e) {
                            console.log('返回的json格式不正确');
                            obj.error('返回的json格式不正确');
                        }
                    } else if (dataType === 'XML') {
                        res = xmlhttp.responseXML;
                    } else {
                        res = xmlhttp.responseText;
                    }
                    obj.success && obj.success(res);

                }
            };
            if(timeout !== 0){
                timeoutTimer = window.setTimeout(function () {
                    xmlhttp.abort();
                    obj.error(xmlhttp.status);
                    window.clearTimeout(timeoutTimer);
                }, timeout);
            }
        }
    },
    /**
     * The function is Ajax of load html
     * @param url Html url
     * @param callback Callback
     * @param isAll if load all html text, default:false
     */
    load:function (url, callback, isAll) {
        this.ajax({
            url:url,
            success:function (res) {
                res = SM.trim(res);
                if(isAll !== true) {
                    let beginIndex = res.indexOf('<body>');
                    if(beginIndex !== -1){
                        let endIndex = res.indexOf('</body>');
                        res = SM.trim(res.substring(beginIndex+6, endIndex));
                    }
                }
                if(typeof callback === 'function') callback.call(this, [res]);
            },
            error:function (res) {
                if(typeof callback === 'function') callback.call(this, ['error', res]);
            }
        })
    }
});