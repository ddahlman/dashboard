function addFirstCharts() {
    const firstSlots = slot(70).createArray();
    const addFirstSlots = addSlotsToDOM(firstSlots).go();
    g.allSlots.push(...firstSlots);

    const divArray = [
        chartDiv('area').createDiv(),
        chartDiv('geo').createDiv(),
        chartDiv('pie').createDiv()
    ];
    const xml = new XMLHttpRequest();
    xml.open("GET", "api/?/reports");
    xml.onload = () => {
        if (xml.status >= 200 && xml.status < 400) {
            const data = JSON.parse(xml.responseText);
            Object.assign(g.reports, data.reports);
            const chartArray = [
                chart(data.reports.sale, 'regular', 'AreaChart', divArray[0]).getChart(),
                chart(data.reports.nationalities, 'regular', 'GeoChart', divArray[1]).getChart(),
                chart(data.reports.bookings, 'pie', 'PieChart', divArray[2]).getChart()
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
        } else {
            let div = document.body.appendChild(document.createElement('h1'));
            div.setAttribute('style', 'color: #ff0000; font: 70px bold arial;');
            div.innerHTML = 'Det gick tyvärr inte att hämta data...';
        }
    };
    xml.send();
}