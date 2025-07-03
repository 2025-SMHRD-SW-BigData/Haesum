// 서버 api/user.js

const express = require('express')
const router = express.Router()
const { getConnection } = require('../config/db')

function ensureLoggedIn(req, res, next) {
  console.log('🔍 ensureLoggedIn 호출')
  console.log('req.user:', req.user)
  console.log('req.session:', req.session)
  console.log('req.isAuthenticated:', req.isAuthenticated ? req.isAuthenticated() : '없음')

  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log('✅ 인증 통과')
    return next()
  }

  console.log('❌ 인증 실패 - 로그인 필요')
  res.status(401).json({ success: false, message: '로그인이 필요합니다.' })
}

// GET /api/user/symptoms
router.get('/symptoms', ensureLoggedIn, async (req, res) => {
  const userId = req.user.USER_ID
  console.log('📌 /symptoms GET - userId:', userId)
  let connection
  try {
    connection = await getConnection()
    const result = await connection.execute(
      `SELECT SYMPTOM_ID FROM USER_SYMPTOMS WHERE USER_ID = :userId`,
      { userId }
    )
    console.log('🔍 DB SELECT 결과:', result.rows)
    const symptoms = result.rows.map(row => row[0])
    res.json({ symptoms })
  } catch (err) {
    console.error('🔥 /symptoms GET 오류:', err)
    res.status(500).json({ success: false, message: err.message })
  } finally {
    if (connection) await connection.close()
  }
})

// POST /api/user/symptoms
router.post('/symptoms', ensureLoggedIn, async (req, res) => {
  const userId = req.user.USER_ID
  const { symptomIds } = req.body

  console.log('📌 /symptoms POST 호출:', { userId, symptomIds })

  if (!Array.isArray(symptomIds)) {
    console.log('❌ symptomIds 유효성 실패')
    return res.status(400).json({ success: false, message: 'symptomIds는 배열이어야 합니다.' })
  }

  if (symptomIds.length === 0) {
    let connection
    try {
      connection = await getConnection()
      await connection.execute(`DELETE FROM USER_SYMPTOMS WHERE USER_ID = :userId`, { userId })
      await connection.commit()
      console.log('🗑️ 증상 전부 삭제 완료 (빈 배열 요청)')
      return res.json({ success: true })
    } catch (err) {
      console.error('🔥 빈 배열 삭제 오류:', err)
      if (connection) await connection.rollback()
      return res.status(500).json({ success: false, message: err.message })
    } finally {
      if (connection) await connection.close()
    }
  }

  let connection
  try {
    connection = await getConnection()
    await connection.execute(`DELETE FROM USER_SYMPTOMS WHERE USER_ID = :userId`, { userId })
    console.log('🗑️ 기존 symptom 삭제 완료')

    const binds = symptomIds.map(symptomId => ({ userId, symptomId }))
    await connection.executeMany(
      `INSERT INTO USER_SYMPTOMS (USER_ID, SYMPTOM_ID) VALUES (:userId, :symptomId)`,
      binds
    )
    console.log('✅ 새 symptom 저장 완료:', binds)

    await connection.commit()
    res.json({ success: true })
  } catch (err) {
    console.error('🔥 /symptoms POST 오류:', err)
    if (connection) await connection.rollback()
    res.status(500).json({ success: false, message: err.message })
  } finally {
    if (connection) await connection.close()
  }
})

module.exports = router
