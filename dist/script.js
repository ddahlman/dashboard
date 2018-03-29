'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

google.charts.load('current', {
    'packages': ['corechart', 'bar', 'line', 'geochart'],
    'mapsApiKey': 'AIzaSyDMPDZMkd7YLnBpiKeBAq2HZYfjdWS8FA4'
});
google.charts.setOnLoadCallback(function () {
    getFirstThreeGraphs();
    showDashboard();
});

/* modular pattern for accessing private variables */
var globals = function () {
    var container = document.querySelector('#grid'),
        container2 = document.querySelector('#container-2'),
        toolbar = document.querySelector('.dashboard-toolbar'),
        pseudoCircle = document.querySelector('.pseudo-circle'),
        menu1 = document.querySelector('.menu-1'),
        box = document.querySelector('.box'),
        removeBox = document.querySelector('.close'),
        allCharts = [],
        timeOut,
        numOfChartSlots = 64,
        numOfSlotsPerRow = 8,
        slotsPerRow,
        rows,
        slotwidth,
        slotWidth2,
        slotWidth3,
        slotHeight,
        slotHeight2,
        slotHeight3,
        increment = 0,
        slotIncrement = 0,
        imageAspectWidth = 1920,
        imageAspectHeight = 1080,
        imageSlots = [],
        selectedChartElement = null,
        originalImageSlot = null,
        originalClickCoords = null,
        lastTouchedSlotId = null,
        slotObjects = [],
        dataId = [];
    return {
        container: container,
        container2: container2,
        toolbar: toolbar,
        pseudoCircle: pseudoCircle,
        menu1: menu1,
        box: box,
        removeBox: removeBox,
        allCharts: allCharts,
        timeOut: timeOut,
        numOfChartSlots: numOfChartSlots,
        numOfSlotsPerRow: numOfSlotsPerRow,
        slotsPerRow: slotsPerRow,
        rows: rows,
        slotwidth: slotwidth,
        slotWidth2: slotWidth2,
        slotWidth3: slotWidth3,
        slotHeight: slotHeight,
        slotHeight2: slotHeight2,
        slotHeight3: slotHeight3,
        increment: increment,
        slotIncrement: slotIncrement,
        imageAspectWidth: imageAspectWidth,
        imageAspectHeight: imageAspectHeight,
        imageSlots: imageSlots,
        selectedChartElement: selectedChartElement,
        originalImageSlot: originalImageSlot,
        originalClickCoords: originalClickCoords,
        lastTouchedSlotId: lastTouchedSlotId,
        slotObjects: slotObjects,
        dataId: dataId
    };
}();

(function init() {
    addFirstImageSlots();
    getBounds();

    /* _doc.getElementById('dragDrop').addEventListener('mousemove', imageMouseMove); */
})();

function createSlot(indx) {

    var item = document.createElement('div');
    item.setAttribute('class', 'dd-slot');
    item.setAttribute('style', 'width:' + 100 / globals.numOfSlotsPerRow + '%;' + 'padding-bottom:' + 100 / globals.numOfSlotsPerRow * (globals.imageAspectHeight / globals.imageAspectWidth) + '%;');

    globals.slotsPerRow = indx % globals.numOfSlotsPerRow + 1, globals.rows = Math.floor(indx / globals.numOfSlotsPerRow) + 1;

    var slot = {
        xPos: globals.rows,
        yPos: globals.slotsPerRow,
        status: 'available'
    };
    globals.slotObjects.push(slot);
    item.setAttribute('data-slot-x', globals.slotObjects[indx].xPos);
    item.setAttribute('data-slot-y', globals.slotObjects[indx].yPos);
    item.setAttribute('data-status', globals.slotObjects[indx].status);
    item.innerHTML = '<p class="dd-slot-num dd-vc">' + (indx + 1) + '</p>';

    return item;
}

