// kakaoStrategy.js
const KakaoStrategy = require('passport-kakao').Strategy;
const { getConnection } = require('./db');
const oracledb = require('oracledb');

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
      { email, loginType },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
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
        { email, loginType },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      user = inserted.rows[0];
    } else {
      user = checkResult.rows[0];
    }

    done(null, {
      USER_ID: user.USER_ID,
      USER_EMAIL: user.USER_EMAIL,
      NICK: user.NICK,
      LOGIN_TYPE: user.LOGIN_TYPE
    });
  } catch (err) {
    done(err);
  } finally {
    if (connection) await connection.close();
  }
});
