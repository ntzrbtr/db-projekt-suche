const { google } = require('googleapis')

const sheetsApi = google.sheets({
  version: 'v4',
  auth: process.env.API_KEY,
})

module.exports = sheetsApi