function addFirstImageSlots() {
    var item;
    for (var i = 0; i < globals.numOfChartSlots; i++) {
        item = createSlot(i);
        globals.container.appendChild(item);
    }
}

function getBounds() {
    var containerBounds = globals.container.getBoundingClientRect();
    var slot = document.getElementsByClassName('dd-slot')[0],
        bounds = slot.getBoundingClientRect();
    var ddSlot = [].concat(_toConsumableArray(document.getElementsByClassName('dd-slot')));

    globals.slotWidth = bounds.width, globals.slotWidth2 = bounds.width * 2, globals.slotWidth3 = bounds.width * 3, globals.slotHeight = bounds.height, globals.slotHeight2 = bounds.height * 2, globals.slotHeight3 = bounds.height * 3;

    ddSlot.forEach(function (slot, i) {

        var slotBounds = slot.getBoundingClientRect(),
            relativeBounds = {
            top: slotBounds.top - containerBounds.top,
            left: slotBounds.left - containerBounds.left,
            bottom: slotBounds.bottom - containerBounds.bottom,
            right: slotBounds.right - containerBounds.right
        };

        globals.slotObjects[i].x = relativeBounds.left, globals.slotObjects[i].y = relativeBounds.top, globals.slotObjects[i].right = relativeBounds.right, globals.slotObjects[i].bottom = relativeBounds.bottom, globals.slotObjects[i].width = slotBounds.width, globals.slotObjects[i].height = slotBounds.height;
    });
    console.log(globals.slotObjects);
}
/* window.addEventListener('resize', function () {
    if (!globals.timeOut) {
        globals.timeOut = setTimeout(function () {

            globals.allCharts.forEach(function (chart) {

            });
        }, 200);
    }
}, false); */

function getFirstThreeGraphs() {
    $.get('reports.json').done(function (response) {
        var pieContainer = createDiv('pie', globals.slotWidth2, globals.slotHeight3);
        var lineContainer = createDiv('line', globals.slotWidth2, globals.slotHeight2);
        var geoContainer = createDiv('geo', globals.slotWidth3, globals.slotHeight3);
        var pie = new PieChart(response.bookings, pieContainer);
        var line = new LineChart(response.sale, lineContainer);
        var geo = new GeoChart(response.nationalities, geoContainer);

        var containerArray = [lineContainer, geoContainer, pieContainer];
        var ddSlot = [].concat(_toConsumableArray(document.getElementsByClassName('dd-slot')));

        var chartArray = [line, geo, pie];

        ddSlot.forEach(function (slot, i) {
            if (globals.slotObjects[i].status === 'occupied') {
                return;
            }
            globals.increment++;
            if (containerArray[globals.increment - 1] !== undefined && chartArray[globals.increment - 1] !== undefined) {
                var container = containerArray[globals.increment - 1],
                    chart = chartArray[globals.increment - 1];
                var widthPX = container.style.width,
                    heightPX = container.style.height,
                    containerWidth = Math.round(widthPX.substring(0, widthPX.length - 2)),
                    containerHeight = Number(heightPX.substring(0, heightPX.length - 2));

                container.classList.add('dd-item', 'dd-transition');
                var itemPos = fillTheGrid(i, container);
                container.style.transform = 'translate3d(' + itemPos.x + 'px,' + itemPos.y + 'px,0px)';
                container.setAttribute('data-id', globals.increment);
                globals.container.appendChild(container);
                chart.draw();
                container.childNodes[0].style.boxShadow = "0 0 3px 1px rgba(0,0,0,0.3)";
                container.addEventListener('mousedown', imageMouseDown);
                container.addEventListener('mouseup', imageMouseUp);
                globals.imageSlots[globals.increment - 1] = { width: containerWidth, height: containerHeight, x: itemPos.x, y: itemPos.y };
                globals.dataId.push(container.dataset.id);
                globals.allCharts.push(container);
            }
        });
    });
}

