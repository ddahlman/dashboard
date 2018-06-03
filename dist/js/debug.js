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
        firstLoader = document.querySelector('.loading-absolute'),
        overlay = document.querySelector('.overlay'),
        wrap = function wrap() {
        var wrapper = document.getElementById('grid');
        if (window.matchMedia("screen and (min-width: 1200px)").matches) {
            wrapper.style.width = '1400px';
        }
        if (window.matchMedia("screen and (min-width: 400px) and (max-width: 1200px)").matches) {
            wrapper.style.width = '700px';
        }
        if (window.matchMedia("screen and (max-width: 400px)").matches) {
            wrapper.style.width = '300px';
        }
        return wrapper;
    },
        slotObjects = [],
        reports = {},
        dataId = [],
        allCharts = [],
        chartPositions = [],
        allSlots = [],
        windowMini = window.matchMedia("screen and (max-width: 400px)"),
        windowMedium = window.matchMedia("screen and (min-width: 400px) and (max-width: 1200px)"),
        windowLarge = window.matchMedia("screen and (min-width: 1200px)"),
        msMediaMedium = "screen and (max-width:1200px) and (min-width:400px)",
        mozMediaMedium = "screen and (min-width: 400px) and (max-width: 1200px)",
        chromeMediaMedium = "screen and (max-width: 1200px) and (min-width: 400px)",
        slotsPerRow = function slotsPerRow() {
        if (window.matchMedia("screen and (min-width: 1200px)").matches) {
            return 10;
        }
        if (window.matchMedia("screen and (min-width: 400px) and (max-width: 1200px)").matches) {
            return 5;
        }
        if (window.matchMedia("screen and (max-width: 400px)").matches) {
            return 1;
        }
    },
        selected = null,
        originalIndex = null,
        originalClickCoords = null,
        lastTouched = null,
        aspectWidth = 1920,
        aspectHeight = 1080;
    return {
        container2: container2,
        toolbar: toolbar,
        pseudoCircle: pseudoCircle,
        menu1: menu1,
        box: box,
        removeBox: removeBox,
        wrap: wrap,
        firstLoader: firstLoader,
        overlay: overlay,
        slotObjects: slotObjects,
        reports: reports,
        dataId: dataId,
        allCharts: allCharts,
        chartPositions: chartPositions,
        slotsPerRow: slotsPerRow,
        allSlots: allSlots,
        mini: windowMini,
        medium: windowMedium,
        large: windowLarge,
        msMediaMedium: msMediaMedium,
        mozMediaMedium: mozMediaMedium,
        chromeMediaMedium: chromeMediaMedium,
        selected: selected,
        originalIndex: originalIndex,
        originalClickCoords: originalClickCoords,
        lastTouched: lastTouched,
        aspectWidth: aspectWidth,
        aspectHeight: aspectHeight
    };
}();

var dynamicTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#icon-text-tab-bar'));
var fixed_ripple = [].concat(_toConsumableArray(document.getElementsByClassName('mdc-tab'))).map(function (btn) {
    return mdc.ripple.MDCRipple.attachTo(btn);
});

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

(function () {
    var counter = 0;
    var c = 0;
    var h1 = document.querySelector('.loading h1');
    var hr = document.querySelector('.loading hr');
    var i = setInterval(function () {
        h1.innerHTML = c + '%';
        hr.style.width = c + '%';
        counter++;
        c++;
        if (counter === 101) {
            clearInterval(i);
            g.firstLoader.classList.add('loaded');
            [g.box, g.container2, g.toolbar].map(function (el) {
                return el.classList.remove('hidden');
            });
        }
    }, 10);
})();
setTimeout(function () {
    g.firstLoader.style.display = 'none';
}, 3000);
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var slot = function slot(num) {
    var state = {
        num: num,
        aspectWidth: 1920,
        aspectHeight: 1080
    };
    return Object.assign({}, createSlotDiv(state), createDivArray(state));
};

var round = function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

