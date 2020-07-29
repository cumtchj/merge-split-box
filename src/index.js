import Grid from './grid/index'

class MergeSplitBox {
  constructor(container, row, col, style) {
    this._container =
      typeof container === "string" ?
        container.startsWith("#") ?
          document.querySelector(container) :
          container.startsWith(".") ?
            document.querySelector(container)[0] :
            document.getElementById(container) :
        container
    this.grid = new Grid(this._container, row, col, style)
    this.grid.build()
    this.grid.merge()
  }

  getRes() {
    return this.grid.res;
  }
}

// window.MergeSplitBox = MergeSplitBox;


export default MergeSplitBox;



