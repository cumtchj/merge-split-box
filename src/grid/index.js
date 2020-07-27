import utils from '../utils/index'
import tools from "../utils/tools";

class Grid {
  constructor(container, row, col) {
    this._container = container;
    this._row = row;
    this._col = col;
  }

  create() {
    console.log(this._array)
    this._array.forEach(item => {
      let div = document.createElement("div")
      div.innerText=`${item.left}_${item.top}`
      this._container.append(div)
    })
  }

  build() {
    let array = utils.makeArray(this._row, this._col)
    console.log(this._container)
    this._array = tools.flatten(array)
    this.create();
  }
}

export default Grid;