var createSlotDiv = function createSlotDiv(state) {
    return {
        createDiv: function createDiv(indx) {
            var div = document.createElement('div');
            var aspectRatio = state.aspectHeight / state.aspectWidth;
            div.setAttribute('style', 'width: ' + 100 / g.slotsPerRow() + '%; padding-bottom: ' + 100 / g.slotsPerRow() * round(aspectRatio, 1) + '%;');
            div.setAttribute('class', 'dd-slot');

            var slotProp = {
                xPos: Math.floor(indx / g.slotsPerRow()) + 1,
                yPos: indx % g.slotsPerRow() + 1,
                status: 'available'
            };

            g.slotObjects.push(slotProp);
            div.setAttribute('data-slot-x', g.slotObjects[indx].xPos);
            div.setAttribute('data-slot-y', g.slotObjects[indx].yPos);
            div.setAttribute('data-status', g.slotObjects[indx].status);
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
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var slotBounds = function slotBounds(num) {
    var state = {
        wrapBounds: g.wrap().getBoundingClientRect(),
        slotSize: document.getElementsByClassName('dd-slot')[0].getBoundingClientRect(),
        num: num
    };
    return Object.assign({}, slotWidth(state), slotHeight(state), addToSlotObjects(state));
};

var slotWidth = function slotWidth(state) {
    return {
        width: function width() {
            switch (state.num) {
                case 1:
                    return state.slotSize.width;
                case 2:
                    return state.slotSize.width * 2;
                case 3:
                    return state.slotSize.width * 3;
                case 4:
                    return state.slotSize.width * 4;
                default:
                    break;
            }
        }
    };
};

var slotHeight = function slotHeight(state) {
    return {
        height: function height() {
            switch (state.num) {
                case 1:
                    return state.slotSize.height;
                case 2:
                    return state.slotSize.height * 2;
                case 3:
                    return state.slotSize.height * 3;
                case 4:
                    return state.slotSize.height * 4;
                default:
                    break;
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
                }); /* ändrat här det var inte Math förut */
            });
        }
    };
};

var addSlotsToDOM = function addSlotsToDOM(array) {
    var arr = array;
    return {
        go: function go() {
            arr.forEach(function (slot, i) {
                g.wrap().appendChild(slot);
            });
            slotBounds().add();
        }
    };
};
'use strict';

