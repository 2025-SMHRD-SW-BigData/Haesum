const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

router.get('/hospitals', async (req, res) => {
  const { department } = req.query;
  let connection;

  try {
    connection = await getConnection();

    const hospitalResult = await connection.execute(
      `SELECT HOSPITAL_ID, HOSPITAL_NAME, ADDRESS, PHONE_NUMBER, LATITUDE, LONGITUDE, WEBSITE FROM HOSPITALINFO`
    );
    const departmentResult = await connection.execute(
      `SELECT MED_ID, MED_NAME FROM MEDICALDEPT`
    );
    const mappingResult = await connection.execute(
      `SELECT HOSPITAL_ID, MED_ID FROM HOSPITAL_DEPARTMENT`
    );

    const hospitalRows = hospitalResult.rows;
    const departmentRows = departmentResult.rows;
    const mappingRows = mappingResult.rows;

    console.log('hospitalRows:', hospitalRows.length);
    console.log('departmentRows:', departmentRows.length);
    console.log('mappingRows:', mappingRows.length);

    // 진료과 Map (MED_ID -> MED_NAME)
    const medMap = new Map();
    departmentRows.forEach(([medId, medName]) => {
      medMap.set(medId, medName);
    });

    // 병원별 진료과 배열 (HOSPITAL_ID -> [MED_NAME])
    const hospitalDeptMap = {};
    mappingRows.forEach(([hospitalId, medId]) => {
      if (!hospitalDeptMap[hospitalId]) {
        hospitalDeptMap[hospitalId] = [];
      }
      hospitalDeptMap[hospitalId].push(medMap.get(medId));
    });

    // 병원 데이터 가공
    let hospitals = hospitalRows.map(([hospitalId, hospitalName, address, phone, lat, lng, website]) => ({
      id: hospitalId,
      name: hospitalName,
      address,
      phone,
      lat,
      lng,
      website,
      departments: hospitalDeptMap[hospitalId] || []
    }));

    // 필터 적용
    if (department && department !== '전체보기') {
      const deptLower = department.toLowerCase();
      hospitals = hospitals.filter(h =>
        h.departments.some(d => d && d.toLowerCase() === deptLower)
      );
    }

    console.log('최종 hospitals:', hospitals.length);

    res.json(hospitals);

  } catch (err) {
    console.error('DB 조회 오류:', err);
    res.status(500).json({ error: 'DB 조회 실패' });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
