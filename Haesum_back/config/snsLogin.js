const passport = require('passport');
const GoogleStrategy = require('./googleStrategy');
const KakaoStrategy = require('./kakaoStrategy');
const NaverStrategy = require('./naverStrategy');
const { getConnection } = require('./db');

passport.serializeUser((user, done) => {
  done(null, user.USER_ID);
});

passport.deserializeUser(async (id, done) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT USER_ID, USER_EMAIL, NICK, LOGIN_TYPE FROM USERINFO WHERE USER_ID = :id`,
      [id]
    );
    if (result.rows.length > 0) {
      const [USER_ID, USER_EMAIL, NICK, LOGIN_TYPE] = result.rows[0];
      done(null, { USER_ID, USER_EMAIL, nick: NICK, LOGIN_TYPE });
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  } finally {
    if (connection) await connection.close();
  }
});

passport.use(GoogleStrategy);
passport.use(KakaoStrategy);
passport.use(NaverStrategy);

module.exports = passport;
