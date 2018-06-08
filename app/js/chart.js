const pieFunction = (obj, chart) => {
    let state = { obj, chart };
    return {
        go: () => {
            state.obj.options.pieStartAngle = 0;
            google.visualization.events.addListener(state.chart, 'ready', function () {
                if (state.obj.options.pieStartAngle < 10) {
                    state.obj.options.pieStartAngle++;
                    setTimeout(function () {
                        state.chart.draw(state.obj.data, state.obj.options);
                    }, 0);
                }
            });
            state.chart.draw(state.obj.data, state.obj.options);
        }
    };
};



const chart = (response, optionType, type, div) => {
    let state = { response, optionType, type, div };
    return {
        getChart: () => {
            const obj = {};
            obj.data = new google.visualization.DataTable(state.response.data);
            obj.options = state.response.options[state.optionType];
            let chart = new google.visualization[state.type](state.div);
            switch (state.type) {
                case 'PieChart':
                    obj.draw = () => pieFunction(obj, chart).go();
                    break;
                default:
                    obj.draw = () => chart.draw(obj.data, obj.options);
                    break;
            }
            return obj;
        }
    };
};

const chartDiv = (cssClass) => {
    let state = {
        cssClass,
        width1: slotBounds(1).width(),
        width2: slotBounds(2).width(),
        width3: slotBounds(3).width(),
        width4: slotBounds(4).width(),
        height1: slotBounds(1).height(),
        height2: slotBounds(2).height(),
        height3: slotBounds(3).height(),
        height4: slotBounds(4).height()
    };
    return {
        createDiv: () => {
            let div = document.createElement('div');
            if (g.large.matches) {
                switch (cssClass) {
                    case 'area': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                    case 'geo': div.setAttribute('style', `width:${state.width4}px; height:${state.height4}px;`); break;
                    case 'pie': div.setAttribute('style', `width:${state.width3}px; height:${state.height4}px;`); break;
                    case 'line': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                    case 'bar': div.setAttribute('style', `width:${state.width4}px; height:${state.height4}px;`); break;
                    default: break;
                }
            }
            if (g.medium.matches) {
                switch (cssClass) {
                    case 'area': div.setAttribute('style', `width:${state.width2}px; height:${state.height2}px;`); break;
                    case 'geo': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                    case 'pie': div.setAttribute('style', `width:${state.width2}px; height:${state.height3}px;`); break;
                    case 'line': div.setAttribute('style', `width:${state.width2}px; height:${state.height2}px;`); break;
                    case 'bar': div.setAttribute('style', `width:${state.width3}px; height:${state.height3}px;`); break;
                    default: break;
                }
            }
            if (g.mini.matches) {
                div.setAttribute('style', `width:${state.width1}px; height:${state.height1}px;`);
            }
            div.classList.add(state.cssClass);
            return div;
        }
    };
};
