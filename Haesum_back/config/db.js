const oracledb = require('oracledb');

oracledb.initOracleClient({
  libDir: process.env.ORACLE_CLIENT_LIB_DIR
});

const getConnection = async () => {
  return await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
  });
};

module.exports = { getConnection };