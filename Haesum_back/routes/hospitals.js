const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

router.get('/', async (req, res) => {  // 병원 전체 조회
  const { department } = req.query;
  let connection;

  try {
    connection = await getConnection();

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

// 즐겨찾기 조회 API 추가
router.get('/favorite', async (req, res) => {
  const { userId } = req.query;
  let connection;

  if (!userId) {
    return res.status(400).json({ error: 'userId 필요' });
  }

  try {
    connection = await getConnection();

    const favResult = await connection.execute(
      `SELECT f.HOSPITAL_ID, h.HOSPITAL_NAME, h.ADDRESS, h.PHONE_NUMBER, h.LATITUDE, h.LONGITUDE, h.WEBSITE
       FROM FAVORITE f
       JOIN HOSPITALINFO h ON f.HOSPITAL_ID = h.HOSPITAL_ID
       WHERE f.USER_ID = :userId`,
      [userId],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );

    const favorites = favResult.rows.map(row => ({
      id: row.HOSPITAL_ID,
      name: row.HOSPITAL_NAME,
      address: row.ADDRESS,
      phone: row.PHONE_NUMBER,
      lat: row.LATITUDE,
      lng: row.LONGITUDE,
      website: row.WEBSITE,
      departments: []  // 필요시 병원별 진료과 추가 로직 구현 가능
    }));

    res.json(favorites);

  } catch (err) {
    console.error('즐겨찾기 조회 오류:', err);
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
