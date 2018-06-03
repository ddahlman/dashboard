function chartMouseDown(e) {
    if (!g.selected) {
        g.wrap().addEventListener('mousemove', chartMouseMove);
        g.selected = e.currentTarget;
        g.originalClickCoords = { x: e.pageX, y: e.pageY };
        g.originalIndex = getIndexOfChartId(g.selected.getAttribute('data-id')).go();
        g.selected.classList.add('dd-selected');
        g.selected.classList.remove('dd-transition');
        g.slotObjects.map(slot => slot.status = 'available');
        g.allSlots.map(slot => slot.dataset.status = 'available');
    }
}


function chartMouseMove(e) {
    if (g.selected) {
        let bounds = g.wrap().getBoundingClientRect(),
            left = bounds.left + document.documentElement.scrollLeft,
            top = bounds.top + document.documentElement.scrollTop;

        let pageX = e.pageX,
            pageY = e.pageY;

        let clickX = pageX - left,
            clickY = pageY - top,
            hoverChartIndex = getChartIdByCoords({ x: clickX, y: clickY }).go(),
            hoverSlotId = getSlotIdByCoords({ x: clickX, y: clickY }).go();

        let ele = g.selected,
            chartId = ele.getAttribute('data-id'),
            index = g.originalIndex,
            newIndex = getIndexOfChartId(chartId).go(),

            x = g.chartPositions[index].x,
            y = g.chartPositions[index].y;

        ele.childNodes[0].classList.add('shadow-elevated');

        let resultX = x + (pageX - g.originalClickCoords.x),
            resultY = y + (pageY - g.originalClickCoords.y);

        if (hoverChartIndex !== undefined && g.lastTouched !== hoverChartIndex) {
            g.lastTouched = hoverChartIndex;
            g.dataId.splice(hoverChartIndex, 0, g.dataId.splice(newIndex, 1)[0]);
            arrangeItems().go();
        }
        ele.style.transform = `translate3d(${resultX}px, ${resultY}px, 0)`;
    }
}


function chartMouseUp() {
    if (g.selected) {
        g.selected.classList.remove('dd-selected');
        g.selected.classList.add('dd-transition');
        g.selected.childNodes[0].classList.remove('shadow-elevated');
        g.selected = null;
        g.originalClickCoords = null;
        arrangeItemsMouseUp().go();
    }
}
