'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Task = require('../models/task');
const Column = require('../models/column');

const router = express.Router();

/* ========== GET/READ ALL TASKS ========== */
router.get('/', (req, res, next) => {
  // const userId = req.user.id;

  // let filter = { userId };

  Task.find()
    // .sort({ id: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
