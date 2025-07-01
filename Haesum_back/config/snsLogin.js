const passport = require('passport')
const googleStrategy = require('./googleStrategy')
const kakaoStrategy = require('./kakaoStrategy')
const naverStrategy = require('./naverStrategy')

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use(googleStrategy)
passport.use(kakaoStrategy)
passport.use(naverStrategy)

module.exports = passport
