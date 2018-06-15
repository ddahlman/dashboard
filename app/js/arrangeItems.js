const putRequest = (url, sendArgs) => {
    const xml = new XMLHttpRequest();
    xml.open("PUT", url);
    xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
            const data = JSON.parse(xml.responseText);
            /* console.log('putRequest: ' + data); */
        }
    };
    xml.send(JSON.stringify(sendArgs));
};



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
        dataId: g.dataId,
        arrangedItems: g.arrangedItems
    };
    return {
        go: () => state.allSlots.map((slot, i) => {
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
                let id = g.chartPositions[state.increment - 1].id;
                if (isNotOverlapping(i, elWidth, elHeight).check()) {
                    pos = getGridPositions(i, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = {
                        id: id,
                        dataId: Number(dataId),
                        report: g.staticChartAttributes[state.increment - 1].report,
                        charttype: g.staticChartAttributes[state.increment - 1].charttype,
                        cssclass: g.staticChartAttributes[state.increment - 1].cssclass,
                        width: pos.width,
                        height: pos.height,
                        x: pos.x,
                        y: pos.y,
                        slotpositions: pos.slot
                    };
                    putRequest("api/?/charts", {
                        id: id,
                        ordernumber: dataId,
                        report: g.staticChartAttributes[state.increment - 1].report,
                        charttype: g.staticChartAttributes[state.increment - 1].charttype,
                        cssclass: g.staticChartAttributes[state.increment - 1].cssclass,
                        x: pos.x,
                        y: pos.y,
                        slotpositions: pos.slot
                    });
                } else {
                    const indx = availableIndex(elWidth, elHeight).get();
                    pos = getGridPositions(indx, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = {
                        id: id,
                        dataId: Number(dataId),
                        report: g.staticChartAttributes[state.increment - 1].report,
                        charttype: g.staticChartAttributes[state.increment - 1].charttype,
                        cssclass: g.staticChartAttributes[state.increment - 1].cssclass,
                        width: pos.width,
                        height: pos.height,
                        x: pos.x,
                        y: pos.y,
                        slotpositions: pos.slot
                    };
                    putRequest("api/?/charts", {
                        id: id,
                        ordernumber: dataId,
                        report: g.staticChartAttributes[state.increment - 1].report,
                        charttype: g.staticChartAttributes[state.increment - 1].charttype,
                        cssclass: g.staticChartAttributes[state.increment - 1].cssclass,
                        x: pos.x,
                        y: pos.y,
                        slotpositions: pos.slot
                    });
                }
                console.log({
                    id: g.chartPositions[state.increment - 1].id,
                    ordernumber: dataId,
                    report: g.staticChartAttributes[state.increment - 1].report,
                    charttype: g.staticChartAttributes[state.increment - 1].charttype,
                    cssclass: g.staticChartAttributes[state.increment - 1].cssclass,
                    x: pos.x,
                    y: pos.y,
                    slotpositions: pos.slot
                });
                /*  console.log({ id: g.dataId.indexOf(id) + 1, ordernumber: dataId, x: pos.x, y: pos.y, slotpositions: pos.slot }); */
                /* console.log(g.chartPositions[dataId - 1]); */
                /* console.log(g.dataId); */
            }
        })
    };
};

