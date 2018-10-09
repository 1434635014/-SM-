
SM.extend({
    /**
     * The function is lazy load images
     * @param obj.id Scroll element of id，default window
     * @param obj.parentId Parent for images element of id，default obj.id
     * @param obj.imgCache Is the picture cached if the number of pictures remains unchanged?
     * @param obj.animation The animation in which the picture appears
     */
    lazyLoad: (function () {
        let list = {}, fadeInTime = 500, scrollTime = 20;
        let bindScrollFun = function(id) {
            let obj = list[id];
            SM.addEvent(obj.ele, 'scroll', scrollFun);
            function scrollFun(call) {
                if(SM.BP('lazyLoad#'+id, scrollTime) || call === true){
                    let images = null, isCache = obj.images !== null, animation = obj.animation, ele = obj.ele, viewEle = obj.viewEle, queryEle = obj.queryEle;
                    if(isCache) images = obj.images; else images = queryEle !== window ? SM.getEle(queryEle, 'img[data-src]' ) : SM.getEle('img[data-src]');

                    if(images.length > 0){
                        for (let j = 0; j<images.length; j++) {
                            let img = images[j];
                            if(SM.appear(ele, img, viewEle, isCache, obj, j)){
                                let src = img.getAttribute('data-src');
                                loadImg(src, img);
                                function loadImg(src, img) {
                                    if(!SM.isEmpty(src)){
                                        let image = new Image();
                                        image.onload = function () {
                                            showImg()
                                        };
                                        image.src = src;
                                        function showImg() {
                                            if(img.getAttribute('src') !== src){
                                                if(obj.delay === 0){
                                                    if(img.getAttribute('src') !== src) {
                                                        if(!SM.isEmpty(animation)) SM(img).fadeIn(fadeInTime); else SM(img).css('opacity',1);
                                                        img.setAttribute('src', src);
                                                    }
                                                }else {
                                                    if(img.getAttribute('src') !== src){
                                                        let delayTimeout = setTimeout(function () {
                                                            if(!SM.isEmpty(animation)) SM(img).fadeIn(fadeInTime); else SM(img).css('opacity',1);
                                                            img.setAttribute('src', src);
                                                            window.clearTimeout(delayTimeout);
                                                        },obj.delay);
                                                    }
                                                }
                                                img.removeAttribute('data-src');
                                            }
                                        }
                                        if(SM.ieVersion <= 8) showImg();
                                    }
                                    if(isCache){                    //If cache, save into cache array
                                        obj.cache.push(j);
                                        if(obj.cache.length === images.length) SM.removeEvent(obj.ele, 'scroll', scrollFun);
                                    }
                                }
                            }

                        }
                    }

                }
            }
            scrollFun();
            list[id].scrollFun = scrollFun;
        };
        return function (obj, isDestroy) {
            if(isDestroy === true || isDestroy === false) {
                let scrollFun = list[obj.id].scrollFun;
                if(isDestroy) scrollFun.call(null, true);
                else this.removeEvent(list[obj.id].ele, 'scroll', scrollFun);
                return;
            }
            obj = this.isEmpty(obj)? {} : obj;
            let id = this.isEmpty(obj.id)? 'window' : obj.id, ele = id !=='window' ? this.getEle('#'+id) : window;
            let viewId = this.isEmpty(obj.viewId) ? 'window' : obj.viewId, viewEle = viewId === 'window' ? window : this.getEle('#'+viewId);
            let queryId = this.isEmpty(obj.queryId) ? id : obj.queryId, queryEle = queryId === 'window' ? window : this.getEle('#'+queryId);
            let imgCache = this.isEmpty(obj.imgCache) ? false : obj.imgCache;
            let delay = this.isEmpty(obj.delay) ? 0 : obj.delay;
            let images = null;
            if(imgCache) images = queryEle !== window ? this.getEle(queryEle, 'img[data-src]' ) : this.getEle('img[data-src]');
            list[id] = {ele:ele, viewEle:viewEle, queryEle:queryEle, images:images, cache:[], animation:obj.animation, delay:delay};
            bindScrollFun(id);
        }
    })()
});
