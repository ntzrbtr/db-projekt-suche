const sheetsApi = require('./sheetsApi')

const ROWS_PER_BATCH = 20

/**
 * Get sheet for given station.
 *
 * @param {string} station
 * @returns {Resource$Spreadsheets$Sheets}
 */
async function getStation(station) {
  const spreadsheet = await sheetsApi.spreadsheets.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
  })

  const sheets = spreadsheet.data.sheets.filter(
    (sheet) =>
      sheet.properties.title.toLowerCase() ===
      `Bahnhof ${station}`.toLowerCase()
  )

  return sheets.length > 0 ? { ...sheets.pop().properties } : null
}

/**
 * Get rows from sheet.
 *
 * @param {Resource$Spreadsheets$Sheets} sheet
 * @param {number} start
 * @param {number} end
 * @returns {Array.Object}
 */
async function getRows(sheet, start, end) {
  let rows

  try {
    rows = (
      await sheetsApi.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: `${sheet.title}!A${start}:K${end}`,
        majorDimension: 'ROWS',
      })
    ).data.values
  } catch (err) {
    console.error(err)
    rows = []
  }

  return rows
}

/**
 * Get all rows from sheet.
 *
 * @param {Resource$Spreadsheets$Sheets} sheet
 * @returns {Array.Object}
 */
async function getAllRows(sheet) {
  const header = (await getRows(sheet, 1, 1)).pop()

  const rows = []
  let start = 2

  do {
    /* eslint-disable no-await-in-loop */
    const batch = await getRows(sheet, start, start + ROWS_PER_BATCH)

    batch
      .map((item) => {
        const res = {}

        item.forEach((value, index) => {
          const key = header[index]

          res[key] = value
        })

        return res
      })
      .forEach((row) => rows.push(row))

    if (batch.length < ROWS_PER_BATCH) {
      break
    }

    start += ROWS_PER_BATCH
  } while (true)

  return rows
}

/**
 * Get pois by term at station.
 *
 * @param {Resource$Spreadsheets$Sheets} sheet
 * @param {string} term
 * @returns {Array.Object}
 */
async function getPois(sheet, term) {
  const rows = await getAllRows(sheet)

  return rows.filter((item) => item.Gruppe.toLowerCase() === term.toLowerCase())
}

/**
 * Search for pois by term at station.
 *
 * @param {string} station
 * @param {string} term
 * @returns {Array.Object}
 */
module.exports = async function searchPoi(station, term) {
  console.log(`Looking for poi at station ${station} by term "${term}"`)

  const sheet = await getStation(station)
  if (!station) {
    return []
  }
  const result = getPois(sheet, term)

  return result
}
