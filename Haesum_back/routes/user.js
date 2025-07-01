const express = require('express');
const { getConnection } = require('../config/db');
const router = express.Router();

router.use((req, res, next) => {
  console.log('user 라우터 호출:', req.method, req.url);
  console.log('body:', req.body);
  next();
});

// 🔹 회원가입
router.post('/join', async (req, res) => {
  const { phone, password, email, nick, age, login_type } = req.body;
  let connection;
  try {
    connection = await getConnection();
    const sql = `
      INSERT INTO USERINFO (PHONE, PW, USER_EMAIL, NICK, AGE, LOGIN_TYPE)
      VALUES (:phone, :password, :email, :nick, :age, :login_type)
    `;
    await connection.execute(
      sql,
      { phone, password, email, nick, age: Number(age), login_type },
      { autoCommit: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
