const api = require('./utils/api')
const { renderUrl } = require('./renderer')
const { findUrlError } = require('../utils/endpointValidation')
const { uploadStream } = require('./utils/s3')
const { v4: uuid } = require('uuid')

const {
  TARGET_BUCKET = '',
} = process.env

api.post('/', async (req, res) => {
  const {
    url,
    data,
  } = req.body

  if (!url) {
    return res.status(400).send({ error: 'A URL for the HTML file is required.' })
  }

  const urlError = await findUrlError(url)
  if (urlError) {
    return res.status(400).send({ error: urlError })
  }

  const pdfStream = await renderUrl({ url, data })

  const { Location: pdfUrl } = await uploadStream(pdfStream, TARGET_BUCKET, `${uuid()}.pdf`)
  return pdfUrl
})

// Declare actual Lambda handler
exports.handler = async (event, context) => {
  // Run the request
  return api.run(event, context)
}
