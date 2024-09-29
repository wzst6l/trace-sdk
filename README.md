# 前端全链路日志SDK源码
持续更新中..

## 如何使用



## 本地调试

1. 源码构建

```
yarn build:js
```

2. 源码调试

```
# 启动后端服务
yarn examples

```
3. 浏览打开HTML
```
 examples/js/index.html
```

## 基本用法

### UMD模式

```JavaScript
// init.js
const instance = window.traceSdkInit({
  dsn: 'http://localhost:2022/track.gif',
  appId: 'fontend-trace-cds-test'
})
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UMD-js-demo</title>
    <script src="/dist/trace-sdk.umd.js"></script>
  </head>
  <body>
    <script src="./init.js"></script>
  </body>
</html>
```

## 当前支持的类型
### 1、代码错误(CodeError)
```
在初始化实例时，添加全局的错误监听，
  window.addEventListener('error', (event) => {
      // 可以捕获语法错误和运行时出现的错误，以及资源加载错误（如图片。脚本标签引入外部文件加兹安失败）
      _t.saveError(event) // 保存错误信息
    })
  window.addEventListener('unhandledrejection', (event: any) => {
    // 捕获未处理的 Promise 拒绝。链式调用中未处理的拒绝（如promise链中.then()方法抛出异常，而后续没有catch()来处理，那么这个异常也会被捕获）
    //todo 保存错误信息
  })

```

### 2、性能（Perf）
```
初始化时，创建PerformanceObserver实例来监听页面的性能
PerformanceObserver是浏览器的提供的API，用于订阅性能时间线上的特定类型事件。可以用来监听和接收页面性能的数据。
this.observer = new PerformanceObserver((list, observer) => {
    for (const entry of list.getEntries()) {
        console.log(entry);
        if (entry.entryType === 'resource') {
          // 调用方法混存性能数据
          this.handleObserverResource(entry as PerformanceResourceTiming)
        }
    }
});
创建实例后，调用 .observe() 方法并传入配置对象来开始监听
 this.observer.observe({
      entryTypes: ["resource"],
    });
获取到数据之后，根据资源加载时长设置不同的级别，如果超过一定的时间则将其保存到 存储错误资源数据 的数组中，等待上报。
```

### 3、接口请求（Fetch）
```
拦截Fetch
重写window.fetch方法，自定义一个函数，该函数支持传入自定义的处理函数，可以在请求发送前，发送后，或者出错时，收集数据。它返回一个函数，用于调用。
对请求进行拦截，修改请求参数，或者添加自定义的请求头等。
```

### 4、普通日志（Console）

### 5、
