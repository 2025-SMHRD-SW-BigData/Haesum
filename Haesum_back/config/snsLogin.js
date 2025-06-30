const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Kakao Client ID:', process.env.KAKAO_CLIENT_ID);
console.log('Naver Client ID:', process.env.NAVER_CLIENT_ID);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  console.log('Google OAuth 콜백 호출됨');
  console.log('Google profile id:', profile.id);
  done(null, profile);
}));

passport.use(new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: process.env.KAKAO_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  console.log('Kakao OAuth 콜백 호출됨');
  console.log('Kakao profile:', profile);
  done(null, profile);
}));

passport.use(new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  console.log('Naver OAuth 콜백 호출됨');
  console.log('Naver profile:', profile);
  done(null, profile);
}));

module.exports = passport;