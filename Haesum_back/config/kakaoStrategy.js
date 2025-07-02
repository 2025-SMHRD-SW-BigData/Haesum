const KakaoStrategy = require('passport-kakao').Strategy;
const { getConnection } = require('./db');

module.exports = new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: process.env.KAKAO_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  let connection;
  try {
    connection = await getConnection();
    const email = profile._json.kakao_account?.email;
    const nick = profile.displayName || profile.username || profile._json.properties?.nickname;
    const loginType = 'kakao';

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
