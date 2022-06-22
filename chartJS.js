const fs = require('fs')

let jsObj;
fs.readdir("./data/", 'utf-8', (error, data) => {
  if (error) {
    return console.log(error)
  }
  data.forEach(x => {
    let file = `data/${x}`
    fs.readFile(file, (error, data) => {
      if (error) {
        return console.log(error)
      }
      jsObj = JSON.parse(data)['mainObj']
      console.log()
    })
  })
})

const labels = Object.keys(jsObj).slice(0, 5);

let values = Object.values(jsObj).slice(0, 5)