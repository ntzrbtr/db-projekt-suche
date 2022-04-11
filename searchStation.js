const sheetsApi = require('./sheetsApi')

/**
 * Get station sheets.
 *
 * @returns {Array.Resource$Spreadsheets$Sheets}
 */
async function getStations() {
  const spreadsheet = await sheetsApi.spreadsheets.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
  })

  return spreadsheet.data.sheets
    .filter((sheet) => sheet.properties.title.startsWith('Bahnhof'))
    .map((sheet) => sheet.properties.title)
}

/**
 * Search for station by term.
 *
 * @param {string} term
 * @returns {Array.string}
 */
module.exports = async function searchStation(term) {
  console.log(`Looking for station by term "${term}"`)

  const stations = await getStations()
  const result = stations.filter((name) =>
    name.toLowerCase().includes(term.toLowerCase())
  )

  return result
}
