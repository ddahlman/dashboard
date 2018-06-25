const getChartIdByCoords = (coords) => {
    const chartPos = g.chartPositions;
    return {
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


const getIndexOfChartId = (id) => {
    const len = g.dataId.length;
    return {
        go: () => {
            for (let i = 0; i < len; i++) {
                if (g.dataId[i] === Number(id))
                    return i;
            }
        }
    };
};
