
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
            const chartData = {
                report: report,
                charttype: type,
                cssclass: type.substring(0, type.length - 5).toLowerCase(),
                x: chartPos.x,
                y: chartPos.y,
                slotpositions: chartPos.slot
            };
            const xml = new XMLHttpRequest();
            xml.open("POST", "api/?/charts");
            xml.onreadystatechange = () => {
                if (xml.readyState == XMLHttpRequest.DONE && xml.status == 200) {
                    const data = JSON.parse(xml.responseText);
                    console.log(data);
                    div.setAttribute('data-id', data.id);
                    g.chartPositions[increment - 1] = {
                        dataId: data.id,
                        width: width,
                        height: height,
                        x: chartPos.x,
                        y: chartPos.y
                    };
                    g.dataId.push(data.id);
                }
            };
            xml.send(JSON.stringify(chartData));
            g.allCharts.push(chart);
        }
    };
};