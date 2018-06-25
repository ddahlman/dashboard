const showAfterDelete = () => {
    let state = {
        increment: 0,
        allSlots: g.allSlots,
        slotObjects: g.slotObjects,
        chartPos: g.chartPositions,
        dataId: g.dataId
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
                        report: g.chartPositions[state.increment - 1].report,
                        charttype: g.chartPositions[state.increment - 1].charttype,
                        cssclass: g.chartPositions[state.increment - 1].cssclass,
                        width: pos.width,
                        height: pos.height,
                        x: pos.x,
                        y: pos.y,
                        slotpositions: pos.slot
                    };
                    putRequest("api/?/charts", {
                        id: id,
                        ordernumber: dataId,
                        report: g.chartPositions[state.increment - 1].report,
                        charttype: g.chartPositions[state.increment - 1].charttype,
                        cssclass: g.chartPositions[state.increment - 1].cssclass
                    });
                } else {
                    const indx = availableIndex(elWidth, elHeight).get();
                    pos = getGridPositions(indx, el).go();
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px,0px)`;
                    state.chartPos[state.increment - 1] = {
                        id: id,
                        dataId: Number(dataId),
                        report: g.chartPositions[state.increment - 1].report,
                        charttype: g.chartPositions[state.increment - 1].charttype,
                        cssclass: g.chartPositions[state.increment - 1].cssclass,
                        width: pos.width,
                        height: pos.height,
                        x: pos.x,
                        y: pos.y,
                        slotpositions: pos.slot
                    };
                    putRequest("api/?/charts", {
                        id: id,
                        ordernumber: dataId,
                        report: g.chartPositions[state.increment - 1].report,
                        charttype: g.chartPositions[state.increment - 1].charttype,
                        cssclass: g.chartPositions[state.increment - 1].cssclass
                    });
                }
            }
        })
    };
};


function removeChart() {
    const id = this.parentElement.dataset.chartid;
    const dataid = Number(this.parentElement.dataset.id);
    console.log(id);


    const xml = new XMLHttpRequest();
    xml.open("DELETE", `api/?/charts/${id}`);
    xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
            g.dataId.splice(g.dataId.indexOf(dataid), 1);
            console.log('detta är dataId: ' + dataid);
            const indx = g.chartPositions.findIndex(obj => obj.dataId === dataid);
            console.log('det här är g.chartPosition indx: ' + indx);
            g.chartPositions.splice(indx, 1);
            g.staticChartAttributes.splice(indx, 1);
            g.allSlots.map(slot => slot.dataset.status = 'available');
            g.slotObjects.map(obj => obj.status = 'available');
            console.log(g.dataId);
            console.log(g.chartPositions);
            console.log(g.staticChartAttributes);
            console.log(this.parentElement);
            g.wrap().removeChild(this.parentElement);
            showAfterDelete().go();
        }
    };
    xml.send();
}