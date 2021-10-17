const fs = require('fs');
const path = require('path');

console.log('hit server')

const fileName = './public/config.json'

fs.readFile(path.resolve(__dirname, fileName),
  (err, response) => {
    if (err) {
      console.log('error', err)
    } else {
      const jsonConfigs = JSON.parse(response)
      jsonConfigs.IS_SRC = false
      const app = require('./dist/app')
      app.startNode(jsonConfigs)
    }
})
