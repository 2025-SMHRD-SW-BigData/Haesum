const express = require('express')
const passport = require('../config/snsLogin')
const router = express.Router()

// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('http://localhost:5173')
)

// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao'))
router.get('/kakao/callback',
  passport.authenticate('kakao', { failureRedirect: '/' }),
  (req, res) => res.redirect('http://localhost:5173')
)

// 네이버 로그인
router.get('/naver', passport.authenticate('naver'))
router.get('/naver/callback',
  passport.authenticate('naver', { failureRedirect: '/' }),
  (req, res) => res.redirect('http://localhost:5173')
)

// 로그아웃
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('로그아웃 에러:', err)
      return res.status(500).json({ success: false, message: '로그아웃 실패' })
    }
    req.session.destroy(err => {
      if (err) {
        console.error('세션 삭제 에러:', err)
        return res.status(500).json({ success: false, message: '세션 삭제 실패' })
      }
      res.clearCookie('connect.sid')
      res.json({ success: true })
    })
  })
})

// 로그인 상태 확인
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    res.status(401).json({ error: '로그인되지 않음' })
  }
})

module.exports = router
