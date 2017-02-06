import passport from 'passport'
import passportJwt from 'passport-jwt'
import player from '../controllers/player'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('auth_token'),
  secretOrKey: process.env.JWT_SECRET,
}

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  player.getPlayer(0, payload.sub)
    .then((playerInfo) => done(null, playerInfo))
    .catch((err) => done(err, false))
})

export const requireToken = passport.authenticate('jwt', { session: false })

passport.use(jwtLogin)

export default passport
