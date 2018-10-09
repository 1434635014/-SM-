

function component(components){
    let allComponents = ['ajax', 'collapse', 'dragLoader', 'ellipsis', 'inputSize', 'lazyLoad', 'monitor', 'onInput', 'rolling', 'paging', 'datePicker', 'qrcode', 'dialog', 'swiper', 'btnTransition', 'ripple', 'imgBase64'];
    //Has style components
    let includeStyles = ['collapse', 'dragLoader', 'rolling', 'paging', 'datePicker', 'qrcode', 'dialog', 'swiper', 'btnTransition', 'ripple'];
    if(components === 'all') components = allComponents;        //If all components
    function requireFun(ss) {
        if(includeStyles.indexOf(ss) !== -1) require ('../css/plugins/' +ss+ '.scss');
        require('../js/plugins/' +ss+ '.js');
    }
    require('../js/SnowMoon.js');
    require('../css/SnowMoon.scss');
    for(let j = 0; j < components.length; j++){
        requireFun(components[j])
    }
};
component('all');