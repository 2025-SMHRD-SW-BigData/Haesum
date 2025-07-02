require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/snsLogin');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const hospitalRouter = require('./routes/hospitals');
const favoriteRouter = require('./routes/favorite');
const symptomsRouter = require('./routes/symptoms');
const userSymptomsRouter = require('./routes/userSymptoms'); 


const app = express();
const PORT = 3000;

// CORS
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

// JSON 파싱
app.use(express.json());

// 세션
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false, // 세션을 수정할 때만 저장
  cookie: { httpOnly: true, secure: false, sameSite: 'lax' }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// 라우터
app.use('/auth', loginRouter);
app.use('/api/user', userRouter);
app.use('/api/hospital', hospitalRouter);
app.use('/api/favorite', favoriteRouter);
app.use('/api/symptoms', symptomsRouter);
app.use('/api/user/symptoms', userSymptomsRouter);


app.get('/', (req, res) => {
  res.send('서버 정상 작동');
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});