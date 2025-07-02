const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

// 사용자 증상 저장
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
      try { await connection.close(); } catch (err) { console.error('DB 연결 닫기 실패:', err); }
    }
  }
});

// 사용자 증상 불러오기
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ error: 'userId 필요' });

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT SYMPTOM_ID FROM USER_SYMPTOMS WHERE USER_ID = :userId`,
      [userId],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );

    const symptoms = result.rows.map(row => row.SYMPTOM_ID);

    res.json({ symptoms });
  } catch (error) {
    console.error('증상 조회 오류:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error('DB 연결 닫기 실패:', err); }
    }
  }
});

module.exports = router;
