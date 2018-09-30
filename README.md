# puppeteer-screenshot

A screenshot tool with puppeteer

## 使用 puppeteer 的截图服务

期望通过传入一段 HTML，或者一个 URL，然后能输出一张图片。

### get start

```
npm install puppeteer-screenshot
```

或者

```
yarn add puppeteer-screenshot
```

### usage

```
const Screenshot = require('puppeteer-screenshot');

const screenshot = new Screenshot({
  optimize: true,
  storage: {
    type: 'filesystem',
    path: ''
  },
  timeout: 30000,
  view: {
    deviceScaleFactor: 2, // 可以理解为多倍图
    width: 750,  
    height: 1200  
  },
  captureOption: {
    type: 'jpeg',
    quality: 75,
    fullPage: false, // 是否截取全屏
    clip: { // 裁剪
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      omitBackground: false // 是否隐藏背景
    }
  },
  hooks: {
    beforeCapture: function(){
      // do something
    },
    afterCapture: function(){
      // do something
    }
  }  
})

screenshot.capture({
  type: 'url',
  url: 'http://www.baidu.com'
})
```

### Options

```
const screenshot = new Screenshot(options);
```

| 参数名        | 类型             | 必填 | 描述         |
| ------------- | ---------------- | ---- | ------------ |
| optimize      | boolean(number)  | 否   | 是否压缩图片 |
| timeout       | number           | 否   | 超时时间     |
| storage       | object(function) | 否   | 存储方式     |
| view          | object           | 否   | 窗口大小     |
| captureOption | object           | 否   | 截图参数     |
| hooks         | object           | 否   | 钩子         |

##### optimize 是否压缩图片

* [ boolean ]: false, 默认不开启图片压缩
* [ number ]: 1-100, 图片质量，数值越小，质量越差

#### timeout 超时时间

* [number]: 30000, 默认是 30000， 这个超时时间是指加载页面的超时时间

#### storage 存储方式

* `type`: 目前支持两种：`filesystem`，`qiniu`。 `filesystem`即存储截图到本地文件系统， `qiniu`是存储截图到[七牛](https://developer.qiniu.com/)服务;
* `path`: 本地文件系统路径，默认是`process.cwd()`，仅在`type: "filesystem"`有效;
* `config`: 七牛参数，具体参考：https://developer.qiniu.com/kodo/sdk/1289/nodejs

我们也可以自定义存储方式，传值`function`时，可以自定义存储

#### view 窗口大小

* `deviceScaleFactor`: number, 窗口缩放，默认是 1 ，当数值为 2 可以理解为截图是两倍图；
* `width`: number, 单位`px`， 默认 1280
* `height`: number, 单位`px`, 默认 720

#### captureOption 截图参数

* `type`: 截图格式，目前只支持`jpeg`和`png`
* `quality`: 截图质量
* `fullPage`： boolean 是否截取整页，`false`是只截取可见部分
* `clip`: 裁剪，具体如下：
  ```
  {
    x: 0,
    y: 0,
    width: 400,
    height: 400,
    omitBackground: false // 是否隐藏背景
  }
  ```

