/**
 * Created by Administrator on 2017/9/15/015.
 */
SM.extend({
    swiper: (function () {
        var list = {};
        var fn = {
            _moveSwiper:function (index, swiperOutWidth, left, swiperIn) {
                var mLeft = index * (swiperOutWidth+left);
                swiperIn.stop().animate({'marginLeft': -mLeft}, 500);
            },
            _choosePaging:function (swiperPagingBar, chooseIndex, removeIndex) {
                swiperPagingBar.eq(removeIndex).removeClass('active');
                swiperPagingBar.eq(chooseIndex).addClass('active');
            }
        };
        return function (obj) {
            var id = obj.id;
            if(!SM.isEmpty(id)) if(list[id] !== undefined) return;
            var ele = SM('#'+id);
            var size = obj.size > 1? obj.size : 1, index = obj.index > 0? obj.index : 0, left = obj.left || 0, isOpenTouch = SM.isEmpty(obj.isOpenTouch) ? true: obj.isOpenTouch;
            var swiperOut = ele.find('.swiper_out'), swiperOutWidth = swiperOut.width();
            var swiperIn = swiperOut.find('.swiper_in'), swiperSlide = swiperIn.find('.swiper_slide'), swiperSlideSize = swiperSlide.length;
            var swiperPaging = ele.find('.swiper_paging'), swiperPrev = ele.find('.swiper_prev'), swiperNext = ele.find('.swiper_next');

            var num = Math.floor(swiperSlideSize / size);
            if(swiperSlideSize % size !== 0) num++;

            swiperIn.width((swiperOutWidth+left)*num-left);
            swiperIn.css('marginLeft', -index*(swiperOutWidth+left)+'px');

            list[id] = {};
            if(swiperPaging.length > 0){            //swiper paging
                var swiperPagingBar = swiperPaging.find('.swiper_paging_bar');
                swiperPagingBar.eq(index).addClass('active');
                swiperPagingBar.click(function (e) {
                    e = e || window.event;
                    var ele = SM(e.target);
                    if(!ele.hasClass('active')){
                        var chooseIndex = parseInt(ele.attr('data-index'));
                        fn._moveSwiper(chooseIndex, swiperOutWidth, left, swiperIn);
                        fn._choosePaging(swiperPagingBar, chooseIndex, index);
                        index = chooseIndex;
                    }
                })
            }
            if(swiperPrev.length > 0){              //swiper prev btn
                swiperPrev.click(function () {
                    if(index > 0){
                        if(swiperPaging.length > 0) fn._choosePaging(swiperPagingBar, index-1, index);
                        index--;
                        fn._moveSwiper(index, swiperOutWidth, left, swiperIn);
                    }
                });
            }
            if(swiperNext.length > 0){              //swiper next btn
                swiperNext.click(function () {
                    if(index < (num-1)){
                        if(swiperPaging.length > 0) fn._choosePaging(swiperPagingBar, index+1, index);
                        index++;
                        fn._moveSwiper(index, swiperOutWidth, left, swiperIn);
                    }
                });
            }
            var moveNum = 0;
            if(isOpenTouch){
                this.monitor({
                    ele: swiperOut,
                    event: 'touch',
                    moved:swiperOutWidth/3,
                    start:function (data) {
                        moveNum = data.moveX;
                    },
                    move:function (data) {
                        moveNum = data.moveX;
                    },
                    end: function (data) {
                        if(data.isLeft === true){
                            if(index < (num-1)){
                                if(swiperPaging.length > 0) fn._choosePaging(swiperPagingBar, index+1, index);
                                index++;
                                fn._moveSwiper(index, swiperOutWidth, left, swiperIn);
                            }
                        }else if(data.isLeft === false){
                            if(index > 0){
                                if(swiperPaging.length > 0) fn._choosePaging(swiperPagingBar, index-1, index);
                                index--;
                                fn._moveSwiper(index, swiperOutWidth, left, swiperIn);
                            }
                        }else{
                            //fn._moveSwiper(index, swiperOutWidth, left, swiperIn);
                        }
                        moveNum = 0;
                    }
                })
            }
        }
    })()
});