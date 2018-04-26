'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

google.charts.load('current', {
    'packages': ['corechart', 'geochart'],
    'mapsApiKey': 'AIzaSyDMPDZMkd7YLnBpiKeBAq2HZYfjdWS8FA4'
});

google.charts.setOnLoadCallback(function () {
    addFirstCharts();
});

var g = function () {
    var container2 = document.getElementById('container-2'),
        toolbar = document.querySelector('.dashboard-toolbar'),
        pseudoCircle = document.querySelector('.pseudo-circle'),
        menu1 = document.querySelector('.menu-1'),
        box = document.querySelector('.box'),
        removeBox = document.querySelector('.close'),
        wrap = document.getElementById('grid'),
        slotObjects = [],
        dataId = [],
        allCharts = [],
        chartPositions = [],
        allSlots = [],
        slotsPerRow = 8,
        selected = null,
        originalIndex = null,
        originalClickCoords = null,
        lastTouched = null;
    return {
        container2: container2,
        toolbar: toolbar,
        pseudoCircle: pseudoCircle,
        menu1: menu1,
        box: box,
        removeBox: removeBox,
        wrap: wrap,
        slotObjects: slotObjects,
        dataId: dataId,
        allCharts: allCharts,
        chartPositions: chartPositions,
        slotsPerRow: slotsPerRow,
        allSlots: allSlots,
        selected: selected,
        originalIndex: originalIndex,
        originalClickCoords: originalClickCoords,
        lastTouched: lastTouched
    };
}();

var slot = function slot(num) {
    var state = {
        num: num,
        aspectWidth: 1920,
        aspectHeight: 1080
    };
    return Object.assign({}, createSlotDiv(state), createDivArray(state));
};

var createSlotDiv = function createSlotDiv(state) {
    return {
        createDiv: function createDiv(indx) {
            var div = document.createElement('div');
            div.setAttribute('style', 'width: ' + 100 / g.slotsPerRow + '%; padding-bottom: ' + 100 / g.slotsPerRow * (state.aspectHeight / state.aspectWidth) + '%;');
            div.setAttribute('class', 'dd-slot');

            var slotProp = {
                xPos: Math.floor(indx / g.slotsPerRow) + 1,
                yPos: indx % g.slotsPerRow + 1,
                status: 'available'
            };
            g.slotObjects.push(slotProp);
            div.setAttribute('data-slot-x', g.slotObjects[indx].xPos);
            div.setAttribute('data-slot-y', g.slotObjects[indx].yPos);
            div.setAttribute('data-status', g.slotObjects[indx].status);
            /* div.innerHTML = `<p class="dd-slot-num dd-vc">${indx + 1}</p>`; */
            return div;
        }
    };
};

var createDivArray = function createDivArray(state) {
    return {
        createArray: function createArray() {
            return [].concat(_toConsumableArray(Array(state.num))).map(function (el, i) {
                return slot().createDiv(i);
            });
        }
    };
};

var slotBounds = function slotBounds(num) {
    var state = {
        wrapBounds: g.wrap.getBoundingClientRect(),
        slotSize: document.getElementsByClassName('dd-slot')[0].getBoundingClientRect(),
        num: num
    };
    return Object.assign({}, slotWidth(state), slotHeight(state), addToSlotObjects(state));
};

var slotWidth = function slotWidth(state) {
    return {
        width: function width() {
            switch (state.num) {
                case 2:
                    return state.slotSize.width * 2;
                case 3:
                    return state.slotSize.width * 3;
                default:
                    return state.slotSize.width;
            }
        }
    };
};

var slotHeight = function slotHeight(state) {
    return {
        height: function height() {
            switch (state.num) {
                case 2:
                    return state.slotSize.height * 2;
                case 3:
                    return state.slotSize.height * 3;
                default:
                    return state.slotSize.height;
            }
        }
    };
};

var addToSlotObjects = function addToSlotObjects(state) {
    return {
        add: function add() {
            return [].concat(_toConsumableArray(document.getElementsByClassName('dd-slot'))).forEach(function (item, i) {
                var slotBound = item.getBoundingClientRect();
                Object.assign(g.slotObjects[i], {
                    y: slotBound.top - state.wrapBounds.top,
                    x: slotBound.left - state.wrapBounds.left,
                    bottom: slotBound.bottom - state.wrapBounds.bottom,
                    right: slotBound.right - state.wrapBounds.right,
                    width: slotBound.width,
                    height: slotBound.height
                });
            });
        }
    };
};