/* open plus-button into a tab-menu */
globals.box.addEventListener('click', function () {
    globals.removeBox.style.display = 'block';
    this.classList.add('open');
    globals.pseudoCircle.classList.add('open');
    globals.menu1.classList.add('show');
    globals.toolbar.classList.add('open');
    globals.toolbar.classList.remove('fade-out');
});

/* close tab-menu into plus-button */
globals.removeBox.addEventListener('click', function () {
    this.style.display = 'none';
    removeMenu();
});

function removeMenu() {
    globals.box.classList.remove('open');
    globals.pseudoCircle.classList.remove('open');
    globals.menu1.classList.remove('show');
    globals.toolbar.classList.remove('open');
}

/* fades out container-1 and pulls down a filtered container-2 that holds chart-buttons */
[].concat(_toConsumableArray(document.querySelectorAll('.add-container-2'))).map(function (card) {
    card.addEventListener('click', switchContainer, false);
});

function switchContainer(e) {
    var reportId = this.id;
    globals.container2.classList.remove('out-of-sight');
    globals.toolbar.classList.add('fade-out');
    setTimeout(function () {
        globals.container2.classList.add('shadow');
    }, 300);
    e.currentTarget.setAttribute('data-selected', 'selected');
    showAvailableCharts(reportId);
}

/* the function that filters chart-buttons */
function showAvailableCharts(reportId) {
    var chartsBtns = [].concat(_toConsumableArray(document.querySelectorAll('.card2')));
    chartsBtns.map(function (chartBtn) {
        chartBtn.style.display = 'none';
    });

    function availableCharts(chartNames) {
        chartsBtns.filter(function (chartBtn) {
            var id = chartBtn.getAttribute('id');
            /* send back that id that's equal to arrVal */
            return chartNames.some(function (arrVal) {
                return id === arrVal;
            });
        }).map(function (btn) {
            return btn.style.display = 'block';
        });
    }

    switch (reportId) {
        case "sale":
            availableCharts(['bar', 'line', 'area']);break;
        case "expenditure":
            availableCharts(['bar', 'line', 'area', 'geo']);break;
        case "nrOfVisitors":
            availableCharts(['bar', 'line', 'pie', 'geo']);break;
        case "socialMedia":
            availableCharts(['bar', 'area', 'pie', 'geo']);break;
        case "compiledInfo":
            availableCharts(['line', 'area', 'pie', 'geo']);break;
        case "nationalities":
            availableCharts(['bar', 'line', 'area']);break;
        case "todaysEvent":
            availableCharts(['bar', 'line', 'area']);break;
        case "bookings":
            availableCharts(['bar', 'area', 'pie', 'geo']);break;
        case "mood":
            availableCharts(['bar', 'line', 'pie', 'geo']);break;
        default:
            break;
    }
}

/* push current object to array when clicking on chart-button + add type to object 
so we know what chart-type to draw*/
[].concat(_toConsumableArray(document.querySelectorAll('.card2'))).map(function (chartBtn) {
    chartBtn.addEventListener('click', function () {
        showDashboard(this);
        globals.container2.classList.add('out-of-sight');
        removeMenu();
        for (var i = 0; i < globals.numOfSlotsPerRow; i++) {
            var slot = createSlot(i + len);
            globals.container.appendChild(slot);
        }
        getBounds();
    }, false);
});

/* creates a div with specified css-class and properties */
/* function createDiv(cssClass) {
    var div = document.createElement('div');
    div.setAttribute('class', cssClass);
    div.classList.add(cssClass, 'draggable');
    return div;
} */
function createDiv(cssClass, width, height) {
    var div = document.createElement('div');
    div.setAttribute('style', 'width:' + width + 'px;height:' + height + 'px;');
    div.classList.add(cssClass);
    return div;
}

console.log(globals.allCharts);

