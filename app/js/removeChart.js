function removeChart() {
    console.log(this.parentElement.dataset.id);
    let id = (this.parentElement.dataset.id - 1);
    g.dataId.splice(id, 1);
    console.log(g.dataId);
}