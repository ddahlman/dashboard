const chartSize = (el) => {
    const ele = el;
    return {
        getSize: () => {
            const widthPX = ele.style.width,
                heightPX = ele.style.height;
            const sizes = {
                elWidth: Math.round(widthPX.substring(0, widthPX.length - 2)),
                elHeight: Number(heightPX.substring(0, heightPX.length - 2))
            };
            return sizes;
        }
    };
};


const getSlotElem = (x, y) => document.querySelector(`[data-slot-x="${x}"][data-slot-y="${y}"]`);


const getGridPositions = (indx, div) => {
    const i = indx;
    const ele = div;
    let occupied = [];
    return {
        go: () => {
            let X = g.slotObjects[i];
            let size = chartSize(ele).getSize();
            let { elWidth, elHeight } = size;
            let [slotWidth, slotHeight] = [Math.round(X.width), X.height];

            if (g.mini.matches && elWidth === slotWidth && elHeight === slotHeight) {
                X.status = 'occupied';
                let slotElem = getSlotElem(X.xPos, X.yPos);
                slotElem.dataset.status = 'occupied';
            }
            else {
                const mediumArea = [X, g.slotObjects[i + 1], g.slotObjects[i + g.slotsPerRow()], g.slotObjects[(i + 1) + g.slotsPerRow()]];
                const largeArea = [g.slotObjects[i + 2], g.slotObjects[(i + 2) + g.slotsPerRow()],
                g.slotObjects[i + (g.slotsPerRow() * 2)], g.slotObjects[i + (g.slotsPerRow() * 2) + 1],
                g.slotObjects[i + (g.slotsPerRow() * 2) + 2]].concat(mediumArea);

                const mediumGeo = [].concat(largeArea);

                const largeGeo = [g.slotObjects[i + 3], g.slotObjects[(i + 3) + g.slotsPerRow()],
                g.slotObjects[i + (g.slotsPerRow() * 3)], g.slotObjects[i + (g.slotsPerRow() * 3) + 1],
                g.slotObjects[i + (g.slotsPerRow() * 3) + 2], g.slotObjects[i + (g.slotsPerRow() * 2) + 3],
                g.slotObjects[i + (g.slotsPerRow() * 3) + 3]].concat(largeArea);

                const mediumPie = [g.slotObjects[i + (g.slotsPerRow() * 2)], g.slotObjects[i + (g.slotsPerRow() * 2) + 1]].concat(mediumArea);

                const largePie = [g.slotObjects[i + (g.slotsPerRow() * 3)], g.slotObjects[i + (g.slotsPerRow() * 3) + 1],
                g.slotObjects[i + (g.slotsPerRow() * 3) + 2],].concat(largeArea);

                const sizeOfDiv = (match, nr1, nr2) => match && (elWidth === (slotWidth * nr1)) && (elHeight === (slotHeight * nr2));

                const occupy = (obj) => {
                    let elem = getSlotElem(obj.xPos, obj.yPos);
                    obj.status = 'occupied';
                    elem.dataset.status = 'occupied';
                    return { xPos: obj.xPos, yPos: obj.yPos };
                };

                switch (true) {
                    case sizeOfDiv(g.medium.matches, 2, 2): occupied = mediumArea.map(occupy); break;
                    case sizeOfDiv(g.medium.matches, 3, 3): occupied = mediumGeo.map(occupy); break;
                    case sizeOfDiv(g.medium.matches, 2, 3): occupied = mediumPie.map(occupy); break;
                    case sizeOfDiv(g.large.matches, 3, 3): occupied = largeArea.map(occupy); break;
                    case sizeOfDiv(g.large.matches, 4, 4): occupied = largeGeo.map(occupy); break;
                    case sizeOfDiv(g.large.matches, 3, 4): occupied = largePie.map(occupy); break;
                    default: break;
                }
            }
            return { x: X.x, y: X.y, width: elWidth, height: elHeight, slot: occupied };
        }
    };
};
