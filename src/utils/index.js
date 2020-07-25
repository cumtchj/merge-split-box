class Utils {
  // 初始化生成数组
  generateArray = (row, col) => {
    let array = [];
    for (let r = 0; r < row; r++) {
      let arrIn = []
      for (let c = 0; c < col; c++) {
        arrIn[c] = {
          left: c + 1,
          top: r + 1,
          row: 1,
          col: 1
        }
      }
      array[r] = arrIn;
    }
    return array;
  }
}

module.exports = new Utils();
// export default new Utils();
