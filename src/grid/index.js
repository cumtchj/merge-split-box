import utils from '../utils/index'
import tools from "../utils/tools";
import Cover from "../cover/index"
import styles from '../index.scss'

class Grid {
  constructor(container, row, col, style) {
    this._container = container;
    this._row = row;
    this._col = col;
    this._style = style
    this._array = utils.makeArray(this._row, this._col)
    this._unitWidth = (this._style && this._style.width) || "100px"
    this._unitWidthNum = +this._unitWidth.slice(0, -2)
    this.res = this._array.map(item => ({
      left: item.left,
      top: item.top,
      row: item.row,
      col: item.col,
    }))
    this._areaArray = []
  }

  build() {
    // 设置容器样式
    // TODO:容器的grid布局样式
    this._container.style.width = `calc(${this._col} * ${this._unitWidth})`
    this._container.style.gridTemplateColumns = `repeat(${this._col}, ${this._unitWidth})`
    this._container.style.gridTemplateRows = `repeat(${this._row}, ${this._unitWidth})`
    this._container.classList.add(styles.container)
    // 生成items
    this.createGrid();
  }

  createGrid() {
    // 清空容器
    this._container.innerHTML = "";
    // 遍历生成items并追加至容器
    tools.flatten(this._array).forEach(item => {
      if (!item.disabled) {
        let div = document.createElement("div");
        // 设置item样式
        div.innerText = `${item.top}_${item.left}`;
        div.classList.add(styles.item)
        div.style.width = "100%";
        div.style.height = "100%";
        if (item.row !== 1 || item.col !== 1) {
          // grid-column-start: 1;
          // grid-column-end: 3;
          // grid-row-start: 2;
          // grid-row-end: 4;
          div.style.gridColumnStart = item.left;
          div.style.gridColumnEnd = item.left + item.col;
          div.style.gridRowStart = item.top;
          div.style.gridRowEnd = item.top + item.row;
        }
        this._container.append(div);
      }
    })
  }

  checkOverlap(area) {
    // TODO:此处用递归处理多个交叉情况

    // 判断是否存在交叉
    let index = this._areaArray.findIndex(item =>
      (item.xMin >= area.xMin && item.xMin <= area.xMax) && (item.yMin >= area.yMin && item.yMin <= area.yMax) ||
      (item.xMin >= area.xMin && item.xMin <= area.xMax) && (item.yMax >= area.yMin && item.yMax <= area.yMax) ||
      (item.xMax >= area.xMin && item.xMax <= area.xMax) && (item.yMin >= area.yMin && item.yMin <= area.yMax) ||
      (item.xMax >= area.xMin && item.xMax <= area.xMax) && (item.yMax >= area.yMin && item.yMax <= area.yMax)
    )
    console.log(index)
    let obj = {}
    if (index > -1) {
      obj = {
        xMin: Math.min(this._areaArray[index].xMin, area.xMin),
        xMax: Math.max(this._areaArray[index].xMax, area.xMax),
        yMin: Math.min(this._areaArray[index].yMin, area.yMin),
        yMax: Math.max(this._areaArray[index].yMax, area.yMax)
      }
      this._areaArray.splice(index, 1, obj)
    } else {
      obj = area
      this._areaArray.push(obj)
    }
    console.log("areaArray====", this._areaArray)
    return obj;
  }

  rebuild() {
    // console.log(this._startX, this._endX, this._startY, this._endY)
    let xMin = parseInt(Math.min(this._startX, this._endX) / this._unitWidthNum)
    let xMax = parseInt(Math.max(this._startX, this._endX) / this._unitWidthNum)
    let yMin = parseInt(Math.min(this._startY, this._endY) / this._unitWidthNum)
    let yMax = parseInt(Math.max(this._startY, this._endY) / this._unitWidthNum)
    console.log(xMin, xMax, yMin, yMax)
    // 区域交叉问题解决
    let area = this.checkOverlap({xMin, xMax, yMin, yMax});
    console.log(area)
    for (let i = area.yMin; i <= area.yMax; i++) {
      for (let j = area.xMin; j <= area.xMax; j++) {
        this._array[i][j].disabled = true
      }
    }
    this._array[area.yMin][area.xMin] = {
      left: this._array[area.yMin][area.xMin].left,
      top: this._array[area.yMin][area.xMin].top,
      row: area.yMax - area.yMin + 1,
      col: area.xMax - area.xMin + 1,
    }
    console.log(this._array)
    this.res = tools.flatten(this._array).filter(item => !item.disabled).map(item => ({
      left: item.left,
      top: item.top,
      row: item.row,
      col: item.col,
    }))
    console.log(this._array, this.res)
    this.createGrid();
  }

  destroyCover() {
    this._isSelect = false
    let node = document.getElementById("cover")
    if (node) {
      this._container.removeChild(node);
    }
    if (this._cover) {
      this._cover.destroy();
      this._cover = null;
    }
  }

  // TODO:容器的事件
  // 合并单元格
  merge() {
    // 鼠标按下事件
    this._container.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      this._isSelect = true
      // 清空可能残留的cover
      if (this._cover) {
        this.destroyCover();
      }
      // 初始化cover
      this._startX = e.clientX - this._container.offsetLeft;
      this._startY = e.clientY - this._container.offsetTop;
      // console.log(
      //   e.clientX, e.clientY,
      //   this._startX, this._startY,
      //   this._container.clientX, this._container.clientY)
      this._cover = new Cover(this._startX, this._startY, this._container)
      this._container.append(this._cover.cover)
    })
    // 鼠标移动事件
    this._container.addEventListener('mousemove', e => {
      if (this._isSelect) {
        e.stopPropagation()
        this._endX = e.clientX - this._container.offsetLeft;
        this._endY = e.clientY - this._container.offsetTop;
        // 超出范围
        if (this._endX <= 1 || this._endX >= (this._unitWidthNum * this._col) || this._endY <= 1 || this._endY >= (this._unitWidthNum * this._row)) {
          if (this._endX <= 1) {
            this._endX = 1
          }
          if (this._endX >= (this._unitWidthNum * this._col)) {
            this._endX = (this._unitWidthNum * this._col)
          }
          if (this._endY <= 1) {
            this._endY = 1
          }
          if (this._endY >= (this._unitWidthNum * this._row)) {
            this._endY = (this._unitWidthNum * this._row)
          }
          this.destroyCover();
          this.rebuild();
        }

        if (this._cover && this._cover.cover) {
          this._cover.resize(this._endX, this._endY)
        }
      }
    })
    // 鼠标抬起事件
    this._container.addEventListener('mouseup', e => {
      this._isSelect = false
      e.stopPropagation()
      this.destroyCover();
      if (Math.abs(this._endX - this._startX) > 0 || Math.abs(this._endY - this._startY)) {
        this.rebuild();
      }

    })
  }

}

export default Grid;