function showDashboard(button) {
    /*  updateCssVar(); */
    var report, selectedChartType;
    var selectedreportId = document.querySelector('[data-selected]');
    if (selectedreportId) {
        report = selectedreportId.id;
        selectedreportId.removeAttribute('[data-selected]');
    }
    if (button) {
        selectedChartType = button.id;
    }
    if (report) {
        $.get('reports.json').done(function (response) {
            var div = createDiv(selectedChartType);
            globals.container.appendChild(div);
            var chart;
            switch (selectedChartType) {
                case 'bar':
                    chart = new BarChart(response[report], div);
                    break;
                case 'area':
                    chart = new AreaChart(response[report], div);
                    break;
                case 'line':
                    chart = new LineChart(response[report], div);
                    break;
                case 'pie':
                    chart = new PieChart(response[report], div);
                    break;
                case 'geo':
                    chart = new GeoChart(response[report], div);
                    break;
            }
            chart.draw();
            globals.allCharts.push(chart);
        });
    }
}

/* The chart-constructors ------------------------------------------------------ */
function BarChart(response, div) {
    this.data = new google.visualization.DataTable(response.data);
    this.options = response.options.regular;
    this.draw = function () {
        new google.visualization.BarChart(div).draw(this.data, this.options);
    };
}

function AreaChart(response, div) {
    this.data = new google.visualization.DataTable(response.data);
    this.options = response.options.regular;
    this.draw = function () {
        new google.visualization.AreaChart(div).draw(this.data, this.options);
    };
}

function LineChart(response, div) {
    this.data = new google.visualization.DataTable(response.data);
    this.options = response.options.regular;
    this.draw = function () {
        new google.visualization.LineChart(div).draw(this.data, this.options);
    };
}

function PieChart(response, div) {
    var self = this;
    self.data = new google.visualization.DataTable(response.data);
    self.options = response.options.pie;
    self.options.pieStartAngle = 0;
    self.draw = function () {
        var chart = new google.visualization.PieChart(div);
        google.visualization.events.addListener(chart, 'ready', function () {
            if (self.options.pieStartAngle < 10) {
                self.options.pieStartAngle++;
                setTimeout(function () {
                    chart.draw(self.data, self.options);
                }, 0);
            }
        });
        chart.draw(self.data, self.options);
    };
}

function GeoChart(response, div) {
    this.data = new google.visualization.DataTable(response.data);
    this.options = response.options.regular;
    this.draw = function () {
        new google.visualization.GeoChart(div).draw(this.data, this.options);
    };
}

