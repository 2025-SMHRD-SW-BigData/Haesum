const NaverStrategy = require('passport-naver').Strategy;
const { getConnection } = require('./db');

module.exports = new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  let connection;
  try {
    connection = await getConnection();

    const email = profile._json.email;
    const nick = profile.displayName || profile._json.nickname;
    const loginType = 'naver';

    console.log('Naver login:', { email, nick, loginType });

    if (!email) {
      return done(new Error('네이버 프로필에 이메일이 없습니다.'));
    }

    const checkResult = await connection.execute(
      `SELECT USER_ID, USER_EMAIL, NICK, LOGIN_TYPE FROM USERINFO
       WHERE USER_EMAIL = :email AND LOGIN_TYPE = :loginType`,
      { email, loginType }
    );

    let user;
    if (checkResult.rows.length === 0) {
      await connection.execute(
        `INSERT INTO USERINFO (USER_EMAIL, NICK, LOGIN_TYPE)
         VALUES (:email, :nick, :loginType)`,
        { email, nick, loginType },
        { autoCommit: true }
      );
      const inserted = await connection.execute(
        `SELECT USER_ID, USER_EMAIL, NICK, LOGIN_TYPE FROM USERINFO
         WHERE USER_EMAIL = :email AND LOGIN_TYPE = :loginType`,
        { email, loginType }
      );
      user = inserted.rows[0];
    } else {
      user = checkResult.rows[0];
    }
    const [USER_ID, USER_EMAIL, NICK, LOGIN_TYPE] = user;
    done(null, { USER_ID, USER_EMAIL, NICK, LOGIN_TYPE });
  } catch (err) {
    done(err);
  } finally {
    if (connection) await connection.close();
  }
});
