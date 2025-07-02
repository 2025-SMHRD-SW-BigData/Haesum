const express = require('express')
const router = express.Router()
const { getConnection } = require('../config/db')

// 즐겨찾기 추가
router.post('/favorite', async (req, res) => {
    const { userId, hospitalId } = req.body
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
router.delete('/favorite', async (req, res) => {
    const { userId, hospitalId } = req.body
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

// 내 즐겨찾기 목록 조회
router.get('/favorite', async (req, res) => {
    const { userId } = req.query
    let connection
    try {
        connection = await getConnection()
        const result = await connection.execute(
            `SELECT H.HOSPITAL_ID, H.HOSPITAL_NAME, H.ADDRESS, H.PHONE_NUMBER, H.WEBSITE,
              LISTAGG(M.MED_NAME, ',') WITHIN GROUP (ORDER BY M.MED_NAME) AS DEPARTMENTS
             FROM FAVORITE F
             JOIN HOSPITALINFO H ON F.HOSPITAL_ID = H.HOSPITAL_ID
             LEFT JOIN HOSPITAL_DEPARTMENT HD ON H.HOSPITAL_ID = HD.HOSPITAL_ID
             LEFT JOIN MEDICALDEPT M ON HD.MED_ID = M.MED_ID
             WHERE F.USER_ID = :userId
             GROUP BY H.HOSPITAL_ID, H.HOSPITAL_NAME, H.ADDRESS, H.PHONE_NUMBER, H.WEBSITE`,
            { userId }
        )

        const favorites = result.rows.map(([id, name, address, phone, website, departments]) => ({
            id,
            name,
            address,
            phone,
            website,
            departments: departments ? departments.split(',') : []
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
