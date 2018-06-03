const slot = (num) => {
    let state = {
        num,
        aspectWidth: 1920,
        aspectHeight: 1080
    };
    return Object.assign(
        {},
        createSlotDiv(state),
        createDivArray(state)
    );
};

const round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

const createSlotDiv = (state) => ({
    createDiv: (indx) => {
        let div = document.createElement('div');
        const aspectRatio = (state.aspectHeight / state.aspectWidth);
        div.setAttribute('style', `width: ${100 / g.slotsPerRow()}%; padding-bottom: ${(100 / g.slotsPerRow()) * (round(aspectRatio, 1))}%;`);
        div.setAttribute('class', 'dd-slot');

        let slotProp = {
            xPos: Math.floor(indx / g.slotsPerRow()) + 1,
            yPos: (indx % g.slotsPerRow()) + 1,
            status: 'available'
        };

        g.slotObjects.push(slotProp);
        div.setAttribute('data-slot-x', g.slotObjects[indx].xPos);
        div.setAttribute('data-slot-y', g.slotObjects[indx].yPos);
        div.setAttribute('data-status', g.slotObjects[indx].status);
        return div;
    }
});

const createDivArray = (state) => ({
    createArray: () => [...Array(state.num)].map((el, i) => slot().createDiv(i))
});
