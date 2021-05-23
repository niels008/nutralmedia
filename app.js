const express = require('express')
const app = express()
const path = require('path')
const port = 1337

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index', {
    meta: {
      data: {
        title: 'Nutral',
        description: 'Metadata description.'
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
