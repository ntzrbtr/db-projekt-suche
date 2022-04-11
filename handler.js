const searchStation = require('./searchStation')
const searchPoi = require('./searchPoi')

module.exports = async function handler(req, res) {
  // Get request parameter.
  const query = new URLSearchParams(req.query)
  const type = query.has('type') ? query.get('type') : null
  const station = query.has('station') ? query.get('station') : null
  const term = query.has('term') ? query.get('term') : null

  // Anything missing?
  if (!type) {
    res.type('text/plain').status(400).send('Missing type')

    return
  }
  switch (type) {
    case 'station':
      if (!term) {
        res.type('text/plain').status(400).send('Missing parameter(s)')

        return
      }
      break

    case 'poi':
      if (!term || !station) {
        res.type('text/plain').status(400).send('Missing parameter(s)')

        return
      }
      break

    default:
    // Nothing to do
  }

  let items
  switch (type) {
    case 'station':
      items = await searchStation(term)
      break

    case 'poi':
      items = await searchPoi(station, term)
      break

    default:
      res.type('text/plain').status(400).send('Unknown type')
      return
  }

  // Send result back.
  res.type('application/json').send({
    count: items.length,
    data: items,
  })
}
