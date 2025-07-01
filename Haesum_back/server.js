require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/snsLogin');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const hospitalRouter = require('./routes/hospitals'); // << 반드시 필요

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false, sameSite: 'lax' }
}));

app.use(passport.initialize());
app.use(passport.session());

// 인증 관련 라우터
app.use('/auth', loginRouter);

// 사용자 관련 API
app.use('/api', userRouter);

// 병원 관련 API << 반드시 추가
app.use('/api', hospitalRouter);

app.get('/', (req, res) => {
  res.send('서버 정상 작동');
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
