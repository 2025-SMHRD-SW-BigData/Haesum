const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

router.get('/hospitals', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const [hospitalResult, departmentResult, mappingResult] = await Promise.all([
      connection.execute(`SELECT HOSPITAL_ID, HOSPITAL_NAME, ADDRESS, PHONE_NUMBER, LATITUDE, LONGITUDE, WEBSITE FROM HOSPITALINFO`),
      connection.execute(`SELECT MED_ID, MED_NAME FROM MEDICALDEPT`),
      connection.execute(`SELECT HOSPITAL_ID, MED_ID FROM HOSPITAL_DEPARTMENT`)
    ]);

    const medMap = new Map(departmentResult.rows.map(([medId, medName]) => [medId, medName]));
    const hospitalDeptMap = {};
    mappingResult.rows.forEach(([hospitalId, medId]) => {
      if (!hospitalDeptMap[hospitalId]) hospitalDeptMap[hospitalId] = [];
      hospitalDeptMap[hospitalId].push(medMap.get(medId));
    });

    const hospitals = hospitalResult.rows.map(row => ({
      id: row[0],
      name: row[1],
      address: row[2],
      phone: row[3],
      lat: row[4],
      lng: row[5],
      website: row[6],
      departments: hospitalDeptMap[row[0]] || []
    }));

    res.json(hospitals);
  } catch (error) {
    console.error('DB 조회 오류:', error);
    res.status(500).json({ error: 'DB 조회 실패' });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;