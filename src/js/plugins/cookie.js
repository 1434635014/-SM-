/**
 * Created by Administrator on 2017/8/21/021.
 */
SM.extend({
    /**
     * The function is set cookie
     * @param key The key of cookie
     * @param value The value of cookie
     * @param time The time of cookie
     */
    setCookie:function (key, value, time) {
        let exdate = new Date();
        if(value !== undefined){
            let lastStr = 'number', newStr = '';
            if(typeof time === 'string') {
                lastStr = time.substring(time.length-1, time.length);
                newStr = parseInt(time.substring(0, time.length));
            }
            switch (lastStr){
                case 'y':       //years
                    exdate.setYear(exdate.getYear()+newStr);
                    break;
                case 'M':       //months
                    exdate.setMonth(exdate.getMonth()+newStr);
                    break;
                case 'd':       //days
                    exdate.setDate(exdate.getDate()+newStr);
                    break;
                case 'h':       //hours
                    exdate.setTime(exdate.getTime()+newStr*1000*60*60);
                    break;
                case 'm':       //minutes
                    exdate.setTime(exdate.getTime()+newStr*1000*60);
                    break;
                case 's':       //seconds
                    exdate.setTime(exdate.getTime()+newStr*1000);
                    break;
                default:        //milliseconds
                    exdate.setTime(exdate.getTime()+parseInt(time));
                    break;
            }
        }
        document.cookie = key+ "=" + escape(value) + ((time===null) ? "" : ";expires=" + exdate.toGMTString());
    },
    /**
     * The function is get cookie
     * @param key The key of cookie
     * @returns {undefined} The value for cookie by the key
     */
    getCookie:function (key) {
        if (document.cookie.length>0) {
            let c_start=document.cookie.indexOf(key + "=");
            if (c_start!==-1) {
                c_start=c_start + key.length+1;
                let c_end=document.cookie.indexOf(";",c_start);
                if (c_end===-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return undefined;
    }
});