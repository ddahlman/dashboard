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
        wrap = () => {
            const wrapper = document.getElementById('grid');
            if (window.matchMedia("(min-width: 1200px)").matches) {
                wrapper.style.width = '1400px';
            }
            if (window.matchMedia("(min-width: 400px) and (max-width: 1200px)").matches) {
                wrapper.style.width = '700px';
            }
            if (window.matchMedia("(max-width: 400px)").matches) {
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
        windowMini = window.matchMedia("(max-width: 400px)"),
        windowMedium = window.matchMedia("(min-width: 400px) and (max-width: 1200px)"),
        windowLarge = window.matchMedia("(min-width: 1200px)"),
        slotsPerRow = () => {
            if (window.matchMedia("(min-width: 1200px)").matches) {
                return 10;
            }
            if (window.matchMedia("(min-width: 400px) and (max-width: 1200px)").matches) {
                return 5;
            }
            if (window.matchMedia("(max-width: 400px)").matches) {
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
        selected: selected,
        originalIndex: originalIndex,
        originalClickCoords: originalClickCoords,
        lastTouched: lastTouched,
        aspectWidth: aspectWidth,
        aspectHeight: aspectHeight
    };
}();

window.onload = function () { alert("It's loaded!") }
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
        div.setAttribute('style', `width: ${100 / g.slotsPerRow()}%; padding-bottom: ${(100 / g.slotsPerRow()) * (state.aspectHeight / state.aspectWidth)}%;`);
        div.setAttribute('class', 'dd-slot');

        let slotProp = {
            xPos: Math.floor(indx / g.slotsPerRow()) + 1,
            yPos: (indx % g.slotsPerRow()) + 1,
            status: 'available'
        };
        g.slotObjects.push(slotProp);
        div.setAttribute('data-slot-x', g.slotObjects[indx].xPos);
        div.setAttribute('data-slot-y', g.slotObjects[indx].yPos);
        div.setAttribute('data-status', g.slotObjects[indx].status);
        div.innerHTML = `<p class="dd-slot-num dd-vc">${indx + 1}</p>`;
        return div;
    }
});

const createDivArray = (state) => ({
    createArray: () => [...Array(state.num)].map((el, i) => slot().createDiv(i))
});


const slotBounds = (num) => {
    let state = {
        wrapBounds: g.wrap().getBoundingClientRect(),
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
            case 1: return state.slotSize.width;
            case 2: return state.slotSize.width * 2;
            case 3: return state.slotSize.width * 3;
            case 4: return state.slotSize.width * 4;
            default: break;
        }
    }
});

const slotHeight = (state) => ({
    height: () => {
        switch (state.num) {
            case 1: return state.slotSize.height;
            case 2: return state.slotSize.height * 2;
            case 3: return state.slotSize.height * 3;
            case 4: return state.slotSize.height * 4;
            default: break;
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
                g.wrap().appendChild(slot);
            });
            slotBounds().add();
        }
    };
};


