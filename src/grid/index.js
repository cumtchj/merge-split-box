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
    this._container.style.width = `calc(${this._col} * ${this._unitWidth})`
    this._container.style.gridTemplateColumns = `repeat(${this._col}, ${this._unitWidth})`
    this._container.style.gridTemplateRows = `repeat(${this._row}, ${this._unitWidth})`
    this._container.classList.add(styles.container)
    // 生成items
    this.createGrid();
    // this.split();
  }

  createGrid() {
    // 清空容器
    this._container.innerHTML = "";
    this._idList = []
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
          let button = document.createElement("input")
          button.classList.add(styles.split_btn)
          button.type = "button"
          button.value = "拆分"
          let id = `${item.left}_${item.top}_${item.row}_${item.col}`
          button.id = id
          button.onclick = this.split.bind(this)
          this._idList.push(id)
          button.setAttribute("data", id)
          div.append(button);
          div.style.gridColumnStart = item.left;
          div.style.gridColumnEnd = item.left + item.col;
          div.style.gridRowStart = item.top;
          div.style.gridRowEnd = item.top + item.row;
        }
        this._container.append(div);
      }
    })

    this.res = tools.flatten(JSON.parse(JSON.stringify(this._array))).filter(item => !item.disabled).map(item => ({
      left: item.left,
      top: item.top,
      row: item.row,
      col: item.col,
    }))
    console.log(this.res)
  }

  checkOverlap(area) {
    // console.log('area====', area)
    // 判断是否存在交叉
    let index = this._areaArray.findIndex(item => !(
      (item.xMin > area.xMax) ||
      (item.xMax < area.xMin) ||
      (item.yMin > area.yMax) ||
      (item.yMax < area.yMin))
    )
    // ((item.xMin >= area.xMin && item.xMin <= area.xMax) && (item.yMax >= area.yMin && item.yMax <= area.yMax)) ||
    // ((item.xMin >= area.xMin && item.xMin <= area.xMax) && (item.yMin >= area.yMin && item.yMin <= area.yMax)) ||
    // ((item.xMax >= area.xMin && item.xMax <= area.xMax) && (item.yMin >= area.yMin && item.yMin <= area.yMax)) ||
    // ((item.xMax >= area.xMin && item.xMax <= area.xMax) && (item.yMax >= area.yMin && item.yMax <= area.yMax)) ||
    // ((area.xMin >= item.xMin && area.xMin <= item.xMax) && (area.yMin >= item.yMin && area.yMin <= item.yMax)) ||
    // ((area.xMin >= item.xMin && area.xMin <= item.xMax) && (area.yMax >= item.yMin && area.yMax <= item.yMax)) ||
    // ((area.xMax >= item.xMin && area.xMax <= item.xMax) && (area.yMin >= item.yMin && area.yMin <= item.yMax)) ||
    // ((area.xMax >= item.xMin && area.xMax <= item.xMax) && (area.yMax >= item.yMin && area.yMax <= item.yMax)))
    if (index > -1) {
      let obj = {
        xMin: Math.min(this._areaArray[index].xMin, area.xMin),
        xMax: Math.max(this._areaArray[index].xMax, area.xMax),
        yMin: Math.min(this._areaArray[index].yMin, area.yMin),
        yMax: Math.max(this._areaArray[index].yMax, area.yMax)
      }
      this._areaArray.splice(index, 1)
      // console.log("obj=========", obj)
      this.checkOverlap(obj)
    } else {
      // console.log("area-else=====", area)
      this._areaArray.push(area)
    }
  }

  rebuild() {
    // console.log(this._startX, this._endX, this._startY, this._endY)
    let xMin = parseInt(Math.min(this._startX, this._endX) / this._unitWidthNum)
    let xMax = parseInt(Math.max(this._startX, this._endX) / this._unitWidthNum)
    let yMin = parseInt(Math.min(this._startY, this._endY) / this._unitWidthNum)
    let yMax = parseInt(Math.max(this._startY, this._endY) / this._unitWidthNum)
    // console.log(xMin, xMax, yMin, yMax)
    // 区域交叉问题解决
    this.checkOverlap({xMin, xMax, yMin, yMax});
    let area = this._areaArray[this._areaArray.length - 1]
    // console.log("area-out======", area)
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
      disabled: false
    }
    console.log("merge======", this._array)

    // console.log(this._array, this.res)
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

  // 合并单元格
  merge() {
    // 鼠标按下事件
    this._container.addEventListener('mousedown', (e) => {
      if (e.target.tagName === "INPUT") {
        this.split(e)
        return;
      }
      e.stopPropagation()
      this._isSelect = true
      // 清空可能残留的cover
      if (this._cover) {
        this.destroyCover();
      }
      // 初始化cover
      this._startX = e.clientX - this._container.offsetLeft;
      this._startY = e.clientY - this._container.offsetTop;
      console.log("start===", this._startX, this._startY)
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
          // this.rebuild();
        }

        if (this._cover && this._cover.cover) {
          this._cover.resize(this._endX, this._endY)
        }
      }
    })
    // 鼠标抬起事件
    this._container.addEventListener('mouseup', e => {
      if (this._isSelect) {
        this._isSelect = false
        e.stopPropagation()
        this._endX = e.clientX - this._container.offsetLeft;
        this._endY = e.clientY - this._container.offsetTop;
        console.log('end==', this._endX, this._endY)
        this.destroyCover();
        if (Math.abs(this._endX - this._startX) > 0 || Math.abs(this._endY - this._startY)) {
          this.rebuild();
        }
      }

    })
  }

  // 拆分单元格
  split(e) {
    e.stopPropagation();
    console.log(e)
    // console.log("split-start======", this._array)
    let [left, top, row, col] = e.target.getAttribute("data").split("_").map(item => +item)
    // console.log(left, top, row, col)
    let [xMin, yMin] = [top - 1, left - 1]
    let [xMax, yMax] = [top + row - 2, left + col - 2]

    // console.log(xMin, yMin, xMax, yMax)
    for (let i = xMin; i <= xMax; i++) {
      // console.log(i)
      for (let j = yMin; j <= yMax; j++) {
        // console.log(i, j)
        // console.log(this._array)
        this._array[i][j].col = 1
        this._array[i][j].row = 1
        this._array[i][j].disabled = false
      }
    }
    // console.log(this._array)
    // 清除 _areaList 中对应的数据
    this.clearAreaList({xMin, xMax, yMin, yMax})
    this.createGrid();
  }

  // 清除 _areaList 中对应的数据
  clearAreaList(area) {
    let index = this._areaArray.findIndex(item => item.xMin === area.xMin && item.xMax === area.xMax)
    // console.log(index)
    // console.log(area)
    // console.log(this._areaArray)
    this._areaArray.splice(index, 1)
  }
}

export default Grid;
