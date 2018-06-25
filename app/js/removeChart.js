

function removeChart() {
    const id = this.parentElement.dataset.chartid;
    const dataid = Number(this.parentElement.dataset.id);

    const xml = new XMLHttpRequest();
    xml.open("DELETE", `api/?/charts/${id}`);
    xml.onreadystatechange = () => {
        if (xml.readyState == 4 && xml.status == 200) {
            g.dataId.splice(g.dataId.indexOf(dataid), 1);
            const indx = g.chartPositions.findIndex(obj => obj.dataId === dataid);
            g.chartPositions.splice(indx, 1);
            g.staticChartAttributes.splice(indx, 1);
            g.allSlots.map(slot => slot.dataset.status = 'available');
            g.slotObjects.map(obj => obj.status = 'available');
            g.wrap().removeChild(this.parentElement);
            rearrangeItems(g.chartPositions).go();
        }
    };
    xml.send();
}