const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

router.get('/hospitals', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const hospitalsSql = `SELECT * FROM HOSPITALS`;
    const deptSql = `SELECT * FROM DEPARTMENTS`;
    const mappingSql = `SELECT * FROM HOSPITAL_DEPARTMENT_MAPPING`;

    const hospitalsResult = await conn.execute(hospitalsSql);
    const deptResult = await conn.execute(deptSql);
    const mappingResult = await conn.execute(mappingSql);

    const hospitals = hospitalsResult.rows.map(row => ({
      id: row[0],
      name: row[1],
      address: row[2],
      phone: row[3],
      lat: row[4],
      lng: row[5],
      website: row[6],
      departments: []
    }));

    const departments = deptResult.rows.map(row => ({
      id: row[0],
      name: row[1]
    }));

    const mappings = mappingResult.rows;

    hospitals.forEach(h => {
      mappings.forEach(m => {
        if (h.id === m[1]) {
          const dept = departments.find(d => d.id === m[2]);
          if (dept) h.departments.push(dept.name);
        }
      });
    });

    res.json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;
