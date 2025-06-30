require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const OracleDB = require('oracledb');
const OracleStore = require('connect-oracle')(session);
const authRoutes = require('./routes/auth');
const hospitalRoutes = require('./routes/hospitals');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new OracleStore({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
  })
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/auth', authRoutes);
app.use('/api', hospitalRoutes);

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
