const { google } = require('googleapis')

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.API_KEY,
})

module.exports = sheets
