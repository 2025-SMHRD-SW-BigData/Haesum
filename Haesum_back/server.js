require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const snsLogin = require('./config/snsLogin');
const loginRouter = require('./routes/login');
const hospitalsRouter = require('./routes/hospitals');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false, sameSite: 'lax' }
}));

app.use(snsLogin.initialize());
app.use(snsLogin.session());

app.use('/auth', loginRouter);
app.use('/api', hospitalsRouter);

app.get('/', (req, res) => res.send('서버 정상 작동'));

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