var pieFunction = function pieFunction(obj, div) {
    var state = { obj: obj, div: div };
    return {
        go: function go() {
            state.obj.options.pieStartAngle = 0;
            var chart = new google.visualization.PieChart(state.div);
            google.visualization.events.addListener(chart, 'ready', function () {
                if (state.obj.options.pieStartAngle < 10) {
                    state.obj.options.pieStartAngle++;
                    setTimeout(function () {
                        chart.draw(state.obj.data, state.obj.options);
                    }, 0);
                }
            });
            chart.draw(state.obj.data, state.obj.options);
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
        width1: slotBounds(1).width(),
        width2: slotBounds(2).width(),
        width3: slotBounds(3).width(),
        width4: slotBounds(4).width(),
        height1: slotBounds(1).height(),
        height2: slotBounds(2).height(),
        height3: slotBounds(3).height(),
        height4: slotBounds(4).height()
    };
    return {
        createDiv: function createDiv() {
            var div = document.createElement('div');
            if (g.large.matches) {
                switch (cssClass) {
                    case 'area':
                        div.setAttribute('style', 'width:' + state.width3 + 'px; height:' + state.height3 + 'px;');break;
                    case 'geo':
                        div.setAttribute('style', 'width:' + state.width4 + 'px; height:' + state.height4 + 'px;');break;
                    case 'pie':
                        div.setAttribute('style', 'width:' + state.width3 + 'px; height:' + state.height4 + 'px;');break;
                    case 'line':
                        div.setAttribute('style', 'width:' + state.width3 + 'px; height:' + state.height3 + 'px;');break;
                    case 'bar':
                        div.setAttribute('style', 'width:' + state.width4 + 'px; height:' + state.height4 + 'px;');break;
                    default:
                        break;
                }
            }
            if (g.medium.matches) {
                switch (cssClass) {
                    case 'area':
                        div.setAttribute('style', 'width:' + state.width2 + 'px; height:' + state.height2 + 'px;');break;
                    case 'geo':
                        div.setAttribute('style', 'width:' + state.width3 + 'px; height:' + state.height3 + 'px;');break;
                    case 'pie':
                        div.setAttribute('style', 'width:' + state.width2 + 'px; height:' + state.height3 + 'px;');break;
                    case 'line':
                        div.setAttribute('style', 'width:' + state.width2 + 'px; height:' + state.height2 + 'px;');break;
                    case 'bar':
                        div.setAttribute('style', 'width:' + state.width3 + 'px; height:' + state.height3 + 'px;');break;
                    default:
                        break;
                }
            }
            if (g.mini.matches) {
                div.setAttribute('style', 'width:' + state.width1 + 'px; height:' + state.height1 + 'px;');
            }
            div.classList.add(state.cssClass);
            return div;
        }
    };
};
'use strict';

var chartSize = function chartSize(el) {
    var ele = el;
    return {
        getSize: function getSize() {
            var widthPX = ele.style.width,
                heightPX = ele.style.height;
            var sizes = {
                elWidth: Math.round(widthPX.substring(0, widthPX.length - 2)),
                elHeight: Number(heightPX.substring(0, heightPX.length - 2))
            }; /* här fanns inte Math.ceil innan */
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

            if (g.mini.matches && elWidth === slotWidth && elHeight === slotHeight) {
                X.status = 'occupied';
                var slotElem = getSlotElem(X.xPos, X.yPos);
                slotElem.dataset.status = 'occupied';
            } else {
                var mediumArea = [X, g.slotObjects[i + 1], g.slotObjects[i + g.slotsPerRow()], g.slotObjects[i + 1 + g.slotsPerRow()]];

                var largeArea = [g.slotObjects[i + 2], g.slotObjects[i + 2 + g.slotsPerRow()], g.slotObjects[i + g.slotsPerRow() * 2], g.slotObjects[i + g.slotsPerRow() * 2 + 1], g.slotObjects[i + g.slotsPerRow() * 2 + 2]].concat(mediumArea);

                var mediumGeo = [].concat(largeArea);

                var largeGeo = [g.slotObjects[i + 3], g.slotObjects[i + 3 + g.slotsPerRow()], g.slotObjects[i + g.slotsPerRow() * 3], g.slotObjects[i + g.slotsPerRow() * 3 + 1], g.slotObjects[i + g.slotsPerRow() * 3 + 2], g.slotObjects[i + g.slotsPerRow() * 2 + 3], g.slotObjects[i + g.slotsPerRow() * 3 + 3]].concat(largeArea);

                var mediumPie = [g.slotObjects[i + g.slotsPerRow() * 2], g.slotObjects[i + g.slotsPerRow() * 2 + 1]].concat(mediumArea);

                var largePie = [g.slotObjects[i + g.slotsPerRow() * 3], g.slotObjects[i + g.slotsPerRow() * 3 + 1], g.slotObjects[i + g.slotsPerRow() * 3 + 2]].concat(largeArea);

                var sizeOfDiv = function sizeOfDiv(match, nr1, nr2) {
                    return match && elWidth === slotWidth * nr1 && elHeight === slotHeight * nr2;
                };
                var occupy = function occupy(obj) {
                    var elem = getSlotElem(obj.xPos, obj.yPos);
                    obj.status = 'occupied';
                    elem.dataset.status = 'occupied';
                };

                switch (true) {
                    case sizeOfDiv(g.medium.matches, 2, 2):
                        mediumArea.map(occupy);break;
                    case sizeOfDiv(g.medium.matches, 3, 3):
                        mediumGeo.map(occupy);break;
                    case sizeOfDiv(g.medium.matches, 2, 3):
                        mediumPie.map(occupy);break;
                    case sizeOfDiv(g.large.matches, 3, 3):
                        largeArea.map(occupy);break;
                    case sizeOfDiv(g.large.matches, 4, 4):
                        largeGeo.map(occupy);break;
                    case sizeOfDiv(g.large.matches, 3, 4):
                        largePie.map(occupy);break;
                    default:
                        break;
                }
            }
            /*  console.log({ x: X.x, y: X.y, width: elWidth, height: elHeight }); */
            return { x: X.x, y: X.y, width: elWidth, height: elHeight };
        }
    };
};
'use strict';

var isNotOverlapping = function isNotOverlapping(i, chartWidth, chartHeight) {
    var state = {
        indx: i,
        width: chartWidth,
        height: chartHeight,
        width1: round(slotBounds(1).width(), 1),
        width2: round(slotBounds(2).width(), 1),
        width3: round(slotBounds(3).width(), 1),
        width4: round(slotBounds(4).width(), 1),
        height1: slotBounds(1).height(),
        height2: slotBounds(2).height(),
        height3: slotBounds(3).height(),
        height4: slotBounds(4).height(),
        yPos: g.slotObjects[i].yPos,
        X: g.slotObjects[i].status,
        X1: function X1() {
            return g.medium.matches || g.large.matches ? g.slotObjects[i + 1].status : '';
        },
        X2: function X2() {
            return g.medium.matches || g.large.matches ? g.slotObjects[i + 2].status : '';
        },
        X3: function X3() {
            return g.medium.matches || g.large.matches ? g.slotObjects[i + 3].status : '';
        },
        Y1: function Y1() {
            return g.medium.matches || g.large.matches ? g.slotObjects[i + g.slotsPerRow()].status : '';
        },
        Y2: function Y2() {
            return g.medium.matches || g.large.matches ? g.slotObjects[i + g.slotsPerRow() * 2].status : '';
        },
        Y3: function Y3() {
            return g.medium.matches || g.large.matches ? g.slotObjects[i + g.slotsPerRow() * 3].status : '';
        }
    };
    return {
        check: function check() {
            var checkSize = function checkSize(stateWidth, stateHeight, match) {
                return state.width === stateWidth && state.height === stateHeight && match;
            };

            switch (true) {
                case checkSize(state.width1, state.height1, g.mini.matches):
                    return state.X === 'available';
                case checkSize(state.width2, state.height2, g.medium.matches):
                    return state.yPos < 5 && [state.X, state.X1(), state.Y1(), state.Y2()].every(function (el) {
                        return el === 'available';
                    });
                case checkSize(state.width3, state.height3, g.medium.matches):
                    return state.yPos < 4 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2()].every(function (el) {
                        return el === 'available';
                    });
                case checkSize(state.width2, state.height3, g.medium.matches):
                    return state.yPos < 5 && [state.X, state.X1(), state.Y1(), state.Y2()].every(function (el) {
                        return el === 'available';
                    });
                case checkSize(state.width3, state.height3, g.large.matches):
                    return state.yPos < 9 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2()].every(function (el) {
                        return el === 'available';
                    });
                case checkSize(state.width3, state.height4, g.large.matches):
                    return state.yPos < 9 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2(), state.Y3()].every(function (el) {
                        return el === 'available';
                    });
                case checkSize(state.width4, state.height4, g.large.matches):
                    return state.yPos < 8 && [state.X, state.X1(), state.X2(), state.X3(), state.Y1(), state.Y2(), state.Y3()].every(function (el) {
                        return el === 'available';
                    });
            }
        }
    };
};
'use strict';

