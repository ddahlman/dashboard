const getChartIdByCoords = (coords) => {
    const chartPos = g.chartPositions;
    return {
        //get the current chart being hovered over  
        go: () => {
            for (var id in chartPos) {
                var chart = chartPos[id];
                if (chart.x <= coords.x &&
                    coords.x <= chart.x + chart.width &&
                    chart.y <= coords.y &&
                    coords.y <= chart.y + chart.height)
                    return id;
            }
        }
    };
};

const getSlotIdByCoords = (coords) => {
    const slotObjects = g.slotObjects;
    return {
        //get the current slot being hovered over  
        go: () => {
            for (var id in slotObjects) {
                var slot = slotObjects[id];
                if (slot.x <= coords.x &&
                    coords.x <= slot.x + slot.width &&
                    slot.y <= coords.y &&
                    coords.y <= slot.y + slot.height)
                    return id;
            }
        }
    };
};


const getIndexOfChartId = (id) => {
    const len = g.dataId.length;
    /* console.log(g.dataId.length); */
    return {
        go: () => {
            for (let i = 0; i < len; i++) {
                /* console.log(typeof g.dataId[i], typeof Number(id)); */
                if (g.dataId[i] === Number(id))
                    return i;
            }
        }
    };
};