var addSlotsToDOM = function addSlotsToDOM(array) {
    var arr = array;
    return {
        go: function go() {
            arr.forEach(function (slot, i) {
                g.wrap.appendChild(slot);
            });
            slotBounds().add();
        }
    };
};

var filterOut = function filterOut(array, string) {
    var state = {
        arr: array,
        str: string
    };
    return {
        getThis: function getThis() {
            return state.arr.filter(function (str) {
                return str === state.str;
            });
        }
    };
};

var pieFunction = function pieFunction(pieChart, div) {
    var state = {
        pieChart: pieChart,
        div: div
    };
    return {
        go: function go() {
            state.pieChart.options.pieStartAngle = 0;
            var chart = new google.visualization.PieChart(state.div);
            google.visualization.events.addListener(chart, 'ready', function () {
                if (state.pieChart.options.pieStartAngle < 10) {
                    state.pieChart.options.pieStartAngle++;
                    setTimeout(function () {
                        chart.draw(state.pieChart.data, state.pieChart.options);
                    }, 0);
                }
            });
            chart.draw(state.pieChart.data, state.pieChart.options);
        }
    };
};

var chart = function chart(response, optionType, type, div) {
    var state = { response: response, optionType: optionType, type: type, div: div };
    return {
        getChart: function getChart() {
            var obj = {};
            obj.data = new google.visualization.DataTable(state.response.data);
            obj.options = state.response.options[state.optionType];
            switch (state.type) {
                case 'PieChart':
                    obj.draw = function () {
                        return pieFunction(obj, state.div).go();
                    };
                    break;
                default:
                    obj.draw = function () {
                        return new google.visualization[state.type](state.div).draw(obj.data, obj.options);
                    };
                    break;
            }
            return obj;
        }
    };
};

var chartDiv = function chartDiv(cssClass) {
    var state = {
        cssClass: cssClass,
        width2: slotBounds(2).width(),
        width3: slotBounds(3).width(),
        height2: slotBounds(2).height(),
        height3: slotBounds(3).height()
    };
    return {
        createDiv: function createDiv() {
            var div = document.createElement('div');
            switch (state.cssClass) {
                case 'geo':
                    div.setAttribute('style', 'width:' + state.width3 + 'px; height:' + state.height3 + 'px;');break;
                case 'pie':
                    div.setAttribute('style', 'width:' + state.width2 + 'px; height:' + state.height3 + 'px;');break;
                case 'area':
                    div.setAttribute('style', 'width:' + state.width2 + 'px; height:' + state.height2 + 'px;');break;
                case 'line':
                    div.setAttribute('style', 'width:' + state.width2 + 'px; height:' + state.height2 + 'px;');break;
                case 'bar':
                    div.setAttribute('style', 'width:' + state.width3 + 'px; height:' + state.height3 + 'px;');break;
            }
            div.classList.add(state.cssClass);
            return div;
        }
    };
};

var chartSize = function chartSize(el) {
    var ele = el;
    return {
        getSize: function getSize() {
            var widthPX = ele.style.width,
                heightPX = ele.style.height;
            var sizes = {
                elWidth: Math.round(widthPX.substring(0, widthPX.length - 2)),
                elHeight: Number(heightPX.substring(0, heightPX.length - 2))
            };
            return sizes;
        }
    };
};

