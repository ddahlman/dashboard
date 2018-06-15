(function () {
    mdc.autoInit();
})();
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
        firstLoader = document.querySelector('.loading-absolute'),
        overlay = document.querySelector('.overlay'),
        wrap = () => {
            const wrapper = document.getElementById('grid');
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
        staticChartAttributes = [
            /*  {
                 report: 'sale',
                 charttype: 'AreaChart',
                 cssclass: 'area'
             },
             {
                 report: 'nationalities',
                 charttype: 'GeoChart',
                 cssclass: 'geo'
             },
             {
                 report: 'bookings',
                 charttype: 'PieChart',
                 cssclass: 'pie'
             } */
        ],
        windowMini = window.matchMedia("screen and (max-width: 400px)"),
        windowMedium = window.matchMedia("screen and (min-width: 400px) and (max-width: 1200px)"),
        windowLarge = window.matchMedia("screen and (min-width: 1200px)"),
        msMediaMedium = "screen and (max-width:1200px) and (min-width:400px)",
        mozMediaMedium = "screen and (min-width: 400px) and (max-width: 1200px)",
        chromeMediaMedium = "screen and (max-width: 1200px) and (min-width: 400px)",
        slotsPerRow = () => {
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
        staticChartAttributes: staticChartAttributes,
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



const dynamicTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#icon-text-tab-bar'));
let fixed_ripple = [...document.getElementsByClassName('mdc-tab')].map((btn) => {
    return mdc.ripple.MDCRipple.attachTo(btn);
});

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



(() => {
    let counter = 0;
    let c = 0;
    const h1 = document.querySelector('.loading h1');
    const hr = document.querySelector('.loading hr');
    let i = setInterval(() => {
        h1.innerHTML = `${c}%`;
        hr.style.width = `${c}%`;
        counter++;
        c++;
        if (counter === 101) {
            clearInterval(i);
            g.firstLoader.classList.add('loaded');
            [g.box, g.container2, g.toolbar].map(el => el.classList.remove('hidden'));
        }
    }, 10);
})();
setTimeout(() => {
    g.firstLoader.style.display = 'none';
}, 3000);
