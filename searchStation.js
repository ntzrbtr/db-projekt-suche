const sheets = require('./sheets')

async function getStations() {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
  })
  return spreadsheet.data.sheets
    .filter((sheet) => sheet.properties.title.startsWith('Bahnhof'))
    .map((sheet) => sheet.properties.title)
}

module.exports = async function searchStation(term) {
  console.log(`Looking for station by term "${term}"`)

  const stations = await getStations()
  const result = stations.filter((name) =>
    name.toLowerCase().includes(term.toLowerCase())
  )

  return result
}
