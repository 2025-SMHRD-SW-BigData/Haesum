require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/snsLogin');

const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const hospitalRouter = require('./routes/hospitals');
const favoriteRouter = require('./routes/favorite');

const app = express();
const PORT = 3000;

const allowedOrigins = ['http://localhost:3001', 'http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS 정책 위반 - 허용되지 않은 출처'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', loginRouter);
app.use('/api/user', userRouter);
app.use('/api/hospital', hospitalRouter);
app.use('/api/favorite', favoriteRouter);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
