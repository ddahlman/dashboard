g.box.addEventListener('click', function () {
    dynamicTabBar.layout();
    fixed_ripple.map(btn => btn.layout());
    g.removeBox.style.display = 'block';
    this.classList.add('open');
    g.pseudoCircle.classList.add('open');
    g.menu1.classList.add('show');
    g.toolbar.classList.add('open');
    g.toolbar.classList.remove('fade-out');
});


g.removeBox.addEventListener('click', function () {
    this.style.display = 'none';
    removeMenu();
});


[...document.querySelectorAll('.add-container-2')].map((card) => {
    card.addEventListener('click', function (e) {
        let reportId = this.id;
        g.container2.classList.remove('out-of-sight');
        g.toolbar.classList.add('fade-out');
        setTimeout(function () {
            g.container2.classList.add('shadow');
        }, 300);
        e.currentTarget.setAttribute('data-selected', 'selected');
        showAvailableCharts(reportId).go();
    });
});




[...document.querySelectorAll('.card2')].forEach((chartButton) => {
    chartButton.addEventListener('click', function () {
        const len = g.slotObjects.length;
        const doubleRow = 20;
        for (let i = 0; i < doubleRow; i++) {
            const newSlot = slot().createDiv(i + len);
            g.allSlots.push(newSlot);
            addSlotsToDOM(g.allSlots).go();
        }
        removeMenu();
        addChartToDOM(this).go();
        g.container2.classList.add('out-of-sight');
    });
});
