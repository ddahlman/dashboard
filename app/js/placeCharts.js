
const addAttributesToChart = (div, pos, chart) => {
    div.classList.add('dd-item', 'dd-transition');
    div.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
    g.wrap().appendChild(div);
    div.addEventListener('mousedown', chartMouseDown);
    div.addEventListener('mouseup', chartMouseUp);
    chart.draw();
    setTimeout(() => {
        const newEl = div.appendChild(document.createElement('i'));
        newEl.innerHTML = 'close';
        newEl.className += 'close-container md-36 material-icons';
        newEl.addEventListener('click', removeChart);
    }, 50);
};


const placeCharts = ({ div, chart, type, report, indx, increment, width, height }) => {
    return {
        go: () => {
            const chartPos = getGridPositions(indx, div).go();
            addAttributesToChart(div, chartPos, chart);
            div.setAttribute('data-id', increment);
            const chartData = {
                ordernumber: increment,
                report: report,
                charttype: type,
                cssclass: type.substring(0, type.length - 5).toLowerCase()/* ,
                x: chartPos.x,
                y: chartPos.y,
                slotpositions: chartPos.slot */
            };
            /* console.log(`${chartData.x}, ${chartData.y}`); */
            const xml = new XMLHttpRequest();
            xml.open("POST", "api/?/charts");
            xml.onreadystatechange = () => {
                if (xml.readyState == 4 && xml.status == 200) {
                    const data = JSON.parse(xml.responseText);
                    div.setAttribute('data-chartid', data.id);

                    g.staticChartAttributes[increment - 1] = {
                        report: data.report,
                        charttype: data.charttype,
                        cssclass: data.cssclass
                    };
                    g.chartPositions[increment - 1] = {
                        id: data.id,
                        dataId: increment,
                        report: data.report,
                        charttype: data.charttype,
                        cssclass: data.cssclass,
                        width: width,
                        height: height,
                        x: chartPos.x,
                        y: chartPos.y,
                        slotpositions: chartPos.slot
                    };
                }
            };
            xml.send(JSON.stringify(chartData));

            g.allCharts.push(chart);
            g.dataId.push(increment);
        }
    };
};