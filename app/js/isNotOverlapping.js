const isNotOverlapping = (i, chartWidth, chartHeight) => {
    let state = {
        indx: i,
        width: chartWidth,
        height: chartHeight,
        width1: round(slotBounds(1).width(), 1),
        width2: round(slotBounds(2).width(), 1),
        width3: round(slotBounds(3).width(), 1),
        width4: round(slotBounds(4).width(), 1),
        height1: slotBounds(1).height(),
        height2: slotBounds(2).height(),
        height3: slotBounds(3).height(),
        height4: slotBounds(4).height(),
        yPos: g.slotObjects[i].yPos,
        X: g.slotObjects[i].status,
        X1: () => g.medium.matches || g.large.matches ? g.slotObjects[i + 1].status : '',
        X2: () => g.medium.matches || g.large.matches ? g.slotObjects[i + 2].status : '',
        X3: () => g.medium.matches || g.large.matches ? g.slotObjects[i + 3].status : '',
        Y1: () => g.medium.matches || g.large.matches ? g.slotObjects[i + g.slotsPerRow()].status : '',
        Y2: () => g.medium.matches || g.large.matches ? g.slotObjects[i + (g.slotsPerRow() * 2)].status : '',
        Y3: () => g.medium.matches || g.large.matches ? g.slotObjects[i + (g.slotsPerRow() * 3)].status : ''
    };
    return {
        check: () => {
            const checkSize = (stateWidth, stateHeight, match) => state.width === stateWidth && state.height === stateHeight && match;

            switch (true) {
                case checkSize(state.width1, state.height1, g.mini.matches): return state.X === 'available';
                case checkSize(state.width2, state.height2, g.medium.matches):
                    return state.yPos < 5 && [state.X, state.X1(), state.Y1(), state.Y2()].every(el => el === 'available');
                case checkSize(state.width3, state.height3, g.medium.matches):
                    return state.yPos < 4 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2()].every(el => el === 'available');
                case checkSize(state.width2, state.height3, g.medium.matches):
                    return state.yPos < 5 && [state.X, state.X1(), state.Y1(), state.Y2()].every(el => el === 'available');
                case checkSize(state.width3, state.height3, g.large.matches):
                    return state.yPos < 9 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2()].every(el => el === 'available');
                case checkSize(state.width3, state.height4, g.large.matches):
                    return state.yPos < 9 && [state.X, state.X1(), state.X2(), state.Y1(), state.Y2(), state.Y3()].every(el => el === 'available');
                case checkSize(state.width4, state.height4, g.large.matches):
                    return state.yPos < 8 && [state.X, state.X1(), state.X2(), state.X3(), state.Y1(), state.Y2(), state.Y3()].every(el => el === 'available');
            }
        }
    };
};