var getGridPositions = function getGridPositions(indx, div) {
    var i = indx;
    var ele = div;
    return {
        go: function go() {
            var X = g.slotObjects[i];
            var size = chartSize(ele).getSize();
            var elWidth = size.elWidth,
                elHeight = size.elHeight;
            var _ref = [Math.round(X.width), X.height],
                slotWidth = _ref[0],
                slotHeight = _ref[1];


            var getSlotElem = function getSlotElem(x, y) {
                return document.querySelector('[data-slot-x="' + x + '"][data-slot-y="' + y + '"]');
            };

            var _ref2 = [g.slotObjects[i + 1], g.slotObjects[i + 2], g.slotObjects[i + 2 + g.slotsPerRow], g.slotObjects[i + (g.slotsPerRow + 1)], g.slotObjects[i + g.slotsPerRow], g.slotObjects[i + g.slotsPerRow * 2], g.slotObjects[i + g.slotsPerRow * 2 + 1], g.slotObjects[i + g.slotsPerRow * 2 + 2]],
                X1 = _ref2[0],
                X2 = _ref2[1],
                X2Y1 = _ref2[2],
                X1Y1 = _ref2[3],
                Y1 = _ref2[4],
                Y2 = _ref2[5],
                X1Y2 = _ref2[6],
                X2Y2 = _ref2[7];
            var _ref3 = [getSlotElem(X.xPos, X.yPos), getSlotElem(Y1.xPos, Y1.yPos), getSlotElem(X1.xPos, X1.yPos), getSlotElem(X2.xPos, X2.yPos), getSlotElem(X1Y1.xPos, X1Y1.yPos), getSlotElem(X2Y1.xPos, X2Y1.yPos), getSlotElem(Y2.xPos, Y2.yPos), getSlotElem(X1Y2.xPos, X1Y2.yPos), getSlotElem(X2Y2.xPos, X2Y2.yPos)],
                el = _ref3[0],
                elY1 = _ref3[1],
                elX1 = _ref3[2],
                elX2 = _ref3[3],
                elX1Y1 = _ref3[4],
                elX2Y1 = _ref3[5],
                elY2 = _ref3[6],
                elX1Y2 = _ref3[7],
                elX2Y2 = _ref3[8];


            if (elWidth === slotWidth * 2 && elHeight === slotHeight * 2) {
                [X, Y1, X1, X1Y1, el.dataset, elY1.dataset, elX1.dataset, elX1Y1.dataset].map(function (obj) {
                    return obj.status = 'occupied';
                });
                return { x: X.x, y: X.y, width: elWidth, height: elHeight };
            } else if (elWidth === slotWidth * 2 && elHeight === slotHeight * 3) {
                [X, Y1, X1, X1Y1, Y2, X1Y2, el.dataset, elY1.dataset, elX1.dataset, elX1Y1.dataset, elY2.dataset, elX1Y2.dataset].map(function (obj) {
                    return obj.status = 'occupied';
                });
                return { x: X.x, y: X.y, width: elWidth, height: elHeight };
            } else if (elWidth === slotWidth * 3 && elHeight === slotHeight * 3) {
                [X, Y1, X1, X1Y1, Y2, X1Y2, X2, X2Y2, X2Y1, el.dataset, elY1.dataset, elX1.dataset, elX1Y1.dataset, elY2.dataset, elX1Y2.dataset, elX2.dataset, elX2Y2.dataset, elX2Y1.dataset].map(function (obj) {
                    return obj.status = 'occupied';
                });
                return { x: X.x, y: X.y, width: elWidth, height: elHeight };
            }
        }
    };
};

var isNotOverlapping = function isNotOverlapping(i, chartWidth) {
    var state = {
        indx: i,
        width: chartWidth,
        width2: slotBounds(2).width(),
        width3: slotBounds(3).width(),
        yPos: g.slotObjects[i].yPos,
        status: g.slotObjects[i].status,
        nextStatus: g.slotObjects[i + 1].status,
        afterNextStatus: g.slotObjects[i + 2].status,
        status1Down: g.slotObjects[i + g.slotsPerRow].status,
        status2Down: g.slotObjects[i + g.slotsPerRow * 2].status
    };
    return {
        check: function check() {
            switch (state.width) {
                case state.width2:
                    return state.yPos < 8 && state.status === 'available' && state.nextStatus === 'available' && state.status1Down === 'available' && state.status2Down === 'available';
                case state.width3:
                    return state.yPos < 7 && state.status === 'available' && state.nextStatus === 'available' && state.afterNextStatus === 'available';
            }
        }
    };
};

var placeCharts = function placeCharts(_ref4) {
    var div = _ref4.div,
        chart = _ref4.chart,
        indx = _ref4.indx,
        increment = _ref4.increment,
        width = _ref4.width,
        height = _ref4.height;

    return {
        go: function go() {
            var chartPos = getGridPositions(indx, div).go();
            div.classList.add('dd-item', 'dd-transition');
            div.style.transform = 'translate3d(' + chartPos.x + 'px, ' + chartPos.y + 'px,0px)';
            div.setAttribute('data-id', increment);
            g.wrap.appendChild(div);
            chart.draw();
            div.addEventListener('mousedown', chartMouseDown);
            div.addEventListener('mouseup', chartMouseUp);
            g.chartPositions[increment - 1] = { width: width, height: height, x: chartPos.x, y: chartPos.y };
            g.dataId.push(div.dataset.id);
            g.allCharts.push(div);
        }
    };
};
/* console.log(g.allCharts.map(el => el.childNodes[0].classList.add('shadow'))); */

