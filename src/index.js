// import utils from 'utils'

const utils = require("./utils")

class MergeSplitBox {
  constructor(row, col) {
    this.arr = utils.generateArray(row, col)
  }
}

module.exports = MergeSplitBox
// export default MergeSplitBox;
