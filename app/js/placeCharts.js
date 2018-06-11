const placeCharts = ({ div, chart, type, report, indx, increment, width, height }) => {
    return {
        go: () => {
            const chartPos = getGridPositions(indx, div).go();
            div.classList.add('dd-item', 'dd-transition');
            div.style.transform = `translate3d(${chartPos.x}px, ${chartPos.y}px,0px)`;
            g.wrap().appendChild(div);
            chart.draw();
            div.addEventListener('mousedown', chartMouseDown);
            div.addEventListener('mouseup', chartMouseUp);
            setTimeout(() => {
                const newEl = div.appendChild(document.createElement('i'));
                newEl.innerHTML = 'close';
                newEl.className += 'close-container md-36 material-icons';
                newEl.addEventListener('click', removeChart);
            }, 50);
            const chartData = {
                report: report,
                charttype: type,
                cssclass: type.substring(0, type.length - 5).toLowerCase(),
                x: chartPos.x,
                y: chartPos.y,
                slotPositions: chartPos.slot
            };
            const xml = new XMLHttpRequest();
            xml.open("POST", "api/?/charts");
            xml.onreadystatechange = () => {
                if (xml.readyState == XMLHttpRequest.DONE && xml.status == 200) {
                    const data = JSON.parse(xml.responseText);
                    div.setAttribute('data-id', data.id);
                    g.chartPositions[increment - 1] = {
                        dataId: data.id,
                        width: width,
                        height: height,
                        x: chartPos.x,
                        y: chartPos.y
                    };
                    g.dataId.push(data.id);
                    g.allCharts.push(chart);
                }
            };
            xml.send(chartData);
        }
    };
};