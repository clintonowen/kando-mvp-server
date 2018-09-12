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

/* ========== PUT/UPDATE TASK ========== */
router.put('/:id', (req, res, next) => {
  return res.json("Hello world");
  const { id } = req.params;
  // const userId = req.user.id;

  const toUpdate = {};
  const updateableFields = ['columnId', 'name', 'time'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Task.findByIdAndUpdate(id, toUpdate, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