var addChartToDOM = function addChartToDOM(button) {
    var state = {
        chartType: button,
        wrap: g.wrap,
        div: chartDiv(button.id).createDiv(),
        len: g.dataId.length,
        selectedReportId: document.querySelector('[data-selected]')
    };
    return {
        go: function go() {
            var report = void 0,
                selectedChartType = void 0;
            if (state.selectedReportId) {
                report = state.selectedReportId.id;
                state.selectedReportId.removeAttribute('[data-selected]');
            }
            if (state.chartType) selectedChartType = state.chartType.id;
            if (report) {
                fetch('reports.json').then(function (res) {
                    return res.json();
                }).then(function (response) {
                    var graph = void 0;
                    switch (selectedChartType) {
                        case 'area':
                            graph = chart(response[report], 'regular', 'AreaChart', state.div).getChart();break;
                        case 'geo':
                            graph = chart(response[report], 'regular', 'GeoChart', state.div).getChart();break;
                        case 'pie':
                            graph = chart(response[report], 'pie', 'PieChart', state.div).getChart();break;
                        case 'line':
                            graph = chart(response[report], 'regular', 'LineChart', state.div).getChart();break;
                        case 'bar':
                            graph = chart(response[report], 'regular', 'BarChart', state.div).getChart();break;
                    }
                    var size = chartSize(state.div).getSize();
                    var elWidth = size.elWidth,
                        elHeight = size.elHeight;

                    var indx = availableIndex(elWidth).get();
                    var chartAttributes = {
                        div: state.div,
                        chart: graph,
                        indx: indx,
                        increment: state.len + 1,
                        width: elWidth,
                        height: elHeight
                    };
                    placeCharts(chartAttributes).go();
                });
            }
        }
    };
};

var availableIndex = function availableIndex(width) {
    var w = width;
    return {
        get: function get() {
            return g.allSlots.findIndex(function (slot, i) {
                return !isNotOverlapping(i, w).check() ? '' : i;
            });
        }
    };
};

var arrangeItems = function arrangeItems() {
    var state = {
        dataId: g.dataId,
        chartPos: g.chartPositions
    };
    return {
        go: function go() {
            return state.dataId.forEach(function (dataId, i) {
                var pos = state.chartPos[i];
                var el = document.querySelector('[data-id="' + dataId + '"]');
                el.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px, 0px)';
            });
        }
    };
};

var arrangeItemsMouseUp = function arrangeItemsMouseUp() {
    var state = {
        increment: 0,
        allSlots: g.allSlots,
        slotObjects: g.slotObjects,
        chartPos: g.chartPositions,
        dataId: g.dataId
    };
    return {
        go: function go() {
            return state.allSlots.map(function (slot, i, arr) {
                if (state.slotObjects[i].status === 'occupied') {
                    return;
                }
                state.increment++;
                if (state.dataId[state.increment - 1] !== undefined) {
                    var dataId = state.dataId[state.increment - 1];
                    var el = document.querySelector('[data-id="' + dataId + '"]');
                    var size = chartSize(el).getSize();
                    var elWidth = size.elWidth,
                        elHeight = size.elHeight;

                    var pos = void 0;
                    if (isNotOverlapping(i, elWidth).check()) {
                        pos = getGridPositions(i, el).go();
                        el.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px,0px)';
                        state.chartPos[state.increment - 1] = { width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                    } else {
                        var indx = availableIndex(elWidth).get();
                        pos = getGridPositions(indx, el).go();
                        el.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px,0px)';
                        state.chartPos[state.increment - 1] = { width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                    }
                }
            });
        }
    };
};

var getChartIdByCoords = function getChartIdByCoords(coords) {
    var chartPos = g.chartPositions;
    return {
        //get the current chart being hovered over  
        go: function go() {
            for (var id in chartPos) {
                var chart = chartPos[id];
                if (chart.x <= coords.x && coords.x <= chart.x + chart.width && chart.y <= coords.y && coords.y <= chart.y + chart.height) return id;
            }
        }
    };
};