var placeCharts = function placeCharts(_ref) {
    var div = _ref.div,
        chart = _ref.chart,
        indx = _ref.indx,
        increment = _ref.increment,
        width = _ref.width,
        height = _ref.height;

    return {
        go: function go() {
            var chartPos = getGridPositions(indx, div).go();
            div.classList.add('dd-item', 'dd-transition');
            div.style.transform = 'translate3d(' + chartPos.x + 'px, ' + chartPos.y + 'px,0px)';
            div.setAttribute('data-id', increment);
            g.wrap().appendChild(div);
            chart.draw();
            div.addEventListener('mousedown', chartMouseDown);
            div.addEventListener('mouseup', chartMouseUp);
            g.chartPositions[increment - 1] = {
                dataId: div.getAttribute('data-id'),
                width: width,
                height: height,
                x: chartPos.x,
                y: chartPos.y
            };
            g.dataId.push(div.dataset.id);
            g.allCharts.push(chart);
        }
    };
};
'use strict';

var addChartToDOM = function addChartToDOM(button) {
    var state = {
        chartType: button,
        wrap: g.wrap(),
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
                state.selectedReportId.removeAttribute('data-selected');
            }
            if (state.chartType) selectedChartType = state.chartType.id;
            if (report) {
                var graph = {};
                switch (selectedChartType) {
                    case 'area':
                        graph = chart(g.reports[report], 'regular', 'AreaChart', state.div).getChart();break;
                    case 'geo':
                        graph = chart(g.reports[report], 'regular', 'GeoChart', state.div).getChart();break;
                    case 'pie':
                        graph = chart(g.reports[report], 'pie', 'PieChart', state.div).getChart();break;
                    case 'line':
                        graph = chart(g.reports[report], 'regular', 'LineChart', state.div).getChart();break;
                    case 'bar':
                        graph = chart(g.reports[report], 'regular', 'BarChart', state.div).getChart();break;
                    default:
                        graph = 'There is no charts here';
                }
                var size = chartSize(state.div).getSize();
                var elWidth = size.elWidth,
                    elHeight = size.elHeight;

                var indx = availableIndex(elWidth, elHeight).get();
                var chartAttributes = {
                    div: state.div,
                    chart: graph,
                    indx: indx,
                    increment: state.len + 1,
                    width: elWidth,
                    height: elHeight
                };
                placeCharts(chartAttributes).go();
            }
        }
    };
};
'use strict';

