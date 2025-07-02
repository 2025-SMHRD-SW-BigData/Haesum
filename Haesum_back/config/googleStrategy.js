const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getConnection } = require('./db');

module.exports = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  let connection;
  try {
    connection = await getConnection();
    const email = profile.emails?.[0]?.value;
    const nick = profile.displayName;
    const loginType = 'google';

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
