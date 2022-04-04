const searchStation = require('./searchStation')

module.exports = async function handler(req, res) {
  // Get request parameter.
  const query = new URLSearchParams(req.query)
  const type = query.has('type') ? query.get('type') : null
  const term = query.has('term') ? query.get('term') : null

  // Anything missing?
  if (!type || !term) {
    res.type('text/plain').status(400).send('Missing parameter(s)')

    return
  }

  let items
  switch (type) {
    case 'station':
      items = await searchStation(term)
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
