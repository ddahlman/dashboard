
const changeOnResize = (slotsPerRow, slotWidth, slotHeight) => {
    let state = {
        perRow: slotsPerRow,
        slotWidth: slotWidth,
        slotHeight: slotHeight
    };
    return Object.assign(
        {},
        drawSlots(state),
        drawDivs(state),
        drawCharts(state)
    );
};

const drawSlots = (state) => ({
    slots: () => {
        g.allSlots.map((slot, i, arr) => {
            const aspectRatio = (g.aspectHeight / g.aspectWidth);
            slot.setAttribute('style',
                `width: ${100 / state.perRow}%; padding-bottom: ${(100 / state.perRow) * (round(aspectRatio, 1))}%;`);
            slot.dataset.status = 'available';
            g.slotObjects[i].status = 'available';
            g.slotObjects[i].xPos = Math.floor(i / state.perRow) + 1;
            g.slotObjects[i].yPos = (i % state.perRow) + 1;
            g.slotObjects[i].width = state.slotWidth;
            g.slotObjects[i].height = state.slotHeight;
            arr[i].dataset.slotX = g.slotObjects[i].xPos;
            arr[i].dataset.slotY = g.slotObjects[i].yPos;
        });
        setTimeout(() => {
            const wrapBounds = g.wrap().getBoundingClientRect();
            [...document.getElementsByClassName('dd-slot')].forEach((slot, i) => {
                const bounds = slot.getBoundingClientRect();
                g.slotObjects[i].y = bounds.top - wrapBounds.top;
                g.slotObjects[i].x = bounds.left - wrapBounds.left;
            });
        }, 200);
    }
});

const drawDivs = (state) => ({
    divs: () => {
        let increment = 0;
        g.allSlots.map((slot, i) => {
            if (g.slotObjects[i].status === 'occupied') return;
            increment++;
            if (g.dataId[increment - 1] !== undefined) {
                let dataId = g.dataId[increment - 1];
                let el = document.querySelector(`[data-id="${dataId}"]`);
                if (g.wrap().style.width === '1400px') {
                    switch (true) {
                        case el.classList.contains('area') || el.classList.contains('line'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 3}px; height:${state.slotHeight * 3}px;`);
                            break;
                        case el.classList.contains('geo') || el.classList.contains('bar'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 4}px; height:${state.slotHeight * 4}px;`);
                            break;
                        case el.classList.contains('pie'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 3}px; height:${state.slotHeight * 4}px;`);
                            break;
                    }
                }
                if (g.wrap().style.width === '700px') {
                    switch (true) {
                        case el.classList.contains('area') || el.classList.contains('line'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 2}px; height:${state.slotHeight * 2}px;`);
                            break;
                        case el.classList.contains('geo') || el.classList.contains('bar'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 3}px; height:${state.slotHeight * 3}px;`);
                            break;
                        case el.classList.contains('pie'):
                            el.setAttribute('style',
                                `width:${state.slotWidth * 2}px; height:${state.slotHeight * 3}px;`);
                            break;
                    }
                }
                if (g.wrap().style.width === '300px') {
                    el.setAttribute('style', `width:${state.slotWidth}px; height:${state.slotHeight}px;`);
                }
                let size = chartSize(el).getSize();
                let { elWidth, elHeight } = size;
                let pos;
                if (isNotOverlapping(i, elWidth, elHeight).check()) {
                    pos = getGridPositions(i, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    g.chartPositions[increment - 1] = { dataId: Number(dataId), width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                } else {
                    const indx = availableIndex(elWidth, elHeight).get();
                    pos = getGridPositions(indx, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    g.chartPositions[increment - 1] = { dataId: Number(dataId), width: pos.width, height: pos.height, x: pos.x, y: pos.y };
                }
            }
        });
    }
});

const drawCharts = (state) => ({
    charts: () => {
        g.allCharts.map(chart => chart.draw());
    }
});


const resize = (rows, slotWidth, slotHeight) => {
    g.wrap();
    changeOnResize(rows, slotWidth, slotHeight).slots();
    setTimeout(() => {
        changeOnResize(rows, slotWidth, slotHeight).divs();
    }, 200);
    setTimeout(() => {
        changeOnResize().charts();
    }, 500);
};



const sizerArray = [g.mini, g.medium, g.large];
sizerArray.forEach((mq, i, arr) => {
    mq.addListener((e) => {
        if (e.matches) {
            if (e.media === "screen and (max-width:400px)" || e.media === "screen and (max-width: 400px)") {
                resize(1, 300, 180);
            }
            if (e.media === g.chromeMediaMedium || e.media === g.mozMediaMedium || e.media === g.msMediaMedium) {
                resize(5, 140, 84);
            }
            if (e.media === "screen and (min-width:1200px)" || e.media === "screen and (min-width: 1200px)") {
                resize(10, 140, 84);
            }
        }
    });
});
