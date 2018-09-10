'use strict';

const express = require('express');

const router = express.Router();

/* ========== GET/READ ALL TASKS ========== */
router.get('/', (req, res, next) => {
  res.json([
    {
      _id: '111111111111111111111101',
      name: 'Example Task 1',
      userId: '000000000000000000000001'
    },
    {
      _id: '111111111111111111111102',
      name: 'Example Task 2',
      userId: '000000000000000000000001'
    },
    {
      _id: '111111111111111111111103',
      name: 'Example Task 3',
      userId: '000000000000000000000001'
    }
  ]);
});

module.exports = router;
