const axios = require('axios');
const express = require('express')
const http = require('http')
const { resolve } = require('path')
const { connectToMongoDB } = require('./db');
// import { port, FilePaths, ServerUrls } from './config'
const { port, FilePaths, ServerUrls } = require('./config')
// const opn = require('open')
// import { mswServer } from './mocks/node'
//   mswServer.listen()
//   mswServer.printHandlers()
const app = express()

// const url = `http://localhost:${port}/JS/index.html`
// Object.entries(FilePaths).forEach(([path, resolvePath]) => {
//   app.use(path, express.static(resolvePath))
// })







app.use(express.static('examples'))
app.use('/dist', express.static('dist'))

app.get('/track.gif', (req, res) => {
  try{
    const data = JSON.parse(req.query.data)
    console.info('user id:',  data.uid)
    console.info('类型:',  data.type)
    console.info('等级:',  data.level)
    console.info('等级:',  data.data.stack)
    console.info('data:',  data)
    //将data存储到数据库或日志文件中
    // TODO savaData(data)
    let msg = `告警信息：
    等级：${data.level};
    内容：${data.data.stack}`
    //TODO 发送信息到企业微信 sendMessage(msg)

  }catch (e) {
    //todo 解析出错,发出报警
  }finally {

  }

  // 返回一个1x1像素的透明GIF图片
  const img = Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': img.length
  });
  res.end(img);
})




/**
 * 保存日志数据
 * @param data
 */
const savaData = (data) => {
  connectToMongoDB().then(client => {
    insertDocument(client, data);
  }).catch(console.error);
}

/**
 * 插入数据库
 * @param client
 * @param data
 * @returns {Promise<void>}
 */
async function insertDocument(client, data) {
  const collection = client.db('local').collection('customer_log');
  const doc = { name: 'John Doe', age: 30 };
  // console.log(data)
  try {
    const result = await collection.insertOne(data);
    console.log(`Inserted a document with the _id: ${result.insertedId}`);
  } catch (error) {
    console.error('Failed to insert document:', error);
  }
}


// 企业微信机器人的 Webhook 地址
const webhookUrl = ''
function sendMessage(massage) {
  // 构造消息体
  const messageData = {
    msgtype: 'text',
    text: {
      content: massage
    }
  };

// 发送请求
  axios.post(webhookUrl, messageData)
    .then(response => {
      console.log('告警消息发送成功:', response.data);
    })
    .catch(error => {
      console.error('告警消息发送失败:', error);
    });
}

// // mock
app.get(ServerUrls.normalGet, (_req, res) => {
  res.send('get 正常请求响应体')
})

app.get(ServerUrls.exceptionGet, (_req, res) => {
  res.status(500).send('get 异常响应体!!!')
})

app.post(ServerUrls.normalPost, (_req, res) => {
  res.send('post 正常请求响应体')
})

app.post(ServerUrls.exceptionPost, (_req, res) => {
  res.status(500).send('post 异常响应体!!!')
})

app.post(ServerUrls.errorsUpload, (_req, res) => {
  res.send('错误上报成功')
})

const server = http.createServer(app)

server.listen(port, () => {})
if (process.env.NODE_ENV === 'demo') {
  console.log('examples is available at: http://localhost:' + port)
  // opn(url)
}
