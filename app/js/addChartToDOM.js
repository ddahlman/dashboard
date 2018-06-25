const postRequest = (url, array, callback) => {
    const xml = new XMLHttpRequest();
    xml.open("POST", url);
    xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
            const data = JSON.parse(xml.responseText);
            callback(data);
        }
    };
    xml.send(JSON.stringify({ chartdata: array }));
};

const postCallback = (data, coords, div) => {
    data.chart.forEach(obj => {
        div.setAttribute('data-chartid', obj.id);

        g.staticChartAttributes.push({
            report: obj.report,
            charttype: obj.charttype,
            cssclass: obj.cssclass
        });
        g.chartPositions.push({
            id: obj.id,
            dataId: obj.ordernumber,
            report: obj.report,
            charttype: obj.charttype,
            cssclass: obj.cssclass,
            width: coords.width,
            height: coords.height,
            x: coords.x,
            y: coords.y
        });
    });
};

const cssClassToChartType = (cssClass) => {
    return cssClass.charAt(0).toUpperCase() + cssClass.slice(1) + 'Chart';
};

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
                let graph = {};
                switch (selectedChartType) {
                    case 'area': graph = chart(g.reports[report], 'regular', 'AreaChart', state.div).getChart(); break;
                    case 'geo': graph = chart(g.reports[report], 'regular', 'GeoChart', state.div).getChart(); break;
                    case 'pie': graph = chart(g.reports[report], 'pie', 'PieChart', state.div).getChart(); break;
                    case 'line': graph = chart(g.reports[report], 'regular', 'LineChart', state.div).getChart(); break;
                    case 'bar': graph = chart(g.reports[report], 'regular', 'BarChart', state.div).getChart(); break;
                    default: graph = 'There are no charts here';
                }
                let size = chartSize(state.div).getSize();
                let { elWidth, elHeight } = size;
                const indx = availableIndex(elWidth, elHeight).get();
                let chartAttributes = {
                    div: state.div,
                    chart: graph,
                    type: cssClassToChartType(selectedChartType),
                    report: report,
                    indx: indx,
                    ordernumber: (Math.max(...g.dataId) + 1),
                    increment: (state.len + 1),
                    width: elWidth,
                    height: elHeight
                };
                let coords = placeCharts(chartAttributes).go();
                postRequest("api/?/charts", g.chartData, (data) => {
                    postCallback(data, coords, state.div);
                    g.chartData = [];
                });
            }
        }
    };
};
