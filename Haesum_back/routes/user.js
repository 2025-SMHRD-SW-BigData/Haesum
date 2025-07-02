const express = require('express');
const { getConnection } = require('../config/db');
const router = express.Router();

router.use((req, res, next) => {
  console.log('user 라우터 호출:', req.method, req.url);
  console.log('body:', req.body);
  next();
});

// 로그인 유저 증상 저장
router.post('/symptoms', async (req, res) => {
  const { userId, symptoms } = req.body;
  if (!userId || !Array.isArray(symptoms)) {
    console.log('❌ 입력값 오류:', req.body);
    return res.status(400).json({ error: 'Invalid input' });
  }

  let connection;
  try {
    connection = await getConnection();
    console.log(`🔄 증상 저장 시작 (USER_ID=${userId})`);

    await connection.execute('BEGIN');

    console.log('🗑 기존 증상 삭제');
    await connection.execute('DELETE FROM USER_SYMPTOMS WHERE USER_ID = :userId', [userId]);

    if (symptoms.length > 0) {
      for (const symptomName of symptoms) {
        console.log(`🔍 증상명 조회: ${symptomName}`);
        const result = await connection.execute(
          'SELECT SYMPTOM_ID FROM SYMPTOMS WHERE SYMPTOM_NAME = :name',
          [symptomName]
        );

        if (result.rows.length === 0) {
          console.warn(`⚠️ SYMPTOMS 테이블에 없음: ${symptomName}`);
          continue;
        }

        const symptomId = result.rows[0][0];
        console.log(`➕ 증상 저장: ${symptomName} (SYMPTOM_ID=${symptomId})`);
        await connection.execute(
          'INSERT INTO USER_SYMPTOMS (USER_ID, SYMPTOM_ID) VALUES (:userId, :symptomId)',
          [userId, symptomId]
        );
      }
    }

    await connection.execute('COMMIT');
    console.log('✅ 트랜잭션 커밋 완료');
    res.json({ message: '저장 완료' });
  } catch (error) {
    console.error('❗ 에러 발생:', error);
    if (connection) {
      try {
        await connection.execute('ROLLBACK');
        console.log('🔄 롤백 완료');
      } catch (rollbackErr) {
        console.error('❌ 롤백 실패:', rollbackErr);
      }
    }
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
});

// 로그인 유저 증상 불러오기
router.get('/symptoms/:userId', async (req, res) => {
  const userId = req.params.userId;
  let connection;
  try {
    connection = await getConnection();
    console.log(`🔄 증상 불러오기 요청 (USER_ID=${userId})`);

    const result = await connection.execute(
      `SELECT S.SYMPTOM_NAME
       FROM USER_SYMPTOMS US
       JOIN SYMPTOMS S ON US.SYMPTOM_ID = S.SYMPTOM_ID
       WHERE US.USER_ID = :userId`,
      [userId]
    );

    const symptoms = result.rows.map(row => row[0]);
    console.log('✅ 불러온 증상:', symptoms);

    res.json({ symptoms });
  } catch (err) {
    console.error('❗ 불러오기 에러:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