var getSlotIdByCoords = function getSlotIdByCoords(coords) {
    var slotObjects = g.slotObjects;
    return {
        //get the current slot being hovered over  
        go: function go() {
            for (var id in slotObjects) {
                var slot = slotObjects[id];
                if (slot.x <= coords.x && coords.x <= slot.x + slot.width && slot.y <= coords.y && coords.y <= slot.y + slot.height) return id;
            }
        }
    };
};

var getIndexOfChartId = function getIndexOfChartId(id) {
    var len = g.dataId.length;
    return {
        go: function go() {
            for (var i = 0; i < len; i++) {
                if (g.dataId[i] === id) return i;
            }
        }
    };
};

var removeMenu = function removeMenu() {
    g.box.classList.remove('open');
    g.pseudoCircle.classList.remove('open');
    g.menu1.classList.remove('show');
    g.toolbar.classList.remove('open');
};

var availableCharts = function availableCharts(typeOfCharts) {
    var types = typeOfCharts;
    return {
        show: function show() {
            [].concat(_toConsumableArray(document.querySelectorAll('.card2'))).filter(function (chartBtn) {
                var id = chartBtn.getAttribute('id');
                /* send back that id that's equal to arrVal */
                return types.some(function (arrVal) {
                    return id === arrVal;
                });
            }).map(function (btn) {
                return btn.style.display = 'block';
            });
        }
    };
};

var showAvailableCharts = function showAvailableCharts(reportId) {
    var id = reportId;
    return {
        go: function go() {
            [].concat(_toConsumableArray(document.querySelectorAll('.card2'))).map(function (chartBtn) {
                return chartBtn.style.display = 'none';
            });
            switch (id) {
                case "sale":
                    availableCharts(['bar', 'line', 'area']).show();break;
                case "expenditure":
                    availableCharts(['bar', 'line', 'area', 'geo']).show();break;
                case "nrOfVisitors":
                    availableCharts(['bar', 'line', 'pie', 'geo']).show();break;
                case "socialMedia":
                    availableCharts(['bar', 'area', 'pie', 'geo']).show();break;
                case "compiledInfo":
                    availableCharts(['line', 'area', 'pie', 'geo']).show();break;
                case "nationalities":
                    availableCharts(['bar', 'line', 'area']).show();break;
                case "todaysEvent":
                    availableCharts(['bar', 'line', 'area']).show();break;
                case "bookings":
                    availableCharts(['bar', 'area', 'pie', 'geo']).show();break;
                case "mood":
                    availableCharts(['bar', 'line', 'pie', 'geo']).show();break;
                default:
                    break;
            }
        }
    };
};

function addFirstCharts() {
    var _g$allSlots;

    var firstSlots = slot(64).createArray();
    var addFirstSlots = addSlotsToDOM(firstSlots).go();
    (_g$allSlots = g.allSlots).push.apply(_g$allSlots, _toConsumableArray(firstSlots));

    var divArray = [chartDiv('area').createDiv(), chartDiv('geo').createDiv(), chartDiv('pie').createDiv()];

    fetch('reports.json').then(function (res) {
        return res.json();
    }).then(function (report) {
        var chartArray = [chart(report.sale, 'regular', 'AreaChart', divArray[0]).getChart(), chart(report.nationalities, 'regular', 'GeoChart', divArray[1]).getChart(), chart(report.bookings, 'pie', 'PieChart', divArray[2]).getChart()];

        var increment = 0;
        g.allSlots.forEach(function (slotItem, i) {
            if (g.slotObjects[i].status === 'occupied') return;
            increment++;
            if (divArray[increment - 1] && chartArray[increment - 1]) {
                var size = chartSize(divArray[increment - 1]).getSize();
                var elWidth = size.elWidth,
                    elHeight = size.elHeight;

                var chartAttributes = {
                    div: divArray[increment - 1],
                    chart: chartArray[increment - 1],
                    indx: i,
                    increment: increment,
                    width: elWidth,
                    height: elHeight
                };
                placeCharts(chartAttributes).go();
            }
        });
    }); /* .catch(error => console.error('Error:', error)); */
}

/* open plus-button into a tab-menu */
g.box.addEventListener('click', function () {
    g.removeBox.style.display = 'block';
    this.classList.add('open');
    g.pseudoCircle.classList.add('open');
    g.menu1.classList.add('show');
    g.toolbar.classList.add('open');
    g.toolbar.classList.remove('fade-out');
});

