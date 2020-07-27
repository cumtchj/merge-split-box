import Grid from './grid/index'

class MergeSplitBox {
  constructor(container, row, col) {
    this._container =
      typeof container === "string" ?
        container.startsWith("#") ?
          document.querySelector(container) :
          container.startsWith(".") ?
            document.querySelector(container)[0] :
            document.getElementById(container) :
        container
    let grid = new Grid(this._container, row, col, style)

    this.arr = grid.build()
  }
}

let msb = new MergeSplitBox('#box', 2, 2, {width: "100%"})
console.log(msb.arr)


// module.exports = MergeSplitBox
// export default MergeSplitBox;