function fillTheGrid(indx, item) {
    var slotArray = globals.slotObjects,
        slot = slotArray[indx];

    var widthPX = item.style.width,
        heightPX = item.style.height,
        imageWidth = Math.round(widthPX.substring(0, widthPX.length - 2)),
        imageHeight = Number(heightPX.substring(0, heightPX.length - 2)),
        slotWidth = Math.round(slot.width),
        slotHeight = slot.height;

    function getSlotElem(x, y) {
        return document.querySelector('[data-slot-x="' + x + '"][data-slot-y="' + y + '"]');
    }

    var slotX1 = slotArray[indx + 1],
        slotX2 = slotArray[indx + 2],
        slotX2Y1 = slotArray[indx + 2 + globals.numOfSlotsPerRow],
        slotX1Y1 = slotArray[indx + (globals.numOfSlotsPerRow + 1)],
        slotY1 = slotArray[indx + globals.numOfSlotsPerRow],
        slotY2 = slotArray[indx + globals.numOfSlotsPerRow * 2],
        slotX1Y2 = slotArray[indx + globals.numOfSlotsPerRow * 2 + 1],
        slotX2Y2 = slotArray[indx + globals.numOfSlotsPerRow * 2 + 2],
        slotElem = getSlotElem(slot.xPos, slot.yPos),
        slotElemY1 = getSlotElem(slotY1.xPos, slotY1.yPos),
        slotElemX1 = getSlotElem(slotX1.xPos, slotX1.yPos),
        slotElemX2 = getSlotElem(slotX2.xPos, slotX2.yPos),
        slotElemX1Y1 = getSlotElem(slotX1Y1.xPos, slotX1Y1.yPos),
        slotElemX2Y1 = getSlotElem(slotX2Y1.xPos, slotX2Y1.yPos),
        slotElemY2 = getSlotElem(slotY2.xPos, slotY2.yPos),
        slotElemX1Y2 = getSlotElem(slotX1Y2.xPos, slotX1Y2.yPos),
        slotElemX2Y2 = getSlotElem(slotX2Y2.xPos, slotX2Y2.yPos);
    /* console.log((imageWidth === slotWidth * 2) && (slot.yPos > 7 || nextSlot.status === 'occupied')) */

    if (imageWidth === slotWidth * 2 && imageHeight === slotHeight * 2) {
        slot.status = 'occupied';
        slotY1.status = 'occupied';
        slotX1.status = 'occupied';
        slotX1Y1.status = 'occupied';
        slotElem.dataset.status = slot.status;
        slotElemY1.dataset.status = slotY1.status;
        slotElemX1.dataset.status = slotX1.status;
        slotElemX1Y1.dataset.status = slotX1Y1.status;
        return { x: slot.x, y: slot.y, width: imageWidth, height: imageHeight };
    } else if (imageWidth === slotWidth * 2 && imageHeight === slotHeight * 3) {
        slot.status = 'occupied';
        slotY1.status = 'occupied';
        slotX1.status = 'occupied';
        slotX1Y1.status = 'occupied';
        slotY2.status = 'occupied';
        slotX1Y2.status = 'occupied';
        slotElem.dataset.status = slot.status;
        slotElemY1.dataset.status = slotY1.status;
        slotElemX1.dataset.status = slotX1.status;
        slotElemX1Y1.dataset.status = slotX1Y1.status;
        slotElemY2.dataset.status = slotY2.status;
        slotElemX1Y2.dataset.status = slotX1Y2.status;
        return { x: slot.x, y: slot.y, width: imageWidth, height: imageHeight };
    } else if (imageWidth === slotWidth * 3 && imageHeight === slotHeight * 3) {
        slot.status = 'occupied';
        slotY1.status = 'occupied';
        slotX1.status = 'occupied';
        slotX1Y1.status = 'occupied';
        slotY2.status = 'occupied';
        slotX1Y2.status = 'occupied';
        slotX2.status = 'occupied';
        slotX2Y2.status = 'occupied';
        slotX2Y1.status = 'occupied';
        slotElem.dataset.status = slot.status;
        slotElemY1.dataset.status = slotY1.status;
        slotElemX1.dataset.status = slotX1.status;
        slotElemX1Y1.dataset.status = slotX1Y1.status;
        slotElemY2.dataset.status = slotY2.status;
        slotElemX1Y2.dataset.status = slotX1Y2.status;
        slotElemX2.dataset.status = slotX2.status;
        slotElemX2Y2.dataset.status = slotX2Y2.status;
        slotElemX2Y1.dataset.status = slotX2Y1.status;
        return { x: slot.x, y: slot.y, width: imageWidth, height: imageHeight };
    }
}
/* end of chart-constructors---------------------------------------------------------- */
/* grid function using css-variables, add rows */
/* function updateCssVar() {
    let htmlStyles = window.getComputedStyle(document.getElementsByTagName('html')[0]);
    let numRows = parseInt(htmlStyles.getPropertyValue("--numRows"));
    let numCols = parseInt(htmlStyles.getPropertyValue("--numCols"));
    let gridItemsCount = (document.querySelectorAll('.draggable').length + 1);
    document.documentElement.style.setProperty('--numRows', gridItemsCount * 2);
} */

/* ----------------------------------------------------------------- */
/* Tab-bar Material Design funtions--------------------------------- */

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
/* end of Material Design-functions------------------------------------------------- */