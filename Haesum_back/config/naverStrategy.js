// naverStrategy.js
const NaverStrategy = require('passport-naver').Strategy;
const { getConnection } = require('./db');
const oracledb = require('oracledb');

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

    if (!email) {
      return done(new Error('네이버 프로필에 이메일이 없습니다.'));
    }

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
