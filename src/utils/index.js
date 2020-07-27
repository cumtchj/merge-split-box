class Utils {
  // 初始化生成数组
  makeRow(row, col) {
    return Array.from({length: col}).map((item, index) => ({
      left: index + 1,
      top: row + 1,
      row: 1,
      col: 1
    }))
  }

  makeArray(row, col) {
    return Array.from({length: row}).map((item, index) => {
      return this.makeRow(index, col)
    })
  }
}

export default new Utils();
