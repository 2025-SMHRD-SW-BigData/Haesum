const passport = require('passport');
const GoogleStrategy = require('./googleStrategy');
const KakaoStrategy = require('./kakaoStrategy');
const NaverStrategy = require('./naverStrategy');
const { getConnection } = require('./db');
const oracledb = require('oracledb');

passport.serializeUser((user, done) => {
  console.log('✅ serializeUser 저장:', user.USER_ID);
  done(null, user.USER_ID);
});

passport.deserializeUser(async (id, done) => {
  console.log('🔥 passport.deserializeUser 실행:', id);
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT USER_ID, USER_EMAIL, NICK, LOGIN_TYPE FROM USERINFO WHERE USER_ID = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('📌 DB 조회 결과:', result.rows);

    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(null, false);
    }
  } catch (err) {
    console.error('🔥 deserializeUser 오류:', err);
    done(err);
  } finally {
    if (connection) await connection.close();
  }
});

passport.use(GoogleStrategy);
passport.use(KakaoStrategy);
passport.use(NaverStrategy);

module.exports = passport;
