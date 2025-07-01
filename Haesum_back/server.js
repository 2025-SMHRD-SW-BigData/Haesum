require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const passport = require('./config/snsLogin') // snsLogin 설정한 파일 경로 맞게 수정
const loginRouter = require('./routes/login')
const userRouter = require('./routes/user')

const app = express()
const PORT = 3000

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}))

app.use(express.json())

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false, sameSite: 'lax' }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', loginRouter)
app.use('/api', userRouter)

app.get('/', (req, res) => {
  res.send('서버 정상 작동')
})

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`)
})