const pieFunction = (obj, div) => {
    let state = { obj, div };
    return {
        go: () => {
            state.obj.options.pieStartAngle = 0;
            let chart = new google.visualization.PieChart(state.div);
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
        createDiv: () => {
            let div = document.createElement('div');
            if (g.large.matches) {
                switch (cssClass) {
                    case 'area': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                    case 'geo': div.setAttribute('style', `width:${state.width4}px; height:${state.height4}px;`); break;
                    case 'pie': div.setAttribute('style', `width:${state.width3}px; height:${state.height4}px;`); break;
                    case 'line': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                    case 'bar': div.setAttribute('style', `width:${state.width4}px; height:${state.height4}px;`); break;
                    default: break;
                }
            }
            if (g.medium.matches) {
                switch (cssClass) {
                    case 'area': div.setAttribute('style', `width:${state.width2}px; height:${state.height2}px;`); break;
                    case 'geo': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                    case 'pie': div.setAttribute('style', `width:${state.width2}px; height:${state.height3}px;`); break;
                    case 'line': div.setAttribute('style', `width:${state.width2}px; height:${state.height2}px;`); break;
                    case 'bar': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                    default: break;
                }
            }
            if (g.mini.matches) {
                div.setAttribute('style', `width:${state.width1}px; height:${state.height1}px;`);
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

            if (g.mini.matches && elWidth === slotWidth && elHeight === slotHeight) {
                X.status = 'occupied';
                let slotElem = getSlotElem(X.xPos, X.yPos);
                slotElem.dataset.status = 'occupied';
            }
            else {
                const mediumArea = [X, g.slotObjects[i + 1], g.slotObjects[i + g.slotsPerRow()], g.slotObjects[(i + 1) + g.slotsPerRow()]];

                const largeArea = [g.slotObjects[i + 2], g.slotObjects[(i + 2) + g.slotsPerRow()],
                g.slotObjects[i + (g.slotsPerRow() * 2)], g.slotObjects[i + (g.slotsPerRow() * 2) + 1],
                g.slotObjects[i + (g.slotsPerRow() * 2) + 2]].concat(mediumArea);

                const mediumGeo = [].concat(largeArea);

                const largeGeo = [g.slotObjects[i + 3], g.slotObjects[(i + 3) + g.slotsPerRow()],
                g.slotObjects[i + (g.slotsPerRow() * 3)], g.slotObjects[i + (g.slotsPerRow() * 3) + 1],
                g.slotObjects[i + (g.slotsPerRow() * 3) + 2], g.slotObjects[i + (g.slotsPerRow() * 2) + 3],
                g.slotObjects[i + (g.slotsPerRow() * 3) + 3]].concat(largeArea);

                const mediumPie = [g.slotObjects[i + (g.slotsPerRow() * 2)], g.slotObjects[i + (g.slotsPerRow() * 2) + 1]].concat(mediumArea);

                const largePie = [g.slotObjects[i + (g.slotsPerRow() * 3)], g.slotObjects[i + (g.slotsPerRow() * 3) + 1],
                g.slotObjects[i + (g.slotsPerRow() * 3) + 2],].concat(largeArea);

                const sizeOfDiv = (match, nr1, nr2) => match && elWidth === (slotWidth * nr1) && elHeight === (slotHeight * nr2);
                const occupy = (obj) => {
                    let elem = getSlotElem(obj.xPos, obj.yPos);
                    obj.status = 'occupied';
                    elem.dataset.status = 'occupied';
                };
                switch (true) {
                    case sizeOfDiv(g.medium.matches, 2, 2): mediumArea.map(occupy); break;
                    case sizeOfDiv(g.medium.matches, 3, 3): mediumGeo.map(occupy); break;
                    case sizeOfDiv(g.medium.matches, 2, 3): mediumPie.map(occupy); break;
                    case sizeOfDiv(g.large.matches, 3, 3): largeArea.map(occupy); break;
                    case sizeOfDiv(g.large.matches, 4, 4): largeGeo.map(occupy); break;
                    case sizeOfDiv(g.large.matches, 3, 4): largePie.map(occupy); break;
                    default: break;
                }
            }
            return { x: X.x, y: X.y, width: elWidth, height: elHeight };
        }
    };
};

const isNotOverlapping = (i, chartWidth, chartHeight) => {
    let state = {
        indx: i,
        width: chartWidth,
        height: chartHeight,
        width1: slotBounds(1).width(),
        width2: slotBounds(2).width(),
        width3: slotBounds(3).width(),
        width4: slotBounds(4).width(),
        height1: slotBounds(1).height(),
        height2: slotBounds(2).height(),
        height3: slotBounds(3).height(),
        height4: slotBounds(4).height(),
        yPos: g.slotObjects[i].yPos,
        X: g.slotObjects[i].status,
        X1: () => g.medium.matches || g.large.matches ? g.slotObjects[i + 1].status : '',
        X2: () => g.medium.matches || g.large.matches ? g.slotObjects[i + 2].status : '',
        X3: () => g.medium.matches || g.large.matches ? g.slotObjects[i + 3].status : '',
        Y1: () => g.medium.matches || g.large.matches ? g.slotObjects[i + g.slotsPerRow()].status : '',
        Y2: () => g.medium.matches || g.large.matches ? g.slotObjects[i + (g.slotsPerRow() * 2)].status : '',
        Y3: () => g.medium.matches || g.large.matches ? g.slotObjects[i + (g.slotsPerRow() * 3)].status : ''
    };
    return {
        check: () => {
            const checkSize = (stateWidth, stateHeight, match) => state.width === stateWidth && state.height === stateHeight && match;

            switch (true) {
                case checkSize(state.width1, state.height1, g.mini.matches): return state.X === 'available';
                case checkSize(state.width2, state.height2, g.medium.matches):
                    return state.yPos < 5 && [state.X, state.X1(), state.Y1(), state.Y2()].every(el => el === 'available');
                case checkSize(state.width3, state.height3, g.medium.matches):
                    return state.yPos < 4 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2()].every(el => el === 'available');
                case checkSize(state.width2, state.height3, g.medium.matches):
                    return state.yPos < 5 && [state.X, state.X1(), state.Y1(), state.Y2()].every(el => el === 'available');
                case checkSize(state.width3, state.height3, g.large.matches):
                    return state.yPos < 9 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2()].every(el => el === 'available');
                case checkSize(state.width3, state.height4, g.large.matches):
                    return state.yPos < 9 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2(), state.Y3()].every(el => el === 'available');
                case checkSize(state.width4, state.height4, g.large.matches):
                    return state.yPos < 8 && [state.X, state.X1(), state.X2(), state.X3(), state.Y1(), state.Y2(), state.Y3()].every(el => el === 'available');
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
/* console.log(g.allCharts.map(el => el.childNodes[0].classList.add('shadow'))); */


const addChartToDOM = (button) => {
    let state = {
        chartType: button,
        wrap: g.wrap(),
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
                state.selectedReportId.removeAttribute('data-selected');
            }

            if (state.chartType) selectedChartType = state.chartType.id;
            if (report) {
                let graph;
                switch (selectedChartType) {
                    case 'area': graph = chart(g.reports[report], 'regular', 'AreaChart', state.div).getChart(); break;
                    case 'geo': graph = chart(g.reports[report], 'regular', 'GeoChart', state.div).getChart(); break;
                    case 'pie': graph = chart(g.reports[report], 'pie', 'PieChart', state.div).getChart(); break;
                    case 'line': graph = chart(g.reports[report], 'regular', 'LineChart', state.div).getChart(); break;
                    case 'bar': graph = chart(g.reports[report], 'regular', 'BarChart', state.div).getChart(); break;
                    default: graph = 'There is no charts here';
                }
                let size = chartSize(state.div).getSize();
                let { elWidth, elHeight } = size;
                const indx = availableIndex(elWidth, elHeight).get();
                let chartAttributes = {
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

const availableIndex = (width, height) => {
    const w = width;
    const h = height;
    return {
        get: () => g.allSlots.findIndex((slot, i) => !isNotOverlapping(i, w, h).check() ? '' : i)
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
                if (isNotOverlapping(i, elWidth, elHeight).check()) {
                    pos = getGridPositions(i, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                } else {
                    const indx = availableIndex(elWidth, elHeight).get();
                    pos = getGridPositions(indx, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
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
                case "sale": availableCharts(['bar', 'line', 'area', 'pie']).show(); break;
                case "expenditure": availableCharts(['bar', 'line', 'area', 'geo']).show(); break;
                case "nrOfVisitors": availableCharts(['bar', 'line', 'pie', 'geo']).show(); break;
                case "socialMedia": availableCharts(['bar', 'area', 'pie', 'geo']).show(); break;
                case "compiledInfo": availableCharts(['line', 'area', 'pie', 'geo']).show(); break;
                case "nationalities": availableCharts(['bar', 'line', 'area', 'geo']).show(); break;
                case "todaysEvent": availableCharts(['bar', 'line', 'area', 'geo']).show(); break;
                case "bookings": availableCharts(['bar', 'area', 'pie', 'line']).show(); break;
                case "mood": availableCharts(['bar', 'line', 'pie', 'geo']).show(); break;
                default: break;
            }
        }
    };
};


function addFirstCharts() {
    const firstSlots = slot(70).createArray();
    const addFirstSlots = addSlotsToDOM(firstSlots).go();
    g.allSlots.push(...firstSlots);

    const divArray = [
        chartDiv('area').createDiv(),
        chartDiv('geo').createDiv(),
        chartDiv('pie').createDiv()
    ];

    fetch('api/?/reports').then(res => res.json())
        .then(report => {
            Object.assign(g.reports, report.reports);
            const chartArray = [
                chart(report.reports.sale, 'regular', 'AreaChart', divArray[0]).getChart(),
                chart(report.reports.nationalities, 'regular', 'GeoChart', divArray[1]).getChart(),
                chart(report.reports.bookings, 'pie', 'PieChart', divArray[2]).getChart()
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
        const doubleRow = 20;
        for (let i = 0; i < doubleRow; i++) {
            const newSlot = slot().createDiv(i + len);
            g.allSlots.push(newSlot);
            addSlotsToDOM(g.allSlots).go();
        }
        addChartToDOM(this).go();
        g.container2.classList.add('out-of-sight');
        removeMenu();
    });
});


const changeOnResize = (slotsPerRow, slotWidth, slotHeight) => {
    let state = {
        perRow: slotsPerRow,
        slotWidth: slotWidth,
        slotHeight: slotHeight
    };
    return Object.assign(
        {},
        drawSlots(state),
        drawDivs(state),
        drawCharts(state)
    );
};

const drawSlots = (state) => ({
    slots: () => {
        g.allSlots.map((slot, i, arr) => {
            slot.setAttribute('style',
                `width: ${100 / state.perRow}%; padding-bottom: ${(100 / state.perRow) * (g.aspectHeight / g.aspectWidth)}%;`);
            slot.dataset.status = 'available';
            g.slotObjects[i].status = 'available';
            g.slotObjects[i].xPos = Math.floor(i / state.perRow) + 1;
            g.slotObjects[i].yPos = (i % state.perRow) + 1;
            g.slotObjects[i].width = state.slotWidth;
            g.slotObjects[i].height = state.slotHeight;
            arr[i].dataset.slotX = g.slotObjects[i].xPos;
            arr[i].dataset.slotY = g.slotObjects[i].yPos;
        });
        setTimeout(() => {
            const wrapBounds = g.wrap().getBoundingClientRect();
            [...document.getElementsByClassName('dd-slot')].forEach((slot, i) => {
                const bounds = slot.getBoundingClientRect();
                g.slotObjects[i].y = bounds.top - wrapBounds.top;
                g.slotObjects[i].x = bounds.left - wrapBounds.left;
            });
        }, 200);
    }
});

const drawDivs = (state) => ({
    divs: () => {
        let increment = 0;
        g.allSlots.map((slot, i) => {
            if (g.slotObjects[i].status === 'occupied') return;
            increment++;
            if (g.dataId[increment - 1] !== undefined) {
                let dataId = g.dataId[increment - 1];
                let el = document.querySelector(`[data-id="${dataId}"]`);
                if (g.wrap().style.width === '1400px') {
                    switch (true) {
                        case el.classList.contains('area') || el.classList.contains('line'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 3}px; height:${state.slotHeight * 3}px;`);
                            break;
                        case el.classList.contains('geo') || el.classList.contains('bar'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 4}px; height:${state.slotHeight * 4}px;`);
                            break;
                        case el.classList.contains('pie'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 3}px; height:${state.slotHeight * 4}px;`);
                            break;
                    }
                }
                if (g.wrap().style.width === '700px') {
                    switch (true) {
                        case el.classList.contains('area') || el.classList.contains('line'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 2}px; height:${state.slotHeight * 2}px;`);
                            break;
                        case el.classList.contains('geo') || el.classList.contains('bar'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 3}px; height:${state.slotHeight * 3}px;`);
                            break;
                        case el.classList.contains('pie'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 2}px; height:${state.slotHeight * 3}px;`);
                            break;
                    }
                }
                if (g.wrap().style.width === '300px') {
                    el.setAttribute('style', `width:${state.slotWidth}px; height:${state.slotHeight}px;`);
                }
                let size = chartSize(el).getSize();
                let { elWidth, elHeight } = size;
                let pos;
                if (isNotOverlapping(i, elWidth, elHeight).check()) {
                    pos = getGridPositions(i, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    g.chartPositions[increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                } else {
                    const indx = availableIndex(elWidth, elHeight).get();
                    pos = getGridPositions(indx, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    g.chartPositions[increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                }
            }
        });
    }
});

const drawCharts = (state) => ({
    charts: () => {
        g.allCharts.forEach(chart => chart.draw());
    }
});


const resize = (rows, slotWidth, slotHeight) => {
    g.wrap();
    changeOnResize(rows, slotWidth, slotHeight).slots();
    setTimeout(() => {
        changeOnResize(rows, slotWidth, slotHeight).divs();
    }, 200);
    setTimeout(() => {
        changeOnResize().charts();
    }, 500);
};


[g.mini, g.medium, g.large].map((mq, i, arr) => {
    mq.addEventListener('change', (e) => {
        if (e.matches) {
            if (e.media === "(max-width: 400px)") {
                resize(1, 300, 168.75);
            }
            if (e.media === "(max-width: 1200px) and (min-width: 400px)") {
                resize(5, 140, 78.75);
            }
            if (e.media === "(min-width: 1200px)") {
                resize(10, 140, 78.75);
            }
        }
    });
});



function chartMouseDown(e) {
    if (!g.selected) {
        g.wrap().addEventListener('mousemove', chartMouseMove);
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
        let bounds = g.wrap().getBoundingClientRect(),
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
