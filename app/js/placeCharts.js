
const addAttributesToChart = (div, pos, chart) => {
    div.classList.add('dd-item', 'dd-transition');
    div.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
    g.wrap().appendChild(div);
    div.addEventListener('mousedown', chartMouseDown);
    div.addEventListener('mouseup', chartMouseUp);
    chart.draw();
    setTimeout(() => {
        div.childNodes[0].classList.add('chart-styles');
        const newEl = div.appendChild(document.createElement('i'));
        newEl.innerHTML = 'close';
        newEl.className += 'close-container md-36 material-icons';
        newEl.addEventListener('click', removeChart);
    }, 50);
};




const placeCharts = ({ div, chart, type, report, indx, ordernumber, width, height }) => {
    return {
        go: () => {
            const chartPos = getGridPositions(indx, div).go();
            addAttributesToChart(div, chartPos, chart);
            div.setAttribute('data-id', ordernumber);

            const chartData = {
                ordernumber: ordernumber,
                report: report,
                charttype: type,
                cssclass: type.substring(0, type.length - 5).toLowerCase()
            };
            g.chartData.push(chartData);
            g.allCharts.push(chart);
            g.dataId.push(ordernumber);
            return { x: chartPos.x, y: chartPos.y, width: width, height: height, div };
        }
    };
};