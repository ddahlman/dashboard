google.charts.load('current', {
    'packages': ['corechart', 'geochart'],
    'mapsApiKey': 'AIzaSyDMPDZMkd7YLnBpiKeBAq2HZYfjdWS8FA4'
});

google.charts.setOnLoadCallback(function () {
    addFirstCharts();
});

const g = function () {
    let container2 = document.getElementById('container-2'),
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



const slot = (num) => {
    let state = {
        num,
        aspectWidth: 1920,
        aspectHeight: 1080
    };
    return Object.assign(
        {},
        createSlotDiv(state),
        createDivArray(state)
    );
};

const createSlotDiv = (state) => ({
    createDiv: (indx) => {
        let div = document.createElement('div');
        div.setAttribute('style', `width: ${100 / g.slotsPerRow}%; padding-bottom: ${(100 / g.slotsPerRow) * (state.aspectHeight / state.aspectWidth)}%;`);
        div.setAttribute('class', 'dd-slot');

        let slotProp = {
            xPos: Math.floor(indx / g.slotsPerRow) + 1,
            yPos: (indx % g.slotsPerRow) + 1,
            status: 'available'
        };
        g.slotObjects.push(slotProp);
        div.setAttribute('data-slot-x', g.slotObjects[indx].xPos);
        div.setAttribute('data-slot-y', g.slotObjects[indx].yPos);
        div.setAttribute('data-status', g.slotObjects[indx].status);
        /* div.innerHTML = `<p class="dd-slot-num dd-vc">${indx + 1}</p>`; */
        return div;
    }
});

const createDivArray = (state) => ({
    createArray: () => [...Array(state.num)].map((el, i) => slot().createDiv(i))
});


const slotBounds = (num) => {
    let state = {
        wrapBounds: g.wrap.getBoundingClientRect(),
        slotSize: document.getElementsByClassName('dd-slot')[0].getBoundingClientRect(),
        num
    };
    return Object.assign(
        {},
        slotWidth(state),
        slotHeight(state),
        addToSlotObjects(state)
    );
};

const slotWidth = (state) => ({
    width: () => {
        switch (state.num) {
            case 2: return state.slotSize.width * 2;
            case 3: return state.slotSize.width * 3;
            default: return state.slotSize.width;
        }
    }
});

const slotHeight = (state) => ({
    height: () => {
        switch (state.num) {
            case 2: return state.slotSize.height * 2;
            case 3: return state.slotSize.height * 3;
            default: return state.slotSize.height;
        }
    }
});

const addToSlotObjects = (state) => ({
    add: () => [...document.getElementsByClassName('dd-slot')].forEach((item, i) => {
        const slotBound = item.getBoundingClientRect();
        Object.assign(g.slotObjects[i], {
            y: slotBound.top - state.wrapBounds.top,
            x: slotBound.left - state.wrapBounds.left,
            bottom: slotBound.bottom - state.wrapBounds.bottom,
            right: slotBound.right - state.wrapBounds.right,
            width: slotBound.width,
            height: slotBound.height
        });
    })
});


const addSlotsToDOM = (array) => {
    let arr = array;
    return {
        go: () => {
            arr.forEach((slot, i) => {
                g.wrap.appendChild(slot);
            });
            slotBounds().add();
        }
    };
};


const pieFunction = (pieChart, div) => {
    let state = {
        pieChart,
        div
    };
    return {
        go: () => {
            state.pieChart.options.pieStartAngle = 0;
            let chart = new google.visualization.PieChart(state.div);
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

const chart = (response, optionType, type, div) => {
    let state = { response, optionType, type, div };
    return {
        getChart: () => {
            const obj = {};
            obj.data = new google.visualization.DataTable(state.response.data);
            obj.options = state.response.options[state.optionType];
            switch (state.type) {
                case 'PieChart':
                    obj.draw = () => pieFunction(obj, state.div).go();
                    break;
                default:
                    obj.draw = () => new google.visualization[state.type](state.div).draw(obj.data, obj.options);
                    break;
            }
            return obj;
        }
    };
};

const chartDiv = (cssClass) => {
    let state = {
        cssClass,
        width2: slotBounds(2).width(),
        width3: slotBounds(3).width(),
        height2: slotBounds(2).height(),
        height3: slotBounds(3).height()
    };
    return {
        createDiv: () => {
            let div = document.createElement('div');
            switch (state.cssClass) {
                case 'geo': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                case 'pie': div.setAttribute('style', `width:${state.width2}px; height:${state.height3}px;`); break;
                case 'area': div.setAttribute('style', `width:${state.width2}px; height:${state.height2}px;`); break;
                case 'line': div.setAttribute('style', `width:${state.width2}px; height:${state.height2}px;`); break;
                case 'bar': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
            }
            div.classList.add(state.cssClass);
            return div;
        }
    };
};

const chartSize = (el) => {
    const ele = el;
    return {
        getSize: () => {
            const widthPX = ele.style.width,
                heightPX = ele.style.height;
            const sizes = {
                elWidth: Math.round(widthPX.substring(0, widthPX.length - 2)),
                elHeight: Number(heightPX.substring(0, heightPX.length - 2))
            };
            return sizes;
        }
    };
};

const getGridPositions = (indx, div) => {
    const i = indx;
    const ele = div;
    return {
        go: () => {
            let X = g.slotObjects[i];
            let size = chartSize(ele).getSize();
            let { elWidth, elHeight } = size;
            let [slotWidth, slotHeight] = [Math.round(X.width), X.height];

            const getSlotElem = (x, y) => document.querySelector(`[data-slot-x="${x}"][data-slot-y="${y}"]`);

            let [X1, X2, X2Y1, X1Y1, Y1, Y2, X1Y2, X2Y2] = [
                g.slotObjects[i + 1],
                g.slotObjects[i + 2],
                g.slotObjects[(i + 2) + g.slotsPerRow],
                g.slotObjects[i + (g.slotsPerRow + 1)],
                g.slotObjects[i + g.slotsPerRow],
                g.slotObjects[i + (g.slotsPerRow * 2)],
                g.slotObjects[i + (g.slotsPerRow * 2) + 1],
                g.slotObjects[i + (g.slotsPerRow * 2) + 2]
            ];

            let [el, elY1, elX1, elX2, elX1Y1, elX2Y1, elY2, elX1Y2, elX2Y2] = [
                getSlotElem(X.xPos, X.yPos),
                getSlotElem(Y1.xPos, Y1.yPos),
                getSlotElem(X1.xPos, X1.yPos),
                getSlotElem(X2.xPos, X2.yPos),
                getSlotElem(X1Y1.xPos, X1Y1.yPos),
                getSlotElem(X2Y1.xPos, X2Y1.yPos),
                getSlotElem(Y2.xPos, Y2.yPos),
                getSlotElem(X1Y2.xPos, X1Y2.yPos),
                getSlotElem(X2Y2.xPos, X2Y2.yPos)
            ];

            if (elWidth === (slotWidth * 2) && elHeight === (slotHeight * 2)) {
                [X, Y1, X1, X1Y1, el.dataset, elY1.dataset, elX1.dataset, elX1Y1.dataset]
                    .map(obj => obj.status = 'occupied');
                return { x: X.x, y: X.y, width: elWidth, height: elHeight };
            }
            else if (elWidth === (slotWidth * 2) && elHeight === (slotHeight * 3)) {
                [X, Y1, X1, X1Y1, Y2, X1Y2, el.dataset, elY1.dataset, elX1.dataset, elX1Y1.dataset, elY2.dataset, elX1Y2.dataset]
                    .map(obj => obj.status = 'occupied');
                return { x: X.x, y: X.y, width: elWidth, height: elHeight };
            }
            else if (elWidth === (slotWidth * 3) && elHeight === (slotHeight * 3)) {
                [X, Y1, X1, X1Y1, Y2, X1Y2, X2, X2Y2, X2Y1, el.dataset, elY1.dataset, elX1.dataset,
                    elX1Y1.dataset, elY2.dataset, elX1Y2.dataset, elX2.dataset, elX2Y2.dataset, elX2Y1.dataset]
                    .map(obj => obj.status = 'occupied');
                return { x: X.x, y: X.y, width: elWidth, height: elHeight };
            }
        }
    };
};


const isNotOverlapping = (i, chartWidth) => {
    let state = {
        indx: i,
        width: chartWidth,
        width2: slotBounds(2).width(),
        width3: slotBounds(3).width(),
        yPos: g.slotObjects[i].yPos,
        status: g.slotObjects[i].status,
        nextStatus: g.slotObjects[i + 1].status,
        afterNextStatus: g.slotObjects[i + 2].status,
        status1Down: g.slotObjects[i + g.slotsPerRow].status,
        status2Down: g.slotObjects[i + (g.slotsPerRow * 2)].status
    };
    return {
        check: () => {
            switch (state.width) {
                case state.width2:
                    return state.yPos < 8 &&
                        state.status === 'available' &&
                        state.nextStatus === 'available' &&
                        state.status1Down === 'available' &&
                        state.status2Down === 'available';
                case state.width3:
                    return state.yPos < 7 &&
                        state.status === 'available' &&
                        state.nextStatus === 'available' &&
                        state.afterNextStatus === 'available';
            }
        }
    };
};





const placeCharts = ({ div, chart, indx, increment, width, height }) => {
    return {
        go: () => {
            const chartPos = getGridPositions(indx, div).go();
            div.classList.add('dd-item', 'dd-transition');
            div.style.transform = `translate3d(${chartPos.x}px, ${chartPos.y}px,0px)`;
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


const addChartToDOM = (button) => {
    let state = {
        chartType: button,
        wrap: g.wrap,
        div: chartDiv(button.id).createDiv(),
        len: g.dataId.length,
        selectedReportId: document.querySelector('[data-selected]')
    };
    return {
        go: () => {
            let report,
                selectedChartType;
            if (state.selectedReportId) {
                report = state.selectedReportId.id;
                state.selectedReportId.removeAttribute('[data-selected]');
            }
            if (state.chartType) selectedChartType = state.chartType.id;
            if (report) {
                fetch('reports.json').then(res => res.json())
                    .then(response => {
                        let graph;
                        switch (selectedChartType) {
                            case 'area': graph = chart(response[report], 'regular', 'AreaChart', state.div).getChart(); break;
                            case 'geo': graph = chart(response[report], 'regular', 'GeoChart', state.div).getChart(); break;
                            case 'pie': graph = chart(response[report], 'pie', 'PieChart', state.div).getChart(); break;
                            case 'line': graph = chart(response[report], 'regular', 'LineChart', state.div).getChart(); break;
                            case 'bar': graph = chart(response[report], 'regular', 'BarChart', state.div).getChart(); break;
                        }
                        let size = chartSize(state.div).getSize();
                        let { elWidth, elHeight } = size;
                        const indx = availableIndex(elWidth).get();
                        let chartAttributes = {
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

const availableIndex = (width) => {
    const w = width;
    return {
        get: () => g.allSlots.findIndex((slot, i) => !isNotOverlapping(i, w).check() ? '' : i)
    };
};


const arrangeItems = () => {
    let state = {
        dataId: g.dataId,
        chartPos: g.chartPositions
    };
    return {
        go: () => state.dataId.forEach((dataId, i) => {
            let pos = state.chartPos[i];
            let el = document.querySelector(`[data-id="${dataId}"]`);
            el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0px)`;
        })
    };
};

const arrangeItemsMouseUp = () => {
    let state = {
        increment: 0,
        allSlots: g.allSlots,
        slotObjects: g.slotObjects,
        chartPos: g.chartPositions,
        dataId: g.dataId
    };
    return {
        go: () => state.allSlots.map((slot, i, arr) => {
            if (state.slotObjects[i].status === 'occupied') {
                return;
            }
            state.increment++;
            if (state.dataId[state.increment - 1] !== undefined) {
                let dataId = state.dataId[state.increment - 1];
                let el = document.querySelector(`[data-id="${dataId}"]`);
                let size = chartSize(el).getSize();
                let { elWidth, elHeight } = size;
                let pos;
                if (isNotOverlapping(i, elWidth).check()) {
                    pos = getGridPositions(i, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = { width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                } else {
                    const indx = availableIndex(elWidth).get();
                    pos = getGridPositions(indx, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = { width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                }
            }
        })
    };
};

const getChartIdByCoords = (coords) => {
    const chartPos = g.chartPositions;
    return {
        //get the current chart being hovered over  
        go: () => {
            for (var id in chartPos) {
                var chart = chartPos[id];
                if (chart.x <= coords.x &&
                    coords.x <= chart.x + chart.width &&
                    chart.y <= coords.y &&
                    coords.y <= chart.y + chart.height)
                    return id;
            }
        }
    };
};

const getSlotIdByCoords = (coords) => {
    const slotObjects = g.slotObjects;
    return {
        //get the current slot being hovered over  
        go: () => {
            for (var id in slotObjects) {
                var slot = slotObjects[id];
                if (slot.x <= coords.x &&
                    coords.x <= slot.x + slot.width &&
                    slot.y <= coords.y &&
                    coords.y <= slot.y + slot.height)
                    return id;
            }
        }
    };
};


const getIndexOfChartId = (id) => {
    const len = g.dataId.length;
    return {
        go: () => {
            for (let i = 0; i < len; i++) {
                if (g.dataId[i] === id)
                    return i;
            }
        }
    };
};


const removeMenu = () => {
    g.box.classList.remove('open');
    g.pseudoCircle.classList.remove('open');
    g.menu1.classList.remove('show');
    g.toolbar.classList.remove('open');
};


const availableCharts = (typeOfCharts) => {
    const types = typeOfCharts;
    return {
        show: () => {
            [...document.querySelectorAll('.card2')].filter((chartBtn) => {
                var id = chartBtn.getAttribute('id');
                /* send back that id that's equal to arrVal */
                return types.some(arrVal => id === arrVal);
            }).map(btn => btn.style.display = 'block');
        }
    };
};


const showAvailableCharts = (reportId) => {
    const id = reportId;
    return {
        go: () => {
            [...document.querySelectorAll('.card2')].map(chartBtn => chartBtn.style.display = 'none');
            switch (id) {
                case "sale": availableCharts(['bar', 'line', 'area']).show(); break;
                case "expenditure": availableCharts(['bar', 'line', 'area', 'geo']).show(); break;
                case "nrOfVisitors": availableCharts(['bar', 'line', 'pie', 'geo']).show(); break;
                case "socialMedia": availableCharts(['bar', 'area', 'pie', 'geo']).show(); break;
                case "compiledInfo": availableCharts(['line', 'area', 'pie', 'geo']).show(); break;
                case "nationalities": availableCharts(['bar', 'line', 'area']).show(); break;
                case "todaysEvent": availableCharts(['bar', 'line', 'area']).show(); break;
                case "bookings": availableCharts(['bar', 'area', 'pie', 'geo']).show(); break;
                case "mood": availableCharts(['bar', 'line', 'pie', 'geo']).show(); break;
                default: break;
            }
        }
    };
};


function addFirstCharts() {
    const firstSlots = slot(64).createArray();
    const addFirstSlots = addSlotsToDOM(firstSlots).go();
    g.allSlots.push(...firstSlots);

    const divArray = [
        chartDiv('area').createDiv(),
        chartDiv('geo').createDiv(),
        chartDiv('pie').createDiv()
    ];

    fetch('reports.json').then(res => res.json())
        .then(report => {
            const chartArray = [
                chart(report.sale, 'regular', 'AreaChart', divArray[0]).getChart(),
                chart(report.nationalities, 'regular', 'GeoChart', divArray[1]).getChart(),
                chart(report.bookings, 'pie', 'PieChart', divArray[2]).getChart()
            ];

            let increment = 0;
            g.allSlots.forEach((slotItem, i) => {
                if (g.slotObjects[i].status === 'occupied') return;
                increment++;
                if (divArray[increment - 1] && chartArray[increment - 1]) {
                    let size = chartSize(divArray[increment - 1]).getSize();
                    let { elWidth, elHeight } = size;
                    let chartAttributes = {
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
        });
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


[...document.querySelectorAll('.add-container-2')].map((card) => {
    card.addEventListener('click', function (e) {
        let reportId = this.id;
        g.container2.classList.remove('out-of-sight');
        g.toolbar.classList.add('fade-out');
        setTimeout(function () {
            g.container2.classList.add('shadow');
        }, 300);
        e.currentTarget.setAttribute('data-selected', 'selected');
        showAvailableCharts(reportId).go();
    });
});


[...document.querySelectorAll('.card2')].forEach((chartButton) => {
    chartButton.addEventListener('click', function () {
        const len = g.slotObjects.length;
        for (let i = 0; i < g.slotsPerRow; i++) {
            const newSlot = slot().createDiv(i + len);
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
        g.slotObjects.map(slot => slot.status = 'available');
        g.allSlots.map(slot => slot.dataset.status = 'available');
    }
}


function chartMouseMove(e) {
    if (g.selected) {
        let bounds = g.wrap.getBoundingClientRect(),
            left = bounds.left + document.documentElement.scrollLeft,
            top = bounds.top + document.documentElement.scrollTop;

        let pageX = e.pageX,
            pageY = e.pageY;

        let clickX = pageX - left,
            clickY = pageY - top,
            hoverChartIndex = getChartIdByCoords({ x: clickX, y: clickY }).go(),
            /* getting the index of the slot the mouse is currently over while dragging*/
            hoverSlotId = getSlotIdByCoords({ x: clickX, y: clickY }).go();

        let ele = g.selected,
            chartId = ele.getAttribute('data-id'),
            index = g.originalIndex,
            newIndex = getIndexOfChartId(chartId).go(),

            x = g.chartPositions[index].x,
            y = g.chartPositions[index].y;

        ele.childNodes[0].classList.add('shadow-elevated');

        let resultX = x + (pageX - g.originalClickCoords.x),
            resultY = y + (pageY - g.originalClickCoords.y);

        if (hoverChartIndex !== undefined && g.lastTouched !== hoverChartIndex) {
            g.lastTouched = hoverChartIndex;
            g.dataId.splice(hoverChartIndex, 0, g.dataId.splice(newIndex, 1)[0]);
            arrangeItems().go();
        }
        ele.style.transform = `translate3d(${resultX}px, ${resultY}px, 0)`;
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






const dynamicTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#icon-text-tab-bar'));
const panels = document.querySelector('.panels');
dynamicTabBar.preventDefaultOnClick = true;

function updatePanel(index) {
    var activePanel = panels.querySelector(".panel.is-active");
    if (activePanel) {
        activePanel.classList.remove("is-active");
    }

    var newActivePanel = panels.querySelector(
        ".panel:nth-child(" + (index + 1) + ")"
    );
    if (newActivePanel) {
        newActivePanel.classList.add("is-active");
    }
}

dynamicTabBar.listen("MDCTabBar:change", function (t) {
    var tabs = t.detail;
    var nthChildIndex = tabs.activeTabIndex;
    updatePanel(nthChildIndex);
});
