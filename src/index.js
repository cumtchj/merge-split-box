import utils from './utils/index'
// const utils = require("./utils")

class MergeSplitBox {
  constructor(row, col) {
    this.arr = utils.generateArray(row, col)
  }
}

let msb = new MergeSplitBox(2, 2)
console.log(msb.arr)


// module.exports = MergeSplitBox
// export default MergeSplitBox;
