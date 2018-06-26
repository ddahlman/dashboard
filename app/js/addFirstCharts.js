


const getRequest = (url, callback) => {
    const xml = new XMLHttpRequest();
    xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
            const data = JSON.parse(xml.responseText);
            callback(data);
        }
    };
    xml.open("GET", url);
    xml.send();
};

const progressBar = () => {
    const h1 = document.querySelector('.loading h1');
    const hr = document.querySelector('.loading hr');
    document.querySelector('.dots').style.display = 'none';
    [h1, hr].map(ele => ele.classList.remove('hidden'));

    let counter = 0;
    let c = 0;

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
    setTimeout(() => {
        g.firstLoader.style.display = 'none';
    }, 3000);
};


const getMySavedCharts = (chartResponse) => {
    const chartObjects = chartResponse.chart;
    const len = chartObjects.length;
    const slotArray = () => {
        switch (true) {
            case len < 5: return slot(90).createArray();
            case len > 4 && len < 7: return slot(130).createArray();
            case len > 6 && len < 11: return slot(210).createArray();
            default: return slot(300).createArray();
        }
    };
    return {
        go: () => {
            getRequest("api/?/reports", (reports) => {
                Object.assign(g.reports, reports.reports);
                progressBar();

                const firstSlots = slotArray();
                addSlotsToDOM(firstSlots).go();
                g.allSlots.push(...firstSlots);

                let increment = 0;
                g.allSlots.forEach((slotItem, i) => {
                    if (g.slotObjects[i].status === 'occupied') return;
                    increment++;
                    if (chartObjects[increment - 1]) {
                        let obj = chartObjects[increment - 1];
                        let div = chartDiv(obj.cssclass).createDiv();
                        div.setAttribute('data-id', obj.ordernumber);
                        div.setAttribute('data-chartid', obj.id);
                        let size = chartSize(div).getSize();
                        let { elWidth, elHeight } = size;
                        const ordernumber = Number(obj.ordernumber);

                        g.staticChartAttributes[increment - 1] = { report: obj.report, charttype: obj.charttype, cssclass: obj.cssclass };
                        let diagram = chart(reports.reports[obj.report], (obj.cssclass === 'pie' ? 'pie' : 'regular'), obj.charttype, div).getChart();
                        let pos;
                        if (isNotOverlapping(i, elWidth, elHeight).check()) {
                            pos = getGridPositions(i, div).go();
                            addAttributesToChart(div, pos, diagram);
                            g.chartPositions[increment - 1] = {
                                id: obj.id,
                                dataId: ordernumber,
                                report: obj.report,
                                charttype: obj.charttype,
                                cssclass: obj.cssclass,
                                width: elWidth,
                                height: elHeight,
                                x: pos.x,
                                y: pos.y
                            };
                        } else {
                            const indx = availableIndex(elWidth, elHeight).get();
                            pos = getGridPositions(indx, div).go();
                            addAttributesToChart(div, pos, diagram);
                            g.chartPositions[increment - 1] = {
                                id: obj.id,
                                dataId: ordernumber,
                                report: obj.report,
                                charttype: obj.charttype,
                                cssclass: obj.cssclass,
                                width: elWidth,
                                height: elHeight,
                                x: pos.x,
                                y: pos.y
                            };
                        }
                        g.dataId.push(ordernumber);
                        g.allCharts.push(diagram);
                    }
                });
            });
        }
    };
};


function addFirstCharts() {
    getRequest("api/?/charts", (chartObjects) => {
        console.log(chartObjects.chart !== undefined && chartObjects.chart.length > 0);
        if (chartObjects.chart !== undefined && chartObjects.chart.length > 0) {
            getMySavedCharts(chartObjects).go();
        } else {
            getRequest("api/?/reports", (data) => {
                progressBar();
                Object.assign(g.reports, data.reports);

                const firstSlots = slot(70).createArray();
                addSlotsToDOM(firstSlots).go();
                g.allSlots.push(...firstSlots);

                const divArray = [
                    chartDiv('area').createDiv(),
                    chartDiv('geo').createDiv(),
                    chartDiv('pie').createDiv()
                ];
                const chartArray = [
                    chart(data.reports.sale, 'regular', 'AreaChart', divArray[0]).getChart(),
                    chart(data.reports.nationalities, 'regular', 'GeoChart', divArray[1]).getChart(),
                    chart(data.reports.bookings, 'pie', 'PieChart', divArray[2]).getChart()
                ];
                const typeArray = ['AreaChart', 'GeoChart', 'PieChart'];
                const reportArray = ['sale', 'nationalities', 'bookings'];
                let increment = 0;
                let coords = [];

                g.allSlots.forEach((slotItem, i) => {
                    if (g.slotObjects[i].status === 'occupied') return;
                    increment++;
                    if (divArray[increment - 1] && chartArray[increment - 1] && typeArray[increment - 1] && reportArray[increment - 1]) {
                        let size = chartSize(divArray[increment - 1]).getSize();
                        let { elWidth, elHeight } = size;
                        let chartAttributes = {
                            div: divArray[increment - 1],
                            chart: chartArray[increment - 1],
                            type: typeArray[increment - 1],
                            report: reportArray[increment - 1],
                            indx: i,
                            ordernumber: increment,
                            increment: increment,
                            width: elWidth,
                            height: elHeight
                        };
                        coords.push(placeCharts(chartAttributes).go());
                    }
                });
                postRequest("api/?/charts", g.chartData, (data) => {
                    data.chart.forEach((obj, i) => {
                        coords[i].div.setAttribute('data-chartid', obj.id);

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
                            width: coords[i].width,
                            height: coords[i].height,
                            x: coords[i].x,
                            y: coords[i].y
                        });
                    });
                    g.chartData = [];
                });
            });
        }
    });
}