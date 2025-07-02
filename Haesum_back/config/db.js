require('dotenv').config();
const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

const getConnection = async () => {
  return await oracledb.getConnection(dbConfig);
};

module.exports = {
  getConnection,
  dbConfig,
};
