const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

router.post('/', async (req, res) => {
  const { userId, symptomIds } = req.body;

  if (!userId || !Array.isArray(symptomIds)) {
    return res.status(400).json({ error: '잘못된 요청입니다.' });
  }

  let connection;
  try {
    connection = await getConnection();

    await connection.execute(
      `DELETE FROM USER_SYMPTOMS WHERE USER_ID = :userId`,
      [userId],
      { autoCommit: true }
    );

    const insertSql = `INSERT INTO USER_SYMPTOMS (USER_ID, SYMPTOM_ID) VALUES (:userId, :symptomId)`;
    for (const symptomId of symptomIds) {
      await connection.execute(insertSql, [userId, symptomId], { autoCommit: false });
    }

    await connection.commit();

    res.json({ message: '증상 저장 완료' });
  } catch (error) {
    console.error('증상 저장 오류:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('DB 연결 닫기 실패:', closeErr);
      }
    }
  }
});

module.exports = router;
