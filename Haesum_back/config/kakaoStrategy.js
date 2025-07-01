const KakaoStrategy = require('passport-kakao').Strategy

const kakaoStrategy = new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: process.env.KAKAO_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  console.log('Kakao OAuth 콜백:', profile.id)
  done(null, profile)
})

module.exports = kakaoStrategy
