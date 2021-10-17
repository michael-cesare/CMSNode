const fs = require('fs');
const path = require('path');

console.log('hit dev server')

const fileName = './public/config.json'

fs.readFile(path.resolve(__dirname, fileName),
  (err: any, response: any) => {
    if (err) {
      console.log('error', err)
    } else {
      const jsonConfigs = JSON.parse(response)
      jsonConfigs.IS_SRC = true
      const app = require('./src/app')
      app.startNode(jsonConfigs)
    }
})