var availableIndex = function availableIndex(width, height) {
    var w = width;
    var h = height;
    return {
        get: function get() {
            return g.allSlots.findIndex(function (slot, i) {
                return !isNotOverlapping(i, w, h).check() ? '' : i;
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
                    if (isNotOverlapping(i, elWidth, elHeight).check()) {
                        pos = getGridPositions(i, el).go();
                        el.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px,0px)';
                        state.chartPos[state.increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                    } else {
                        var indx = availableIndex(elWidth, elHeight).get();
                        pos = getGridPositions(indx, el).go();
                        el.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px,0px)';
                        state.chartPos[state.increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                    }
                }
            });
        }
    };
};
"use strict";

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
'use strict';

var removeMenu = function removeMenu() {
    g.box.classList.remove('open');
    g.pseudoCircle.classList.remove('open');
    g.menu1.classList.remove('show');
    g.toolbar.classList.remove('open');
};
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var availableCharts = function availableCharts(typeOfCharts) {
    var types = typeOfCharts;
    return {
        show: function show() {
            [].concat(_toConsumableArray(document.querySelectorAll('.card2'))).filter(function (chartBtn) {
                var id = chartBtn.getAttribute('id');
                return types.some(function (arrVal) {
                    return id === arrVal;
                });
            }).map(function (btn, i) {
                btn.style.display = 'block';
                btn.classList.add('c' + (i + 1));
                return btn;
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
                    availableCharts(['bar', 'line', 'area', 'pie']).show();break;
                case "expenditure":
                    availableCharts(['bar', 'line', 'area', 'geo']).show();break;
                case "nrOfVisitors":
                    availableCharts(['bar', 'line', 'pie', 'geo']).show();break;
                case "socialMedia":
                    availableCharts(['bar', 'area', 'pie', 'geo']).show();break;
                case "compiledInfo":
                    availableCharts(['line', 'area', 'pie', 'geo']).show();break;
                case "nationalities":
                    availableCharts(['bar', 'line', 'area', 'geo']).show();break;
                case "todaysEvent":
                    availableCharts(['bar', 'line', 'area', 'geo']).show();break;
                case "bookings":
                    availableCharts(['bar', 'area', 'pie', 'line']).show();break;
                case "mood":
                    availableCharts(['bar', 'line', 'pie', 'geo']).show();break;
                default:
                    break;
            }
        }
    };
};
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function addFirstCharts() {
    var _g$allSlots;

    var firstSlots = slot(70).createArray();
    var addFirstSlots = addSlotsToDOM(firstSlots).go();
    (_g$allSlots = g.allSlots).push.apply(_g$allSlots, _toConsumableArray(firstSlots));

    var divArray = [chartDiv('area').createDiv(), chartDiv('geo').createDiv(), chartDiv('pie').createDiv()];
    var xml = new XMLHttpRequest();
    xml.open("GET", "api/?/reports");
    xml.onload = function () {
        if (xml.status >= 200 && xml.status < 400) {
            var data = JSON.parse(xml.responseText);
            Object.assign(g.reports, data.reports);
            var chartArray = [chart(data.reports.sale, 'regular', 'AreaChart', divArray[0]).getChart(), chart(data.reports.nationalities, 'regular', 'GeoChart', divArray[1]).getChart(), chart(data.reports.bookings, 'pie', 'PieChart', divArray[2]).getChart()];

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
        } else {
            var div = document.body.appendChild(document.createElement('h1'));
            div.setAttribute('style', 'color: #00ff00; font: 70px bold arial;');
            div.innerHTML = 'Det gick tyvärr inte att hämta data...';
        }
    };
    xml.send();
}
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

g.box.addEventListener('click', function () {
    dynamicTabBar.layout();
    fixed_ripple.map(function (btn) {
        return btn.layout();
    });
    g.removeBox.style.display = 'block';
    this.classList.add('open');
    g.pseudoCircle.classList.add('open');
    g.menu1.classList.add('show');
    g.overlay.classList.add('add');
    g.toolbar.classList.add('open');
    g.toolbar.classList.remove('fade-out');
});

[g.overlay, g.removeBox].map(function (el) {
    el.addEventListener('click', function () {
        g.removeBox.style.display = 'none';
        g.container2.classList.add('out-of-sight');
        g.overlay.classList.remove('add');
        removeMenu();
    });
});

[].concat(_toConsumableArray(document.querySelectorAll('.add-container-2'))).map(function (card) {
    card.addEventListener('click', function (e) {
        var reportId = this.id;
        g.container2.classList.remove('out-of-sight');
        g.toolbar.classList.add('fade-out');
        setTimeout(function () {
            g.container2.classList.add('shadow');
        }, 300);
        e.currentTarget.setAttribute('data-selected', 'selected');
        console.log(reportId);
        showAvailableCharts(reportId).go();
    });
});

[].concat(_toConsumableArray(document.querySelectorAll('.card2'))).forEach(function (chartButton) {
    chartButton.addEventListener('click', function () {
        g.overlay.classList.remove('add');
        var len = g.slotObjects.length;
        var doubleRow = 20;
        for (var i = 0; i < doubleRow; i++) {
            var newSlot = slot().createDiv(i + len);
            g.allSlots.push(newSlot);
            addSlotsToDOM(g.allSlots).go();
        }
        removeMenu();
        addChartToDOM(this).go();
        g.container2.classList.add('out-of-sight');
    });
});
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var changeOnResize = function changeOnResize(slotsPerRow, slotWidth, slotHeight) {
    var state = {
        perRow: slotsPerRow,
        slotWidth: slotWidth,
        slotHeight: slotHeight
    };
    return Object.assign({}, drawSlots(state), drawDivs(state), drawCharts(state));
};

var drawSlots = function drawSlots(state) {
    return {
        slots: function slots() {
            g.allSlots.map(function (slot, i, arr) {
                var aspectRatio = g.aspectHeight / g.aspectWidth;
                slot.setAttribute('style', 'width: ' + 100 / state.perRow + '%; padding-bottom: ' + 100 / state.perRow * round(aspectRatio, 1) + '%;');
                slot.dataset.status = 'available';
                g.slotObjects[i].status = 'available';
                g.slotObjects[i].xPos = Math.floor(i / state.perRow) + 1;
                g.slotObjects[i].yPos = i % state.perRow + 1;
                g.slotObjects[i].width = state.slotWidth;
                g.slotObjects[i].height = state.slotHeight;
                arr[i].dataset.slotX = g.slotObjects[i].xPos;
                arr[i].dataset.slotY = g.slotObjects[i].yPos;
            });
            setTimeout(function () {
                var wrapBounds = g.wrap().getBoundingClientRect();
                [].concat(_toConsumableArray(document.getElementsByClassName('dd-slot'))).forEach(function (slot, i) {
                    var bounds = slot.getBoundingClientRect();
                    g.slotObjects[i].y = bounds.top - wrapBounds.top;
                    g.slotObjects[i].x = bounds.left - wrapBounds.left;
                });
            }, 200);
        }
    };
};

var drawDivs = function drawDivs(state) {
    return {
        divs: function divs() {
            var increment = 0;
            g.allSlots.map(function (slot, i) {
                if (g.slotObjects[i].status === 'occupied') return;
                increment++;
                if (g.dataId[increment - 1] !== undefined) {
                    var dataId = g.dataId[increment - 1];
                    var el = document.querySelector('[data-id="' + dataId + '"]');
                    if (g.wrap().style.width === '1400px') {
                        switch (true) {
                            case el.classList.contains('area') || el.classList.contains('line'):
                                el.setAttribute('style', 'width:' + state.slotWidth * 3 + 'px; height:' + state.slotHeight * 3 + 'px;');
                                break;
                            case el.classList.contains('geo') || el.classList.contains('bar'):
                                el.setAttribute('style', 'width:' + state.slotWidth * 4 + 'px; height:' + state.slotHeight * 4 + 'px;');
                                break;
                            case el.classList.contains('pie'):
                                el.setAttribute('style', 'width:' + state.slotWidth * 3 + 'px; height:' + state.slotHeight * 4 + 'px;');
                                break;
                        }
                    }
                    if (g.wrap().style.width === '700px') {
                        switch (true) {
                            case el.classList.contains('area') || el.classList.contains('line'):
                                el.setAttribute('style', 'width:' + state.slotWidth * 2 + 'px; height:' + state.slotHeight * 2 + 'px;');
                                break;
                            case el.classList.contains('geo') || el.classList.contains('bar'):
                                el.setAttribute('style', 'width:' + state.slotWidth * 3 + 'px; height:' + state.slotHeight * 3 + 'px;');
                                break;
                            case el.classList.contains('pie'):
                                el.setAttribute('style', 'width:' + state.slotWidth * 2 + 'px; height:' + state.slotHeight * 3 + 'px;');
                                break;
                        }
                    }
                    if (g.wrap().style.width === '300px') {
                        el.setAttribute('style', 'width:' + state.slotWidth + 'px; height:' + state.slotHeight + 'px;');
                    }
                    var size = chartSize(el).getSize();
                    var elWidth = size.elWidth,
                        elHeight = size.elHeight;

                    var pos = void 0;
                    if (isNotOverlapping(i, elWidth, elHeight).check()) {
                        pos = getGridPositions(i, el).go();
                        el.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px,0px)';
                        g.chartPositions[increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                    } else {
                        var indx = availableIndex(elWidth, elHeight).get();
                        pos = getGridPositions(indx, el).go();
                        el.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px,0px)';
                        g.chartPositions[increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                    }
                }
            });
        }
    };
};

var drawCharts = function drawCharts(state) {
    return {
        charts: function charts() {
            g.allCharts.forEach(function (chart) {
                return chart.draw();
            });
        }
    };
};

var resize = function resize(rows, slotWidth, slotHeight) {
    g.wrap();
    changeOnResize(rows, slotWidth, slotHeight).slots();
    setTimeout(function () {
        changeOnResize(rows, slotWidth, slotHeight).divs();
    }, 200);
    setTimeout(function () {
        changeOnResize().charts();
    }, 500);
};

var sizerArray = [g.mini, g.medium, g.large];
sizerArray.forEach(function (mq, i, arr) {
    mq.addListener(function (e) {
        if (e.matches) {
            console.log(e.media);
            if (e.media === "screen and (max-width:400px)" || e.media === "screen and (max-width: 400px)") {
                resize(1, 300, 180);
            }
            if (e.media === g.chromeMediaMedium || e.media === g.mozMediaMedium || e.media === g.msMediaMedium) {
                resize(5, 140, 84);
            }
            if (e.media === "screen and (min-width:1200px)" || e.media === "screen and (min-width: 1200px)") {
                resize(10, 140, 84);
            }
        }
    });
});
'use strict';

function chartMouseDown(e) {
    if (!g.selected) {
        g.wrap().addEventListener('mousemove', chartMouseMove);
        g.selected = e.currentTarget;
        g.originalClickCoords = { x: e.pageX, y: e.pageY };
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
        var bounds = g.wrap().getBoundingClientRect(),
            left = bounds.left + document.documentElement.scrollLeft,
            top = bounds.top + document.documentElement.scrollTop;

        var pageX = e.pageX,
            pageY = e.pageY;

        var clickX = pageX - left,
            clickY = pageY - top,
            hoverChartIndex = getChartIdByCoords({ x: clickX, y: clickY }).go(),
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

        if (hoverChartIndex !== undefined && g.lastTouched !== hoverChartIndex) {
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