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
