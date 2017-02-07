export default (req, res, next) => {
  if (req.ip.slice(-9) === '127.0.0.1') {
    return next()
  }
  res.jsend.error('Unauthorized')
}
