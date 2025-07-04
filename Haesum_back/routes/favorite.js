const express = require('express')
const router = express.Router()
const { getConnection } = require('../config/db')

// 인증 미들웨어
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next()
  res.status(401).json({ success: false, message: '로그인이 필요합니다.' })
}

// 즐겨찾기 추가
router.post('/favorite', ensureLoggedIn, async (req, res) => {
  const userId = req.user.USER_ID
  const { hospitalId } = req.body
  if (!hospitalId) return res.status(400).json({ success: false, message: 'hospitalId 필요' })

  let connection
  try {
    connection = await getConnection()
    await connection.execute(
      `INSERT INTO FAVORITE (FAVORITE_ID, USER_ID, HOSPITAL_ID, REG_DATE)
       VALUES (FAVORITE_SEQ.NEXTVAL, :userId, :hospitalId, SYSDATE)`,
      { userId, hospitalId },
      { autoCommit: true }
    )
    res.json({ success: true })
  } catch (err) {
    console.error('즐겨찾기 추가 오류:', err)
    res.status(500).json({ success: false, message: err.message })
  } finally {
    if (connection) await connection.close()
  }
})

// 즐겨찾기 삭제
router.delete('/favorite', ensureLoggedIn, async (req, res) => {
  const userId = req.user.USER_ID
  const { hospitalId } = req.body
  if (!hospitalId) return res.status(400).json({ success: false, message: 'hospitalId 필요' })

  let connection
  try {
    connection = await getConnection()
    await connection.execute(
      `DELETE FROM FAVORITE WHERE USER_ID = :userId AND HOSPITAL_ID = :hospitalId`,
      { userId, hospitalId },
      { autoCommit: true }
    )
    res.json({ success: true })
  } catch (err) {
    console.error('즐겨찾기 삭제 오류:', err)
    res.status(500).json({ success: false, message: err.message })
  } finally {
    if (connection) await connection.close()
  }
})

// 즐겨찾기 조회
router.get('/favorite', ensureLoggedIn, async (req, res) => {
  const userId = req.user.USER_ID

  let connection
  try {
    connection = await getConnection()  // 누락된 부분 추가
    const result = await connection.execute(
      `SELECT H.HOSPITAL_ID, H.HOSPITAL_NAME, H.ADDRESS, H.PHONE_NUMBER, H.WEBSITE,
              H.LATITUDE, H.LONGITUDE,
              LISTAGG(M.MED_NAME, ',') WITHIN GROUP (ORDER BY M.MED_NAME) AS DEPARTMENTS
       FROM FAVORITE F
       JOIN HOSPITALINFO H ON F.HOSPITAL_ID = H.HOSPITAL_ID
       LEFT JOIN HOSPITAL_DEPARTMENT HD ON H.HOSPITAL_ID = HD.HOSPITAL_ID
       LEFT JOIN MEDICALDEPT M ON HD.MED_ID = M.MED_ID
       WHERE F.USER_ID = :userId
       GROUP BY H.HOSPITAL_ID, H.HOSPITAL_NAME, H.ADDRESS, H.PHONE_NUMBER, H.WEBSITE, H.LATITUDE, H.LONGITUDE`,
      { userId }
    )

    const favorites = result.rows.map(([id, name, address, phone, website, lat, lng, departments]) => ({
      id,
      name,
      address,
      phone,
      website,
      lat,
      lng,
      departments: departments ? departments.split(',') : [],
    }))
    res.json(favorites)
  } catch (err) {
    console.error('즐겨찾기 조회 오류:', err)
    res.status(500).json({ success: false, message: err.message })
  } finally {
    if (connection) await connection.close()
  }
})

module.exports = router
