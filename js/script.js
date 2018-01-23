

google.charts.load('current', {
    'packages': ['corechart', 'geochart'],
    'mapsApiKey': 'AIzaSyDMPDZMkd7YLnBpiKeBAq2HZYfjdWS8FA4'
});
google.charts.setOnLoadCallback(function () {
    showDashboard();
});



/* the global variables */
var container1 = document.querySelector('#container-1');
var container2 = document.querySelector('#container-2');

/* open plus-button into a tab-menu */
document.querySelector('.box').addEventListener('click', function () {
    container1.classList.add('open');
});


/* fades out container-1 and pulls down a filtered container-2 that holds chart-buttons */
[...document.querySelectorAll('.add-container-2')].map((card) => {
    card.addEventListener('click', switchContainer, false);
});

function switchContainer(e) {
    var reportId = this.id;
    container2.classList.remove('out-of-sight');
    container1.classList.add('fade-out');

    setTimeout(function () {
        container1.style.display = 'none';
    }, 280);
    container1.tabIndex = -1;
    e.currentTarget.setAttribute('data-selected', 'selected');
    showAvailableCharts(reportId);
}

/* the function that filters chart-buttons */
function showAvailableCharts(reportId) {
    var chartsBtns = [...document.querySelectorAll('.card2')];
    chartsBtns.map((chartBtn) => {
        chartBtn.style.display = 'none';
    });

    function availableCharts(chartNames) {
        chartsBtns.filter((chartBtn) => {
            var id = chartBtn.getAttribute('id');
            /* send back that id that's equal to arrVal */
            return chartNames.some(arrVal => id === arrVal);
        }).map(btn => btn.style.display = 'block');
    }

    switch (reportId) {
        case "sale": availableCharts(['bar', 'line']); break;
        case "expenditure": availableCharts(['area']); break;
        case "nrOfVisitors": availableCharts(['geo']); break;
        case "socialMedia": availableCharts(['bar', 'line', 'area']); break;
        case "compiledInfo": availableCharts(['area']); break;
        case "nationalities": availableCharts(['geo']); break;
        case "todaysEvent": availableCharts(['bar', 'line', 'geo']); break;
        case "bookings": availableCharts(['area']); break;
        case "mood": availableCharts(['geo']); break;
        default: break;
    }
}

/* push current object to array when clicking on chart-button + add type to object 
so we know what chart-type to draw*/
[...document.querySelectorAll('.card2')].map(function (chartBtn) {
    chartBtn.addEventListener('click', showDashboard);
});


/* creates a div with specified css-class and properties */
function createDiv(cssClass) {
    var div = document.createElement('div');
    div.setAttribute('class', cssClass);
    div.classList.add(cssClass, 'draggable');
    return div;
}


/* loops through the storage and uses createChart() to create a div with the right css-class 
depending on what 'id' it has */
/* inserts the newly created array in the container (and removes the old one) */
function showDashboard() {
    updateCssVar();
    var container = document.querySelector('#grid');
    var report;
    var selectedreportId = document.querySelector('[data-selected]');
    if (selectedreportId) {
        report = selectedreportId.id;
        selectedreportId.removeAttribute('[data-selected]');
    }
    var selectedChartType = this.id;

    switch (selectedChartType) {
        case 'bar':
            $.get(report + '.json').done((data) => {
                var div = createDiv('bar');
                container.appendChild(div);
                var barchart = new BarChart(data, div);
                barchart.draw();
            });
            break;

        default:
            break;
    }


}

function BarChart(response, div) {
    this.data = new google.visualization.DataTable(response.data);
    this.options = response.options;
    this.draw = function () {
        new google.visualization.AreaChart(div).draw(this.data, this.options);
    };
}

/* grid function using css-variables, add rows */
function updateCssVar() {
    let htmlStyles = window.getComputedStyle(document.getElementsByTagName('html')[0]);
    let numRows = parseInt(htmlStyles.getPropertyValue("--numRows"));
    let numCols = parseInt(htmlStyles.getPropertyValue("--numCols"));
    let gridItemsCount = (document.querySelectorAll('.draggable').length + 1);
    document.documentElement.style.setProperty('--numRows', gridItemsCount * 2);
    console.log(gridItemsCount);
}


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
/* end of Material Design-functions------------------------------------------------- */
