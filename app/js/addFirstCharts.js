


const getChartsFromDB = () => {
    const xml = new XMLHttpRequest();
    xml.open("GET", "api/?/charts");
    xml.onload = () => {
        if (xml.status >= 200 && xml.status < 400) {
            const data = JSON.parse(xml.responseText);
            Object.assign(g.chartsFromDB, data);
        }
        else {
            let div = document.body.appendChild(document.createElement('h1'));
            div.setAttribute('style', 'color: #ff0000; font: 70px bold arial;');
            div.innerHTML = 'Det gick tyvärr inte att hämta data...';
        }
    };
    xml.send();
};


const getMySavedCharts = (data) => {
    const reports = data;
    const chartObjects = g.chartsFromDB.chart;
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
            const firstSlots = slotArray();
            const addFirstSlots = addSlotsToDOM(firstSlots).go();
            g.allSlots.push(...firstSlots);

            const divArray = chartObjects.map(obj => {
                return chartDiv(obj.cssclass).createDiv();
            });
            const chartArray = chartObjects.map((obj, i) => {
                return chart(reports[obj.report], obj.cssclass, obj.charttype, divArray[i]).getChart();
            });
            let increment = 0;
            g.allSlots.forEach((slotItem, i, arr) => {
                if (g.slotObjects[i].status === 'occupied') return;
                increment++;

            });
        }
    };
};




function addFirstCharts() {
    const xml = new XMLHttpRequest();
    xml.open("GET", "api/?/reports");
    xml.onload = () => {
        if (xml.status >= 200 && xml.status < 400) {
            const data = JSON.parse(xml.responseText);
            Object.assign(g.reports, data.reports);
            getChartsFromDB();
            if (g.chartsFromDB.chart) {
                getMySavedCharts(data.reports).go();
            }
            else {
                const firstSlots = slot(70).createArray();
                const addFirstSlots = addSlotsToDOM(firstSlots).go();
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
            }
        }
        else {
            let div = document.body.appendChild(document.createElement('h1'));
            div.setAttribute('style', 'color: #ff0000; font: 70px bold arial;');
            div.innerHTML = 'Det gick tyvärr inte att hämta data...';
        }
    };
    xml.send();
}