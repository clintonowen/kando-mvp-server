'use strict';

const express = require('express');

const router = express.Router();

/* ========== GET/READ ALL TASKS ========== */
router.get('/', (req, res, next) => {
  res.json([
    {
      _id: '222222222222222222222201',
      name: 'Example Task 1',
      time: 0,
      columnId: '111111111111111111111101',
      userId: '000000000000000000000001'
    },
    {
      _id: '222222222222222222222202',
      name: 'Example Task 2',
      time: 3900000,
      columnId: '111111111111111111111101',
      userId: '000000000000000000000001'
    },
    {
      _id: '222222222222222222222203',
      name: 'Example Task 3',
      time: 1380000,
      columnId: '111111111111111111111101',
      userId: '000000000000000000000001'
    },
    {
      _id: '222222222222222222222204',
      name: 'Example Task 4',
      time: 5380000,
      columnId: '111111111111111111111102',
      userId: '000000000000000000000001'
    }
  ]);
});

module.exports = router;
