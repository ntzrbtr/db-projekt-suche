require('dotenv').config()

const express = require('express')

const app = express()
const port = 3000

const handler = require('./handler')

app.get('/', handler)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
