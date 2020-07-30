# merge-split-box
merge box

## 使用方法

##### 1.准备HTML
```
<div id="box"></box>
```

##### 2.引入并生成对象, 获取结果

###### 1)方法一
```ecmascript 6
import MSB from "merge-split-box"

const msb = new MSB("#box",2 ,6 );
let res = msb.getRes();
```

###### 2)方法二
```ecmascript 6
import MSB from "merge-split-box"

const msb = new MSB("#box",2 ,6 ,onChange);
let onChange=(res)=>{
    console.log(res);
    //...
}
```

## API

##### 1.传参

###### 1）dom
```
可以是 id, #id, .class, dom元素
```

###### 2）row
```
生成宫格的行数, Number类型
```

###### 3）col
```
生成宫格的列数, Number类型
```

###### 4）[onChange]
```
可选，每次操作以后的回调函数，有一个参数res, res是有效宫格的数组
```
###### 5）[style]
```
可选，基础单元格的样式，目前只支持width, 默认每个单元格的宽度为100px。
例：
    {
        width："100px"
    }
```

##### 2.实例对象

###### 1）getRes
```
获取操作以后的结果函数, 返回一个res数组, res是有效宫格的数组
```











