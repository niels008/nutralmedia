require('dotenv').config()

const express = require('express')
const errorHandler = require('errorhandler')

const path = require('path')
const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

const handleLinkResolver = doc => {
  return '/'
}

app.use(errorHandler())

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }
  res.locals.PrismicDOM = PrismicDOM
  next()
})

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const meta = await api.getSingle('meta')

  res.render('pages/home', {
    meta
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const meta = await api.getSingle('meta')
  const about = await api.getSingle('about')

  res.render('pages/about', {
    meta,
    about
  })
})

app.get('/collections/', async (req, res) => {
  const api = await initApi(req)
  const meta = await api.getSingle('meta')
  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks: 'product.image'
  })

  // console.log(collections)

  collections.forEach(collection => {
    console.log(collection.data.products[0].data)
  })

  res.render('pages/collections', {
    meta,
    collections
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const meta = await api.getSingle('meta')
  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })

  res.render('pages/detail', {
    meta,
    product
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
