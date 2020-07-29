class Style {
  container(row, col, unitW) {
    return {
      width: `calc(${col} * ${unitW})`,
      position: 'relative',
      border: '1px solid #999',
      display: 'grid',
      gridTemplateColumns: `repeat(${col}, ${unitW})`,
      gridTemplateRows: `repeat(${row}, ${unitW})`
    }
  }

  item() {
    return {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      border: "1px dashed #eee",
      userSelect: 'none'
    }
  }

  itemAdd(top, left, row, col) {
    return {
      gridColumnStart: left,
      gridColumnEnd: left + col,
      gridRowStart: top,
      gridRowEnd: top + row
    }

  }

  splitBtn() {
    return {
      border: "none",
      outline: "none",
      background: "none",
      cursor: "pointer",
      borderRadius: "4px",
      color: "white",
      backgroundColor: 'cornflowerblue',
      margin: '8px',
      padding: "4px 14px",
    }
  }

  cover(){
    return{
      position:"absolute",
      zIndex:5,
      backgroundColor:"rgba(100, 100, 149, .1)",
      border: "1px dashed #6495ed"
    }
  }

}

export default new Style();
