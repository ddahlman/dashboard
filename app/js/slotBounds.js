const slotBounds = (num) => {
    let state = {
        wrapBounds: g.wrap().getBoundingClientRect(),
        slotSize: document.getElementsByClassName('dd-slot')[0].getBoundingClientRect(),
        num
    };
    return Object.assign(
        {},
        slotWidth(state),
        slotHeight(state),
        addToSlotObjects(state)
    );
};

const slotWidth = (state) => ({
    width: () => {
        switch (state.num) {
            case 1: return state.slotSize.width;
            case 2: return state.slotSize.width * 2;
            case 3: return state.slotSize.width * 3;
            case 4: return state.slotSize.width * 4;
            default: break;
        }
    }
});

const slotHeight = (state) => ({
    height: () => {
        switch (state.num) {
            case 1: return state.slotSize.height;
            case 2: return state.slotSize.height * 2;
            case 3: return state.slotSize.height * 3;
            case 4: return state.slotSize.height * 4;
            default: break;
        }
    }
});

const addToSlotObjects = (state) => ({
    add: () => [...document.getElementsByClassName('dd-slot')].forEach((item, i) => {
        const slotBound = item.getBoundingClientRect();
        Object.assign(g.slotObjects[i], {
            y: slotBound.top - state.wrapBounds.top,
            x: slotBound.left - state.wrapBounds.left,
            bottom: slotBound.bottom - state.wrapBounds.bottom,
            right: slotBound.right - state.wrapBounds.right,
            width: slotBound.width,
            height: slotBound.height
        });
    })
});


const addSlotsToDOM = (array) => {
    let arr = array;
    return {
        go: () => {
            arr.forEach((slot, i) => {
                g.wrap().appendChild(slot);
            });
            slotBounds().add();
        }
    };
};
