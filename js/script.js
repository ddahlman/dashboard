

google.charts.load('current', {
    'packages': ['corechart', 'bar', 'line', 'geochart'],
    'mapsApiKey': 'AIzaSyDMPDZMkd7YLnBpiKeBAq2HZYfjdWS8FA4'
});
google.charts.setOnLoadCallback(function () {
    /*  getFirstThreeGraphs(); */
    showDashboard();
});

/* (function getFirstThreeGraphs() {
    $
})(); */

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
        case "sale": availableCharts(['bar', 'line', 'area', 'pie']); break;
        case "expenditure": availableCharts(['bar', 'line', 'area', 'geo']); break;
        case "nrOfVisitors": availableCharts(['bar', 'line', 'pie', 'geo']); break;
        case "socialMedia": availableCharts(['bar', 'area', 'pie', 'geo']); break;
        case "compiledInfo": availableCharts(['line', 'area', 'pie', 'geo']); break;
        case "nationalities": availableCharts(['bar', 'line', 'area']); break;
        case "todaysEvent": availableCharts(['bar', 'pie', 'geo']); break;
        case "bookings": availableCharts(['bar', 'area', 'pie', 'geo']); break;
        case "mood": availableCharts(['bar', 'line', 'pie', 'geo']); break;
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
    if (report) {
        $.get('reports.json').done((response) => {
            var div = createDiv(selectedChartType);
            container.appendChild(div);
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
            if (self.options.pieStartAngle < 20) {
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
/* end of chart-constructors---------------------------------------------------------- */
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
