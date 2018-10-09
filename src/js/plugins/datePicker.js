/**
 * Created by Administrator on 2017/7/6/006.
 */
SM.extend({

    datePicker: (function () {
        var minYear = 2015, maxYear = 2025, animateTme = 200;
        var dateEle =
            '<div class="date_time_picker_header">\
                <div class="date_time_year" data-time-year="2017" data-year-active="2017">\
                    <div class="date_time_year_in">\
                        <div data-year="2015">2015年</div>\
                        <div data-year="2016">2016年</div>\
                        <div data-year="2017">2017年</div>\
                        <div data-year="2018">2018年</div>\
                        <div data-year="2019">2019年</div>\
                        <div data-year="2020">2020年</div>\
                        <div data-year="2021">2021年</div>\
                        <div data-year="2022">2022年</div>\
                        <div data-year="2023">2023年</div>\
                        <div data-year="2024">2024年</div>\
                        <div data-year="2025">2025年</div>\
                    </div>\
                </div>\
                <i class="icon icon_prev"></i>\
                <i class="icon icon_next"></i>\
            </div>\
            <div class="date_time_picker_body" data-time-month="1">\
                <div class="s_re_all_center">\
                    <div class="date_time_month">1</div>\
                    <div class="date_time_month">2</div>\
                    <div class="date_time_month">3</div>\
                    <div class="date_time_month">4</div>\
                    <div class="date_time_month">5</div>\
                    <div class="date_time_month">6</div>\
                    <div class="date_time_month">7</div>\
                    <div class="date_time_month">8</div>\
                    <div class="date_time_month">9</div>\
                    <div class="date_time_month">10</div>\
                    <div class="date_time_month">11</div>\
                    <div class="date_time_month">12</div>\
                </div>\
            </div>\
            <div class="date_time_mask"></div>';
        var fn = {
            _createDateView: function (dateId, inputEle) {
                var dateDiv = SM.createEle('div');
                dateDiv.setAttribute('id', dateId);
                dateDiv.setAttribute('class', 'date_time_picker');
                dateDiv.innerHTML = dateEle;
                // inputEle.parentNode.appendChild(dateDiv);
                document.body.appendChild(dateDiv);
                return this._setPosition(dateId, inputEle)
            },
            _setPosition: function (dateId, inputEle) {
                var dateEle = SM('#'+dateId);
                let left = inputEle.getBoundingClientRect().left + document.body.scrollLeft;
                let top = inputEle.getBoundingClientRect().top + document.body.scrollTop + SM.withoutPx(SM.getStyle(inputEle, 'height'));
                dateEle.css('left', left + 'px');
                dateEle.css('top', top + 'px');
                return dateEle;
            },
            _setDateInit: function (dateYearEle, dateBodyEle, dateMonthEle, dateYearInEle, defaultDate) {
                var year = SM.getYear(defaultDate), month = SM.getMonth(defaultDate);
                dateYearEle.attr('data-time-year', year);
                dateYearEle.attr('data-year-active', year);
                dateBodyEle.attr('data-time-month', month);
                this._setMonthActive(year, year, month, dateMonthEle);
                this._setYearActive(year, dateYearInEle)
            },
            _setMonthActive: function (year, activeYear, month, dateMonthEle) {
                if(year !== activeYear){
                    dateMonthEle.removeClass('active');
                }else{
                    dateMonthEle.eq(month-1).addClass('active');
                }
            },
            _setYearActive: function (year, dateYearInEle) {
                var num = year - minYear;
                dateYearInEle.css('marginTop', (-num * 35)+ 'px')
            },
            _setInputValue: function (ele, dateYearEle, dateBodyEle) {
                var year = dateYearEle.attr('data-year-active');
                var month =  dateBodyEle.attr('data-time-month');
                var value = year +"-"+ month;
                ele.value = value;
                this._changeOrReset(dateYearEle, year, true);
                return value;
            },
            _changeOrReset: function (dateYearEle, year, isChange) {
                if(isChange) dateYearEle.attr('data-time-year', year); else dateYearEle.attr('data-year-active', year);
            },
        };
        return function (obj) {
            var id = obj.id, inputEle = document.getElementById(id), dateId = id+'Date', callback = obj.callback || undefined, defaultDate = obj.defaultDate || undefined;
            inputEle.setAttribute('readonly', 'readonly');
            inputEle.style.cursor = 'pointer';
            if(typeof defaultDate === 'object') inputEle.value = SM.dateFormat(defaultDate, 'yyyy-MM');
            if(typeof defaultDate === 'string') inputEle.value = defaultDate;
            var dateEle = fn._createDateView(dateId, inputEle);
            var dateMaskEle = dateEle.children('.date_time_mask');
            var dateMonthEle = dateEle.find('.date_time_picker_body .date_time_month');
            var dateIconEle = dateEle.find('.date_time_picker_header i.icon');
            var dateYearInEle = dateEle.find('.date_time_picker_header .date_time_year_in');
            var dateYearEle = dateEle.find('.date_time_picker_header .date_time_year');
            var dateBodyEle = dateEle.children('.date_time_picker_body');

            fn._setDateInit (dateYearEle, dateBodyEle, dateMonthEle, dateYearInEle, defaultDate);

            SM.addEvent(inputEle, 'click', function () {
                dateEle.show();
                fn._setPosition(dateId, inputEle)
            });
            SM.addEvent(dateMaskEle.get(0), 'click', function (e) {
                e = e || window.e;
                var year = dateYearEle.attr('data-time-year');
                var month = dateBodyEle.attr('data-time-month');
                fn._changeOrReset(dateYearEle, year, false);
                fn._setMonthActive(true, true, month,  dateMonthEle);
                fn._setYearActive(year,dateYearInEle);
                dateEle.hide(); e.preventDefault(); e.stopPropagation(); return false;
            });
            SM.addEvent(dateMonthEle.get(), 'click', function (e) {
                e = e || window.e;
                var ele = SM(e.target), month = ele.text();
                dateMonthEle.removeClass('active');
                dateBodyEle.attr('data-time-month', month);
                ele.addClass('active');
                dateEle.hide();
                var value = fn._setInputValue(inputEle, dateYearEle, dateBodyEle);
                if(callback) callback.call(this, value);
                e.preventDefault(); e.stopPropagation(); return false;
            });
            SM.addEvent(dateIconEle.get(), 'click', function (e) {
                if(SM.BP('date#'+dateId, animateTme)){
                    e = e || window.e;
                    var ele = SM(e.target);
                    var year = parseInt(dateYearEle.attr('data-time-year'));
                    var activeYear = parseInt(dateYearEle.attr('data-year-active'));
                    var month =  parseInt(dateBodyEle.attr('data-time-month'));
                    if(ele.hasClass('icon_prev')){
                        if(activeYear > minYear) {
                            dateYearInEle.animate({marginTop: '+=35px'}, animateTme);
                            dateYearEle.attr('data-year-active', --activeYear);
                        }
                    }else{
                        if(activeYear < maxYear) {
                            dateYearInEle.animate({marginTop: '-=35px'}, animateTme);
                            dateYearEle.attr('data-year-active', ++activeYear);
                        }
                    }
                    fn._setMonthActive(year, activeYear, month, dateMonthEle);
                }
            });
        }
    })()

});