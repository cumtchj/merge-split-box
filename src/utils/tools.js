class Tools {

  flatten(arr){
    return arr.reduce((prev,cur)=>{
      return prev.concat(Array.isArray(cur)?this.flatten(cur):cur)
    },[])
  }
}

export default new Tools();
