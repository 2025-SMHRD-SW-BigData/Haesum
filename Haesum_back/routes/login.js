
const express = require('express');
const passport = require('../config/snsLogin');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('http://localhost:5173')
);

router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback',
  passport.authenticate('naver', { failureRedirect: '/' }),
  (req, res) => res.redirect('http://localhost:5173')
);

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback',
  passport.authenticate('kakao', { failureRedirect: '/' }),
  (req, res) => res.redirect('http://localhost:5173')
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: '로그아웃 실패' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

router.get('/user', (req, res) => {
  if (req.isAuthenticated()) res.json(req.user);
  else res.status(401).json({ error: '로그인되지 않음' });
});

module.exports = router;