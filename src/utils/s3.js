const AWS = require('aws-sdk')
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

exports.uploadStream = async (Stream, Bucket, Key) => {
  return s3.upload({
    Bucket,
    Key,
    Body: Stream,
  }).promise()
}
