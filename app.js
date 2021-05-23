const express = require('express')
const app = express()
const path = require('path')
const port = 1337

app.set('views', path.join(__dirname, 'app'))

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