/* close tab-menu into plus-button */
g.removeBox.addEventListener('click', function () {
    this.style.display = 'none';
    removeMenu();
});

[].concat(_toConsumableArray(document.querySelectorAll('.add-container-2'))).map(function (card) {
    card.addEventListener('click', function (e) {
        var reportId = this.id;
        console.log(g.container2);
        g.container2.classList.remove('out-of-sight');
        g.toolbar.classList.add('fade-out');
        setTimeout(function () {
            g.container2.classList.add('shadow');
        }, 300);
        e.currentTarget.setAttribute('data-selected', 'selected');
        showAvailableCharts(reportId).go();
    });
});

[].concat(_toConsumableArray(document.querySelectorAll('.card2'))).forEach(function (chartButton) {
    chartButton.addEventListener('click', function () {
        var len = g.slotObjects.length;
        for (var i = 0; i < g.slotsPerRow; i++) {
            var newSlot = slot().createDiv(i + len);
            g.allSlots.push(newSlot);
            addSlotsToDOM(g.allSlots).go();
        }
        addChartToDOM(this).go();
        g.container2.classList.add('out-of-sight');
        removeMenu();
    });
});

function chartMouseDown(e) {
    if (!g.selected) {

        g.wrap.addEventListener('mousemove', chartMouseMove);
        // save the element
        g.selected = e.currentTarget;
        g.originalClickCoords = { x: e.pageX, y: e.pageY };
        /* getting index from _dataId array */
        g.originalIndex = getIndexOfChartId(g.selected.getAttribute('data-id')).go();
        g.selected.classList.add('dd-selected');
        g.selected.classList.remove('dd-transition');
        g.slotObjects.map(function (slot) {
            return slot.status = 'available';
        });
        g.allSlots.map(function (slot) {
            return slot.dataset.status = 'available';
        });
    }
}

function chartMouseMove(e) {
    if (g.selected) {
        var bounds = g.wrap.getBoundingClientRect(),
            left = bounds.left + document.documentElement.scrollLeft,
            top = bounds.top + document.documentElement.scrollTop;

        var pageX = e.pageX,
            pageY = e.pageY;

        var clickX = pageX - left,
            clickY = pageY - top,
            hoverChartIndex = getChartIdByCoords({ x: clickX, y: clickY }).go(),

        /* getting the index of the slot the mouse is currently over while dragging*/
        hoverSlotId = getSlotIdByCoords({ x: clickX, y: clickY }).go();

        var ele = g.selected,
            chartId = ele.getAttribute('data-id'),
            index = g.originalIndex,
            newIndex = getIndexOfChartId(chartId).go(),
            x = g.chartPositions[index].x,
            y = g.chartPositions[index].y;

        ele.childNodes[0].classList.add('shadow-elevated');

        var resultX = x + (pageX - g.originalClickCoords.x),
            resultY = y + (pageY - g.originalClickCoords.y);

        if (hoverChartIndex != undefined && g.lastTouched != hoverChartIndex) {
            g.lastTouched = hoverChartIndex;
            g.dataId.splice(hoverChartIndex, 0, g.dataId.splice(newIndex, 1)[0]);
            arrangeItems().go();
        }
        ele.style.transform = 'translate3d(' + resultX + 'px, ' + resultY + 'px, 0)';
    }
}

function chartMouseUp() {
    if (g.selected) {
        g.selected.classList.remove('dd-selected');
        g.selected.classList.add('dd-transition');
        g.selected.childNodes[0].classList.remove('shadow-elevated');
        g.selected = null;
        g.originalClickCoords = null;
        arrangeItemsMouseUp().go();
    }
}

var dynamicTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#icon-text-tab-bar'));
var panels = document.querySelector('.panels');
dynamicTabBar.preventDefaultOnClick = true;

function updatePanel(index) {
    var activePanel = panels.querySelector(".panel.is-active");
    if (activePanel) {
        activePanel.classList.remove("is-active");
    }

    var newActivePanel = panels.querySelector(".panel:nth-child(" + (index + 1) + ")");
    if (newActivePanel) {
        newActivePanel.classList.add("is-active");
    }
}

dynamicTabBar.listen("MDCTabBar:change", function (t) {
    var tabs = t.detail;
    var nthChildIndex = tabs.activeTabIndex;
    updatePanel(nthChildIndex);
});