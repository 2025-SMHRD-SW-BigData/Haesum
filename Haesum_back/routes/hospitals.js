const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');  // 수정

router.get('/hospitals', async (req, res) => {
  const { department } = req.query;
  let connection;

  try {
    connection = await getConnection();  // 수정

    // 쿼리 실행
    const hospitalResult = await connection.execute(
      `SELECT HOSPITAL_ID, HOSPITAL_NAME, ADDRESS, PHONE_NUMBER, LATITUDE, LONGITUDE, WEBSITE FROM HOSPITALINFO`,
      [],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    const departmentResult = await connection.execute(
      `SELECT MED_ID, MED_NAME FROM MEDICALDEPT`,
      [],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    const mappingResult = await connection.execute(
      `SELECT HOSPITAL_ID, MED_ID FROM HOSPITAL_DEPARTMENT`,
      [],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );

    const hospitalRows = hospitalResult.rows;
    const departmentRows = departmentResult.rows;
    const mappingRows = mappingResult.rows;

    const medMap = new Map();
    departmentRows.forEach(row => {
      medMap.set(row.MED_ID, row.MED_NAME);
    });

    const hospitalDeptMap = {};
    mappingRows.forEach(row => {
      if (!hospitalDeptMap[row.HOSPITAL_ID]) {
        hospitalDeptMap[row.HOSPITAL_ID] = [];
      }
      hospitalDeptMap[row.HOSPITAL_ID].push(medMap.get(row.MED_ID));
    });

    let hospitals = hospitalRows.map(row => ({
      id: row.HOSPITAL_ID,
      name: row.HOSPITAL_NAME,
      address: row.ADDRESS,
      phone: row.PHONE_NUMBER,
      lat: row.LATITUDE,
      lng: row.LONGITUDE,
      website: row.WEBSITE,
      departments: hospitalDeptMap[row.HOSPITAL_ID] || []
    }));

    if (department && department !== '전체보기') {
      const deptLower = department.toLowerCase();
      hospitals = hospitals.filter(h =>
        h.departments.some(d => d && d.toLowerCase() === deptLower)
      );
    }

    res.json(hospitals);

  } catch (err) {
    console.error('DB 조회 오류:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('DB 연결 닫기 실패:', closeErr);
      }
    }
  }
});

module.exports = router;
