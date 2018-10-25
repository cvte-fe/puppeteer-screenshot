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
  storage: {
    type: 'filesystem',
    path: ''
  },
  pageOption: {
    timeout: 30000,
  },
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
    },
    omitBackground: false, // 是否隐藏背景
    encoding: 'binary'
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

const result = await screenshot.capture('http://www.baidu.com');

await screenshot.close();
```

#### close 销毁`Browser`实例

每个`Screenshot`实例只会使用一个`Browser`，所以在所有任务完毕后应该销毁`Browser`， 否则可能会导致内存泄漏；另外，服务关闭时也应该销毁`Browser`。

```
process.on('exit', code => {
  screenshot.close();
});
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

#### pageOption 超时时间

* timeout [number]: 30000, 默认是 30000， 这个超时时间是指加载页面的超时时间

更多配置项请参考文档： https://pptr.dev/#?product=Puppeteer&version=v1.9.0&show=api-pagegotourl-options

#### storage 存储方式

* `type`: 目前支持两种：`filesystem`，`qiniu`, 'custom'。 `filesystem`即存储截图到本地文件系统， `qiniu`是存储截图到[七牛](https://developer.qiniu.com/)服务, 自定义是自行处理存储;

* `path`: 本地文件系统路径，默认是`process.cwd()`，仅在`type: "filesystem"`有效;

* `accessKey`: 七牛参数
* `secretKey`: 七牛参数
* `bucket`: 七牛参数， 存储空间
* `bucketType`: 七牛参数， `public` or `private`存储空间
* `deadline`: 七牛参数, 仅对`bucketType`为`private`时有效
* `domain`: 七牛参数, 资源访问域名

* `func`: 当 `type` 为 `custom`时有效，传出处理存储的函数，func(buffer, storage, captureOption)

注意, 当`type`为空时，不执行任何存储动作，直接跳到下一步

#### view 窗口大小

* `deviceScaleFactor`: number, 窗口缩放，默认是 1 ，当数值为 2 可以理解为截图是两倍图；
* `width`: number, 单位`px`， 默认 1280
* `height`: number, 单位`px`, 默认 720

### isSetRequestInterception 是否拦截请求， 值为`boolean`

注意：当`isSetRequestInterception` 为 `true`时，缓存失效

### interceptedRequest 请求拦截器，值为`function`

例如：

```
{
  interceptedRequest : (interceptedRequest) => {
    if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
      interceptedRequest.abort();
    else
      interceptedRequest.continue();
  }
}
```

#### captureOption 截图参数

详细请参考文档：https://pptr.dev/#?product=Puppeteer&version=v1.9.0&show=api-pagescreenshotoptions

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

#### hooks

为了更加方便地扩展，提供了四个基本的 hooks：

* beforeCreatePage： function return Promise, 创建页面前调用

```
  beforeCreatePage(browser, ctx)
```

* afterCreatePage function return Promise, 创建页面后调用

```
  afterCreatePage(page, browser, ctx)
```

* beforeCapture function return Promise, 在截图前调用

```
  beforeCapture(ctx)
```

* afterCapture function return Promise, 在截图后调用

```
  afterCapture(ctx)
```

#### middleware

如果钩子无法满足扩展的需求，那么可以使用 middleware 来扩展，例如：

```
screenshot.use({
  enable: true,
  module: async (ctx, next) => {
    // do something...
    next();
  },
  priority: 60,
});
```

`priority` 代表执行权重:

`priority` < 50: 在页面初始化之前执行
`priority` > 50 && `priority` < 150: 在截图前执行
`priority` > 150 && `priority` < 200: 在截图后，存储前执行
`priority` > 200 在存储后执行

## Test

```
npm run test
```
