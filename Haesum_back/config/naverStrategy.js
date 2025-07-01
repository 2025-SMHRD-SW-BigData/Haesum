const NaverStrategy = require('passport-naver').Strategy

const naverStrategy = new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  console.log('Naver OAuth 콜백:', profile.id)
  done(null, profile)
})

module.exports = naverStrategy
