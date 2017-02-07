import passport from '../services/passport'

export default (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) {
      return res.jsend.error(err)
    }
    if (!user) {
      return res.jsend.error('Unauthorized')
    }
    req.user = user
    next()
  })(req, res, next)
}
