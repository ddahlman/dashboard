(function () {
    function init() {
        google.charts.load('current', {
            'packages': ['corechart', 'geochart'],
            'mapsApiKey': 'AIzaSyDMPDZMkd7YLnBpiKeBAq2HZYfjdWS8FA4'
        });
        google.charts.setOnLoadCallback(function () {
            showDashboard();
        });
    }
})();

/* the global variables */
var container1 = document.querySelector('#container-1');
var container2 = document.querySelector('#container-2');

/* the function that gets the dashboard */
function getDashboard() {
    var storage = localStorage.getItem('dashboard');
    var charts = storage === null ? [] : JSON.parse(storage);
    return charts;
}

/* open plus-button into a tab-menu */
document.querySelector('.box').addEventListener('click', function () {
    container1.classList.add('open');
});

/* close container-1 that holds the tab-menu -- still a work in progress */
document.querySelector('#close').addEventListener('click', function () {
    console.log(container1.classList);
    container1.classList.add('fade-out');
    container1.tabIndex = -1;
});

/* fades out container-1 and pulls down a filtered container-2 that holds chart-buttons */
[...document.querySelectorAll('.add-container-2')].map((card) => {
    card.addEventListener('click', function (e) {
        var id = card.getAttribute('id');
        container2.classList.remove('out-of-sight');
        container1.classList.add('fade-out');

        setTimeout(function () {
            container1.style.display = 'none';
        }, 280);
        container1.tabIndex = -1;

        switch (id) {
            case "report1": filterCharts(e, ['bar', 'line']); break;
            case "report2": filterCharts(e, ['area']); break;
            case "report3": filterCharts(e, ['geo']); break;
            case "report4": filterCharts(e, ['bar', 'line']); break;
            case "report5": filterCharts(e, ['area']); break;
            case "report6": filterCharts(e, ['geo']); break;
            case "report7": filterCharts(e, ['bar', 'line']); break;
            case "report8": filterCharts(e, ['area']); break;
            case "report9": filterCharts(e, ['geo']); break;
            default: break;
        }
    });
});

/* the function that filters charts and adds css-class "selected" to report-button*/
function filterCharts(e, arr) {
    var chartsBtns = [...document.querySelectorAll('.card2')];
    chartsBtns.map((chartBtn) => {
        chartBtn.style.display = 'none';
    });

    chartsBtns.filter((chartBtn) => {
        var id = chartBtn.getAttribute('id');
        /* don't send back that id that's equal to arrVal */
        return !arr.some(arrVal => id === arrVal);
    }).map(btn => btn.style.display = 'block');
    /* currentTarget = is the target you assigned listener to */
    e.currentTarget.className += ' selected';
}

/* checks which of the topbtns are selected to know which object to put in the charts */
function isSelected() {
    var root = 'https://jsonplaceholder.typicode.com';
    var selected = [...document.querySelectorAll('.report-btn')].filter(function (btn) {
        return btn.classList.contains('selected');
    });
    var id = selected[0].getAttribute('id');
    switch (id) {
        case "report1": return $.get(root + "/posts/1");
        case "report2": return $.get(root + "/posts/2");
        case "report3": return $.get(root + "/posts/3");
        case "report4": return $.get(root + "/posts/4");
        case "report5": return $.get(root + "/posts/5");
        case "report6": return $.get(root + "/posts/6");
        case "report7": return $.get(root + "/posts/7");
        case "report8": return $.get(root + "/posts/8");
        case "report9": return $.get(root + "/posts/9");
        default: return "fel!";
    }
}

/* push current object to array when clicking on chart-button + add type to object 
so we know what chart-type to draw*/
[...document.querySelectorAll('.card2')].map(function (chartBtn) {
    chartBtn.addEventListener('click', function () {
        var type = chartBtn.getAttribute('id');
        console.log(type);
        var charts = getDashboard();
        var currentObject = isSelected();
        currentObject.done(function (chartData) {
            chartData.type = type;
            console.log(chartData);
            charts.push(chartData);
            localStorage.setItem('dashboard', JSON.stringify(charts));
            console.log(charts);
            showDashboard();
        });
    });
});

/* grid function using css-variables, add rows */
function updateCssVar() {
    let htmlStyles = window.getComputedStyle(document.getElementsByTagName('html')[0]);
    let numRows = parseInt(htmlStyles.getPropertyValue("--numRows"));
    let numCols = parseInt(htmlStyles.getPropertyValue("--numCols"));
    let gridItemsCount = document.querySelectorAll('.draggable').length;
    document.documentElement.style.setProperty('--numRows', Math.ceil(gridItemsCount / numCols) * 4);
    console.log(numRows);
}


/* creates a div with specified css-class and properties */
function createChart(cssClass, eventObject) {
    var div = `<div class='draggable ${cssClass}'>${eventObject.userId}<br>${eventObject.title}<br>${eventObject.type}</div>`;
    return div;
}

/* loops through the storage and uses createChart() to create a div with the right css-class 
depending on what 'id' it has */
/* inserts the newly created array in the container (and removes the old one) */
function showDashboard() {
    var charts = getDashboard();
    var container = document.querySelector('#grid');

    var chartsArray = charts.map(function (obj) {

        var div;
        switch (obj.type) {
            case 'bar': div = createChart('bar', obj); break;
            case 'pie': div = createChart('pie', obj); break;
            case 'line': div = createChart('line', obj); break;
            case 'area': div = createChart('area', obj); break;
            case 'geo': div = createChart('geo', obj); break;
        }
        return div;
    });
    console.log(chartsArray);
    container.innerHTML = chartsArray.join("");
    updateCssVar();
}

/* clear localstorage */
document.querySelector('#clear').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.clear();
    showDashboard();
});

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
