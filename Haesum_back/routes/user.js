const express = require('express')
const router = express.Router()
const { getConnection } = require('../config/db')

// 요청 로그 미들웨어
router.use((req, res, next) => {
    console.log('user 라우터 호출:', req.method, req.url)
    console.log('body:', req.body)
    next()
})

// 회원가입
router.post('/join', async (req, res) => {
    const { phone, password, email, nick, age, login_type } = req.body
    let connection
    try {
        connection = await getConnection()
        const sql = `
      INSERT INTO USERINFO (PHONE, PW, USER_EMAIL, NICK, AGE, LOGIN_TYPE)
      VALUES (:phone, :password, :email, :nick, :age, :login_type)
    `
        await connection.execute(sql, {
            phone,
            password,
            email,
            nick,
            age: Number(age),
            login_type
        }, { autoCommit: true })

        res.json({ success: true })
    } catch (err) {
        console.error('회원가입 오류:', err)
        res.status(500).json({ success: false, message: err.message })
    } finally {
        if (connection) await connection.close()
    }
})

// 로그인
router.post('/login', async (req, res) => {
    const { email, password, login_type } = req.body
    let connection
    try {
        connection = await getConnection()

        const sql = `
      SELECT USER_ID, USER_EMAIL, PW, NICK, AGE, PHONE, LOGIN_TYPE
      FROM USERINFO
      WHERE USER_EMAIL = :email AND PW = :password AND LOGIN_TYPE = :login_type
    `

        const result = await connection.execute(sql, { email, password, login_type })

        if (result.rows.length > 0) {
            const [userId, userEmail, pw, nick, age, phone, loginType] = result.rows[0]
            res.json({
                success: true,
                user: { userId, userEmail, nick, age, phone, loginType }
            })
        } else {
            res.json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' })
        }
    } catch (err) {
        console.error('로그인 오류:', err)
        res.status(500).json({ success: false, message: err.message })
    } finally {
        if (connection) await connection.close()
    }
})

// 로그아웃
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ success: false, message: '로그아웃 실패' })
        req.session.destroy(() => {
            res.clearCookie('connect.sid')
            res.json({ success: true })
        })
    })
})

module.exports = router
