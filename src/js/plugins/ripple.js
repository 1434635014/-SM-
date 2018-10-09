SM.extend({
    ripple: (function () {
        function _bind(element, color){
            this.element = element;
            this.color = color || 'white';
            SM.addEvent(element, 'click', this.run.bind(this));
            if(SM.deviceType === 'phone') SM.addEvent(element, 'touchstart', function () {})
        }
        _bind.prototype.run = function (event) {
            var offsetInfo = this.element.getBoundingClientRect();
            // if(this.element.querySelector('.ripple-container'))  ripplerContainer.remove();
            var rippleContainer = document.createElement('div');
            rippleContainer.style.position = 'fixed';
            rippleContainer.style.zIndex = 99;
            rippleContainer.style.width = offsetInfo.width + 'px';
            rippleContainer.style.left = offsetInfo.left + 'px';
            rippleContainer.style.top = offsetInfo.top + 'px';
            rippleContainer.style.height = offsetInfo.height + 'px';
            rippleContainer.className = 'ripple-container-' + this.color;
            rippleContainer.style.overflow = 'hidden';
            this.element.appendChild(rippleContainer);
            var circleD = offsetInfo.width * 2;
            var ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = circleD + 'px';
            ripple.style.height = circleD + 'px';
            ripple.style.borderRadius = '500px';
            ripple.style.left = ((event.clientX - offsetInfo.left) - circleD/2) + 'px';
            ripple.style.top = ((event.clientY - offsetInfo.top) - circleD/2) + 'px';
            ripple.className = 'ripple';
            rippleContainer.appendChild(ripple);
            SM.addEvent(ripple, 'animationend', function(){
                rippleContainer.remove();
            }.bind(this));
        }
        return function (ele, color) {
            if(ele.length && ele.length > 0){
                Array.prototype.forEach.call(ele, function(element){
                    if(!element.hasAttribute('is-ripple')) {
                        new _bind(element, color);
                        element.setAttribute('is-ripple','is-ripple')
                    }
                });
            }else new _bind(ele);
        }
    })()
})