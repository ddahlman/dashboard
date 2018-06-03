const availableIndex = (width, height) => {
    const w = width;
    const h = height;
    return {
        get: () => g.allSlots.findIndex((slot, i) => !isNotOverlapping(i, w, h).check() ? '' : i)
    };
};


const arrangeItems = () => {
    let state = {
        dataId: g.dataId,
        chartPos: g.chartPositions
    };
    return {
        go: () => state.dataId.forEach((dataId, i) => {
            let pos = state.chartPos[i];
            let el = document.querySelector(`[data-id="${dataId}"]`);
            el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0px)`;
        })
    };
};


const arrangeItemsMouseUp = () => {
    let state = {
        increment: 0,
        allSlots: g.allSlots,
        slotObjects: g.slotObjects,
        chartPos: g.chartPositions,
        dataId: g.dataId
    };
    return {
        go: () => state.allSlots.map((slot, i, arr) => {
            if (state.slotObjects[i].status === 'occupied') {
                return;
            }
            state.increment++;
            if (state.dataId[state.increment - 1] !== undefined) {
                let dataId = state.dataId[state.increment - 1];
                let el = document.querySelector(`[data-id="${dataId}"]`);
                let size = chartSize(el).getSize();
                let { elWidth, elHeight } = size;
                let pos;
                if (isNotOverlapping(i, elWidth, elHeight).check()) {
                    pos = getGridPositions(i, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                } else {
                    const indx = availableIndex(elWidth, elHeight).get();
                    pos = getGridPositions(indx, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = { dataId: dataId, width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                }
            }
        })
    };
};