import styles from '../style/index'

// import styles from '../index.scss'

class Cover {
  constructor(x, y) {
    this.init(x, y)
    this.startX = x;
    this.startY = y;
  }

  init(x, y) {
    this.cover = document.createElement("div")
    this.cover.id = 'cover'
    this.cover.style.position = "absolute";
    this.cover.style.zIndex = "5";
    this.cover.style.backgroundColor = "rgba(100, 100, 149, .1)";
    this.cover.style.border = "1px dashed #6495ed";
    // this.cover.classList.add(styles.cover);
    this.cover.style.top = y + 'px';
    this.cover.style.left = x + 'px';
  }

  resize(x, y) {
    this.endX = x;
    this.endY = y;
    if (this.endX < this.startX) {
      this.cover.style.left = this.endX + 'px'
    }
    if (this.endY < this.startY) {
      this.cover.style.top = this.endY + 'px'
    }
    let width = Math.abs(this.endX - this.startX)
    let height = Math.abs(this.endY - this.startY)
    this.cover.style.width = width + 'px';
    this.cover.style.height = height + 'px';
  }

  destroy() {
    this.cover = null;
  }
}

export default Cover
