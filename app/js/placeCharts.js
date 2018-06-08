const placeCharts = ({ div, chart, indx, increment, width, height }) => {
    return {
        go: () => {
            const chartPos = getGridPositions(indx, div).go();
            div.classList.add('dd-item', 'dd-transition');
            div.style.transform = `translate3d(${chartPos.x}px, ${chartPos.y}px,0px)`;
            div.setAttribute('data-id', increment);
            g.wrap().appendChild(div);
            chart.draw();
            div.addEventListener('mousedown', chartMouseDown);
            div.addEventListener('mouseup', chartMouseUp);
            setTimeout(() => {
                const newEl = div.appendChild(document.createElement('i'));
                newEl.innerHTML = 'close';
                newEl.classList.add('close-container', 'md-36', 'material-icons');
                newEl.addEventListener('click', removeChart);
            }, 50);
            g.chartPositions[increment - 1] = {
                dataId: div.getAttribute('data-id'),
                width: width,
                height: height,
                x: chartPos.x,
                y: chartPos.y
            };
            g.dataId.push(div.dataset.id);
            g.allCharts.push(chart);
        }
    };
};