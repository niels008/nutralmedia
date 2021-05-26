require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const port = 1337

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

const handleLinkResolver = doc => {
  return '/'
}

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }
  res.locals.PrismicDOM = PrismicDOM
  next()
})

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/collections/', (req, res) => {
  res.render('pages/collections')
})

app.get('/about', async (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['about', 'meta'])).then((response) => {
      const { results } = response
      const [meta, about] = results
      console.log(results)
      console.log(`
      meta
      data
      here
      `)
      console.log(meta)

      res.render('pages/about', {
        about,
        meta
      })
    })
  })
})

app.get('/detail/:uid', (req, res) => {
  res.render('pages/detail')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
