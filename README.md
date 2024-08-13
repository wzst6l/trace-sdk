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
yarn examples
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

