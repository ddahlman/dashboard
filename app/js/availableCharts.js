const availableCharts = (typeOfCharts) => {
    const types = typeOfCharts;
    return {
        show: () => {
            [...document.querySelectorAll('.card2')].filter((chartBtn) => {
                var id = chartBtn.getAttribute('id');
                return types.some(arrVal => id === arrVal);
            }).map((btn, i) => {
                btn.style.display = 'block';
                btn.classList.add(`c${(i + 1)}`);
                return btn;
            });
        }
    };
};


const showAvailableCharts = (reportId) => {
    const id = reportId;
    return {
        go: () => {
            [...document.querySelectorAll('.card2')].map(chartBtn => chartBtn.style.display = 'none');
            switch (id) {
                case "sale": availableCharts(['bar', 'line', 'area', 'pie']).show(); break;
                case "expenditure": availableCharts(['bar', 'line', 'area', 'geo']).show(); break;
                case "nrOfVisitors": availableCharts(['bar', 'line', 'pie', 'geo']).show(); break;
                case "socialMedia": availableCharts(['bar', 'area', 'pie', 'geo']).show(); break;
                case "compiledInfo": availableCharts(['line', 'area', 'pie', 'geo']).show(); break;
                case "nationalities": availableCharts(['bar', 'line', 'area', 'geo']).show(); break;
                case "todaysEvent": availableCharts(['bar', 'line', 'area', 'geo']).show(); break;
                case "bookings": availableCharts(['bar', 'area', 'pie', 'line']).show(); break;
                case "mood": availableCharts(['bar', 'line', 'pie', 'geo']).show(); break;
                default: break;
            }
        }
    };
};