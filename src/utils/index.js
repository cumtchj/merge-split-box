class Utils {
  // 生成数组行
  makeRow(row, col) {
    return Array.from({length: col}).map((item, index) => ({
      left: index + 1,
      top: row + 1,
      row: 1,
      col: 1,
      disabled: false
    }))
  }

  // 生成数组矩阵
  makeArray(row, col) {
    return Array.from({length: row}).map((item, index) => {
      return this.makeRow(index, col)
    })
  }
}

export default new Utils();
