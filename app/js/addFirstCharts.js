


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
                const firstSlots = slotArray();
                addSlotsToDOM(firstSlots).go();
                g.allSlots.push(...firstSlots);
                console.log(chartObjects.map(obj => { return { x: obj.x, y: obj.y }; }));
                chartObjects.map((obj, i) => {
                    let div = chartDiv(obj.cssclass).createDiv();
                    div.setAttribute('data-id', obj.id);
                    let size = chartSize(div).getSize();
                    let { elWidth, elHeight } = size;
                    g.chartPositions[i] = {
                        dataId: Number(obj.id),
                        width: elWidth,
                        height: elHeight,
                        x: Number(obj.x),
                        y: Number(obj.y)
                    };
                    let diagram = chart(reports.reports[obj.report], (obj.cssclass === 'pie' ? 'pie' : 'regular'), obj.charttype, div).getChart();
                    addAttributesToChart(div, obj, diagram);
                    g.dataId.push(Number(obj.id));
                    g.allCharts.push(diagram);
                });
                const occupied = chartObjects.map(obj => {
                    return obj.slotpositions;
                }).reduce((arr, elem) => {
                    return arr.concat(elem);
                }, []);
                g.slotObjects.filter(obj => {
                    return occupied.some(o => o.xPos === obj.xPos && o.yPos === obj.yPos);
                }).map(obj => {
                    let elem = getSlotElem(obj.xPos, obj.yPos);
                    obj.status = 'occupied';
                    elem.dataset.status = 'occupied';
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
                            increment: increment,
                            width: elWidth,
                            height: elHeight
                        };
                        placeCharts(chartAttributes).go();
                    }
                });
            });
        }
    });
}